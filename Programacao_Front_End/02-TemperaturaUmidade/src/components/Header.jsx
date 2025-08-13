import { useTheme } from "../hooks/useTheme";

export default function Header({ isConnected, lastUpdate }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const formatTime = (date) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("pt-BR");
  };

  return (
    <header className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-center flex-grow-1">
          <h1 className="display-4 text-gradient mb-3 fw-bold">
            <i className="fas fa-microchip me-3 text-primary"></i>
            Monitor IoT
          </h1>
          <p className="lead mb-0 opacity-75">
            Temperatura e Umidade em Tempo Real
          </p>
        </div>

        <button
          className="btn btn-outline-secondary btn-lg rounded-circle p-3 theme-toggle"
          onClick={toggleTheme}
          title={
            isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"
          }
        >
          <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} fa-lg`}></i>
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-auto">
          <div
            className={`status-badge ${
              isConnected ? "status-online" : "status-offline"
            }`}
          >
            <i
              className={`fas ${
                isConnected ? "fa-wifi" : "fa-wifi-slash"
              } me-2`}
            ></i>
            <span className="fw-semibold">
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
            {lastUpdate && (
              <small className="ms-2 opacity-75">
                • Última atualização: {formatTime(lastUpdate)}
              </small>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
