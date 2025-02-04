"use strict";

let alertSSE = null;

class AlertSSE
{
    constructor(entrance, mapApp)
    {
        console.log(mapApp);
        this.map = mapApp;
        // console.log(entrance);
        const id = entrance.id;
        const lat = entrance.location.latitude;
        const lon = entrance.location.longitude;

        const backend = "http://localhost:8080";
        this.eventSource = new EventSource(
            `${backend}/api/alerts/stream?id=${id}&lat=${lat}&lon=${lon}`
        );

        this.eventSource.onmessage = this.onmessage.bind(this);
    }

    onmessage(event) {
        const alertSSEDto = JSON.parse(event.data);
        this.map.drawAlert(alertSSEDto);
    }

}


