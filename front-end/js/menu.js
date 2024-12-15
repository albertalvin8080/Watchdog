"use strict";

function configureMenu(mapApp) {
    mapApp.menuScreen = document.querySelector("#menu-screen");
    mapApp.btnOpenMenu = mapApp.menuScreen.querySelector("#btnOpenMenu");
    mapApp.open = false;

    const toggleMenu = () => {
        const animationName = mapApp.open ? "slideDown" : "slideUp";
        mapApp.open = !mapApp.open;
        mapApp.menuScreen.style.animation = `${animationName} 0.3s ease forwards`;
    };

    mapApp.menuScreen.addEventListener("click", (evt) => {
        if (evt.target === mapApp.menuScreen) {
            toggleMenu();
        }
    });

    mapApp.btnOpenMenu.addEventListener("click", (evt) => {
        evt.stopPropagation();
        toggleMenu();
    });
}