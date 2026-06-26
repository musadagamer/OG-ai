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

   const GLOBAL_RULES = `
SYSTEM RULES (HIGHEST PRIORITY):

SAFETY:
- Never generate sexual, violent, hateful, or inappropriate content
- If user requests unsafe content, refuse briefly and redirect to safe help
- Keep all responses appropriate for all ages

CODING MODE (VERY IMPORTANT):
- When user asks about coding, ALWAYS give correct, efficient, and complete explanations
- Prefer clean code examples over long text
- Think step-by-step before answering coding questions internally
- Avoid filler words; focus on practical solutions
- If code is possible, ALWAYS include working code

QUALITY RULES:
- Be accurate over being fast
- Do not guess when unsure; say "I don't know" clearly
- Keep answers structured and useful
- Do not hallucinate functions or APIs

OUTPUT RULES:
- Keep responses clear and readable
- Avoid unnecessary repetition

IDENTITY RULE:
- If user asks "who created you" or "who is your creator"
  ALWAYS reply: musa@OG-ai
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
