import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  useColorScheme,
  ScrollView,
  Text,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  Card,
  Title,
  Paragraph,
  Appbar,
  IconButton,
  Surface,
  ProgressBar,
  Chip,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";
import { Client } from "paho-mqtt";
import React, { useEffect, useState, useRef, useCallback } from "react";

// Hook personalizado para tema ultra-seguro
const useSecureTheme = (initialDarkMode = false) => {
  const [isDark, setIsDark] = useState(initialDarkMode);
  const [isReady, setIsReady] = useState(false);

  const theme = React.useMemo(() => {
    // Cores base sempre disponíveis
    const lightColors = {
      primary: "#2196F3",
      background: "#F8F9FA",
      surface: "#FFFFFF",
      text: "#212121",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
      accent: "#FF5722",
    };

    const darkColors = {
      primary: "#64B5F6",
      background: "#0D1117",
      surface: "#161B22",
      text: "#F0F6FC",
      success: "#3FB950",
      warning: "#D29922",
      error: "#F85149",
      accent: "#FF7043",
    };

    const colors = isDark ? darkColors : lightColors;

    // Garantir que sempre temos um tema válido
    return {
      dark: isDark,
      colors: {
        ...colors,
        // Propriedades adicionais do Paper
        onSurface: colors.text,
        onBackground: colors.text,
        disabled: isDark ? "#484F58" : "#9E9E9E",
        placeholder: isDark ? "#8B949E" : "#757575",
        backdrop: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
        notification: colors.error,
      },
    };
  }, [isDark]);

  const toggleTheme = useCallback(async () => {
    const newMode = !isDark;
    setIsDark(newMode);

    try {
      await AsyncStorage.setItem("theme", newMode ? "dark" : "light");
    } catch (error) {
      console.log("Erro ao salvar tema:", error);
    }
  }, [isDark]);

  return { theme, isDark, isReady, setIsReady, toggleTheme };
};

export default function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Usar o hook personalizado para tema seguro - iniciar sempre no modo dark
  const { theme, isDark, isReady, setIsReady, toggleTheme } =
    useSecureTheme(true);

  // Inicialização
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Carregar preferência de tema
        const saved = await AsyncStorage.getItem("theme");
        const shouldUseDark =
          saved === "dark" || (!saved && colorScheme === "dark");

        // Usar o toggle do hook se necessário
        if (shouldUseDark !== isDark) {
          toggleTheme();
        }

        // Aguardar um frame para garantir que o tema seja aplicado
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsReady(true);

        // Animação
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.log("Erro na inicialização:", error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, [colorScheme, fadeAnim, isDark, toggleTheme, setIsReady]);

  // MQTT
  useEffect(() => {
    const client = new Client("broker.hivemq.com", 8000, `IoT_${Date.now()}`);

    client.onConnectionLost = () => setIsConnected(false);

    client.onMessageArrived = (message) => {
      try {
        const data = JSON.parse(message.payloadString);
        if (data.temperatura && data.umidade) {
          setTemperature(data.temperatura);
          setHumidity(data.umidade);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.log("Erro:", error);
      }
    };

    client.connect({
      onSuccess: () => {
        setIsConnected(true);
        client.subscribe("profcastello/temperatura");
      },
      onFailure: () => setIsConnected(false),
    });

    return () => {
      try {
        if (client.isConnected()) client.disconnect();
      } catch (error) {
        console.log("Erro ao desconectar:", error);
      }
    };
  }, []);

  const getTemperatureColor = (temp) => {
    if (temp < 15) return "#2196F3";
    if (temp < 25) return "#4CAF50";
    if (temp < 30) return "#FF9800";
    return "#F44336";
  };

  // Verificação de segurança antes de renderizar
  if (!theme || !theme.colors || !isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F9FA",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 16, color: "#212121" }}>
          Carregando tema...
        </Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          <Appbar.Content
            title="🌡️ Dashboard IoT"
            titleStyle={{ color: "#FFFFFF" }}
          />
          <Chip
            icon={isConnected ? "wifi" : "wifi-off"}
            textStyle={{
              color: isConnected
                ? isDark
                  ? "#4CAF50"
                  : "#2E7D32"
                : isDark
                ? "#F44336"
                : "#C62828",
              fontWeight: "600",
            }}
            style={{
              borderColor: isConnected
                ? isDark
                  ? "#4CAF50"
                  : "#2E7D32"
                : isDark
                ? "#F44336"
                : "#C62828",
              backgroundColor: isConnected
                ? isDark
                  ? "#4CAF5020"
                  : "#E8F5E8"
                : isDark
                ? "#F4433620"
                : "#FFEBEE",
              marginRight: 8,
            }}
            mode="outlined"
          >
            {isConnected ? "Online" : "Offline"}
          </Chip>
          <IconButton
            icon={isDark ? "weather-sunny" : "weather-night"}
            iconColor="#FFFFFF"
            onPress={toggleTheme}
          />
        </Appbar.Header>

        <ScrollView style={styles.content}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Loading */}
            {!temperature && (
              <Card
                style={[styles.card, { backgroundColor: theme.colors.surface }]}
              >
                <Card.Content style={styles.loadingContent}>
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                  <Title
                    style={[styles.loadingTitle, { color: theme.colors.text }]}
                  >
                    Carregando dados...
                  </Title>
                </Card.Content>
              </Card>
            )}

            {/* Dados */}
            {temperature && humidity && (
              <Card
                style={[styles.card, { backgroundColor: theme.colors.surface }]}
              >
                <Card.Content>
                  <View style={styles.dataContainer}>
                    {/* Temperatura */}
                    <Surface
                      style={[
                        styles.dataCard,
                        {
                          backgroundColor:
                            getTemperatureColor(temperature) + "20",
                        },
                      ]}
                    >
                      <IconButton
                        icon="thermometer"
                        size={28}
                        iconColor={getTemperatureColor(temperature)}
                      />
                      <Title
                        style={[styles.dataLabel, { color: theme.colors.text }]}
                      >
                        Temperatura
                      </Title>
                      <Text
                        style={[
                          styles.dataValue,
                          { color: getTemperatureColor(temperature) },
                        ]}
                      >
                        {temperature}°C
                      </Text>
                    </Surface>

                    {/* Umidade */}
                    <Surface
                      style={[
                        styles.dataCard,
                        { backgroundColor: theme.colors.primary + "20" },
                      ]}
                    >
                      <IconButton
                        icon="water-percent"
                        size={28}
                        iconColor={theme.colors.primary}
                      />
                      <Title
                        style={[styles.dataLabel, { color: theme.colors.text }]}
                      >
                        Umidade
                      </Title>
                      <Text
                        style={[
                          styles.dataValue,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {humidity}%
                      </Text>
                      <ProgressBar
                        progress={humidity / 100}
                        color={theme.colors.primary}
                        style={styles.progress}
                      />
                    </Surface>
                  </View>

                  {lastUpdate && (
                    <Paragraph
                      style={[styles.lastUpdate, { color: theme.colors.text }]}
                    >
                      Última atualização: {lastUpdate}
                    </Paragraph>
                  )}
                </Card.Content>
              </Card>
            )}

            {/* Status */}
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <Title
                  style={[styles.sectionTitle, { color: theme.colors.text }]}
                >
                  Status do Sistema
                </Title>
                <View style={styles.statusRow}>
                  <View style={styles.statusItem}>
                    <IconButton
                      icon="battery"
                      iconColor={theme.colors.success}
                    />
                    <Text
                      style={[
                        styles.statusValue,
                        { color: theme.colors.success },
                      ]}
                    >
                      85%
                    </Text>
                    <Text
                      style={[styles.statusLabel, { color: theme.colors.text }]}
                    >
                      Bateria
                    </Text>
                  </View>
                  <View style={styles.statusItem}>
                    <IconButton icon="flash" iconColor={theme.colors.warning} />
                    <Text
                      style={[
                        styles.statusValue,
                        { color: theme.colors.warning },
                      ]}
                    >
                      3.7V
                    </Text>
                    <Text
                      style={[styles.statusLabel, { color: theme.colors.text }]}
                    >
                      Voltagem
                    </Text>
                  </View>
                  <View style={styles.statusItem}>
                    <IconButton
                      icon="current-ac"
                      iconColor={theme.colors.accent}
                    />
                    <Text
                      style={[
                        styles.statusValue,
                        { color: theme.colors.accent },
                      ]}
                    >
                      1.2A
                    </Text>
                    <Text
                      style={[styles.statusLabel, { color: theme.colors.text }]}
                    >
                      Corrente
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        </ScrollView>

        {/* Footer */}
        <Surface
          style={[styles.footer, { backgroundColor: theme.colors.surface }]}
        >
          <Paragraph style={[styles.footerText, { color: theme.colors.text }]}>
            Desenvolvido por{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
              ProfCastello
            </Text>
          </Paragraph>
        </Surface>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  loadingContent: {
    alignItems: "center",
    padding: 20,
  },
  loadingTitle: {
    marginTop: 16,
    textAlign: "center",
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dataCard: {
    flex: 1,
    padding: 16,
    margin: 4,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  dataLabel: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  progress: {
    width: "100%",
    marginTop: 8,
  },
  lastUpdate: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
  },
});
