"use strict";

function hideAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
}

hideAllForms();

function showForm(formId) {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.style.display = 'none');
    const formToShow = document.getElementById(formId);
    formToShow.style.display = 'block';
}