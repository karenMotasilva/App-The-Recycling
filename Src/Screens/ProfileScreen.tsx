import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  StyleSheet,
  Alert,
  Image,
  Modal,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../Theme/GlobalStyles";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { api, API_URL } from "../Services/api";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { useAuth } from "../Context/AuthContext";


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
  const { logout } = useAuth();

  const [user, setUser] = useState({
    name: "",
    condominium: "",
    cpf: "",
    email: "",
    points: "",
    apartamento: "",
    foto: null as string | null,
    notifPontos: true,
    notifRecompensas: true,
  });
  const [modalDados, setModalDados] = useState(false);
  const [modalNotif, setModalNotif] = useState(false);
  const [cpfEdit, setCpfEdit] = useState("");
  const [aptoEdit, setAptoEdit] = useState("");

  useFocusEffect(
    useCallback(() => {
      api("/perfil").then(setUser).catch(() => {});
    }, []),
  );

  const recarregar = () => api("/perfil").then(setUser).catch(() => {});

  async function trocarFoto() {
    const r = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (r.canceled) return;
    try {
      const form = new FormData();
      form.append("foto", new File(r.assets[0].uri), "perfil.jpg");
      await api("/perfil/foto", { method: "POST", body: form });
      recarregar();
    } catch (error) {
      Alert.alert(
        "Não foi possível atualizar a foto",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    }
  }

  function abrirEditar() {
    setCpfEdit(user.cpf === "Não informado" ? "" : user.cpf);
    setAptoEdit(user.apartamento === "Não informado" ? "" : user.apartamento);
    setModalDados(true);
  }

  async function salvarDados() {
    try {
      await api("/perfil", {
        method: "PUT",
        body: JSON.stringify({ cpf: cpfEdit, apartamento: aptoEdit }),
      });
      setModalDados(false);
      recarregar();
    } catch (error) {
      Alert.alert(
        "Não foi possível salvar",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    }
  }

  async function alternarNotif(campo: "notifPontos" | "notifRecompensas", valor: boolean) {
    setUser({ ...user, [campo]: valor });
    try {
      await api("/perfil", { method: "PUT", body: JSON.stringify({ [campo]: valor }) });
    } catch {
      recarregar();
    }
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
         
          <Pressable style={styles.avatar} onPress={trocarFoto}>
            {user.foto ? (
              <Image
                source={{ uri: `${API_URL}/uploads/${user.foto}` }}
                style={styles.avatarFoto}
              />
            ) : (
              <Ionicons name="person" size={88} color="#42616A" />
            )}
          </Pressable>

          <Text style={styles.userName}>{user.name}</Text>

          <View style={styles.conteinerBadge}>
            <Text style={styles.conteinerText}>{user.condominium}</Text>
          </View>

         
          <View style={styles.information}>
            <InfoRow icon="id-card-outline" label="CPF" value={user.cpf} />

            <InfoRow icon="mail-outline" label="E-mail" value={user.email} />

            <InfoRow icon="home-outline" label="Apartamento" value={user.apartamento} />
          </View>
        </View>

       
        <Text style={styles.selecTitle}>Minha conta</Text>

        <View style={styles.optionsContainer}>
          <AccountOption
            icon="person-outline"
            title="Editar Dados"
            onPress={abrirEditar}
          />

          <AccountOption
            icon="ribbon-outline"
            title="Meus Pontos"
            detail={user.points}
            onPress={() => console.log("Meus pontos")}
          />

          <AccountOption
            icon="notifications-outline"
            title="Configurações de Notificação"
            onPress={() => setModalNotif(true)}
          />

          <AccountOption
            icon="log-out-outline"
            title="Sair"
            onPress={logout}
          />
        </View>

       
        <Text style={styles.fonteSlogan}>Recicle. Ganhe. Transforme.</Text>
      </ScrollView>
      <Modal visible={modalDados} animationType="slide" transparent onRequestClose={() => setModalDados(false)}>
        <KeyboardAvoidingView
          style={styles.modalFundo}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>Editar Dados</Text>

            <Text style={styles.modalRotulo}>CPF</Text>
            <TextInput
              style={styles.campo}
              placeholder="000.000.000-00"
              placeholderTextColor="#82969A"
              value={cpfEdit}
              onChangeText={setCpfEdit}
              keyboardType="numeric"
              maxLength={14}
            />

            <Text style={styles.modalRotulo}>Apartamento</Text>
            <TextInput
              style={styles.campo}
              placeholder="Ex.: Bloco A, apto 302"
              placeholderTextColor="#82969A"
              value={aptoEdit}
              onChangeText={setAptoEdit}
            />

            <Pressable style={styles.botaoSalvar} onPress={salvarDados}>
              <Text style={styles.botaoSalvarTexto}>Salvar</Text>
            </Pressable>
            <Pressable onPress={() => setModalDados(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={modalNotif} animationType="slide" transparent onRequestClose={() => setModalNotif(false)}>
        <View style={styles.modalFundo}>
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>Notificações</Text>

            <View style={styles.linhaSwitch}>
              <Text style={styles.optionTitle}>Pontos e descartes</Text>
              <Switch
                value={user.notifPontos}
                onValueChange={(v) => alternarNotif("notifPontos", v)}
                trackColor={{ true: COLORS.primary }}
              />
            </View>

            <View style={styles.linhaSwitch}>
              <Text style={styles.optionTitle}>Novas recompensas</Text>
              <Switch
                value={user.notifRecompensas}
                onValueChange={(v) => alternarNotif("notifRecompensas", v)}
                trackColor={{ true: COLORS.primary }}
              />
            </View>

            <Pressable onPress={() => setModalNotif(false)}>
              <Text style={styles.cancelar}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  avatarFoto: {
    width: 124,
    height: 124,
  },

  modalFundo: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalCaixa: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },

  modalRotulo: {
    fontSize: 15,
    color: COLORS.text,
    marginTop: 14,
    marginBottom: 8,
  },

  campo: {
    height: 45,
    borderWidth: 1,
    borderColor: "#CFDFE2",
    borderRadius: 9,
    paddingHorizontal: 13,
    fontSize: 15,
    color: COLORS.text,
  },

  botaoSalvar: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  botaoSalvarTexto: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },

  linhaSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  cancelar: {
    textAlign: "center",
    color: COLORS.secondary,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },

  fonteSlogan: {
    textAlign: "center",
    color: COLORS.secondary,
    fontSize: 17,
    marginTop: 28,
    marginBottom: 10,
  },
});