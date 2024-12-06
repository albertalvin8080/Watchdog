"use strict";

const SpeechRecognitionObject = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
if (!SpeechRecognitionObject) {
    alert('Speech recognition is not supported in this browser.');
    throw new Error('Speech recognition not supported');
}

const startButton = document.getElementById('startButton');
const outputDiv = document.getElementById('output');

const recognition = new SpeechRecognitionObject();
recognition.lang = 'pt-BR';

recognition.onstart = () => {
    startButton.textContent = 'Listening...';
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    outputDiv.textContent = transcript;
    console.log(transcript);
    console.log(event.results);
};

recognition.onend = () => {
    startButton.textContent = 'Start Voice Input';
};

startButton.addEventListener('click', () => {
    recognition.start();
});