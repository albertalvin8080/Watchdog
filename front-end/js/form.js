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
const registerCondominiumForm = document.querySelectorAll("#registerCondominiumForm");
const locationBar = document.querySelector("#locationBar");
const btnCancel = locationBar.querySelector("#btnCancel");
btnCancel.addEventListener("click", (evt) => {
    locationBar.style.display = "none";
    mapApp.hideMap();
});

function openLocationSelector()
{
    mapApp.openLocationSelector(locationBar);
}