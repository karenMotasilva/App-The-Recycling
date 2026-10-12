
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from '../Context/AuthContext';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../Theme/GlobalStyles";
import React from "react";


const COLORS = {
  background: "#EAF6F8",
  white: "#FFFFFF",
  primary: "#167D8A",
  primaryLight: "#DDF1F1",
  text: "#29383D",
  secondary: "#68777B",
};





function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infRow}>
      <Ionicons
        name={icon}
        size={30}
        color={COLORS.primary}
        style={styles.infIcon}
      />

      <View style={styles.infContent}>
        <Text style={styles.infLabel}>{label}</Text>
        <Text style={styles.infValue}>{value}</Text>
      </View>
    </View>
  );
}


function AccountOption({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  detail?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.optionCard, pressed && styles.pressed]}
    >
      <Ionicons
        name={icon}
        size={35}
        color={COLORS.primary}
        style={styles.optionIcon}
      />

      <Text style={styles.optionTitle}>{title}</Text>

      <View style={styles.optionRight}>
        {detail ? <Text style={styles.optionDetail}>{detail}</Text> : null}

        <Ionicons name="chevron-forward" size={24} color={COLORS.secondary} />
      </View>
    </Pressable>
  );
}

// Tela principal de Perfil
export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  const { logout } = useAuth();

function fazerLogout() {
  Alert.alert(
    'Sair da conta',
    'Tem certeza de que deseja sair?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ],
  );
}
  return (
    <SafeAreaView
      style={[globalStyles.container, styles.safeArea]}
      edges={["top"]}
    >
      {/* <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} /> */}

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => {}}>
          <Ionicons name="arrow-back" size={28} color={COLORS.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={88} color="#42616A" />
          </View>

          <Text style={styles.userName}> {user?.name ?? "Usuário"}</Text>
          {/* <View style={styles.conteinerBadge}>
            <Text style={styles.conteinerText}>{user.condominium}</Text>
          </View> */}

          <View style={styles.information}>
            {/* <InfoRow icon="id-card-outline" label="CPF" value={user.cpf} /> */}

            <InfoRow
              icon="mail-outline"
              label="E-mail"
              value={user?.email ?? "E-mail não informado"}
            />
          </View>
        </View>

        <Text style={styles.selecTitle}>Minha conta</Text>

        <View style={styles.optionsContainer}>
          <AccountOption
            icon="person-outline"
            title="Editar Dados"
            onPress={() =>
              Alert.alert(
                "Em desenvolvimento. Em breve estará disponível!",
              )
            }
          />

          <AccountOption
            icon="ribbon-outline"
            title="Meus Pontos"
            // detail={user.points}
            onPress={() =>
              Alert.alert(
                " Em desenvolvimento. Em breve estará disponível!",
              )
            }
          />

          <AccountOption
            icon="notifications-outline"
            title="Configurações de Notificação"
            onPress={() =>
              Alert.alert(
                "Em desenvolvimento. Em breve estará disponível!",
              )
            }
          />

          <AccountOption
            icon="log-out-outline"
            title="Sair"
            onPress={fazerLogout}
          />
        </View>

        <Text style={styles.fonteSlogan}>Recicle. Ganhe. Transforme.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  backButton: {
    width: 42,
    height: 48,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 12,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 24,
  },

  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 26,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#789397",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
  },

  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: "#E8E5DC",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  userName: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  conteinerBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
    maxWidth: "100%",
  },

  conteinerText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  information: {
    width: "100%",
    marginTop: 34,
    gap: 24,
  },

  infRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infIcon: {
    width: 40,
    marginRight: 12,
  },

  infContent: {
    flex: 1,
  },

  infLabel: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 3,
  },

  infValue: {
    color: COLORS.text,
    fontSize: 18,
  },

  selecTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 28,
    marginBottom: 16,
  },

  optionsContainer: {
    gap: 16,
  },

  optionCard: {
    minHeight: 92,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#789397",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  pressed: {
    opacity: 0.75,
  },

  optionIcon: {
    width: 42,
    marginRight: 12,
  },

  optionTitle: {
    flex: 1,
    fontSize: 18,
    color: COLORS.text,
  },

  optionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  optionDetail: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  fonteSlogan: {
    textAlign: "center",
    color: COLORS.secondary,
    fontSize: 17,
    marginTop: 28,
    marginBottom: 10,
  },
});
