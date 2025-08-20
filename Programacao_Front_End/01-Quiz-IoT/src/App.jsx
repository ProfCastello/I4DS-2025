import React, { useEffect, useState } from 'react';
import Placar from './components/Placar';
import Resultado from './components/Resultado';
import { connectMQTT } from './services/mqttService';

function App() {
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [media, setMedia] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    connectMQTT((topic, payload) => {
      if (topic === 'quizIoT/resp_enviada') {
        if (payload === 'Correta') setAcertos(prev => prev + 1);
        else setErros(prev => prev + 1);
      }
      if (topic === 'quizIoT/resultado') {
        const match = payload.match(/Media:(\d+\.?\d*)%/);
        if (match) setMedia(parseFloat(match[1]));
      }
      if (topic === 'quizIoT/statusAluno') {
        setStatus(payload);
      }
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Quiz IoT - Placar ao Vivo</h1>
      <Placar acertos={acertos} erros={erros} />
      {media > 0 && <Resultado media={media} status={status} />}
    </div>
  );
}

export default App;
