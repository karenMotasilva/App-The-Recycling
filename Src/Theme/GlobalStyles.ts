import { StyleSheet } from 'react-native';
import { Theme } from './Theme';

export const globalStyles = StyleSheet.create({
  // Layout e Containers
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background, // Fundo padrão das telas
  },
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  contentPadding: {
    paddingHorizontal: Theme.spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Cards
  card: {
    backgroundColor: Theme.colors.surface, // Cards brancos (ESG, Home, Ranking)
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginVertical: Theme.spacing.xs,
    ...Theme.shadows.card,
  },
  cardHighlight: {
    backgroundColor: Theme.colors.highlightBg, // Card em destaque (posição do usuário)
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.highlightBorder,
    padding: Theme.spacing.md,
  },

  // Botões
  buttonPrimary: {
    height: 52,
    backgroundColor: Theme.colors.primary, // Botão principal CTA
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  buttonPrimaryText: {
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.bold,
  },

  // Tipografia
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.textPrimary, // Títulos principais
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.textSecondary, // Subtítulos e labels
  },
  bodyText: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.regular,
    color: Theme.colors.textPrimary,
  },
  mutedText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.regular,
    color: Theme.colors.textMuted, // Datas e legendas
  },

  // Badges e Tags
  badge: {
    backgroundColor: Theme.colors.badgeBackground, // Tags de filtro e selos
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Theme.colors.badgeText,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
  },
});