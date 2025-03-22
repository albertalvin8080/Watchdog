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
            this.render();
            this.createFilder();
        } catch (error)
        {
            console.error("Failed to load alerts:", error);
        }

    }

    createFilder() {
        const div = document.createElement("div");
        div.classList.add("filter");
        this.historyDiv.appendChild(div);
    
        // Function to create a dropdown with options
        const createDropdown = (options, label, className) => {
            const container = document.createElement("div");
            container.className = "dropdown-container";
    
            const select = document.createElement("select");
            select.className = className;
            select.innerHTML = `<option value="">${label}</option>` +
                options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    
            container.appendChild(select);
            return container;
        };
    
        // Danger Levels dropdown
        const dangerLevels = [...new Set(this.alerts.map(alert => alert.dangerLevel))];
        div.appendChild(createDropdown(dangerLevels, "Danger", "danger-level"));
    
        // Entrance IDs dropdown
        const entranceIds = [...new Set(this.alerts.map(alert => alert.entranceId))];
        div.appendChild(createDropdown(entranceIds, "Entrance", "entrance-id"));
    
        // Condominium IDs dropdown
        const condominiumIds = [...new Set(this.alerts.map(alert => 
            alert.condominiumId ? alert.condominiumId : "None"))];

        div.appendChild(createDropdown(condominiumIds, "Condominium", "condominium-id"));
    }

    render()
    {
        this.historyDiv.innerHTML = ""; // Clear previous content

        if (this.alerts.length === 0)
        {
            this.historyDiv.innerHTML = `<p class="empty">No alerts available.</p>`;
            return;
        }

        const list = document.createElement("ul");
        list.className = "alert-list";

        this.alerts.forEach(alert =>
        {
            const listItem = document.createElement("li");
            listItem.className = `alert-item ${alert.dangerLevel.toLowerCase()}`;
            listItem.innerHTML = `
            <span class="alert-entrance">${alert.entranceId}</span>
            <span class="alert-level">${alert.dangerLevel}</span>
            <span class="alert-title">${alert.title}</span>
            `;

            // Add click event to open the dialog
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
