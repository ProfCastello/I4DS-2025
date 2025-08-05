import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react"; // Removido useEffect, ScrollView
import {
  ActivityIndicator, // Removido, pois não há carregamento de API
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
} from "react-native";

// --- COTAÇÕES FIXAS NO CÓDIGO ---
// Valores de cotação definidos manualmente para Real -> Dólar e Real -> Euro
const COTACAO_DOLAR_FIXA = 5.2; // 1 Dólar = 5.20 Reais
const COTACAO_EURO_FIXA = 5.6; // 1 Euro = 5.60 Reais

export default function App() {
  const [valorEmReais, setValorEmReais] = useState(""); // Valor digitado em Reais (string)
  const [resultadoDolar, setResultadoDolar] = useState(0); // Resultado da conversão para Dólar
  const [resultadoEuro, setResultadoEuro] = useState(0); // Resultado da conversão para Euro
  const [showResults, setShowResults] = useState(false); // Controla a exibição dos resultados

  const inputRef = useRef(null); // Mantido para fechar o teclado, embora não seja estritamente necessário para esta versão

  // Função para formatar um valor numérico para exibição com 2 casas decimais e vírgula
  const formatValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "" : num.toFixed(2).replace(".", ",");
  };

  // Lida com a mudança de texto no input, permitindo apenas números e ponto decimal
  const handleAmountChange = (text) => {
    const cleanedText = text.replace(/[^0-9.]/g, "");
    setValorEmReais(cleanedText);
    setShowResults(false);
  };

  // Realiza a conversão da moeda com base nas cotações fixas
  const convertCurrency = () => {
    Keyboard.dismiss(); // Fecha o teclado

    const amountInReais = parseFloat(valorEmReais || "0");

    if (isNaN(amountInReais) || amountInReais <= 0) {
      Alert.alert("Erro", "Por favor, digite um valor válido em Reais.");
      setShowResults(false);
      return;
    }

    // Calcula os resultados da conversão usando as cotações fixas
    const dolarConvertido = amountInReais / COTACAO_DOLAR_FIXA;
    const euroConvertido = amountInReais / COTACAO_EURO_FIXA;

    setResultadoDolar(dolarConvertido.toFixed(2));
    setResultadoEuro(euroConvertido.toFixed(2));
    setShowResults(true);
  };

  // Limpa todos os campos e resultados
  const handleClear = () => {
    setValorEmReais("");
    setResultadoDolar(0);
    setResultadoEuro(0);
    setShowResults(false);
    Keyboard.dismiss();
  };

  // Não há estado de carregamento, então não precisamos do 'if (loading)'

  return (
    <View style={fixedStyles.container}>
      {/* Removido ScrollView, pois o conteúdo é fixo e deve caber na tela */}
      <Text style={fixedStyles.title}>Conversor de Moedas</Text>

      <View style={fixedStyles.card}>
        {/* Input do Valor em Reais */}
        <View style={fixedStyles.inputContainer}>
          <Text style={fixedStyles.label}>Valor em R$</Text>
          <TextInput
            ref={inputRef}
            style={fixedStyles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={valorEmReais}
            onChangeText={handleAmountChange}
          />
        </View>

        <View style={fixedStyles.buttonGroup}>
          <TouchableOpacity
            style={fixedStyles.button}
            onPress={convertCurrency}
          >
            <Text style={fixedStyles.buttonText}>Converter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[fixedStyles.button, fixedStyles.clearButton]}
            onPress={handleClear}
          >
            <Text style={fixedStyles.buttonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showResults && (
        <View style={fixedStyles.card}>
          <Text style={fixedStyles.resultTitle}>Resultados da Conversão</Text>
          <Text style={fixedStyles.convertedValueText}>
            <Text style={{ fontWeight: "bold" }}>
              R$ {formatValue(valorEmReais)}
            </Text>
            <Text> equivalem a:</Text>
          </Text>
          <Text style={fixedStyles.finalResultText}>
            <Text style={fixedStyles.currencySymbol}>$</Text> {resultadoDolar}{" "}
            Dólares
          </Text>
          <Text style={fixedStyles.finalResultText}>
            <Text style={fixedStyles.currencySymbol}>€</Text> {resultadoEuro}{" "}
            Euros
          </Text>
        </View>
      )}

      {/* Informações de cotação fixa */}
      <View style={fixedStyles.cotacaoInfoContainer}>
        <Text style={fixedStyles.cotacaoInfoTitle}>Cotações Fixas:</Text>
        <Text style={fixedStyles.cotacaoInfoText}>
          1 USD = R$ {COTACAO_DOLAR_FIXA.toFixed(4)}
        </Text>
        <Text style={fixedStyles.cotacaoInfoText}>
          1 EUR = R$ {COTACAO_EURO_FIXA.toFixed(4)}
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

// Estilos básicos para o aplicativo
const fixedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20, // Padding direto no container principal
    justifyContent: "center", // Centraliza o conteúdo verticalmente
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "right",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#dc3545",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  convertedValueText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    color: "#666",
  },
  finalResultText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#007bff",
  },
  currencySymbol: {
    fontWeight: "bold",
  },
  cotacaoInfoContainer: {
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  cotacaoInfoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  cotacaoInfoText: {
    fontSize: 14,
    color: "#777",
  },
});
