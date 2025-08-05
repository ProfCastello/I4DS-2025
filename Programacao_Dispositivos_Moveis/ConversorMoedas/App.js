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
} from "react-native";

// Importa a variável de ambiente do arquivo .env
import { AWESOME_API_KEY } from "@env";

export default function App() {
  // O valor em reais agora será armazenado como um número inteiro (centavos)
  // Ex: R$ 10,50 será armazenado como 1050
  const [valorEmReais, setValorEmReais] = useState(0);
  const [cotacaoDolar, setCotacaoDolar] = useState(0);
  const [cotacaoEuro, setCotacaoEuro] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resultadoDolar, setResultadoDolar] = useState(0);
  const [resultadoEuro, setResultadoEuro] = useState(0);

  // Usamos useRef para ter uma referência direta ao componente TextInput
  const inputRef = useRef(null);

  useEffect(() => {
    fetchCotacoes();
  }, []);

  const fetchCotacoes = async () => {
    // --- INÍCIO DA INTEGRAÇÃO COM AWESOME API ---
    // A Awesome API pode ser usada sem chave para um limite básico (cache de 1 minuto).
    // Para mais requisições ou dados em tempo real sem cache, você pode precisar de uma API Key.
    // Obtenha sua chave em https://awesomeapi.com.br/

    // A API_KEY agora é lida do arquivo .env
    const API_KEY_VALUE = AWESOME_API_KEY;

    // Constrói a URL da API. Se houver uma chave, ela é adicionada como parâmetro.
    const API_URL =
      API_KEY_VALUE && API_KEY_VALUE !== "SUA_CHAVE_AQUI"
        ? `https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL?token=${API_KEY_VALUE}`
        : "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL";

    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        // Se a resposta não for OK, tentamos extrair a mensagem de erro da API
        // A Awesome API pode não retornar um JSON de erro tão detalhado quanto outras.
        throw new Error(`Erro ao buscar as cotações: ${response.status}`);
      }

      const data = await response.json();

      // Verifica se a API retornou os dados esperados
      if (data.USDBRL && data.EURBRL) {
        const dolar = parseFloat(data.USDBRL.high);
        const euro = parseFloat(data.EURBRL.high);

        setCotacaoDolar(dolar);
        setCotacaoEuro(euro);
      } else {
        throw new Error("Dados de cotação inválidos recebidos da API.");
      }
    } catch (error) {
      console.error("Erro na busca de cotações:", error);
      Alert.alert(
        "Erro",
        `Não foi possível buscar as cotações. Detalhes: ${error.message}. Verifique sua conexão com a internet ou sua API Key (se estiver usando).`
      );
    } finally {
      setLoading(false);
    }
    // --- FIM DA INTEGRAÇÃO COM AWESOME API ---
  };

  // Função para formatar o valor monetário para exibição
  const formatCurrency = (value) => {
    // Divide por 100 para obter o valor em reais (de centavos para reais)
    // Usa toFixed(2) para garantir duas casas decimais
    // Replace '.' por ',' para o formato brasileiro
    return (value / 100).toFixed(2).replace(".", ",");
  };

  // Função para lidar com a mudança de texto no input
  const handleValueChange = (text) => {
    // Remove tudo que não for número (apenas dígitos 0-9)
    const cleanedText = text.replace(/[^0-9]/g, "");

    // Se o texto limpo estiver vazio, o valor é 0 centavos.
    if (cleanedText === "") {
      setValorEmReais(0);
      return;
    }

    // Limita o número de dígitos para evitar valores muito grandes
    // Ex: se o máximo for 999.999.999,99, então o inteiro máximo é 99999999999
    // 11 dígitos para um valor até 99.999.999,99 (sem contar a vírgula e os centavos)
    if (cleanedText.length > 11) {
      return;
    }

    // Converte o texto limpo para um número inteiro (representando centavos).
    const numericValue = parseInt(cleanedText, 10);

    // Atualiza o estado.
    setValorEmReais(numericValue);
  };

  const converterMoeda = () => {
    // O valor já está em centavos, então dividimos por 100 para a conversão
    const valor = valorEmReais / 100;

    if (isNaN(valor) || valor <= 0) {
      Alert.alert("Erro", "Por favor, digite um valor válido em Reais.");
      return;
    }

    if (cotacaoDolar === 0 || cotacaoEuro === 0) {
      Alert.alert(
        "Erro",
        "As cotações ainda não foram carregadas. Tente novamente em alguns segundos."
      );
      return;
    }

    const dolarConvertido = valor / cotacaoDolar;
    const euroConvertido = valor / cotacaoEuro;

    setResultadoDolar(dolarConvertido.toFixed(2));
    setResultadoEuro(euroConvertido.toFixed(2));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Buscando cotações...</Text>
      </View>
    );
  }

  // Calcula a posição do cursor para sempre estar no final do texto formatado.
  // Isso é crucial para o comportamento de input monetário.
  const formattedValue = formatCurrency(valorEmReais);
  const cursorPosition = formattedValue.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversor de Moedas</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor em R$</Text>
        <TextInput
          ref={inputRef} // Atribui a referência ao TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formattedValue} // Exibe o valor formatado para o usuário
          onChangeText={handleValueChange} // Usa a nova função de tratamento
          // Controla a posição do cursor: sempre no final do texto
          selection={{ start: cursorPosition, end: cursorPosition }}
          // Desabilita a seleção automática de texto ao focar (pode ajudar a evitar o problema)
          selectTextOnFocus={false}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={converterMoeda}>
        <Text style={styles.buttonText}>Converter</Text>
      </TouchableOpacity>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Resultados</Text>
        <Text style={styles.resultText}>Dólar: $ {resultadoDolar}</Text>
        <Text style={styles.resultText}>Euro: € {resultadoEuro}</Text>
      </View>

      <View style={styles.cotacaoInfoContainer}>
        <Text style={styles.cotacaoInfoTitle}>Cotações Atuais:</Text>
        <Text style={styles.cotacaoInfoText}>
          1 USD = R$ {cotacaoDolar.toFixed(4)}
        </Text>
        <Text style={styles.cotacaoInfoText}>
          1 EUR = R$ {cotacaoEuro.toFixed(4)}
        </Text>
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
  label: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlign: "right", // Alinha o texto para a direita
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  cotacaoInfoContainer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  cotacaoInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
    marginBottom: 5,
  },
  cotacaoInfoText: {
    fontSize: 15,
    color: "#888",
  },
});
