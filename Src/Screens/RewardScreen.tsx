import React from 'react';
import { Text,View,FlatList,Image, StyleSheet,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Theme } from '../Theme/Theme';
import { globalStyles } from '../Theme/GlobalStyles';

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

const recompensas: Recompensa[] = [
  {
    id: '1',
    titulo: 'Desconto na conta de luz',
    categoria: 'Economia de energia',
    pontos: 200,
    imagem:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500',
  },
  {
    id: '2',
    titulo: 'Vale-compras sustentável',
    categoria: 'Comércio parceiro',
    pontos: 150,
    imagem:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
  },
  {
    id: '3',
    titulo: 'Kit de plantas',
    categoria: 'Jardim sustentável',
    pontos: 100,
    imagem:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
  },
];

const historico: Descarte[] = [
  {
    id: '1',
    data: '17/10/2026',
    local: 'Condomínio X',
    peso: '2,5 kg',
    pontos: 25,
  },
  {
    id: '2',
    data: '19/10/2026',
    local: 'Condomínio X',
    peso: '2,5 kg',
    pontos: 25,
  },
];

export const RewardScreen: React.FC = () => {
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