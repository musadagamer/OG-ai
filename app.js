// =======================
// SERVICE WORKER
// =======================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log("SW error:", err));
    });
}

// =======================
// INSTALL PROMPT
// =======================
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById("installAppBtn");
    if (installBtn) installBtn.style.display = "block";
});

window.addEventListener("appinstalled", () => {
    console.log("OG AI Installed");

    const installBtn = document.getElementById("installAppBtn");
    if (installBtn) installBtn.style.display = "none";
});

window.addEventListener("load", () => {
    const installBtn = document.getElementById("installAppBtn");

    if (installBtn) {
        installBtn.addEventListener("click", async () => {
            if (!deferredPrompt) {
                alert("OG AI isn't ready to install yet.");
                return;
            }

            deferredPrompt.prompt();
            await deferredPrompt.userChoice;

            deferredPrompt = null;
            installBtn.style.display = "none";
        });
    }
});

// =======================
// FILE UPLOAD
// =======================
window.handleFileUpload = function(event) {
    const file = event.target.files[0];

    if (!file) return;

    console.log("FILE PICKED:", file);
    alert("File selected: " + file.name);
};

// =======================
// GLOBAL + PERSONA STORAGE
// =======================
function getGlobalInstruction() {
    return localStorage.getItem("og-global-instruction") || "";
}

function getPersona() {
    return localStorage.getItem("og-persona") || "";
}

// =======================
// SYSTEM PROMPT (FIXED)
// =======================
function buildSystemPrompt() {
    const base =
        "You are OG AI, a helpful, smart, and friendly assistant. Use markdown for code blocks.";

    const HARD_RULES = `
SYSTEM RULE (HIGHEST PRIORITY):
- Always answer in ONE SINGLE LINE only
- Be clear and concise
`;

    const global = getGlobalInstruction().trim();
    const persona = getPersona().trim();

    let prompt = base + HARD_RULES;

    if (global) {
        prompt += "\n\nGLOBAL INSTRUCTIONS:\n" + global;
    }

    if (persona) {
        prompt += "\n\nPERSONA:\n" + persona;
    }

    return prompt;
}
