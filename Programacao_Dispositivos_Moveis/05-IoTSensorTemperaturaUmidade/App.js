import SensorCard from "./components/SensorCard";
import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import mqtt from "mqtt";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  RefreshControl,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Polyfills para mqtt.js funcionar no React Native/Expo
import { Buffer } from "buffer";
import process from "process";
import { decode, encode } from "base-64";

if (!global.Buffer) global.Buffer = Buffer;
if (!global.process) global.process = process;
if (!global.atob) global.atob = decode;
if (!global.btoa) global.btoa = encode;

const { width, height } = Dimensions.get("window");

const Main = () => {
  const theme = useTheme();
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [tempMin, setTempMin] = useState(null);
  const [tempMax, setTempMax] = useState(null);
  const [humMin, setHumMin] = useState(null);
  const [humMax, setHumMax] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Configuração MQTT usando mqtt.js (WebSocket)
  const MQTT_URL = "ws://broker.hivemq.com:8000/mqtt";
  const MQTT_TOPIC = "profcastello/temperatura";
  const mqttClient = useRef(null);
  // ...duplicado, removido...

  useEffect(() => {
    console.log(
      `🔌 Tentando conectar ao broker MQTT (mqtt.js) em: ${MQTT_URL}`
    );
    const client = mqtt.connect(MQTT_URL);
    mqttClient.current = client;

    client.on("connect", () => {
      setIsConnected(true);
      client.subscribe(MQTT_TOPIC);
      console.log("✅ Conectado ao broker MQTT (mqtt.js)!");
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (
          typeof data.temperatura === "number" &&
          typeof data.umidade === "number"
        ) {
          updateSensorData(data.temperatura, data.umidade);
        } else {
          console.log(
            "Mensagem recebida não contém dados esperados:",
            message.toString()
          );
        }
      } catch (e) {
        console.log("Mensagem recebida não é JSON válido:", message.toString());
      }
    });

    client.on("error", (err) => {
      setIsConnected(false);
      console.log("❌ Erro MQTT:", err.message);
      Alert.alert("Erro MQTT", err.message);
    });

    client.on("close", () => {
      setIsConnected(false);
      console.log("Conexão MQTT fechada.");
    });

    return () => {
      client.end(true, () => {
        console.log("MQTT desconectado.");
      });
    };
  }, []);

  const updateSensorData = (temp, hum) => {
    setTemperature(temp);
    if (tempMin === null || temp < tempMin) setTempMin(temp);
    if (tempMax === null || temp > tempMax) setTempMax(temp);
    setHumidity(hum);
    if (humMin === null || hum < humMin) setHumMin(hum);
    if (humMax === null || hum > humMax) setHumMax(hum);
    setTemperatureData((prev) => {
      const newData = [...prev, temp];
      return newData.length > 10 ? newData.slice(-10) : newData;
    });
    setHumidityData((prev) => {
      const newData = [...prev, hum];
      return newData.length > 10 ? newData.slice(-10) : newData;
    });
    setLastUpdate(new Date());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Atualizando dados...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Erro durante refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "--";
    return date.toLocaleTimeString("pt-BR");
  };

  const getTemperatureProgress = () => {
    if (temperature === null) return 0;
    return Math.max(0, Math.min(100, ((temperature + 10) / 60) * 100));
  };

  const getHumidityProgress = () => {
    return humidity || 0;
  };

  const ConnectionStatus = () => (
    <View
      style={[
        styles.connectionStatus,
        isConnected ? styles.connected : styles.disconnected,
      ]}
    >
      <Text
        style={[
          styles.connectionText,
          {
            color: isConnected
              ? theme.connectionConnected
              : theme.connectionDisconnected,
          },
        ]}
      >
        {isConnected ? "🟢 Conectado" : "🔴 Desconectado"}
      </Text>
    </View>
  );

  const Chart = () => (
    <View style={styles.chartCard}>
      <View style={styles.cardHeader}>
        <View
          style={[styles.icon, { backgroundColor: theme.iconBg || "#667eea" }]}
        >
          <Text style={styles.iconText}>📊</Text>
        </View>
        <Text style={styles.cardTitle}>Histórico (Últimas 10 leituras)</Text>
      </View>
      <View style={styles.chart}>
        <View style={styles.chartContainer}>
          {temperatureData.length > 0 ? (
            temperatureData.map((temp, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.temperatureBar,
                    {
                      height: Math.max(5, temp * 2),
                      backgroundColor: theme.chartTemp || "#ff6b6b",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.humidityBar,
                    {
                      height: Math.max(5, (humidityData[index] || 0) * 1.5),
                      backgroundColor: theme.chartHum || "#4ecdc4",
                    },
                  ]}
                />
                <Text style={styles.chartLabel}>{index + 1}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Aguardando dados...</Text>
          )}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: theme.chartTemp || "#ff6b6b" },
              ]}
            />
            <Text style={styles.legendText}>Temp</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: theme.chartHum || "#4ecdc4" },
              ]}
            />
            <Text style={styles.legendText}>Umid</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={
        theme.mode === "dark" ? ["#23242a", "#181a20"] : ["#667eea", "#764ba2"]
      }
      style={[styles.container, { minHeight: "100%" }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingTop: 70 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { marginBottom: 35 }]}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",
                textShadowColor:
                  theme.mode === "dark" ? "#000" : "rgba(0,0,0,0.2)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 6,
                letterSpacing: 1.2,
              },
            ]}
          >
            🌡️ Dashboard IoT
          </Text>
          <View style={{ marginTop: 10 }}>
            <ConnectionStatus />
          </View>
        </View>

        <SensorCard
          title="Temperatura"
          value={temperature}
          unit="°C"
          icon="🌡️"
          progress={getTemperatureProgress()}
          progressColor={theme.chartTemp}
          min={tempMin}
          max={tempMax}
          theme={theme}
        />

        <SensorCard
          title="Umidade"
          value={humidity}
          unit="%"
          icon="💧"
          progress={getHumidityProgress()}
          progressColor={theme.chartHum}
          min={humMin}
          max={humMax}
          theme={theme}
        />

        <Chart />

        <View style={styles.lastUpdate}>
          <Text style={styles.lastUpdateText}>
            Última atualização: {formatTime(lastUpdate)}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 15,
  },
  connectionStatus: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  connected: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "#4CAF50",
  },
  disconnected: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderColor: "#F44336",
  },
  connectionText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconText: {
    fontSize: 20,
    color: "white",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  valueDisplay: {
    alignItems: "center",
    marginVertical: 20,
  },
  value: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 5,
  },
  unit: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginVertical: 15,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  chartCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    minHeight: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  chart: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    flex: 1,
    paddingBottom: 30,
  },
  chartBar: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    maxWidth: 30,
  },
  temperatureBar: {
    width: 12,
    backgroundColor: "#ff6b6b",
    borderRadius: 2,
    marginBottom: 3,
    minHeight: 5,
  },
  humidityBar: {
    width: 12,
    backgroundColor: "#4ecdc4",
    borderRadius: 2,
    minHeight: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    flex: 1,
    textAlignVertical: "center",
  },
  chartLegend: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  lastUpdate: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  lastUpdateText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
});

const App = () => (
  <ThemeProvider>
    <Main />
  </ThemeProvider>
);

export default App;
