import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, Touchable, View } from "react-native";

export default function App() {
  // Adicionaremos a lógica de conversão de moedas aqui

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversor de Moedas</Text>
      <Text style={styles.subtitle}>Desenvolvido por ProfCastello</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Valor em R$</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o valor em Reais"
          keyboardType="numeric"
          value={valorEmReais}
          onChangeText={setValorEmReais}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={converterMoeda}>
        <Text style={styles.buttonText}>Converter</Text>
      </TouchableOpacity>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Resultados</Text>
        {/* Aqui vamos exibir os resultados da conversão */}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderColor: "#fff",
    borderWidth: 1,
    backgroundColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
});
