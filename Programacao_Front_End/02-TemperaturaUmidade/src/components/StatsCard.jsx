import { useState, useEffect } from "react";

export default function StatsCard({ temperature, humidity }) {
  const [stats, setStats] = useState({
    tempMin: null,
    tempMax: null,
    tempAvg: null,
    humMin: null,
    humMax: null,
    humAvg: null,
    dataCount: 0,
  });

  useEffect(() => {
    if (temperature !== null && humidity !== null) {
      setStats((prevStats) => {
        const newCount = prevStats.dataCount + 1;

        return {
          tempMin:
            prevStats.tempMin === null
              ? temperature
              : Math.min(prevStats.tempMin, temperature),
          tempMax:
            prevStats.tempMax === null
              ? temperature
              : Math.max(prevStats.tempMax, temperature),
          tempAvg:
            prevStats.tempAvg === null
              ? temperature
              : (prevStats.tempAvg * (newCount - 1) + temperature) / newCount,
          humMin:
            prevStats.humMin === null
              ? humidity
              : Math.min(prevStats.humMin, humidity),
          humMax:
            prevStats.humMax === null
              ? humidity
              : Math.max(prevStats.humMax, humidity),
          humAvg:
            prevStats.humAvg === null
              ? humidity
              : (prevStats.humAvg * (newCount - 1) + humidity) / newCount,
          dataCount: newCount,
        };
      });
    }
  }, [temperature, humidity]);

  const resetStats = () => {
    setStats({
      tempMin: null,
      tempMax: null,
      tempAvg: null,
      humMin: null,
      humMax: null,
      humAvg: null,
      dataCount: 0,
    });
  };

  const formatValue = (value) => {
    return value !== null ? value.toFixed(1) : "--";
  };

  return (
    <div className="stats-card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="card-title text-muted mb-0 d-flex align-items-center">
            <i className="fas fa-chart-line me-2"></i>
            Estatísticas da Sessão
          </h6>
          <div className="d-flex align-items-center gap-3">
            <small className="text-muted">
              <i className="fas fa-database me-1"></i>
              {stats.dataCount} leituras
            </small>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={resetStats}
              title="Resetar estatísticas"
              disabled={stats.dataCount === 0}
            >
              <i className="fas fa-redo"></i>
            </button>
          </div>
        </div>

        <div className="row g-3">
          {/* Estatísticas de Temperatura */}
          <div className="col-md-6">
            <div className="stats-section">
              <h6 className="text-muted mb-3">
                <i className="fas fa-thermometer-half temperature-icon me-2"></i>
                Temperatura (°C)
              </h6>
              <div className="row g-2">
                <div className="col-4">
                  <div className="stat-item">
                    <small className="text-muted d-block">Mínima</small>
                    <span className="fw-bold text-primary">
                      {formatValue(stats.tempMin)}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="stat-item">
                    <small className="text-muted d-block">Média</small>
                    <span className="fw-bold text-info">
                      {formatValue(stats.tempAvg)}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="stat-item">
                    <small className="text-muted d-block">Máxima</small>
                    <span className="fw-bold text-danger">
                      {formatValue(stats.tempMax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas de Umidade */}
          <div className="col-md-6">
            <div className="stats-section">
              <h6 className="text-muted mb-3">
                <i className="fas fa-tint humidity-icon me-2"></i>
                Umidade (%)
              </h6>
              <div className="row g-2">
                <div className="col-4">
                  <div className="stat-item">
                    <small className="text-muted d-block">Mínima</small>
                    <span className="fw-bold text-primary">
                      {formatValue(stats.humMin)}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="stat-item">
                    <small className="text-muted d-block">Média</small>
                    <span className="fw-bold text-info">
                      {formatValue(stats.humAvg)}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="stat-item">
                    <small className="text-muted d-block">Máxima</small>
                    <span className="fw-bold text-success">
                      {formatValue(stats.humMax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
