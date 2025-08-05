import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  ScrollView,
} from "react-native";

// --- CHAVE DA API DIRETAMENTE NO CÓDIGO ---
// IMPORTANTE: Em projetos reais e públicos, use arquivos .env para chaves de API.
// Para fins de simplificação e aprendizado, estamos colocando aqui.
const AWESOME_API_KEY_VALUE = "SUA_CHAVE_AQUI"; // <-- SUBSTITUA PELA SUA CHAVE DE API REAL DA AWESOME API

export default function App() {
  const [valorEmReais, setValorEmReais] = useState(""); // Valor digitado em Reais (string)
  const [cotacaoDolar, setCotacaoDolar] = useState(0); // Cotação do Dólar para Real
  const [cotacaoEuro, setCotacaoEuro] = useState(0); // Cotação do Euro para Real
  const [loading, setLoading] = useState(true); // Estado de carregamento da API
  const [resultadoDolar, setResultadoDolar] = useState(0); // Resultado da conversão para Dólar
  const [resultadoEuro, setResultadoEuro] = useState(0); // Resultado da conversão para Euro
  const [showResults, setShowResults] = useState(false); // Controla a exibição dos resultados

  const inputRef = useRef(null);

  // Efeito para buscar as cotações do Dólar e Euro na montagem do componente
  useEffect(() => {
    fetchCotacoes();
  }, []);

  // Função assíncrona para buscar as cotações da API
  const fetchCotacoes = async () => {
    // URL da Awesome API para Dólar e Euro em relação ao Real
    const API_URL =
      AWESOME_API_KEY_VALUE && AWESOME_API_KEY_VALUE !== "SUA_CHAVE_AQUI"
        ? `https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL?token=${AWESOME_API_KEY_VALUE}`
        : `https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL`;

    try {
      setLoading(true); // Inicia o estado de carregamento
      const response = await fetch(API_URL); // Faz a requisição à API

      // Verifica se a resposta da requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro ao buscar as cotações: ${response.status}`);
      }

      const data = await response.json(); // Converte a resposta para JSON

      // Extrai as cotações do Dólar e Euro
      if (data.USDBRL && data.EURBRL) {
        const dolar = parseFloat(data.USDBRL.high);
        const euro = parseFloat(data.EURBRL.high);

        setCotacaoDolar(dolar); // Atualiza o estado da cotação do Dólar
        setCotacaoEuro(euro); // Atualiza o estado da cotação do Euro
      } else {
        throw new Error("Dados de cotação inválidos recebidos da API.");
      }
    } catch (error) {
      console.error("Erro na busca de cotação:", error); // Loga o erro no console
      Alert.alert(
        // Exibe um alerta para o usuário
        "Erro",
        `Não foi possível buscar as cotações. Detalhes: ${error.message}. Verifique sua conexão com a internet.`
      );
      setCotacaoDolar(0); // Define as cotações como 0 em caso de erro
      setCotacaoEuro(0);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Função para formatar um valor numérico para exibição com 2 casas decimais e vírgula
  const formatValue = (value) => {
    // Garante que o valor é um número antes de formatar
    const num = parseFloat(value);
    return isNaN(num) ? "" : num.toFixed(2).replace(".", ",");
  };

  // Lida com a mudança de texto no input, permitindo apenas números e ponto decimal
  const handleAmountChange = (text) => {
    // Remove tudo que não for número ou ponto
    const cleanedText = text.replace(/[^0-9.]/g, "");
    setValorEmReais(cleanedText); // Atualiza o estado com o texto limpo
    setShowResults(false); // Esconde resultados ao digitar
  };

  // Realiza a conversão da moeda
  const convertCurrency = () => {
    Keyboard.dismiss(); // Fecha o teclado

    // Converte o valor digitado para número. Se for string vazia, considera 0.
    const amountInReais = parseFloat(valorEmReais || "0");

    // Valida se o valor é numérico e maior que 0
    if (isNaN(amountInReais) || amountInReais <= 0) {
      Alert.alert("Erro", "Por favor, digite um valor válido em Reais.");
      setShowResults(false);
      return;
    }

    // Valida se as cotações foram carregadas
    if (cotacaoDolar === 0 || cotacaoEuro === 0) {
      Alert.alert(
        "Erro",
        "As cotações ainda não foram carregadas ou estão inválidas. Tente novamente em alguns segundos."
      );
      setShowResults(false);
      return;
    }

    // Calcula os resultados da conversão
    const dolarConvertido = amountInReais / cotacaoDolar;
    const euroConvertido = amountInReais / cotacaoEuro;

    setResultadoDolar(dolarConvertido.toFixed(2)); // Atualiza o resultado do Dólar
    setResultadoEuro(euroConvertido.toFixed(2)); // Atualiza o resultado do Euro
    setShowResults(true); // Exibe os resultados
  };

  // Limpa todos os campos e resultados
  const handleClear = () => {
    setValorEmReais(""); // Limpa o input
    setResultadoDolar(0);
    setResultadoEuro(0);
    setShowResults(false);
    Keyboard.dismiss();
  };

  // Se estiver carregando, exibe um indicador
  if (loading) {
    return (
      <View style={basicStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={basicStyles.loadingText}>Buscando cotações...</Text>
      </View>
    );
  }

  return (
    <View style={basicStyles.container}>
      <ScrollView
        contentContainerStyle={basicStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={basicStyles.title}>Conversor de Moedas</Text>

        <View style={basicStyles.card}>
          {/* Input do Valor em Reais */}
          <View style={basicStyles.inputContainer}>
            <Text style={basicStyles.label}>Valor em R$</Text>
            <TextInput
              ref={inputRef}
              style={basicStyles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={valorEmReais} // Valor como string
              onChangeText={handleAmountChange}
            />
          </View>

          <View style={basicStyles.buttonGroup}>
            <TouchableOpacity
              style={basicStyles.button}
              onPress={convertCurrency}
            >
              <Text style={basicStyles.buttonText}>Converter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[basicStyles.button, basicStyles.clearButton]}
              onPress={handleClear}
            >
              <Text style={basicStyles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showResults && (
          <View style={basicStyles.card}>
            <Text style={basicStyles.resultTitle}>Resultados da Conversão</Text>
            <Text style={basicStyles.convertedValueText}>
              <Text style={{ fontWeight: "bold" }}>
                R$ {formatValue(valorEmReais)}
              </Text>
              <Text> equivalem a:</Text>
            </Text>
            <Text style={basicStyles.finalResultText}>
              <Text style={basicStyles.currencySymbol}>$</Text> {resultadoDolar}{" "}
              Dólares
            </Text>
            <Text style={basicStyles.finalResultText}>
              <Text style={basicStyles.currencySymbol}>€</Text> {resultadoEuro}{" "}
              Euros
            </Text>
          </View>
        )}

        {/* Informações de cotação atual */}
        <View style={basicStyles.cotacaoInfoContainer}>
          <Text style={basicStyles.cotacaoInfoTitle}>Cotações Atuais:</Text>
          <Text style={basicStyles.cotacaoInfoText}>
            1 USD = R$ {cotacaoDolar.toFixed(4)}
          </Text>
          <Text style={basicStyles.cotacaoInfoText}>
            1 EUR = R$ {cotacaoEuro.toFixed(4)}
          </Text>
        </View>
      </ScrollView>

      {/* StatusBar simples */}
      <StatusBar style="auto" />
    </View>
  );
}

// Estilos básicos para o aplicativo
const basicStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Fundo claro padrão
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20, // Padding em todo o conteúdo
    paddingBottom: 80, // Espaço para o botão de rodapé, se houver
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
    textAlign: "right", // Mantido alinhamento à direita para valores
  },
  pickerContainer: {
    // Estilos do Picker não serão usados, mas mantidos para referência
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    // Estilos do Picker não serão usados, mas mantidos para referência
    height: 50,
    width: "100%",
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
    backgroundColor: "#dc3545", // Cor vermelha para limpar
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
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
