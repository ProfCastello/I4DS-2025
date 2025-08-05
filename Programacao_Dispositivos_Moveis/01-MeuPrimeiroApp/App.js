// Importa os módulos necessários do React e React Native.
import React from "react"; // 'React' é necessário para usar JSX.
import { StyleSheet, Text, View } from "react-native"; // 'StyleSheet', 'Text' e 'View' são componentes e APIs do React Native.

// Define o componente principal da aplicação, 'App'.
// A palavra-chave 'export default' o torna disponível para ser usado em outras partes da aplicação.
export default function App() {
  // O componente retorna uma estrutura de UI (Interface de Usuário) em JSX.
  return (
    // 'View' é um contêiner flexível, equivalente a uma <div> em HTML.
    // A prop 'style' recebe um objeto de estilos definido no 'StyleSheet'.
    <View style={styles.container}>
      {/* 'Text' é o componente usado para exibir qualquer texto. */}
      {/* O estilo 'title' é aplicado especificamente a este texto. */}
      <Text style={styles.title}>Meu Primeiro App</Text>

      {/* Outro componente 'Text', desta vez com o estilo 'subtitle'. */}
      <Text style={styles.subtitle}>Bem-vindo ao React Native!</Text>
    </View>
  );
}

// Cria um objeto de estilos usando a API 'StyleSheet'.
// Isso otimiza o desempenho e facilita a organização dos estilos.
const styles = StyleSheet.create({
  // Estilos para o contêiner principal.
  container: {
    // 'flex: 1' faz com que o 'View' ocupe todo o espaço disponível na tela.
    flex: 1,
    // Define a cor de fundo do contêiner como branco.
    backgroundColor: "#fff",
    // Alinha os itens filhos (os textos) horizontalmente ao centro.
    alignItems: "center",
    // Alinha os itens filhos verticalmente ao centro.
    justifyContent: "center",
  },
  // Estilos para o título.
  title: {
    // Define o tamanho da fonte.
    fontSize: 24,
    // Define a espessura da fonte como negrito.
    fontWeight: "bold",
    // Define a cor do texto.
    color: "darkblue",
    // Adiciona uma margem na parte inferior para separar do subtítulo.
    marginBottom: 20,
  },
  // Estilos para o subtítulo.
  subtitle: {
    // Define o tamanho da fonte.
    fontSize: 16,
    // Define a cor do texto com um cinza escuro.
    color: "#666",
  },
});
