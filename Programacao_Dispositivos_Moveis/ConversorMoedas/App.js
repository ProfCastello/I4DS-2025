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
  useColorScheme,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Importa a variável de ambiente do arquivo .env
import { AWESOME_API_KEY } from "@env";

// Lista de moedas disponíveis para seleção
const CURRENCIES = [
  { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
  { code: "USD", name: "Dólar Americano", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
  { code: "JPY", name: "Iene Japonês", symbol: "¥" },
  { code: "CAD", name: "Dólar Canadense", symbol: "C$" },
  { code: "AUD", name: "Dólar Australiano", symbol: "A$" },
];

export default function App() {
  const [fromCurrencyCode, setFromCurrencyCode] = useState("BRL");
  const [toCurrencyCode, setToCurrencyCode] = useState("USD");
  const [fromAmount, setFromAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef(null);

  const systemColorScheme = useColorScheme();
  const [appTheme, setAppTheme] = useState(systemColorScheme || "light");

  useEffect(() => {
    if (systemColorScheme) {
      setAppTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  useEffect(() => {
    fetchConversionRate();
  }, [fromCurrencyCode, toCurrencyCode]);

  const fetchConversionRate = async () => {
    if (
      !fromCurrencyCode ||
      !toCurrencyCode ||
      fromCurrencyCode === toCurrencyCode
    ) {
      setConversionRate(1);
      setLoading(false);
      return;
    }

    const API_KEY_VALUE = AWESOME_API_KEY;

    const API_URL =
      API_KEY_VALUE && API_KEY_VALUE !== "SUA_CHAVE_AQUI"
        ? `https://economia.awesomeapi.com.br/json/last/${fromCurrencyCode}-${toCurrencyCode}?token=${API_KEY_VALUE}`
        : `https://economia.awesomeapi.com.br/json/last/${fromCurrencyCode}-${toCurrencyCode}`;

    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro ao buscar a cotação: ${response.status}`);
      }
      const data = await response.json();
      const pairKey = `${fromCurrencyCode}${toCurrencyCode}`;
      if (data[pairKey] && data[pairKey].high) {
        const rate = parseFloat(data[pairKey].high);
        setConversionRate(rate);
      } else {
        throw new Error(
          "Dados de cotação inválidos recebidos da API para o par selecionado."
        );
      }
    } catch (error) {
      console.error("Erro na busca de cotação:", error);
      Alert.alert(
        "Erro",
        `Não foi possível buscar a cotação para ${fromCurrencyCode}/${toCurrencyCode}. Detalhes: ${error.message}.`
      );
      setConversionRate(0);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) => {
    return (value / 100).toFixed(2).replace(".", ",");
  };

  const handleAmountChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    if (cleanedText === "") {
      setFromAmount(0);
      setShowResults(false);
      return;
    }
    if (cleanedText.length > 11) {
      return;
    }
    const numericValue = parseInt(cleanedText, 10);
    setFromAmount(numericValue);
    setShowResults(false);
  };

  const convertCurrency = () => {
    Keyboard.dismiss();
    const amountInFromCurrency = fromAmount / 100;
    if (isNaN(amountInFromCurrency) || amountInFromCurrency <= 0) {
      Alert.alert("Erro", "Por favor, digite um valor válido.");
      setShowResults(false);
      return;
    }
    if (conversionRate === 0) {
      Alert.alert(
        "Erro",
        "A cotação para as moedas selecionadas ainda não foi carregada ou está inválida. Tente novamente em alguns segundos."
      );
      setShowResults(false);
      return;
    }
    const result = amountInFromCurrency * conversionRate;
    setConvertedAmount(result.toFixed(2));
    setShowResults(true);
  };

  const handleClear = () => {
    setFromAmount(0);
    setConvertedAmount(0);
    setShowResults(false);
    Keyboard.dismiss();
  };

  const getCurrencySymbol = (code) => {
    const currency = CURRENCIES.find((c) => c.code === code);
    return currency ? currency.symbol : "";
  };

  const toggleTheme = () => {
    setAppTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeColors = getThemeColors(appTheme);

  if (loading) {
    return (
      <View
        style={[
          baseStyles.loadingContainer,
          { backgroundColor: themeColors.loadingBg },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.buttonBg} />
        <Text
          style={[
            baseStyles.loadingText,
            { color: themeColors.loadingTextColor },
          ]}
        >
          Buscando cotação...
        </Text>
      </View>
    );
  }

  const formattedFromAmount = formatAmount(fromAmount);
  const cursorPosition = formattedFromAmount.length;

  return (
    <View
      style={[
        baseStyles.container,
        { backgroundColor: themeColors.containerBg },
      ]}
    >
      <ScrollView
        contentContainerStyle={baseStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            baseStyles.title,
            {
              color: themeColors.titleColor,
              textShadowColor: themeColors.titleShadowColor,
            },
          ]}
        >
          Conversor de Moedas
        </Text>

        <View
          style={[
            baseStyles.card,
            {
              backgroundColor: themeColors.cardBg,
              shadowColor: themeColors.cardShadow,
            },
          ]}
        >
          {/* Seletor de Moeda de Origem */}
          <Text style={[baseStyles.label, { color: themeColors.labelColor }]}>
            Converter de:
          </Text>
          <View
            style={[
              baseStyles.pickerContainer,
              {
                borderColor: themeColors.inputBorder,
                backgroundColor: themeColors.inputBg,
              },
            ]}
          >
            <Picker
              selectedValue={fromCurrencyCode}
              onValueChange={(itemValue) => setFromCurrencyCode(itemValue)}
              style={[baseStyles.picker, { color: themeColors.inputColor }]}
            >
              {CURRENCIES.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${currency.name} (${currency.code})`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>

          {/* Input do Valor */}
          <View style={baseStyles.inputContainer}>
            <Text style={[baseStyles.label, { color: themeColors.labelColor }]}>
              Valor ({getCurrencySymbol(fromCurrencyCode)})
            </Text>
            <TextInput
              ref={inputRef}
              style={[
                baseStyles.input,
                {
                  borderColor: themeColors.inputBorder,
                  backgroundColor: themeColors.inputBg,
                  color: themeColors.inputColor,
                },
              ]}
              keyboardType="numeric"
              value={formattedFromAmount}
              onChangeText={handleAmountChange}
              selection={{ start: cursorPosition, end: cursorPosition }}
              selectTextOnFocus={false}
            />
          </View>

          {/* Seletor de Moeda de Destino */}
          <Text style={[baseStyles.label, { color: themeColors.labelColor }]}>
            Converter para:
          </Text>
          <View
            style={[
              baseStyles.pickerContainer,
              {
                borderColor: themeColors.inputBorder,
                backgroundColor: themeColors.inputBg,
              },
            ]}
          >
            <Picker
              selectedValue={toCurrencyCode}
              onValueChange={(itemValue) => setToCurrencyCode(itemValue)}
              style={[baseStyles.picker, { color: themeColors.inputColor }]}
            >
              {CURRENCIES.map((currency) => (
                <Picker.Item
                  key={currency.code}
                  label={`${currency.name} (${currency.code})`}
                  value={currency.code}
                />
              ))}
            </Picker>
          </View>

          <View style={baseStyles.buttonGroup}>
            <TouchableOpacity
              style={[
                baseStyles.button,
                { backgroundColor: themeColors.buttonBg },
              ]}
              onPress={convertCurrency}
            >
              <Text style={baseStyles.buttonText}>Converter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                baseStyles.button,
                baseStyles.clearButton,
                { backgroundColor: themeColors.clearButtonBg },
              ]}
              onPress={handleClear}
            >
              <Text style={baseStyles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showResults && (
          <View
            style={[
              baseStyles.card,
              {
                backgroundColor: themeColors.cardBg,
                shadowColor: themeColors.cardShadow,
              },
            ]}
          >
            <Text
              style={[
                baseStyles.resultTitle,
                { color: themeColors.resultTitleColor },
              ]}
            >
              Resultado da Conversão
            </Text>
            <Text
              style={[
                baseStyles.convertedValueText,
                { color: themeColors.convertedValueTextColor },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>
                {getCurrencySymbol(fromCurrencyCode)} {formatAmount(fromAmount)}
              </Text>
              <Text> equivalem a:</Text>
            </Text>
            <Text
              style={[
                baseStyles.finalResultText,
                { color: themeColors.resultTextColor },
              ]}
            >
              <Text
                style={[
                  baseStyles.currencySymbol,
                  { color: themeColors.currencySymbolColor },
                ]}
              >
                {getCurrencySymbol(toCurrencyCode)}
              </Text>
              {convertedAmount} {toCurrencyCode}
            </Text>
          </View>
        )}

        <View
          style={[
            baseStyles.cotacaoInfoContainer,
            {
              backgroundColor: themeColors.cotacaoInfoBg,
              borderTopColor: themeColors.cotacaoInfoBorder,
              shadowColor: themeColors.cardShadow,
            },
          ]}
        >
          <Text
            style={[
              baseStyles.cotacaoInfoTitle,
              { color: themeColors.cotacaoInfoTitleColor },
            ]}
          >
            Cotações Atuais:
          </Text>
          <Text
            style={[
              baseStyles.cotacaoInfoText,
              { color: themeColors.cotacaoInfoTextColor },
            ]}
          >
            1 USD = R$ {conversionRate.toFixed(4)}
            {/* Ajustado para usar conversionRate */}
          </Text>
          <Text
            style={[
              baseStyles.cotacaoInfoText,
              { color: themeColors.cotacaoInfoTextColor },
            ]}
          >
            1 EUR = R$ {conversionRate.toFixed(4)}
            {/* Ajustado para usar conversionRate */}
          </Text>
        </View>

        {/* Indicador visual do tema para depuração (agora dentro do ScrollView) */}
        <Text
          style={[
            baseStyles.themeIndicator,
            { color: themeColors.loadingTextColor },
          ]}
        >
          Tema detectado pelo sistema: {systemColorScheme || "Não detectado"}
        </Text>
      </ScrollView>

      {/* Botão para alternar o tema manualmente (fixo na parte inferior) */}
      <TouchableOpacity
        style={[
          baseStyles.themeToggleButton,
          {
            backgroundColor: themeColors.buttonBg,
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
          },
        ]}
        onPress={toggleTheme}
      >
        <Text style={baseStyles.buttonText}>
          Alternar Tema ({appTheme === "light" ? "Claro" : "Escuro"})
        </Text>
      </TouchableOpacity>

      <StatusBar style={appTheme === "dark" ? "light" : "dark"} />
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    // Removido padding aqui para ser aplicado no scrollViewContent
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20, // Adicionado padding horizontal aqui
    paddingVertical: 20, // Mantido padding vertical aqui
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2, // Aumentado para melhor visibilidade
    shadowRadius: 8, // Aumentado para melhor visibilidade
    elevation: 10, // Aumentado para melhor visibilidade
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 18,
    fontSize: 22,
    textAlign: "right",
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  convertedValueText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  finalResultText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  currencySymbol: {
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  cotacaoInfoContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15, // Aumentado para melhor visibilidade
    shadowRadius: 4, // Aumentado para melhor visibilidade
    elevation: 6, // Aumentado para melhor visibilidade
  },
  cotacaoInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cotacaoInfoText: {
    fontSize: 15,
  },
  themeIndicator: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  themeToggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

const getThemeColors = (colorScheme) => {
  const isDark = colorScheme === "dark";
  return {
    containerBg: isDark ? "#2c3e50" : "#e0f7fa",
    titleColor: isDark ? "#ecf0f1" : "#00796b",
    titleShadowColor: isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)",
    cardBg: isDark ? "#34495e" : "#ffffff",
    cardShadow: isDark ? "rgba(255,255,255,0.2)" : "#000",
    labelColor: isDark ? "#bdc3c7" : "#424242",
    inputBorder: isDark ? "#5c6e7f" : "#b0bec5",
    inputBg: isDark ? "#4a627a" : "#fcfcfc",
    inputColor: isDark ? "#ecf0f1" : "#333",
    buttonBg: isDark ? "#1abc9c" : "#009688",
    clearButtonBg: isDark ? "#e74c3c" : "#ef5350",
    resultTitleColor: isDark ? "#1abc9c" : "#00796b",
    convertedValueTextColor: isDark ? "#bdc3c7" : "#555",
    resultTextColor: isDark ? "#ecf0f1" : "#333",
    currencySymbolColor: isDark ? "#1abc9c" : "#00796b",
    loadingBg: isDark ? "#2c3e50" : "#e0f7fa",
    loadingTextColor: isDark ? "#bdc3c7" : "#555",
    cotacaoInfoBg: isDark ? "#34495e" : "#ffffff",
    cotacaoInfoBorder: isDark ? "#4a627a" : "#b2dfdb",
    cotacaoInfoTitleColor: isDark ? "#1abc9c" : "#4db6ac",
    cotacaoInfoTextColor: isDark ? "#bdc3c7" : "#616161",
  };
};
