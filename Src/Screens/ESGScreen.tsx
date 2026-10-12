import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { api, API_URL } from '../Services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../Theme/Theme';
import { globalStyles } from '../Theme/GlobalStyles';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export default function ESGScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'Semana' | 'Mês' | 'Ano'>('Mês');

  // Dados vindos da API (refaz a busca ao trocar a aba ou ao voltar para a tela)
  const [dados, setDados] = useState<any>({
    condominio: '', inicio: '', fim: '',
    totalKg: 0, pontos: 0, carbono: 0, variacao: {}, materiais: [],
    apartamento: '', foto: null,
  });
  const periodo = activeTab === 'Semana' ? 'semana' : activeTab === 'Ano' ? 'ano' : 'mes';
  const anterior =
    activeTab === 'Semana' ? 'semana anterior' : activeTab === 'Ano' ? 'ano anterior' : 'mês anterior';

  useFocusEffect(
    useCallback(() => {
      api(`/esg?periodo=${periodo}`).then(setDados).catch(() => {});
    }, [periodo]),
  );

  const nf = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  const seta = (v: number | null | undefined) =>
    v == null ? '—' : `${v >= 0 ? '↑' : '↓'} ${Math.abs(v)}%`;

  const info: any = {
    plastico: ['Plástico', Theme.colors.chart.plastic],
    papel: ['Papel', Theme.colors.chart.paper],
    vidro: ['Vidro', Theme.colors.chart.glass],
    metal: ['Metal', Theme.colors.chart.metal],
  };
  const listaMateriais = dados.materiais.map((m: any) => ({
    label: info[m.material][0],
    weight: `${nf(m.kg)} kg`,
    pct: `${m.pct}%`,
    color: info[m.material][1],
  }));

  // Largura calculada das abas com base nas dimensões da janela
  const tabWidth = (width - Theme.spacing.md * 2 - 8) / 3;

  // Função para gerar e compartilhar o relatório em PDF
const handleGeneratePdf = async () => {
    // Template HTML e CSS estilizado para o relatório
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 20px; color: #1C3138; }
            h1 { color: #0A7B8E; }
            .card { background: #EFF7F8; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            .highlight { font-size: 24px; font-weight: bold; color: #0A7B8E; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #D0E2E5; padding: 10px; text-align: left; }
            th { background-color: #0A7B8E; color: white; }
          </style>
        </head>
        <body>
          <h1>Relatório Ambiental (ESG) - Recycling</h1>
          <p><strong>Empresa:</strong> ${dados.condominio}</p>
          <p><strong>Período:</strong> ${dados.inicio} a ${dados.fim}</p>
          
          <div class="card">
            <h3>Total de Resíduos Triados</h3>
            <p class="highlight">${nf(dados.totalKg)} kg</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantidade (kg)</th>
                <th>Porcentagem</th>
              </tr>
            </thead>
            <tbody>
              ${listaMateriais
                .map((m: any) => `<tr><td>${m.label}</td><td>${m.weight}</td><td>${m.pct}</td></tr>`)
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      // Gera o PDF padrão do Expo
      const { uri: tempUri } = await Print.printToFileAsync({ html: htmlContent });

      // Define o nome corporativo com base na data atual
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      const customFileName = `Relatorio_ESG_Jardim_das_Flores_${periodo}_${formattedDate}.pdf`;
      
      // Move o arquivo para o diretório de cache 
      const newUri = `${FileSystem.cacheDirectory}${customFileName}`;
      await FileSystem.moveAsync({
        from: tempUri,
        to: newUri,
      });

      // Abre o menu nativo de compartilhamento utilizando o novo caminho nomeado
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newUri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={Theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={globalStyles.title}>Relatório Ambiental (ESG)</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Foto e apartamento do usuário */}
        <View style={[globalStyles.rowCenter, { marginBottom: Theme.spacing.sm }]}>
          {dados.foto ? (
            <Image
              source={{ uri: `${API_URL}/uploads/${dados.foto}` }}
              style={styles.fotoPerfil}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color={Theme.colors.primary} />
          )}
          <Text style={[globalStyles.mutedText, { marginLeft: Theme.spacing.xs }]}>
            {dados.apartamento || 'Apartamento não informado'}
          </Text>
        </View>

        {/* Info da Empresa e Periodo */}
        <View style={globalStyles.rowBetween}>
          <View>
            <Text style={[globalStyles.title, { fontSize: Theme.typography.sizes.lg }]}>
              {dados.condominio}
            </Text>
            <Text style={globalStyles.mutedText}>
              {dados.inicio} a {dados.fim}
            </Text>
          </View>
          <View style={globalStyles.badge}>
            <Text style={globalStyles.badgeText}>Painel ESG</Text>
          </View>
        </View>

        {/* Abas de filtros de data */}
        <View style={styles.tabContainer}>
          {(['Semana', 'Mês', 'Ano'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                { width: tabWidth },
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  globalStyles.subtitle,
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card principal -> total de resíduos */}
        <View style={globalStyles.card}>
          <View style={[globalStyles.rowCenter, { marginBottom: Theme.spacing.xs }]}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="recycle" size={20} color={Theme.colors.primary} />
            </View>
            <Text style={globalStyles.subtitle}>Total de Resíduos Triados (kg)</Text>
          </View>
          <View style={globalStyles.rowBetween}>
            <Text style={[globalStyles.title, { fontSize: Theme.typography.sizes.xxl }]}>
              {nf(dados.totalKg)} <Text style={globalStyles.subtitle}>kg</Text>
            </Text>
            <View style={globalStyles.rowCenter}>
              <Text style={styles.growthText}>{seta(dados.variacao.kg)}</Text>
            </View>
          </View>
        </View>

        {/* Cards Secundários -> Grid com Pontos + Economia de Carbono */}
        <View style={styles.gridRow}>
          <View style={[globalStyles.card, styles.smallCard]}>
            <Text style={globalStyles.subtitle}>Pontos Distribuídos</Text>
            <Text style={[globalStyles.title, styles.cardValue]}>
              {dados.pontos.toLocaleString('pt-BR')}
            </Text>
            <Text style={styles.growthText}>
              {seta(dados.variacao.pontos)} vs. {anterior}
            </Text>
          </View>

          <View style={[globalStyles.card, styles.smallCard]}>
            <Text style={globalStyles.subtitle}>Economia de Carbono (kgCO₂)</Text>
            <Text style={[globalStyles.title, styles.cardValue]}>
              {dados.carbono.toLocaleString('pt-BR')}
            </Text>
            <Text style={styles.growthText}>
              {seta(dados.variacao.kg)} vs. {anterior}
            </Text>
          </View>
        </View>

        {/* Seção resíduos por tipo */}
        <View style={globalStyles.card}>
          <View style={[globalStyles.rowBetween, { marginBottom: Theme.spacing.md }]}>
            <Text style={globalStyles.title}>Resíduos por tipo</Text>
            <Text style={globalStyles.mutedText}>Peso triado</Text>
          </View>

          <View style={globalStyles.rowBetween}>
            {/* Gráfico Anelar */}
            <View style={styles.chartMock}>
              <View style={styles.chartInner}>
                <Text style={[globalStyles.title, { fontSize: Theme.typography.sizes.base }]}>
                  {nf(dados.totalKg)} kg
                </Text>
                <Text style={globalStyles.mutedText}>reciclados</Text>
              </View>
            </View>

            {/* Lista dos residuos reciclados */}
            <View style={styles.breakdownList}>
              {listaMateriais.map((item: any, index: number) => (
                <View key={index} style={[globalStyles.rowBetween, { marginBottom: Theme.spacing.xs }]}>
                  <View style={globalStyles.rowCenter}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <View>
                      <Text style={globalStyles.bodyText}>{item.label}</Text>
                      <Text style={globalStyles.mutedText}>{item.weight}</Text>
                    </View>
                  </View>
                  <Text style={[globalStyles.title, { fontSize: Theme.typography.sizes.base }]}>
                    {item.pct}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={[globalStyles.mutedText, styles.footerNote]}>
            {nf(dados.totalKg)} kg de materiais destinados à reciclagem.
          </Text>
        </View>

        {/* Botão principal CTA */}
        <TouchableOpacity 
          style={[globalStyles.buttonPrimary, styles.ctaButton]}
          onPress={handleGeneratePdf}
        >
          <MaterialCommunityIcons name="file-pdf-box" size={22} color={Theme.colors.textLight} />
          <Text style={globalStyles.buttonPrimaryText}>Gerar Relatório Completo (PDF)</Text>
        </TouchableOpacity>

        <Text style={[globalStyles.mutedText, styles.updateInfo]}>
          Atualizado em {new Date().toLocaleDateString('pt-BR')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  menuButton: {
    marginRight: Theme.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: 4,
    marginVertical: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  tabButton: {
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: Theme.typography.sizes.sm,
  },
  tabTextActive: {
    color: Theme.colors.textLight,
    fontWeight: Theme.typography.weights.bold,
  },
  iconCircle: {
    backgroundColor: Theme.colors.badgeBackground,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.xs,
  },
  growthText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.primary,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: '48.5%',
  },
  cardValue: {
    marginVertical: Theme.spacing.xs,
    fontSize: Theme.typography.sizes.xl,
  },
  chartMock: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: Theme.colors.chart.plastic,
    borderLeftColor: Theme.colors.chart.paper,
    borderBottomColor: Theme.colors.chart.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chartInner: {
    alignItems: 'center',
  },
  breakdownList: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Theme.borderRadius.pill,
    marginRight: Theme.spacing.xs,
  },
  footerNote: {
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  ctaButton: {
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  updateInfo: {
    textAlign: 'center',
  },
});