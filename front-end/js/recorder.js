"use strict";

const recordStart = document.querySelector("#recordStart");
// const recordStop = document.querySelector("#recordStop");
let myStream = null;
let mediaRecorder = null;
let audioChunks = [];

const baseurl = "http://localhost:8080";

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
{
    console.log("getUserMedia supported.");
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
        })
        .then((stream) =>
        {
            myStream = stream;
            main();
        })
        .catch((err) =>
        {
            console.error(`The following getUserMedia error occurred: ${err}`);
        });
} else
{
    console.log("getUserMedia not supported on your browser!");
}

function main()
{
    mediaRecorder = new MediaRecorder(myStream);

    mediaRecorder.onstart = () =>
    {
        console.log("Recording started.");
        audioChunks = []; // Clear any previous chunks
    };

    mediaRecorder.ondataavailable = (event) =>
    {
        if (event.data.size > 0)
        {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () =>
    {
        console.log("Recording stopped.");

        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        const audioURL = URL.createObjectURL(audioBlob);

        // Create an audio element to play the recording
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = audioURL;
        document.querySelector("#menu-screen > #content").appendChild(audio);

        persistAudio(audioBlob);

        // const downloadLink = document.createElement("a");
        // downloadLink.href = audioURL;
        // downloadLink.download = "recording.webm";
        // downloadLink.textContent = "Download Recording";
        // document.body.appendChild(downloadLink);
    };

    recordStart.addEventListener("click", async () =>
    {
        if (mediaRecorder.state === "inactive")
        {
            customSpeechRecognition.start();
            mediaRecorder.start();
            recordStart.innerText = "Listening";
        } else if (mediaRecorder.state === "recording")
        {
            await customSpeechRecognition.stop();
            mediaRecorder.stop();
            recordStart.innerText = "Alert";
        }
    });
}

async function persistAudio(audioBlob)
{
    const dangerLevel = getDangetLevel();
    const entranceId = sessionStorage.getItem("entranceId");

    const formData = new FormData();
    formData.append("dangerLevel", dangerLevel);
    formData.append("entranceId", entranceId);
    formData.append("description", audioBlob);
    formData.append("transcript", customSpeechRecognition.getTranscript());

    try
    {
        const response = await fetch(baseurl + "/alert/register", {
            method: "POST",
            body: formData,
        })
        // const json = await response.json();
        if (response.ok)
            fetchAndDisplayAlerts(200, entranceId);
        else
            showMsg(errorMsg, "Try again.");
    }
    catch (error)
    {
        console.error("Error:", error);
    }
}

function getDangetLevel()
{
    // Retonando na tora, depois bota a IA pra adivinhar
    return "HIGH";
}

async function fetchAndDisplayAlerts(radius, entranceId)
{
    if (!entranceId)
    {
        return;
    }

    try
    {
        const response = await fetch(`${baseurl}/alert/${radius}/${entranceId}`);
        const alerts = await response.json();

        const alertsContainer = document.querySelector("#alerts-container");
        alertsContainer.innerHTML = '';

        alerts.forEach(alertSseDto =>
        {
            const card = document.createElement('div');
            card.className = 'alert-card';

            const date = new Date(alertSseDto.alert.date);
            const formattedDate = date.toLocaleString();

            const color = hashColor(alertSseDto.alert.id, 1);


            // style="text-shadow: -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000;"
            const style = `
                display: flex;
                justify-content: space-between;
            `;
            card.innerHTML = ` 
                <div class="danger-level ${alertSseDto.alert.dangerLevel}" style="${style}">
                    <div>${alertSseDto.alert.title}</div>
                    <div>
                        <div class="danger-info">
                            ${alertSseDto.alert.dangerLevel}
                        </div>
                    </div>
                </div>
                <div class="meta">
                    <!--<div>From Entrance #${alertSseDto.entranceId}</div>-->
                    <div>${formattedDate}</div>
                </div>
                <audio controls>
                    <source src="data:audio/webm;base64,${btoa(String.fromCharCode(...new Uint8Array(alertSseDto.alert.description)))}" type="audio/webm">
                    Your browser does not support the audio element.
                </audio>
            `;
            card.style.border = `3px solid ${color}`

            alertsContainer.appendChild(card);
        });

        return alerts;
    } catch (error)
    {
        console.error('Error fetching alerts:', error);
        const alertsContainer = document.querySelector("#alerts-container");
        alertsContainer.innerHTML = '<p class="error">Error loading alerts</p>';
    }
}


document.addEventListener('DOMContentLoaded', () =>
{
    const entranceId = sessionStorage.getItem("entranceId");
    if (entranceId)
    {
        /*
        WARNING: I don't think it's a good idea to fecth every time we reload. If the server is still going up, it will fail anyway. 
        Put it inside entranceLoginForm and condominiumLoginForm individually.
        */
        // fetchAndDisplayAlerts(200, entranceId);
        // setInterval(() => fetchAndDisplayAlerts(200, entranceId), 60000);
    }
});
