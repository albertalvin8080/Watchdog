"use strict";

class AlertHistory
{
    constructor(historyDiv)
    {
        this.historyDiv = historyDiv;
        this.alerts = [];
        this.dialog = this.createDialog();
        this.init();
    }

    async init()
    {
        try
        {
            const response = await fetch("http://localhost:8080/alert/history", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            this.alerts = await response.json();
            this.alerts = this.alerts.sort((a, b) => {
                // console.log(a, b);
                if (parseInt(a.condominiumId) < parseInt(b.condominiumId)) 
                    return -1
                // if(parseInt(a.condominiumId) === parseInt(b.condominiumId))
                //     return 0
                if(parseInt(a.condominiumId) > parseInt(b.condominiumId))
                    return 1
                if (parseInt(a.entranceId) < parseInt(b.entranceId)) 
                    return -1
                // if (parseInt(a.entranceId) === parseInt(b.entranceId)) 
                //     return 0
                if (parseInt(a.entranceId) > parseInt(b.entranceId)) 
                    return 1

                return 0;
            });

            this.render();
            this.createFilter();
        } catch (error)
        {
            console.error("Failed to load alerts:", error);
        }

    }

    createFilter()
    {
        const filter = document.createElement("div");
        this.filter = filter;
        filter.classList.add("filter");
        this.historyDiv.appendChild(filter);

        const displayAlertsByFilter = (evt) =>
        {
            const dangerSelect = this.filter.querySelector(".danger-level");
            const entranceSelect = this.filter.querySelector(".entrance-id");
            const condominiumSelect = this.filter.querySelector(".condominium-id");

            const filteredAlerts = this.alerts.filter((alert =>
            {
                if (dangerSelect.value !== "" && dangerSelect.value !== alert.dangerLevel)
                    return false;

                if (entranceSelect.value !== "" && entranceSelect.value != alert.entranceId)
                    return false;

                if (condominiumSelect.value !== "" && condominiumSelect.value != alert.condominiumId)
                    return false;

                return true;
            }));

            this.render(filteredAlerts);
        }

        const createDropdown = (options, label, className) =>
        {
            const container = document.createElement("div");
            container.className = "dropdown-container";

            const select = document.createElement("select");
            select.className = className;
            select.innerHTML = `<option value="">${label}</option>` +
                options.map(opt => `<option value="${opt}">${opt}</option>`).join('');

            container.appendChild(select);
            select.addEventListener("change", displayAlertsByFilter);
            return container;
        };

        // Danger Levels dropdown
        const dangerLevels = [...new Set(this.alerts.map(alert => alert.dangerLevel))];

        // Entrance IDs dropdown
        const entranceIds = [...new Set(this.alerts.map(alert => alert.entranceId))].sort((a, b) =>
        {
            return a < b ? -1 : (a == b ? 0 : 1);
        });

        // Condominium IDs dropdown
        const condominiumIds = [...new Set(this.alerts.map(alert =>
            alert.condominiumId ? alert.condominiumId : "None"))].sort((a, b) =>
            {
                return a < b ? -1 : (a == b ? 0 : 1)
            });

        filter.appendChild(createDropdown(dangerLevels, "Danger", "danger-level"));
        filter.appendChild(createDropdown(entranceIds, "Entrance", "entrance-id"));
        filter.appendChild(createDropdown(condominiumIds, "Condominium", "condominium-id"));
    }

    render(alerts = null)
    {
        if (alerts === null)
            alerts = this.alerts

        this.historyDiv.querySelector(".alert-list")?.remove(); // Clear previous content

        const list = document.createElement("ul");
        list.className = "alert-list";

        alerts.forEach(alert =>
        {
            const rein = alert.reinforcedAlertId;
            const reinSpan = `<span style="color: red;">R</span>`;
            const listItem = document.createElement("li");
            listItem.className = `alert-item ${alert.dangerLevel.toLowerCase()}`;
            listItem.innerHTML = `
            <span class="alert-entrance">C${alert.condominiumId}E${alert.entranceId}${rein ? reinSpan : ""}</span>
            <span class="alert-level">${alert.dangerLevel}</span>
            <span class="alert-title">${alert.title}</span>
            `;

            listItem.addEventListener("click", () => this.showDetails(alert));

            list.appendChild(listItem);
        });

        this.historyDiv.appendChild(list);
    }

    createDialog()
    {
        const dialog = document.createElement("div");
        dialog.className = "alert-dialog hidden";
        dialog.innerHTML = `
            <div class="dialog-content">
                <span class="close-btn">&times;</span>
                <h2 class="dialog-title"></h2>
                <p><strong>Danger Level:</strong> <span id="dialog-danger"></span></p>
                <p><strong>Date:</strong> <span id="dialog-date"></span></p>
                <p><strong>Entrance Email:</strong> <span id="dialog-email"></span></p>
                <p><strong>Latitude:</strong> <span id="dialog-lat"></span></p>
                <p><strong>Longidude:</strong> <span id="dialog-lon"></span></p>
                <p><strong>Reinforced Alert ID:</strong> <span id="dialog-reinforced"></span></p>
                <p><strong>Condominium ID:</strong> <span id="dialog-condominium"></span></p>
                <p>
                    <strong>Description:</strong>
                    <span id="dialog-description">
                        <audio controls>
                            <source src="" type="audio/webm">
                            Your browser does not support the audio element.
                        </audio>
                    </span>
                </p>
            </div>
        `;
        document.body.appendChild(dialog);

        dialog.querySelector(".close-btn").addEventListener("click", () =>
        {
            dialog.classList.add("hidden");
        });

        return dialog;
    }

    showDetails(alert)
    {
        this.dialog.querySelector(".dialog-title").textContent = alert.title;
        this.dialog.querySelector("#dialog-danger").textContent = alert.dangerLevel;
        this.dialog.querySelector("#dialog-date").textContent = new Date(alert.date).toLocaleString();
        this.dialog.querySelector("#dialog-email").textContent = alert.email;
        this.dialog.querySelector("#dialog-lat").textContent = alert.location ? JSON.stringify(alert.location.latitude) : "No location";
        this.dialog.querySelector("#dialog-lon").textContent = alert.location ? JSON.stringify(alert.location.longitude) : "No location";
        this.dialog.querySelector("#dialog-reinforced").textContent = alert.reinforcedAlertId ? alert.reinforcedAlertId : "None";
        this.dialog.querySelector("#dialog-condominium").textContent = alert.condominiumId ? alert.condominiumId : "None";

        const audioElement = this.dialog.querySelector("#dialog-description audio");
        const base64Audio = alert.description; // Base64-encoded string
        const audioUrl = `data:audio/webm;base64,${base64Audio}`;

        audioElement.src = audioUrl;
        audioElement.load();

        this.dialog.classList.remove("hidden");
    }

    show()
    {
        this.historyDiv.style.display = "flex";
    }
}

const alertHistory = new AlertHistory(document.querySelector("#alertHistory"));
