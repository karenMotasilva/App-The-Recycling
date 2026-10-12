import React, { useCallback, useState } from 'react';


import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useAuth } from '../Context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { api, API_URL } from '../Services/api';
import { File } from 'expo-file-system';

type Aba = 'Recompensas' | 'Ranking' | 'Home' | 'Perfil' | 'ESG';

const MATERIAIS = [
  { id: 'plastico', nome: 'Plástico' },
  { id: 'papel', nome: 'Papel' },
  { id: 'vidro', nome: 'Vidro' },
  { id: 'metal', nome: 'Metal' },
];

function tempoDesde(iso: string | null) {
  if (!iso) return '—';
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.floor(min / 60)} h`;
  return `${Math.floor(min / 1440)} d`;
}

export default function HomeScreen() {
  const { user } = useAuth();

  const [abaSelecionada, setAbaSelecionada] = useState<Aba>('Home');

  const [dados, setDados] = useState<any>({
    pontos: 0,
    kg: 0,
    ultimo: null,
    recompensas: [],
  });
  const [modal, setModal] = useState(false);
  const [material, setMaterial] = useState('plastico');
  const [peso, setPeso] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Recarrega sempre que a tela ganha foco (ex.: voltou de outra aba).
  const carregar = useCallback(() => {
    api('/home').then(setDados).catch(() => {});
  }, []);
  useFocusEffect(carregar);

  async function escolherFoto(camera: boolean) {
    if (camera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permissão', 'Precisamos da câmera para comprovar o descarte.');
        return;
      }
    }
    const r = camera
      ? await ImagePicker.launchCameraAsync({ quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!r.canceled) setFoto(r.assets[0].uri);
  }

  async function enviarDescarte() {
    const kg = parseFloat(peso.replace(',', '.'));
    if (!(kg > 0)) {
      Alert.alert('Peso inválido', 'Informe o peso em kg.');
      return;
    }
    if (!foto) {
      Alert.alert('Foto obrigatória', 'Tire uma foto para comprovar o descarte.');
      return;
    }

    setEnviando(true);
    try {
      const form = new FormData();

      form.append('material', material);
      form.append('peso', String(kg));

      const arquivo = new File(foto);
      form.append('foto', arquivo, 'descarte.jpg');

      const r = await api('/descartes', {
        method: 'POST',
        body: form,
      });

      setModal(false);
      setPeso('');
      setFoto(null);
      carregar();
      Alert.alert('Descarte registrado', `Você ganhou ${r.pontos} pontos!`);
    } catch (error) {
      Alert.alert(
        'Não foi possível registrar',
        error instanceof Error ? error.message : 'Tente novamente.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#E9F6F8"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            onPress={() => Alert.alert('Menu', 'Menu em desenvolvimento')}
          >
            <Text style={styles.iconeMenu}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Tela Inicial</Text>

          <View style={styles.avatar}>
            {dados.foto ? (
              <Image
                source={{ uri: `${API_URL}/uploads/${dados.foto}` }}
                style={styles.avatarFoto}
              />
            ) : (
              <Text style={styles.avatarTexto}>👤</Text>
            )}
          </View>
        </View>

        {/* Saudação */}
        <Text style={styles.saudacao}>
          Bem-vindo, {user?.name || 'usuário'}!
        </Text>

        {!!dados.apartamento && (
          <Text style={styles.apartamento}>{dados.apartamento}</Text>
        )}

        {/* Saldo de pontos */}
        <View style={styles.areaPontos}>
          <View style={styles.circulo}>
            <Text style={styles.textoSaldo}>
              Saldo de Pontos
            </Text>

            <Text style={styles.pontos}>
              {dados.pontos.toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>

        {/* Informações ambientais */}
        <View style={styles.linhaCartoes}>
          <View style={styles.cartao}>
            <Text style={styles.rotulo}>
              Seu Impacto (kg):
            </Text>

            <Text style={styles.valor}>
              {dados.kg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg
            </Text>
          </View>

          <View style={styles.cartao}>
            <Text style={styles.rotulo}>
              Último Descarte:
            </Text>

            <Text style={styles.valor}>{tempoDesde(dados.ultimo)}</Text>
          </View>
        </View>

        {/* Acesso rápido */}
        <Text style={styles.tituloSecao}>
          Acesso Rápido
        </Text>

        <TouchableOpacity
          style={styles.botaoDescarte}
          onPress={() => setModal(true)}
        >
          <Text style={styles.iconeBotao}>♻</Text>

          <Text style={styles.textoBotao}>
            Descartar Resíduo
          </Text>

          <Text style={styles.iconeNfc}>)))</Text>
        </TouchableOpacity>

        {/* Benefícios disponíveis */}
        <Text style={styles.tituloSecao}>
          Próximas Recompensas
        </Text>

        <View style={styles.listaRecompensas}>
          {dados.recompensas.map((r: any, i: number) => (
            <View key={r.id}>
              {i > 0 && <View style={styles.divisor} />}
              <View style={styles.itemRecompensa}>
                <Text style={styles.iconePresente}>🎁</Text>

                <View style={styles.infoRecompensa}>
                  <Text style={styles.textoRecompensa}>{r.titulo}</Text>
                  <Text style={styles.descricaoRecompensa}>
                    {r.pontos} pontos
                    {dados.pontos >= r.pontos
                      ? ' • disponível!'
                      : ` • faltam ${r.pontos - dados.pontos}`}
                  </Text>
                </View>

                <Text style={styles.seta}>›</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal de descarte */}
      <Modal
        visible={modal}
        animationType="slide"
        transparent
        onRequestClose={() => setModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalFundo}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>Descartar Resíduo</Text>

            <Text style={styles.modalRotulo}>Material</Text>
            <View style={styles.linhaOpcoes}>
              {MATERIAIS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.chip, material === m.id && styles.chipAtivo]}
                  onPress={() => setMaterial(m.id)}
                >
                  <Text
                    style={[
                      styles.chipTexto,
                      material === m.id && styles.chipTextoAtivo,
                    ]}
                  >
                    {m.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalRotulo}>Peso (kg)</Text>
            <TextInput
              style={styles.campo}
              placeholder="Ex.: 2,5"
              placeholderTextColor="#82969A"
              keyboardType="decimal-pad"
              value={peso}
              onChangeText={setPeso}
            />

            <Text style={styles.modalRotulo}>Foto do descarte</Text>
            {foto && <Image source={{ uri: foto }} style={styles.previa} />}
            <View style={styles.linhaOpcoes}>
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => escolherFoto(true)}
              >
                <Text style={styles.botaoSecundarioTexto}>📷 Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => escolherFoto(false)}
              >
                <Text style={styles.botaoSecundarioTexto}>🖼 Galeria</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.botaoConfirmar}
              onPress={enviarDescarte}
              disabled={enviando}
            >
              <Text style={styles.textoBotao}>
                {enviando ? 'Enviando...' : 'Confirmar descarte'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModal(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F6F8',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  cabecalho: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconeMenu: {
    fontSize: 27,
    color: '#263B40',
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#263B40',
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#DCE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarTexto: {
    fontSize: 25,
  },

  avatarFoto: {
    width: 43,
    height: 43,
    borderRadius: 22,
  },

  apartamento: {
    fontSize: 15,
    color: '#718184',
    marginTop: 4,
  },

  saudacao: {
    fontSize: 22,
    color: '#263B40',
    marginTop: 14,
  },

  areaPontos: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circulo: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 10,
    borderColor: '#087F91',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoSaldo: {
    fontSize: 20,
    color: '#263B40',
  },

  pontos: {
    fontSize: 47,
    fontWeight: 'bold',
    color: '#245568',
    marginTop: 8,
  },

  linhaCartoes: {
    flexDirection: 'row',
    gap: 12,
  },

  cartao: {
    flex: 1,
    minHeight: 115,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 2,
  },

  rotulo: {
    fontSize: 15,
    color: '#34464A',
    textAlign: 'center',
  },

  valor: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#263B40',
    marginTop: 8,
  },

  tituloSecao: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#263B40',
    marginTop: 28,
    marginBottom: 14,
  },

  botaoDescarte: {
    minHeight: 100,
    backgroundColor: '#087F91',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  iconeBotao: {
    fontSize: 35,
    color: '#FFFFFF',
  },

  textoBotao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  iconeNfc: {
    fontSize: 23,
    color: '#FFFFFF',
  },

  listaRecompensas: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    overflow: 'hidden',
    elevation: 2,
  },

  itemRecompensa: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  iconePresente: {
    fontSize: 28,
    color: '#579B9D',
  },

  infoRecompensa: {
    flex: 1,
  },

  textoRecompensa: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34464A',
  },

  descricaoRecompensa: {
    fontSize: 12,
    color: '#718184',
    marginTop: 5,
    lineHeight: 17,
  },

  seta: {
    fontSize: 30,
    color: '#718184',
  },

  divisor: {
    height: 1,
    backgroundColor: '#D8E1E2',
    marginLeft: 16,
  },

  navegacao: {
    minHeight: 72,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#D5E0E1',
  },

  itemNav: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  iconeNav: {
    fontSize: 23,
    color: '#788587',
  },

  textoNav: {
    fontSize: 10,
    color: '#788587',
    marginTop: 3,
  },

  ativo: {
    color: '#087F91',
    fontWeight: 'bold',
  },

  // ----- Modal de descarte -----
  modalFundo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalCaixa: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263B40',
    marginBottom: 6,
  },

  modalRotulo: {
    fontSize: 15,
    color: '#34464A',
    marginTop: 14,
    marginBottom: 8,
  },

  linhaOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#EAF5F7',
  },

  chipAtivo: {
    backgroundColor: '#087F91',
  },

  chipTexto: {
    color: '#34464A',
    fontWeight: '600',
  },

  chipTextoAtivo: {
    color: '#FFFFFF',
  },

  campo: {
    height: 45,
    borderWidth: 1,
    borderColor: '#CFDFE2',
    borderRadius: 9,
    paddingHorizontal: 13,
    fontSize: 15,
    color: '#20383E',
  },

  previa: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },

  botaoSecundario: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#087F91',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoSecundarioTexto: {
    color: '#087F91',
    fontWeight: '700',
  },

  botaoConfirmar: {
    height: 52,
    backgroundColor: '#087F91',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  cancelar: {
    textAlign: 'center',
    color: '#718184',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
  },
});