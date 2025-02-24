"use strict";

let previousEntranceId = null;

async function persistReinforce(audioBlob) 
{
    const entranceId = sessionStorage.getItem("entranceId");
    const formData = new FormData();
    // formData.append("dangerLevel", dangerLevel);
    formData.append("entranceId", entranceId);
    formData.append("previousEntranceId", previousEntranceId);
    formData.append("description", audioBlob);
    formData.append("transcript", customSpeechRecognition.getTranscript());

    try
    {
        const response = await fetch(baseurl + "/alert/reinforce", {
            method: "POST",
            body: formData,
        })
        // const json = await response.json();
        if (response.ok)
            fetchAndDisplayAlerts(200, entranceId);
        else
            showMsg(errorMsg, "Try again.");
    
        console.log("OK");
    }
    catch (error)
    {
        console.error("Error:", error);
    }
}

function addAlertReinforceListener(btnReinforce)
{
    btnReinforce.addEventListener("click", async (evt) =>
        {
            previousEntranceId = parseInt(btnReinforce.getAttribute("data-entrance-id"));
        
            if (mediaRecorder.state === "inactive")
            {
                customSpeechRecognition.start();
                mediaRecorder.onstop = () => recordAudioBlob(persistReinforce);
                mediaRecorder.start();
                btnReinforce.innerText = "listening";
            } else if (mediaRecorder.state === "recording")
            {
                await customSpeechRecognition.stop();
                mediaRecorder.stop();
                btnReinforce.innerText = "reforce";
            }
        });
}
