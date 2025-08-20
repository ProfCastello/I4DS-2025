import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContextInstance";

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verifica se há preferência salva no localStorage
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Se não há preferência salva, usa a preferência do sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Salva a preferência no localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    // Aplica a classe ao body
    if (isDarkMode) {
      document.body.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-theme");
    } else {
      document.body.setAttribute("data-bs-theme", "light");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
