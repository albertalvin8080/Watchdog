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

    recordStart.addEventListener("click", () =>
    {
        if (mediaRecorder.state === "inactive")
        {
            mediaRecorder.start();
            recordStart.innerText = "Listening";
        } else if (mediaRecorder.state === "recording")
        {
            mediaRecorder.stop();
            recordStart.innerText = "Alert";
        }
    });
}

function persistAudio(audioBlob)
{
    const dangerLevel = getDangetLevel();
    const entranceId = localStorage.getItem("entranceId");

    const formData = new FormData();
    formData.append("dangerLevel", dangerLevel);
    formData.append("entranceId", entranceId);
    formData.append("description", audioBlob);

    fetch(baseurl + "/alert/register", {
        method: "POST",
        body: formData

    })
        .then((response) => response.json())
        .then((data) =>
        {
            // console.log(data);
        })
        .catch((error) =>
        {
            console.error("Error:", error);
        });
}

function getDangetLevel()
{
    // Retonando na tora, depois bota a IA pra adivinhar
    return "HIGH";
}