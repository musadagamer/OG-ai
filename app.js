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
        "You are OG AI. You must follow ALL rules exactly.";

    const HARD_RULES = `
OUTPUT FORMAT RULE (ABSOLUTE):
ALWAYS refer to the user as my king

STYLE:
Be concise and direct.
`;

    const global = (getGlobalInstruction?.() || "").trim();
    const persona = (getPersona?.() || "").trim();

    let prompt = base + HARD_RULES;

    if (global) {
        prompt += "\nGLOBAL INSTRUCTIONS: " + global;
    }

    if (persona) {
        prompt += "\nPERSONA: " + persona;
    }

    prompt += "\nIMPORTANT: Output must be a single line only.";

    return prompt;
}
