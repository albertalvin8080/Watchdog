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

// MAIN SCREEN

const mainScreen = document.querySelector("#main-screen");
const condominiumLoginForm = document.querySelector("#condominiumLoginForm");

condominiumLoginForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    // mainScreen.style.display = "flex";
    // mapApp.openMap();

    const formData = new FormData(condominiumLoginForm);
    const formObject = Object.fromEntries(formData.entries());
    try {
        // Send the POST request with JSON body
        const response = await fetch("https://localhost:8080/condom/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)
        });
        const result = await response.json();
        console.log(result);  
    } catch (error) {
        console.error("Error:", error);  
    }
})