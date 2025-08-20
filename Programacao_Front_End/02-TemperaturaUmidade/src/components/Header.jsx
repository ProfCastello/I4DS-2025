import React from "react";

const Header = ({ isConnected, lastUpdate }) => {
  const formatTime = (date) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("pt-BR");
  };
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-center flex-grow-1">
          <h1 className="display-4 text-gradient mb-3 fw-bold">
            <i className="bi bi-microchip text-primary"></i>
            Monitor IoT
          </h1>
          <p className="lead mb-0 opacity-75">
            Temperatura e Umidade em Tempo Real
          </p>
        </div>

        <button
          className="btn btn-outline-secondary btn-lg rounded-circle p-3 theme-toggle"
          onClick={toggleTheme}
          title={""}
        >
          <i className="bi bi-sun"></i>
        </button>
      </div>
    </div>
  );
};

export default Header;
