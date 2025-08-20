import React from 'react';

const Placar = ({ acertos, erros }) => {
  return (
    <div className="card text-center shadow p-3 mb-3 bg-body rounded">
      <div className="card-header">Placar ao Vivo</div>
      <div className="card-body">
        <h5 className="card-title">Acertos: {acertos}</h5>
        <h5 className="card-title text-danger">Erros: {erros}</h5>
      </div>
    </div>
  );
};

export default Placar;

