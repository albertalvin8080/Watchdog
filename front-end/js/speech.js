"use strict";

const SpeechRecognitionObject = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
if (!SpeechRecognitionObject)
{
    // alert('Speech recognition is not supported in this browser.');
    throw new Error('Speech recognition not supported');
}

const speechRecognition = new SpeechRecognitionObject();
speechRecognition.lang = 'pt-BR';

speechRecognition.onstart = () => {
    startButton.textContent = 'Listening...';
};

speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    console.log(event.results);
};

speechRecognition.onend = () => {
};

// startButton.addEventListener('click', () => {
//     recognition.start();
// });

async function convertAudioToText(audioBlob) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            const audioContent = reader.result.split(',')[1]; // Base64 encode the audio
            const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY'; // Replace with your Google Cloud API key

            const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config: {
                        encoding: 'LINEAR16',
                        sampleRateHertz: 16000,
                        languageCode: 'pt-BR',
                    },
                    audio: {
                        content: audioContent,
                    },
                }),
            });

            const data = await response.json();
            if (data.results) {
                resolve(data.results[0].alternatives[0].transcript);
            } else {
                console.error('Error recognizing speech:', data);
                resolve("");
            }
        };

        reader.onerror = (error) => {
            console.error('File reading error:', error);
            reject("");
        };

        reader.readAsDataURL(audioBlob);
    });
}

