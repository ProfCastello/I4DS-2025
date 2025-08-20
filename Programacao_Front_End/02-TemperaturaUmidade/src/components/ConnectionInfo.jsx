export default function ConnectionInfo({
  brokerHost,
  topic,
  isConnected,
  connectionAttempts,
}) {
  return (
    <div className="connection-info-card">
      <div className="card-body">
        <h6 className="card-title text-muted mb-4 d-flex align-items-center">
          <i className="fas fa-info-circle me-2"></i>
          Informações da Conexão
          {connectionAttempts > 0 && (
            <span className="badge bg-warning text-dark ms-2">
              {connectionAttempts} tentativas
            </span>
          )}
        </h6>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="info-item">
              <i className="fas fa-server text-primary mb-2"></i>
              <small className="text-muted d-block">Broker MQTT</small>
              <span className="fw-bold">{brokerHost}</span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="info-item">
              <i className="fas fa-hashtag text-success mb-2"></i>
              <small className="text-muted d-block">Tópico</small>
              <span className="fw-bold font-monospace">{topic}</span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="info-item">
              <i className="fas fa-shield-alt text-info mb-2"></i>
              <small className="text-muted d-block">Protocolo</small>
              <span className="fw-bold">MQTT over WSS</span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="info-item">
              <i
                className={`fas ${
                  isConnected
                    ? "fa-check-circle text-success"
                    : "fa-times-circle text-danger"
                } mb-2`}
              ></i>
              <small className="text-muted d-block">Status</small>
              <span
                className={`fw-bold ${
                  isConnected ? "text-success" : "text-danger"
                }`}
              >
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="mt-3 p-3 bg-warning bg-opacity-10 border-start border-warning border-4 rounded">
            <div className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle text-warning me-2"></i>
              <small className="text-warning-emphasis">
                Tentando reconectar ao broker MQTT...
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
