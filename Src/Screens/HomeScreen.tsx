import React, { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

import { useAuth } from '../Context/AuthContext';

type Aba = 'Recompensas' | 'Ranking' | 'Home' | 'Perfil' | 'ESG';

export default function HomeScreen() {
  const { user } = useAuth();

  const [abaSelecionada, setAbaSelecionada] = useState<Aba>('Home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#E9F6F8"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            onPress={() => Alert.alert('Menu', 'Menu em desenvolvimento')}
          >
            <Text style={styles.iconeMenu}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Tela Inicial</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>👤</Text>
          </View>
        </View>

        {/* Saudação */}
        <Text style={styles.saudacao}>
          Bem-vindo, {user?.name || 'usuário'}!
        </Text>

        {/* Saldo de pontos */}
        <View style={styles.areaPontos}>
          <View style={styles.circulo}>
            <Text style={styles.textoSaldo}>
              Saldo de Pontos
            </Text>

            <Text style={styles.pontos}>1.250</Text>
          </View>
        </View>

        {/* Informações ambientais */}
        <View style={styles.linhaCartoes}>
          <View style={styles.cartao}>
            <Text style={styles.rotulo}>
              Seu Impacto (kg):
            </Text>

            <Text style={styles.valor}>1,8 kg</Text>
          </View>

          <View style={styles.cartao}>
            <Text style={styles.rotulo}>
              Último Descarte:
            </Text>

            <Text style={styles.valor}>18 min</Text>
          </View>
        </View>

        {/* Acesso rápido */}
        <Text style={styles.tituloSecao}>
          Acesso Rápido
        </Text>

        <TouchableOpacity
          style={styles.botaoDescarte}
          onPress={() =>
            Alert.alert(
              'Descarte',
              'Fluxo de descarte em desenvolvimento',
            )
          }
        >
          <Text style={styles.iconeBotao}>♻</Text>

          <Text style={styles.textoBotao}>
            Descartar Resíduo
          </Text>

          <Text style={styles.iconeNfc}>)))</Text>
        </TouchableOpacity>

        {/* Benefícios disponíveis */}
        <Text style={styles.tituloSecao}>
          Próximas Recompensas
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F6F8',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  cabecalho: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconeMenu: {
    fontSize: 27,
    color: '#263B40',
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#263B40',
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#DCE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarTexto: {
    fontSize: 25,
  },

  saudacao: {
    fontSize: 22,
    color: '#263B40',
    marginTop: 14,
  },

  areaPontos: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circulo: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 10,
    borderColor: '#087F91',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoSaldo: {
    fontSize: 20,
    color: '#263B40',
  },

  pontos: {
    fontSize: 47,
    fontWeight: 'bold',
    color: '#245568',
    marginTop: 8,
  },

  linhaCartoes: {
    flexDirection: 'row',
    gap: 12,
  },

  cartao: {
    flex: 1,
    minHeight: 115,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 2,
  },

  rotulo: {
    fontSize: 15,
    color: '#34464A',
    textAlign: 'center',
  },

  valor: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#263B40',
    marginTop: 8,
  },

  tituloSecao: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#263B40',
    marginTop: 28,
    marginBottom: 14,
  },

  botaoDescarte: {
    minHeight: 100,
    backgroundColor: '#087F91',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  iconeBotao: {
    fontSize: 35,
    color: '#FFFFFF',
  },

  textoBotao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  iconeNfc: {
    fontSize: 23,
    color: '#FFFFFF',
  },

  listaRecompensas: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    overflow: 'hidden',
    elevation: 2,
  },

  itemRecompensa: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  iconePresente: {
    fontSize: 28,
    color: '#579B9D',
  },

  infoRecompensa: {
    flex: 1,
  },

  textoRecompensa: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34464A',
  },

  descricaoRecompensa: {
    fontSize: 12,
    color: '#718184',
    marginTop: 5,
    lineHeight: 17,
  },

  seta: {
    fontSize: 30,
    color: '#718184',
  },

  divisor: {
    height: 1,
    backgroundColor: '#D8E1E2',
    marginLeft: 16,
  },

  navegacao: {
    minHeight: 72,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#D5E0E1',
  },

  itemNav: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  iconeNav: {
    fontSize: 23,
    color: '#788587',
  },

  textoNav: {
    fontSize: 10,
    color: '#788587',
    marginTop: 3,
  },

  ativo: {
    color: '#087F91',
    fontWeight: 'bold',
  },
});