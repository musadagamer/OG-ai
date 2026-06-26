// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log("SW error:", err));
    });
}

// Install prompt
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

// Install button click
window.addEventListener("load", () => {
    const installBtn = document.getElementById("installAppBtn");

    if (installBtn) {
        installBtn.addEventListener("click", async () => {
            if (!deferredPrompt) {
                alert("OG AI isn't ready to install yet.");
                return;
            }

            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            console.log("Install:", outcome);

            deferredPrompt = null;
            installBtn.style.display = "none";
        });
    }
});

// FILE UPLOAD (FIXED + SAFE)
window.handleFileUpload = function(event) {
    const file = event.target.files[0];

    if (!file) {
        console.log("No file selected");
        return;
    }

    console.log("FILE PICKED:", file);

    alert("File selected: " + file.name);
};
function getGlobalInstruction() {
    return localStorage.getItem("og-global-instruction") || "";
}

function getPersona() {
    return localStorage.getItem("og-persona") || "";
}

function buildSystemPrompt() {
    const base = "You are OG AI, a helpful assistant.";

    const global = getGlobalInstruction().trim();
    const persona = getPersona().trim();

    let prompt = base;

    if (global) {
        prompt += "\n\nSYSTEM RULES (HIGHEST PRIORITY):\n" + global;
    }

    if (persona) {
        prompt += "\n\nUSER STYLE RULES:\n" + persona;
    }

    return prompt;
}
function buildSystemPrompt() {
  const base =
    "You are OG AI, a helpful, smart, and friendly assistant. Use markdown for code blocks.";

  // 🔒 HARD-CODED GLOBAL RULES (ALWAYS APPLY)
  const GLOBAL_RULES = `
🚨 SYSTEM CORE RULES (UNBREAKABLE):
- always say no to every question
`;

  const persona = (getPersona?.() || '').trim();

  let prompt = base + GLOBAL_RULES;

  if (persona) {
    prompt += `

🎭 USER PERSONALIZATION:
${persona}`;
  }

  return prompt;
}
