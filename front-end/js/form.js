"use strict";

function hideAllForms() {
    const forms = document.querySelectorAll("#form-container > form");
    forms.forEach(form => {
        form.style.display = "none";
    });
}
// hideAllForms();

function showForm(formId) {
    const forms = document.querySelectorAll("form");
    forms.forEach(form => form.style.display = "none");
    const formToShow = document.getElementById(formId);
    formToShow.style.display = "block";
}

/* MAP REGISTER LOCATION */
const registerCondominiumForm = document.querySelector("#registerCondominiumForm");
const btnLocation = document.querySelector("#btnLocation");
const locationBar = document.querySelector("#locationBar");
let locationObj = null;

async function openLocationSelector() {
    locationObj = await new Promise((resolve, reject) => {
        mapApp.openLocationSelectorView(locationBar, resolve);
    });
    if (locationObj) {
        btnLocation.classList.remove("not-ok");
        btnLocation.classList.add("ok");
    } else {
        btnLocation.classList.remove("ok");
        btnLocation.classList.add("not-ok");
    }
}

registerCondominiumForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    if (!locationObj) {
        alert("Select the condominium location.");
        btnLocation.classList.add("not-ok");
        return;
    }
    btnLocation.classList.add("ok");

    const form = evt.target;
    const formData = {
        name: form.name.value,
        email: form.condominiumRegisterEmail.value,
        passwordHash: form.condominiumRegisterPassword.value,
        location: {
            display_name: locationObj.display_name,
            latitude: locationObj.lat,
            longitude: locationObj.lon,
        }
    };

    try {
        const response = await fetch("http://localhost:8080/condom/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Failed to register condominium.");
        }

        const result = await response.json();
        alert("Condominium registered successfully!");
        console.log(result);

    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred while registering the condominium.");
    }
});

const warnMsg = document.querySelector(".warn-msg.msg");
const errorMsg = document.querySelector(".error-msg.msg");
const condominiumLoginForm = document.querySelector("#condominiumLoginForm");

condominiumLoginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    // mapApp.openMap();

    const formData = new FormData(condominiumLoginForm);
    const formObject = Object.fromEntries(formData.entries());
    try {
        const response = await fetch("http://localhost:8080/condom/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
        const result = await response.json();

        // Remember to expose this header at the cors filter
        // const success = Boolean(response.headers.get("login-success"));
        const success = response.ok;

        if (success) {
            mapApp.openCondominiumView(result);
        }
        else {
            showMsg(warnMsg, result.message);
        }

        console.log(result);
    } catch (error) {
        console.error("Error:", error);
        showMsg(errorMsg, "Ops! Try again in a few moments.");
    }
})

let id1 = null;
let id2 = null;
function showMsg(msgE, msgStr) {
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

    id1 = setTimeout(() => {
        msgE.style.animation = `hideMsg ${seconds}s ease forwards`;
        id2 = setTimeout(() => {
            msgE.style.display = "none";
        }, seconds * 1000);  
    }, showDuration);
}