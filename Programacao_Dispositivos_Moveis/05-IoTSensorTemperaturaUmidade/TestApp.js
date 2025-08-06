import React from "react";
import { View, Text } from "react-native";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";

// Teste de tema básico
const TestApp = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#2196F3",
      background: "#F8F9FA",
      surface: "#FFFFFF",
      text: "#212121",
    },
  };

  console.log("Theme colors:", theme.colors);

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.colors.text }}>Teste de Tema</Text>
      </View>
    </PaperProvider>
  );
};

export default TestApp;
