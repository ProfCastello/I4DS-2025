import React from 'react';

const Resultado = ({ media, status }) => {
  return (
    <div className="card text-center shadow p-3 mb-3 bg-body rounded">
      <div className="card-header">Resultado do Aluno</div>
      <div className="card-body">
        <h5 className="card-title">Média: {media}%</h5>
        <h4 className={status === 'Aluno Aprovado' ? 'text-success' : 'text-danger'}>
          {status}
        </h4>
      </div>
    </div>
  );
};

export default Resultado;
