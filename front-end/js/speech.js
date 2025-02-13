"use strict";

const SpeechRecognitionObject = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
if (!SpeechRecognitionObject)
{
    // alert('Speech recognition is not supported in this browser.');
    throw new Error('Speech recognition not supported');
}

class CustomSpeechRecognitionObject
{
    constructor()
    {
        this.speechRecognition = new SpeechRecognitionObject();
        this.speechRecognition.lang = 'pt-BR';
        this.running = false;
        this.transcript = null;

        this.speechRecognition.onstart = () =>
        {
        };

        this.speechRecognition.onresult = (event) =>
        {
            this.transcript += " " + event.results[0][0].transcript;
            console.log(this.transcript);
            console.log(event.results);
        };

        this.speechRecognition.onend = () =>
        {
            if (this.running) {
                this.speechRecognition.start();
            }
        };
    }

    start()
    {
        this.transcript = "";
        this.running = true;
        this.speechRecognition.start();
    }

    stop()
    {
        this.running = false;
        this.speechRecognition.stop();
    }
}

const customSpeechRecognition = new CustomSpeechRecognitionObject();