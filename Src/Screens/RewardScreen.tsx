import React, { useCallback, useState } from 'react';
import { Text,View,FlatList,Image, StyleSheet, Alert, TouchableOpacity,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Theme } from '../Theme/Theme';
import { globalStyles } from '../Theme/GlobalStyles';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../Services/api';

type Recompensa = {
  id: string;
  titulo: string;
  categoria: string;
  pontos: number;
  imagem: string;
};

type Descarte = {
  id: string;
  data: string;
  local: string;
  peso: string;
  pontos: number;
};

export const RewardScreen: React.FC = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [historico, setHistorico] = useState<Descarte[]>([]);
  const [saldo, setSaldo] = useState(0);

  
  const carregar = useCallback(() => {
    api('/recompensas')
      .then((d) => {
        setRecompensas(Array.isArray(d.recompensas) ? d.recompensas : []);
        setHistorico(Array.isArray(d.historico) ? d.historico : []);
        setSaldo(Number(d.pontos ?? 0));
      })
      .catch((error) => {
        console.error('Erro ao carregar recompensas:', error);
      });
  }, []);
  useFocusEffect(carregar);

  function resgatar(item: Recompensa) {
    Alert.alert(
      'Resgatar recompensa',
      `Trocar ${item.pontos} pontos por "${item.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resgatar',
          onPress: async () => {
            try {
              await api(`/recompensas/${item.id}/resgatar`, { method: 'POST' });
              carregar();
              Alert.alert('Recompensa resgatada', `Você resgatou "${item.titulo}"!`);
            } catch (error) {
              Alert.alert(
                'Não foi possível resgatar',
                error instanceof Error ? error.message : 'Tente novamente.',
              );
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.cabecalho}>
              Recompensas & Histórico
            </Text>

            <Text style={[globalStyles.title, styles.tituloSecao]}>
              Recompensas Disponíveis
            </Text>

            <Text style={[globalStyles.mutedText, { marginBottom: Theme.spacing.sm }]}>
              Seu saldo: {Number(saldo ?? 0).toLocaleString('pt-BR')} pontos
            </Text>

            {recompensas.map((item) => (
              <View key={item.id} style={styles.cartaoRecompensa}>
                <View style={styles.informacoes}>
                  <Text style={styles.tituloCartao}>
                    {item.titulo}
                  </Text>

                  <Text style={styles.categoria}>
                    {item.categoria}
                  </Text>

                  <Text style={styles.pontos}>
                    {item.pontos} pontos
                  </Text>

                  <TouchableOpacity
                    style={[styles.botaoResgatar, saldo < item.pontos && styles.botaoResgatarOff]}
                    disabled={saldo < item.pontos}
                    onPress={() => resgatar(item)}
                  >
                    <Text style={styles.botaoResgatarTexto}>
                      {saldo < item.pontos ? `Faltam ${item.pontos - saldo} pts` : 'Resgatar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={{ uri: item.imagem }}
                  style={styles.imagem}
                  resizeMode="cover"
                />
              </View>
            ))}

            <Text style={[globalStyles.title, styles.tituloSecao]}>
              Histórico de Descartes
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[globalStyles.card, styles.cartaoHistorico]}>
            <View style={styles.linhaHistorico}>
              <View style={styles.dadosHistorico}>
                <Text style={globalStyles.bodyText}>
                  Data: {item.data}
                </Text>
                <Text style={globalStyles.bodyText}>
                  Local: {item.local}
                </Text>
                <Text style={globalStyles.bodyText}>
                  Peso: {item.peso}
                </Text>
                <Text style={globalStyles.bodyText}>
                  Pontos: {item.pontos}
                </Text>
              </View>

              <Text style={styles.seta}>›</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  conteudo: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },

  cabecalho: {
    backgroundColor: Theme.colors.primary,
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.xl,
  },

  tituloSecao: {
    marginBottom: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },

  cartaoRecompensa: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    minHeight: 140,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.card,
  },

  informacoes: {
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.md,
  },

  tituloCartao: {
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold,
  },

  categoria: {
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.md,
    marginTop: Theme.spacing.xs,
  },

  pontos: {
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.md,
    marginTop: Theme.spacing.xs,
  },

  botaoResgatar: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.pill,
    marginTop: Theme.spacing.sm,
  },

  botaoResgatarOff: {
    opacity: 0.6,
  },

  botaoResgatarTexto: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.bold,
  },

  imagem: {
    width: '34%',
    height: '100%',
  },

  cartaoHistorico: {
    marginBottom: Theme.spacing.sm,
  },

  linhaHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dadosHistorico: {
    flex: 1,
    gap: Theme.spacing.xs,
  },

  seta: {
    fontSize: 32,
    color: Theme.colors.textSecondary,
    paddingHorizontal: Theme.spacing.sm,
  },
});