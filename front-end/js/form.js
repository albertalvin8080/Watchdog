"use strict";

let g_condom_metadata = null;

const warnMsg = document.querySelector(".warn-msg.msg");
const errorMsg = document.querySelector(".error-msg.msg");
const successMsg = document.querySelector(".success-msg.msg");

function hideAllForms()
{
    const forms = document.querySelectorAll("#form-container > form");
    forms.forEach(form =>
    {
        form.style.display = "none";
    });
}

function showForm(formId, clean = true)
{
    if(clean)
        mapApp.cleanUpAll();
    mapApp.hideMap();
    mapApp.hideMenu();
    mapApp.hideEntranceRegister();
    const forms = document.querySelectorAll("form");
    forms.forEach(form => form.style.display = "none");
    const formToShow = document.getElementById(formId);
    formToShow.style.display = "block";
}

/* MAP REGISTER LOCATION */
const registerCondominiumForm = document.querySelector("#registerCondominiumForm");
const registerEntranceForm = document.querySelector("#registerEntranceForm")
const btnLocation = document.querySelector(".btnLocation");
const locationBar = document.querySelector("#locationBar");
let locationObj = null;

async function openLocationSelector(boundByCondom)
{
    locationObj = await new Promise((resolve, reject) =>
    {
        mapApp.openLocationSelectorView(locationBar, resolve, { radius: 1000, boundByCondom, condom: g_condom_metadata });
    });
    if (locationObj)
    {
        btnLocation.classList.remove("not-ok");
        btnLocation.classList.add("ok");
    } else
    {
        btnLocation.classList.remove("ok");
        btnLocation.classList.add("not-ok");
    }
}

registerCondominiumForm.addEventListener("submit", async (evt) =>
{
    evt.preventDefault();

    if (!locationObj)
    {
        showMsg(warnMsg, "Select the condominium location.");
        btnLocation.classList.add("not-ok");
        return;
    }
    btnLocation.classList.add("ok");

    const form = evt.target;
    const formData = {
        condomName: form.condomName.value,
        trusteeName: form.trusteeName.value,
        email: form.condominiumRegisterEmail.value,
        passwordHash: form.condominiumRegisterPassword.value,
        location: {
            display_name: locationObj.display_name,
            latitude: locationObj.lat,
            longitude: locationObj.lon,
        }
    };

    try
    {
        const response = await fetch("http://localhost:8080/condom/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok)
        {
            throw new Error("Failed to register condominium.");
        }

        const result = await response.json();
        showMsg(successMsg, "Condominium registered successfully!");
        //console.log(result);
        g_condom_metadata = result;

    } catch (error)
    {
        console.error("Error during registration:", error);
        showMsg(errorMsg, "Ops! Try again in a few minutes.")
    }
});

const condominiumLoginForm = document.querySelector("#condominiumLoginForm");
const entranceLoginForm = document.querySelector("#entranceLoginForm");

let processing = false;
condominiumLoginForm.addEventListener("submit", async (evt) =>
{
    evt.preventDefault();
    // mapApp.openMap();

    if (processing) // Prevent multiple requests in sucession.
        return;
    processing = true;

    const formData = new FormData(condominiumLoginForm);
    const formObject = Object.fromEntries(formData.entries());
    try
    {
        const response = await fetch("http://localhost:8080/condom/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formObject),
        });
        const result = await response.json();

        // Remember to expose this header at the cors filter
        // const success = Boolean(response.headers.get("login-success"));
        const success = response.ok;

        if (success)
        {
            localStorage.setItem('condominiumId', result.id);
            mapApp.openCondominiumView(result);
        }
        else
        {
            showMsg(warnMsg, result.message);
        }

        //console.log(result);
        g_condom_metadata = result;
    } catch (error)
    {
        console.error("Error:", error);
        showMsg(errorMsg, "Ops! Try again in a few moments.");
    }

    processing = false;
})

/* REGISTER ENTRANCE */
registerEntranceForm.addEventListener("submit", async (evt) =>
{
    evt.preventDefault();

    if (!locationObj)
    {
        showMsg(warnMsg, "Select the entrance location.");
        btnLocation.classList.add("not-ok");
        return;
    }
    btnLocation.classList.add("ok");

    const condominiumId = localStorage.getItem('condominiumId');
    console.log('Retrieved condominiumId:', condominiumId);

    if (!condominiumId)
    {
        showMsg(errorMsg, "Condominium not selected. Please login first.");
        return;
    }

    const form = evt.target;
    const formData = {
        email: form.entranceRegisterEmail.value,
        passwordHash: form.entranceRegisterPassword.value,
        location: {
            display_name: locationObj.display_name,
            latitude: locationObj.lat,
            longitude: locationObj.lon,
        },
        condominiumId: parseInt(condominiumId)
    };

    try
    {
        const response = await fetch("http://localhost:8080/entrance/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok)
        {
            throw new Error("Failed to register entrance.");
        }

        const result = await response.json();
        showMsg(successMsg, "Entrance registered successfully!");
        //console.log(result);

    } catch (error)
    {
        console.error("Error during registration:", error);
        showMsg(errorMsg, "Ops! Try again in a few minutes.")
    }
});


entranceLoginForm.addEventListener("submit", async (evt) =>
{
    evt.preventDefault();

    const formData = new FormData(entranceLoginForm);
    const formObject = Object.fromEntries(formData.entries());

    try
    {
        const response = await fetch("http://localhost:8080/entrance/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        const success = response.ok;

        if (success)
        {
            localStorage.setItem("entranceId", result.id);
            alertSSE = new AlertSSE(result.entrance, mapApp);
            mapApp.openEntranceView(result);
        }
        else
        {
            showMsg(warnMsg, result.message);
        }

    } catch (error)
    {
        console.error("Error:", error);
        showMsg(errorMsg, "Ops! Try again in a few moments.");
    }
})



let id1 = null;
let id2 = null;
function showMsg(msgE, msgStr)
{
    clearTimeout(id1);
    clearTimeout(id2);

    const seconds = 0.3;
    const showDuration = 2000;
    msgE.style.display = "flex";
    msgE.innerText = msgStr;

    msgE.style.animation = "none";
    // NOTE: Accessing msgE.offsetHeight forces the browser to recompute styles.
    msgE.offsetHeight; // Force reflow to restart animation

    msgE.style.animation = `showMsg ${seconds}s ease forwards`;

    id1 = setTimeout(() =>
    {
        msgE.style.animation = `hideMsg ${seconds}s ease forwards`;
        id2 = setTimeout(() =>
        {
            msgE.style.display = "none";
        }, seconds * 1000);
    }, showDuration);
}
