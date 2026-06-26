// Register Service Worker

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./sw.js")

        .then(() => {

            console.log("Service Worker Registered");

        })

        .catch(err => {

            console.log(err);

        });

    });

}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    const installBtn = document.getElementById("installAppBtn");

    if (installBtn) {

        installBtn.style.display = "block";

    }

});

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

window.addEventListener("appinstalled", () => {

    console.log("OG AI Installed");

    if (installBtn) {

        installBtn.style.display = "none";

    }

});
window.handleFileUpload = function(event) {
    const file = event.target.files[0];
    console.log("FILE PICKED:", file);
};
