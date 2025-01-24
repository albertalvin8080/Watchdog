"use strict";

class AppWs {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8080/ws');

        this.socket.onopen = this.onopen;
        this.socket.onmessage = this.onmessage;
        this.socket.onclose = this.onclose;
    }

    sendMessage() {
        const message = 'Hello from Client at ' + new Date().toLocaleTimeString();
        socket.send(message);
    }

    onmessage(event) {
        console.log(event.data);
    }

    onclose() {
        console.log('WebSocket connection closed');
    }

    onopen() {
        console.log('WebSocket connection opened');
    }
}