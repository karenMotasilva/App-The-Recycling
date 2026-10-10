import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../Theme/Theme';
import { globalStyles } from '../Theme/GlobalStyles';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export default function ESGScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'Semana' | 'Mês' | 'Ano'>('Mês');

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
          <p><strong>Empresa:</strong> Jardim das Flores</p>
          <p><strong>Período:</strong> 01 a 30 de setembro de 2026</p>
          
          <div class="card">
            <h3>Total de Resíduos Triados</h3>
            <p class="highlight">480 kg</p>
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
              <tr><td>Plástico</td><td>192 kg</td><td>40%</td></tr>
              <tr><td>Papel</td><td>144 kg</td><td>30%</td></tr>
              <tr><td>Vidro</td><td>96 kg</td><td>20%</td></tr>
              <tr><td>Metal</td><td>48 kg</td><td>10%</td></tr>
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
      const customFileName = `Relatorio_ESG_Jardim_das_Flores_${formattedDate}.pdf`;
      
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
        {/* Info da Empresa e Periodo */}
        <View style={globalStyles.rowBetween}>
          <View>
            <Text style={[globalStyles.title, { fontSize: Theme.typography.sizes.lg }]}>
              Jardim das Flores
            </Text>
            <Text style={globalStyles.mutedText}>01 a 30 de setembro de 2026</Text>
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
              480 <Text style={globalStyles.subtitle}>kg</Text>
            </Text>
            <View style={globalStyles.rowCenter}>
              <Ionicons name="arrow-up" size={14} color={Theme.colors.primary} />
              <Text style={styles.growthText}>20%</Text>
            </View>
          </View>
        </View>

        {/* Cards Secundários -> Grid com Pontos + Economia de Carbono */}
        <View style={styles.gridRow}>
          <View style={[globalStyles.card, styles.smallCard]}>
            <Text style={globalStyles.subtitle}>Pontos Distribuídos</Text>
            <Text style={[globalStyles.title, styles.cardValue]}>4.800</Text>
            <Text style={styles.growthText}>↑ 20% vs. mês anterior</Text>
          </View>

          <View style={[globalStyles.card, styles.smallCard]}>
            <Text style={globalStyles.subtitle}>Economia de Carbono (kgCO₂)</Text>
            <Text style={[globalStyles.title, styles.cardValue]}>720</Text>
            <Text style={styles.growthText}>↑ 20% vs. mês anterior</Text>
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
                  480 kg
                </Text>
                <Text style={globalStyles.mutedText}>reciclados</Text>
              </View>
            </View>

            {/* Lista dos residuos reciclados */}
            <View style={styles.breakdownList}>
              {[
                { label: 'Plástico', weight: '192 kg', pct: '40%', color: Theme.colors.chart.plastic },
                { label: 'Papel', weight: '144 kg', pct: '30%', color: Theme.colors.chart.paper },
                { label: 'Vidro', weight: '96 kg', pct: '20%', color: Theme.colors.chart.glass },
                { label: 'Metal', weight: '48 kg', pct: '10%', color: Theme.colors.chart.metal },
              ].map((item, index) => (
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
            480 kg de materiais destinados à reciclagem.
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
          Atualizado em 30/09 às 18:00  - Ainda vou mudar
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