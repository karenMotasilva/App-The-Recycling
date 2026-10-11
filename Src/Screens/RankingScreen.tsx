import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Theme } from '../Theme/Theme';
import { useAuth } from '../Context/AuthContext';

type Morador = {
  id: string;
  nome: string;
  apartamento: string;
  pontos: number;
};

const moradores: Morador[] = [
  {
    id: '1',
    nome: 'Karen Mota',
    apartamento: 'Apto 302',
    pontos: 1850,
  },
  {
    id: '2',
    nome: 'Nilson Santos',
    apartamento: 'Apto 104',
    pontos: 1620,
  },
  {
    id: '3',
    nome: 'Sara Lima',
    apartamento: 'Apto 205',
    pontos: 1480,
  },
  {
    id: '4',
    nome: 'Alejandro Silva',
    apartamento: 'Apto 401',
    pontos: 1250,
  },
  {
    id: '5',
    nome: 'Ismael Moura',
    apartamento: 'Apto 103',
    pontos: 1100,
  },
  {
    id: '6',
    nome: 'Pedro Oliveira',
    apartamento: 'Apto 204',
    pontos: 950,
  },
];

export const RankingScreen: React.FC = () => {
  const { user } = useAuth();

  const meuNome = user?.name || 'Usuário';

  // Verifica se a pessoa já existe na lista de moradores.
  const moradorCadastrado = moradores.some(
    (morador) =>
      morador.nome.trim().toLowerCase() ===
      meuNome.trim().toLowerCase(),
  );

  // Se for uma nova conta, inclui a pessoa no ranking.
  // Os pontos começam em zero porque ainda não há pontuação real.
  const listaMoradores: Morador[] = moradorCadastrado
    ? moradores
    : [
        ...moradores,
        {
          id: user?.email || 'usuario-atual',
          nome: meuNome,
          apartamento: 'Apartamento não informado',
          pontos: 0,
        },
      ];

  // Ordena os moradores do maior para o menor número de pontos.
  const ranking = [...listaMoradores].sort(
    (a, b) => b.pontos - a.pontos,
  );

  // Localiza a pessoa conectada.
  const meuIndice = ranking.findIndex(
    (morador) =>
      morador.nome.trim().toLowerCase() ===
      meuNome.trim().toLowerCase(),
  );

  const minhaPosicao =
    meuIndice >= 0 ? meuIndice + 1 : null;

  const meusPontos =
    meuIndice >= 0 ? ranking[meuIndice].pontos : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Ranking</Text>

          <Text style={styles.subtitulo}>
            Condomínio sustentável
          </Text>
        </View>

        {/* Destaque */}
        <View style={styles.cartaoDestaque}>
          <Text style={styles.iconeDestaque}>🏆</Text>

          <Text style={styles.tituloDestaque}>
            Juntos por um condomínio melhor!
          </Text>

          <Text style={styles.textoDestaque}>
            Confira quem está contribuindo mais
            para um futuro sustentável.
          </Text>
        </View>

        {/* Minha posição */}
        <Text style={styles.tituloSecao}>
          Minha posição
        </Text>

        <View style={styles.cartaoMinhaPosicao}>
          <View style={styles.posicaoCirculo}>
            <Text style={styles.numeroPosicao}>
              {minhaPosicao ?? '—'}º
            </Text>
          </View>

          <View style={styles.infoMinhaPosicao}>
            <Text style={styles.nomeMorador}>
              {meuNome}
            </Text>

            <Text style={styles.textoSecundario}>
              Sua colocação no condomínio
            </Text>
          </View>

          <View style={styles.pontosMinhaPosicao}>
            <Text style={styles.numeroPontos}>
              {meusPontos.toLocaleString('pt-BR')}
            </Text>

            <Text style={styles.rotuloPontos}>
              pontos
            </Text>
          </View>
        </View>

        {/* Classificação */}
        <Text style={styles.tituloSecao}>
          Classificação geral
        </Text>

        <View style={styles.listaRanking}>
          {ranking.map((morador, index) => {
            const posicao = index + 1;
            const primeiro = posicao === 1;
            const segundo = posicao === 2;
            const terceiro = posicao === 3;

            const souEu =
              morador.nome.trim().toLowerCase() ===
              meuNome.trim().toLowerCase();

            return (
              <View
                key={morador.id}
                style={[
                  styles.itemRanking,
                  souEu && styles.itemDestaque,
                ]}
              >
                <View
                  style={[
                    styles.numeroRanking,
                    primeiro && styles.medalhaOuro,
                    segundo && styles.medalhaPrata,
                    terceiro && styles.medalhaBronze,
                  ]}
                >
                  <Text
                    style={[
                      styles.textoNumeroRanking,
                      (primeiro || segundo || terceiro) &&
                        styles.textoMedalha,
                    ]}
                  >
                    {posicao}
                  </Text>
                </View>

                <View style={styles.avatar}>
                  <Text style={styles.textoAvatar}>
                    {primeiro
                      ? '🥇'
                      : segundo
                        ? '🥈'
                        : terceiro
                          ? '🥉'
                          : '🌱'}
                  </Text>
                </View>

                <View style={styles.infoMorador}>
                  <Text style={styles.nomeLista}>
                    {morador.nome}
                    {souEu ? ' (Você)' : ''}
                  </Text>

                  <Text style={styles.apartamento}>
                    {morador.apartamento}
                  </Text>
                </View>

                <View style={styles.pontosLista}>
                  <Text style={styles.pontosNumero}>
                    {morador.pontos.toLocaleString('pt-BR')}
                  </Text>

                  <Text style={styles.pontosLegenda}>
                    pontos
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Mensagem final */}
        <View style={styles.mensagemFinal}>
          <Text style={styles.iconeFolha}>🍃</Text>

          <Text style={styles.textoMensagem}>
            Cada descarte correto faz a diferença.
            Continue participando!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },

  cabecalho: {
    marginBottom: 22,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },

  subtitulo: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    marginTop: 5,
  },

  cartaoDestaque: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
  },

  iconeDestaque: {
    fontSize: 44,
    marginBottom: 10,
  },

  tituloDestaque: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  textoDestaque: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },

  tituloSecao: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginTop: 26,
    marginBottom: 14,
  },

  cartaoMinhaPosicao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    ...Theme.shadows.card,
  },

  posicaoCirculo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.colors.highlightBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  numeroPosicao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },

  infoMinhaPosicao: {
    flex: 1,
    marginLeft: 12,
  },

  nomeMorador: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },

  textoSecundario: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },

  pontosMinhaPosicao: {
    alignItems: 'flex-end',
  },

  numeroPontos: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },

  rotuloPontos: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },

  listaRanking: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    ...Theme.shadows.card,
  },

  itemRanking: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },

  itemDestaque: {
    backgroundColor: Theme.colors.highlightBg,
    marginHorizontal: -14,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  numeroRanking: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDF2F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoNumeroRanking: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
  },

  medalhaOuro: {
    backgroundColor: Theme.colors.ranking.gold,
  },

  medalhaPrata: {
    backgroundColor: Theme.colors.ranking.silver,
  },

  medalhaBronze: {
    backgroundColor: Theme.colors.ranking.bronze,
  },

  textoMedalha: {
    color: '#FFFFFF',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  textoAvatar: {
    fontSize: 22,
  },

  infoMorador: {
    flex: 1,
    marginLeft: 10,
  },

  nomeLista: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },

  apartamento: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },

  pontosLista: {
    alignItems: 'flex-end',
    marginLeft: 5,
  },

  pontosNumero: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },

  pontosLegenda: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 3,
  },

  mensagemFinal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.highlightBg,
    borderRadius: 14,
    padding: 16,
    marginTop: 22,
    gap: 10,
  },

  iconeFolha: {
    fontSize: 25,
  },

  textoMensagem: {
    flex: 1,
    fontSize: 13,
    color: Theme.colors.textPrimary,
    lineHeight: 19,
  },
});