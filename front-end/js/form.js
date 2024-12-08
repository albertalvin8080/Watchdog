"use strict";

mapApp.hideMap();

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
    }
});