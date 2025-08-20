export default function SensorCard({
  title,
  value,
  unit,
  icon,
  colorClass,
  isConnected,
  trend = null,
}) {
  const formatValue = (val) => {
    if (val === null || val === undefined) return "--";
    return typeof val === "number" ? val.toFixed(1) : val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <i className="fas fa-arrow-up text-success ms-2"></i>;
    if (trend < 0)
      return <i className="fas fa-arrow-down text-danger ms-2"></i>;
    return <i className="fas fa-minus text-muted ms-2"></i>;
  };

  return (
    <div className="col-md-6 mb-4">
      <div
        className={`sensor-card h-100 ${!isConnected ? "sensor-offline" : ""}`}
      >
        <div className="card-body text-center p-4 position-relative">
          {/* Indicador de status */}
          <div className="position-absolute top-0 end-0 m-3">
            <div
              className={`status-dot ${
                isConnected ? "status-dot-online" : "status-dot-offline"
              }`}
            ></div>
          </div>

          {/* Ícone do sensor */}
          <div className={`sensor-icon ${colorClass} mb-3`}>
            <i className={`${icon} fa-4x`}></i>
          </div>

          {/* Título */}
          <h5 className="card-title text-muted mb-3 fw-semibold text-uppercase tracking-wide">
            {title}
          </h5>

          {/* Valor principal */}
          <div className="value-container mb-2">
            <span className={`value-display ${colorClass}`}>
              {formatValue(value)}
            </span>
            <span className="unit ms-2">{unit}</span>
            {getTrendIcon()}
          </div>

          {/* Animação de pulso quando conectado */}
          {isConnected && value !== null && (
            <div className="pulse-animation">
              <div className={`pulse-dot ${colorClass}`}></div>
            </div>
          )}

          {/* Mensagem quando desconectado */}
          {!isConnected && (
            <small className="text-muted d-block mt-2">
              <i className="fas fa-exclamation-triangle me-1"></i>
              Aguardando conexão...
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
