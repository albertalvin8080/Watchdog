"use strict";

// function hideAllForms() {
//     const forms = document.querySelectorAll("form");
//     forms.forEach(form => {
//         form.style.display = "none";
//     });
// }
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
        mapApp.openLocationSelector(locationBar, resolve);
    });
    if (locationObj) {
        btnLocation.classList.remove("not-ok");
        btnLocation.classList.add("ok");
    } else {
        btnLocation.classList.remove("ok");
        btnLocation.classList.add("not-ok");
    }
}

registerCondominiumForm.addEventListener("submit", (evt) => {
    if (!locationObj) {
        evt.preventDefault();
        alert("Select the condominium location.");
        btnLocation.classList.add("not-ok");
        return;
    }
    btnLocation.classList.add("ok");
});

registerCondominiumForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;

    const formData = {
        name: form.name.value,
        email: form.condominiumRegisterEmail.value,
        passwordHash: form.condominiumRegisterPassword.value,
        location: locationObj ? {
            display_name: locationObj.display_name,
            latitude: locationObj.lat,
            longitude: locationObj.lon
        } : null
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
