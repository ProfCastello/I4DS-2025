import { Client } from 'paho-mqtt';


let client;


export const connectMQTT = (onMessageReceived) => {
// Usando wss na porta 8884
client = new Client('broker.hivemq.com', 8884, '/mqtt', 'reactClient_' + Math.random());


client.onConnectionLost = (responseObject) => {
console.log('Conexão perdida', responseObject);
};


client.onMessageArrived = (message) => {
onMessageReceived(message.destinationName, message.payloadString);
};


client.connect({
useSSL: true, // habilita WSS
onSuccess: () => {
console.log('MQTT conectado via WSS!');
client.subscribe('quizIoT/resp_enviada');
client.subscribe('quizIoT/resultado');
client.subscribe('quizIoT/statusAluno');
},
onFailure: (err) => console.error('Erro MQTT', err),
});
};


export const publishMessage = (topic, payload) => {
if (!client) return;
const message = new window.Paho.MQTT.Message(payload);
message.destinationName = topic;
client.send(message);
};