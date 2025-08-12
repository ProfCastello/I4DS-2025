import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * SensorCard - Componente moderno e reutilizável para exibir dados de sensores
 * Props:
 *  - title: string
 *  - value: number|null
 *  - unit: string
 *  - icon: string (emoji ou ícone)
 *  - progress: number (0-100)
 *  - progressColor: string
 *  - min: number|null
 *  - max: number|null
 */
const SensorCard = ({
  title,
  value,
  unit,
  icon,
  progress,
  progressColor,
  min,
  max,
  theme,
}) => (
  <View
    style={[
      styles.card,
      {
        backgroundColor: theme.card,
        shadowColor: theme.shadow,
        borderColor: theme.cardBorder,
      },
    ]}
  >
    <View style={styles.cardHeader}>
      <View style={[styles.icon, { backgroundColor: progressColor }]}>
        <Text style={[styles.iconText, { color: theme.text }]}>{icon}</Text>
      </View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
    </View>
    <View style={styles.valueDisplay}>
      <Text style={[styles.value, { color: theme.accent }]}>
        {value !== null ? value.toFixed(1) : "--"}
      </Text>
      <Text style={[styles.unit, { color: theme.textSecondary }]}>{unit}</Text>
    </View>
    <View style={[styles.progressBar, { backgroundColor: theme.progressBg }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${progress}%`, backgroundColor: progressColor },
        ]}
      />
    </View>
    <View style={styles.stats}>
      <View style={styles.stat}>
        <Text style={[styles.statLabel, { color: theme.statLabel }]}>
          Mínima
        </Text>
        <Text style={[styles.statValue, { color: theme.statValue }]}>
          {min !== null ? `${min.toFixed(1)}${unit}` : `--${unit}`}
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.statLabel, { color: theme.statLabel }]}>
          Máxima
        </Text>
        <Text style={[styles.statValue, { color: theme.statValue }]}>
          {max !== null ? `${max.toFixed(1)}${unit}` : `--${unit}`}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
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
});

export default React.memo(SensorCard);
