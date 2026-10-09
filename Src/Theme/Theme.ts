export const Theme = {
  colors: {
    primary: '#0A7B8E',        // Botões principais, abas e ícones ativos
    primaryDark: '#075E6C',    // Estado pressed dos botões
    background: '#EFF7F8',     // Fundo das telas
    surface: '#FFFFFF',        // Cards, formulários e modais

    textPrimary: '#1C3138',    // Títulos e números em destaque
    textSecondary: '#5A6E75',  // Subtítulos e labels
    textMuted: '#8A9A8B',      // Datas e legendas
    textLight: '#FFFFFF',      // Texto sobre fundos escuros e botões

    badgeBackground: '#DDF2F4',// Fundo das badges/tags
    badgeText: '#0A7B8E',      // Texto das badges
    highlightBg: '#E4F5F6',    // Card da posição do utilizador no Ranking
    highlightBorder: '#92D2D7',// Borda do card em destaque

    // Gráfico de pizza / ESG
    chart: {
      plastic: '#0A7B8E',
      paper: '#4DA1A9',
      glass: '#71C0A7',
      metal: '#B2D8D8',
    },

    // Pódio do Ranking
    ranking: {
      gold: '#C89233',
      silver: '#8F999F',
      bronze: '#BD7C53',
    },

    border: '#D0E2E5',
    divider: '#E2EFEF',
  },

  typography: {
    sizes: {
      xs: 11,
      sm: 12,
      md: 14,
      base: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
      huge: 36,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  borderRadius: {
    sm: 8,     // Ícones e elementos pequenos
    md: 12,    // Inputs e abas
    lg: 16,    // Cards e botões
    xl: 24,    // Modais
    pill: 999, // Badges e avatares
  },

  shadows: {
    card: {
      shadowColor: '#0A7B8E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  },
};

export type Theme = typeof Theme;