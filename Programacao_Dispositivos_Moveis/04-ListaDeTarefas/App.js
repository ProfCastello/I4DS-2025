import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList, // Importa o FlatList para renderizar listas eficientemente
  Alert,
  Keyboard,
  useColorScheme,
  ScrollView, // Para o tema claro/escuro
} from "react-native";

export default function App() {
  const [tasks, setTasks] = useState([]); // Estado para armazenar a lista de tarefas
  const [newTask, setNewTask] = useState(""); // Estado para o texto da nova tarefa

  const systemColorScheme = useColorScheme();
  const [appTheme, setAppTheme] = useState(systemColorScheme || "light");

  // Efeito para atualizar o tema do app se o tema do sistema mudar
  useEffect(() => {
    if (systemColorScheme) {
      setAppTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  // Função para adicionar uma nova tarefa
  const addTask = () => {
    if (newTask.trim().length > 0) {
      // Garante que a tarefa não seja vazia
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now().toString(), text: newTask.trim(), completed: false }, // Cria um ID único
      ]);
      setNewTask(""); // Limpa o campo de input
      Keyboard.dismiss(); // Fecha o teclado
    } else {
      Alert.alert("Atenção", "Por favor, digite uma tarefa.");
    }
  };

  // Função para marcar uma tarefa como concluída/não concluída
  const toggleTaskCompleted = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Função para remover uma tarefa
  const deleteTask = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () =>
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
          style: "destructive",
        },
      ]
    );
  };

  // Função para alternar o tema manualmente
  const toggleTheme = () => {
    // <--- FUNÇÃO toggleTheme ADICIONADA AQUI
    setAppTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Define as cores do tema com base no appTheme
  const themeColors = getThemeColors(appTheme);

  // Renderiza cada item da lista de tarefas
  const renderItem = ({ item }) => (
    <View
      style={[baseStyles.taskItem, { backgroundColor: themeColors.taskItemBg }]}
    >
      <TouchableOpacity
        onPress={() => toggleTaskCompleted(item.id)}
        style={baseStyles.taskTextContainer}
      >
        <Text
          style={[
            baseStyles.taskText,
            { color: themeColors.taskTextColor },
            item.completed && baseStyles.completedTaskText, // Aplica estilo se concluída
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={[
          baseStyles.deleteButton,
          { backgroundColor: themeColors.deleteButtonBg },
        ]}
      >
        <Text style={baseStyles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        baseStyles.container,
        { backgroundColor: themeColors.containerBg },
      ]}
    >
      {/* Topbar/Header do Aplicativo */}
      <View
        style={[baseStyles.topbar, { backgroundColor: themeColors.topbarBg }]}
      >
        <Text
          style={[
            baseStyles.topbarTitle,
            { color: themeColors.topbarTitleColor },
          ]}
        >
          Minhas Tarefas
        </Text>
        {/* Botão de alternar tema no Topbar */}
        <TouchableOpacity
          style={[
            baseStyles.topbarThemeToggle,
            { backgroundColor: themeColors.topbarThemeToggleBg },
          ]}
          onPress={toggleTheme}
        >
          <Text
            style={[
              baseStyles.topbarThemeToggleText,
              { color: themeColors.topbarThemeToggleColor },
            ]}
          >
            {appTheme === "light" ? "🌙" : "☀️"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={baseStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            baseStyles.card,
            {
              backgroundColor: themeColors.cardBg,
              shadowColor: themeColors.cardShadow,
            },
          ]}
        >
          <TextInput
            style={[
              baseStyles.input,
              {
                borderColor: themeColors.inputBorder,
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputColor,
              },
            ]}
            placeholder="Adicionar nova tarefa..."
            placeholderTextColor={themeColors.placeholderTextColor}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask} // Adiciona tarefa ao pressionar Enter no teclado
          />
          <TouchableOpacity
            style={[
              baseStyles.addButton,
              { backgroundColor: themeColors.buttonBg },
            ]}
            onPress={addTask}
          >
            <Text style={baseStyles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Tarefas */}
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            // Componente exibido quando a lista está vazia
            <Text
              style={[
                baseStyles.emptyListText,
                { color: themeColors.placeholderTextColor },
              ]}
            >
              Nenhuma tarefa adicionada ainda.
            </Text>
          )}
          contentContainerStyle={baseStyles.flatListContent}
        />
      </ScrollView>

      <StatusBar style={appTheme === "dark" ? "light" : "dark"} />
    </View>
  );
}

// Estilos base que não mudam com o tema
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // Ajuste para a barra de status
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  topbarTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  topbarThemeToggle: {
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topbarThemeToggleText: {
    fontSize: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 20,
    paddingBottom: 20, // Ajuste para o final da lista
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 10, // Espaçamento no final da lista
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  taskTextContainer: {
    flex: 1, // Permite que o texto ocupe o espaço disponível
    marginRight: 10,
  },
  taskText: {
    fontSize: 18,
    flexWrap: "wrap", // Permite que o texto quebre linha
  },
  completedTaskText: {
    textDecorationLine: "line-through", // Risca o texto
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

// Função para obter as cores do tema com base no esquema de cores do dispositivo
const getThemeColors = (colorScheme) => {
  const isDark = colorScheme === "dark";
  return {
    containerBg: isDark ? "#2c3e50" : "#e0f7fa",
    topbarBg: isDark ? "#222f3e" : "#ffffff",
    topbarTitleColor: isDark ? "#ecf0f1" : "#00796b",
    topbarThemeToggleBg: isDark ? "#34495e" : "#e0e0e0",
    topbarThemeToggleColor: isDark ? "#ecf0f1" : "#424242",
    cardBg: isDark ? "#34495e" : "#ffffff",
    cardShadow: isDark ? "rgba(255,255,255,0.2)" : "#000",
    inputBorder: isDark ? "#5c6e7f" : "#b0bec5",
    inputBg: isDark ? "#4a627a" : "#fcfcfc",
    inputColor: isDark ? "#ecf0f1" : "#333",
    placeholderTextColor: isDark ? "#bdc3c7" : "#9e9e9e",
    buttonBg: isDark ? "#1abc9c" : "#009688",
    taskItemBg: isDark ? "#4a627a" : "#ffffff",
    taskTextColor: isDark ? "#ecf0f1" : "#333",
    deleteButtonBg: isDark ? "#e74c3c" : "#ef5350",
  };
};
