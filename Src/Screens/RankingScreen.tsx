import React, { useCallback, useState } from 'react';

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
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../Services/api';

type Morador = {
  id: string;
  nome: string;
  apartamento: string;
  pontos: number;
  souEu?: boolean;
};

export const RankingScreen: React.FC = () => {
  const { user } = useAuth();

  const [ranking, setRanking] = useState<Morador[]>([]);

  // Busca o ranking sempre que a tela ganha foco (já inclui quem acabou de descartar).
  useFocusEffect(
    useCallback(() => {
      api('/ranking').then(setRanking).catch(() => {});
    }, []),
  );

  const meuNome = user?.name || 'Usuário';

  // Localiza a pessoa conectada (a API marca souEu).
  const meuIndice = ranking.findIndex((morador) => morador.souEu);

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

            const souEu = morador.souEu;

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