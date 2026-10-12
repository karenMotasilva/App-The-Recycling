const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Config 
const PORTA = 3000;
const SEGREDO = 'segredo-teste-longgasso-aqui';
const PONTOS_POR_KG = 10;
const CARBONO_POR_KG = 1.5; // kgCO2 evitados por kg reciclado
const MATERIAIS = ['plastico', 'papel', 'vidro', 'metal'];

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senai123',
  database: 'recycling_flow',
});

fs.mkdirSync('uploads', { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname || '.jpg')),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ====== helpers ======
const h = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  });

function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    req.uid = jwt.verify(token, SEGREDO).id;
    next();
  } catch {
    res.status(401).json({ error: 'Sessão inválida.' });
  }
}

const sessao = (u) => ({
  token: jwt.sign({ id: u.id }, SEGREDO, { expiresIn: '30d' }),
  user: { name: u.nome, email: u.email },
});

function cpfValido(c) {
  c = String(c || '').replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let t = 9; t < 11; t++) {
    let s = 0;
    for (let i = 0; i < t; i++) s += Number(c[i]) * (t + 1 - i);
    if (((s * 10) % 11) % 10 !== Number(c[t])) return false;
  }
  return true;
}

// saldo = pontos ganhos em descartes - pontos gastos em resgates
async function saldo(uid) {
  const [[r]] = await db.query(
    `SELECT (SELECT COALESCE(SUM(pontos),0) FROM descartes WHERE usuario_id=?) -
            (SELECT COALESCE(SUM(pontos),0) FROM resgates WHERE usuario_id=?) s`, [uid, uid]);
  return Number(r.s);
}

// ====== AUTH ======
app.post('/auth/register', h(async (req, res) => {
  const { name, email, password, cpf, apartamento } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: 'Dados inválidos.' });
  if (!cpfValido(cpf))
    return res.status(400).json({ error: 'CPF inválido.' });
  if (!apartamento || !String(apartamento).trim())
    return res.status(400).json({ error: 'Informe o apartamento.' });

  const mail = email.trim().toLowerCase();
  const cpfLimpo = String(cpf).replace(/\D/g, '');
  const [[existe]] = await db.query('SELECT id FROM usuarios WHERE email=?', [mail]);
  if (existe)
    return res.status(409).json({ error: 'Já existe uma conta cadastrada com esse e-mail.' });
  const [[cpfExiste]] = await db.query('SELECT id FROM usuarios WHERE cpf=?', [cpfLimpo]);
  if (cpfExiste)
    return res.status(409).json({ error: 'Já existe uma conta cadastrada com esse CPF.' });

  const hash = await bcrypt.hash(password, 10);
  // condomínio 1 = Jardim das Flores (todos entram nele por enquanto)
  const [r] = await db.query(
    'INSERT INTO usuarios (condominio_id, nome, email, senha_hash, cpf, apartamento) VALUES (1,?,?,?,?,?)',
    [name.trim(), mail, hash, cpfLimpo, String(apartamento).trim()]);
  res.json(sessao({ id: r.insertId, nome: name.trim(), email: mail }));
}));

app.post('/auth/login', h(async (req, res) => {
  const mail = (req.body.email || '').trim().toLowerCase();
  const [[u]] = await db.query('SELECT * FROM usuarios WHERE email=?', [mail]);
  if (!u || !(await bcrypt.compare(req.body.password || '', u.senha_hash)))
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  res.json(sessao(u));
}));

// HOME
app.get('/home', auth, h(async (req, res) => {
  const [[t]] = await db.query(
    `SELECT COALESCE(SUM(pontos),0) pontos, COALESCE(SUM(peso_kg),0) kg, MAX(criado_em) ultimo
     FROM descartes WHERE usuario_id=?`, [req.uid]);
  const [[u]] = await db.query(
    'SELECT apartamento, foto_perfil foto FROM usuarios WHERE id=?', [req.uid]);
  const [recompensas] = await db.query(
    'SELECT id, titulo, pontos FROM recompensas ORDER BY pontos LIMIT 3');
  res.json({ pontos: await saldo(req.uid), kg: Number(t.kg), ultimo: t.ultimo, recompensas,
             apartamento: u.apartamento, foto: u.foto });
}));

// DESCARTE -> MODAL DA HOME
app.post('/descartes', auth, upload.single('foto'), h(async (req, res) => {
  const { material } = req.body;
  const peso = parseFloat(String(req.body.peso).replace(',', '.'));
  if (!MATERIAIS.includes(material) || !(peso > 0 && peso <= 100) || !req.file)
    return res.status(400).json({ error: 'Informe material, peso (até 100 kg) e foto.' });

  const [[u]] = await db.query('SELECT condominio_id FROM usuarios WHERE id=?', [req.uid]);
  const pontos = Math.round(peso * PONTOS_POR_KG);
  await db.query(
    `INSERT INTO descartes (usuario_id, condominio_id, material, peso_kg, pontos, foto, criado_em)
     VALUES (?,?,?,?,?,?,?)`,
    [req.uid, u.condominio_id, material, peso, pontos, req.file.filename, new Date()]);
  res.json({ ok: true, pontos });
}));

// REWARDS + HISTÓRICO
app.get('/recompensas', auth, h(async (req, res) => {
  const [recompensas] = await db.query(
    'SELECT id, titulo, categoria, pontos, imagem FROM recompensas ORDER BY pontos DESC');
  const [rows] = await db.query(
    `SELECT d.id, d.criado_em, d.peso_kg, d.pontos, c.nome AS condo
     FROM descartes d JOIN condominios c ON c.id = d.condominio_id
     WHERE d.usuario_id=? ORDER BY d.criado_em DESC LIMIT 20`, [req.uid]);
  const historico = rows.map((d) => ({
    id: String(d.id),
    data: new Date(d.criado_em).toLocaleDateString('pt-BR'),
    local: `Condomínio ${d.condo}`,
    peso: `${Number(d.peso_kg).toLocaleString('pt-BR')} kg`,
    pontos: d.pontos,
  }));
  res.json({ recompensas, historico,  pontos: await saldo(req.uid), });
}));

app.post('/recompensas/:id/resgatar', auth, h(async (req, res) => {
  const [[rc]] = await db.query(
    'SELECT id, titulo, pontos FROM recompensas WHERE id=?', [req.params.id]);
  if (!rc) return res.status(404).json({ error: 'Recompensa não encontrada.' });
  if ((await saldo(req.uid)) < rc.pontos)
    return res.status(400).json({ error: 'Pontos insuficientes.' });
  await db.query(
    'INSERT INTO resgates (usuario_id, recompensa_id, pontos) VALUES (?,?,?)',
    [req.uid, rc.id, rc.pontos]);
  res.json({ ok: true, titulo: rc.titulo, pontos: await saldo(req.uid) });
}));

// RANKING (TOP 10 DO CONDOMÍNIO)
app.get('/ranking', auth, h(async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.nome, COALESCE(u.apartamento,'Apartamento não informado') apartamento,
            COALESCE(SUM(d.pontos),0) pontos
     FROM usuarios u LEFT JOIN descartes d ON d.usuario_id = u.id
     WHERE u.condominio_id = (SELECT condominio_id FROM usuarios WHERE id=?)
     GROUP BY u.id ORDER BY pontos DESC, u.nome`, [req.uid]);
  res.json(rows.map((r) => ({
    id: String(r.id), nome: r.nome, apartamento: r.apartamento,
    pontos: Number(r.pontos), souEu: r.id === req.uid,
  })));
}));

// PROFILE
app.get('/perfil', auth, h(async (req, res) => {
  const [[u]] = await db.query(
    `SELECT u.nome, u.email, u.cpf, u.apartamento, u.foto_perfil,
            u.notif_pontos, u.notif_recompensas, c.nome AS condo
     FROM usuarios u JOIN condominios c ON c.id = u.condominio_id WHERE u.id=?`, [req.uid]);
  const cpf = String(u.cpf || '').replace(/\D/g, '');
  res.json({
    name: u.nome,
    condominium: `Condomínio ${u.condo}`,
    cpf: cpf.length === 11
      ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      : 'Não informado',
    email: u.email,
    points: `${(await saldo(req.uid)).toLocaleString('pt-BR')} pts`,
    apartamento: u.apartamento || 'Não informado',
    foto: u.foto_perfil,
    notifPontos: !!u.notif_pontos,
    notifRecompensas: !!u.notif_recompensas,
  });
}));

// EDITAR DADOS / NOTIFICAÇÕES 
app.put('/perfil', auth, h(async (req, res) => {
  const { cpf, apartamento, notifPontos, notifRecompensas } = req.body;
  if (cpf !== undefined && !cpfValido(cpf))
    return res.status(400).json({ error: 'CPF inválido.' });
  await db.query(
    `UPDATE usuarios SET cpf=COALESCE(?,cpf), apartamento=COALESCE(?,apartamento),
            notif_pontos=COALESCE(?,notif_pontos), notif_recompensas=COALESCE(?,notif_recompensas)
     WHERE id=?`,
    [cpf !== undefined ? String(cpf).replace(/\D/g, '') : null,
     String(apartamento ?? '').trim() || null,
     notifPontos !== undefined ? +!!notifPontos : null,
     notifRecompensas !== undefined ? +!!notifRecompensas : null,
     req.uid]);
  res.json({ ok: true });
}));

// FOTO DE PERFIL
app.post('/perfil/foto', auth, upload.single('foto'), h(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Envie uma foto.' });
  await db.query('UPDATE usuarios SET foto_perfil=? WHERE id=?', [req.file.filename, req.uid]);
  res.json({ ok: true, foto: req.file.filename });
}));

// ====== ESG (filtro semana / mês / ano) ======
// deslocar=0 → período atual; deslocar=1 → período anterior (para o % de variação)
function intervalo(p, deslocar) {
  const h = new Date();
  if (p === 'semana') {
    const dia = (h.getDay() + 6) % 7; // segunda = 0
    const ini = new Date(h.getFullYear(), h.getMonth(), h.getDate() - dia - 7 * deslocar);
    return [ini, new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + 7)];
  }
  if (p === 'ano')
    return [new Date(h.getFullYear() - deslocar, 0, 1), new Date(h.getFullYear() - deslocar + 1, 0, 1)];
  return [new Date(h.getFullYear(), h.getMonth() - deslocar, 1),
          new Date(h.getFullYear(), h.getMonth() - deslocar + 1, 1)];
}

async function resumo(cid, ini, fim) {
  const [rows] = await db.query(
    `SELECT material, SUM(peso_kg) kg, SUM(pontos) pontos FROM descartes
     WHERE condominio_id=? AND criado_em>=? AND criado_em<? GROUP BY material`, [cid, ini, fim]);
  const kg = {};
  let totalKg = 0, pontos = 0;
  rows.forEach((r) => { kg[r.material] = Number(r.kg); totalKg += Number(r.kg); pontos += Number(r.pontos); });
  return { kg, totalKg, pontos };
}

app.get('/esg', auth, h(async (req, res) => {
  const p = ['semana', 'mes', 'ano'].includes(req.query.periodo) ? req.query.periodo : 'mes';
  const [[u]] = await db.query(
    `SELECT u.condominio_id id, c.nome, u.apartamento, u.foto_perfil FROM usuarios u
     JOIN condominios c ON c.id = u.condominio_id WHERE u.id=?`, [req.uid]);

  const [ini, fim] = intervalo(p, 0);
  const [iniAnt, fimAnt] = intervalo(p, 1);
  const atual = await resumo(u.id, ini, fim);
  const ant = await resumo(u.id, iniAnt, fimAnt);
  const variacao = (a, b) => (b > 0 ? Math.round(((a - b) / b) * 100) : null);

  res.json({
    condominio: u.nome,
    apartamento: u.apartamento,
    foto: u.foto_perfil,
    inicio: ini.toLocaleDateString('pt-BR'),
    fim: new Date(fim.getTime() - 1).toLocaleDateString('pt-BR'),
    totalKg: Math.round(atual.totalKg * 100) / 100,
    pontos: atual.pontos,
    carbono: Math.round(atual.totalKg * CARBONO_POR_KG),
    variacao: {
      kg: variacao(atual.totalKg, ant.totalKg),
      pontos: variacao(atual.pontos, ant.pontos),
    },
    materiais: MATERIAIS.map((m) => ({
      material: m,
      kg: atual.kg[m] || 0,
      pct: atual.totalKg ? Math.round(((atual.kg[m] || 0) / atual.totalKg) * 100) : 0,
    })),
  });
}));

app.listen(PORTA, '0.0.0.0', () => console.log(`API rodando na porta ${PORTA}`));
