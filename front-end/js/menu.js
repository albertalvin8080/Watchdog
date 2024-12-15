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

    const menuScreenContent = mapApp.menuScreen.querySelector("#content");
    mapApp.menuScreen.addEventListener("click", (evt) => {
        if (evt.target === mapApp.menuScreen ||
            evt.target == menuScreenContent
        ) {
            toggleMenu();
        }
    });

    mapApp.btnOpenMenu.addEventListener("click", (evt) => {
        evt.stopPropagation();
        toggleMenu();
    });
}