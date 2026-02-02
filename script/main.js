// Main Animation Logic
const animationTimeline = () => {
    // Helpery do tekstu
    const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
    const hbd = document.getElementsByClassName("wish-hbd")[0];

    // Rozbijanie tekstu na litery (do efektu pisania)
    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    hbd.innerHTML = `<span>${hbd.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    const ideaTextTrans = { opacity: 0, y: -20, rotationX: 5, skewX: "15deg" };
    const ideaTextTransLeave = { opacity: 0, y: 20, rotationY: 5, skewX: "-15deg" };

    const tl = new TimelineMax();

    tl
        // 1. START
        .to(".container", 0.1, { visibility: "visible" })
        .from(".one", 0.7, { opacity: 0, y: 10 })
        .from(".two", 0.4, { opacity: 0, y: 10 })

        // Przejście
        .to(".one", 0.7, { opacity: 0, y: 10 }, "+=2")
        .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")

        // 2. OKAZJA
        .from(".three", 0.7, { opacity: 0, y: 10 })
        .to(".three", 0.7, { opacity: 0, y: 10 }, "+=2")

        // 3. CZAT
        .from(".four", 0.7, { scale: 0.2, opacity: 0 })
        .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })
        .staggerTo(".hbd-chatbox span", 0.05, { visibility: "visible" }, 0.05) // Szybsze pisanie
        .to(".fake-btn", 0.1, { backgroundColor: "#e91e63", scale: 1.1 }, "+=0.5") // Kliknięcie
        .to(".fake-btn", 0.1, { scale: 1 })
        .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=1")

        // 4. TEXTY
        .from(".idea-1", 0.7, ideaTextTrans)
        .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-2", 0.7, ideaTextTrans)
        .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-3", 0.7, ideaTextTrans)
        .to(".idea-3 strong", 0.5, { scale: 1.2, x: 10, color: "#e91e63" })
        .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-4", 0.7, ideaTextTrans)
        .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-5", 0.7, { rotationX: 15, rotationZ: -10, skewY: "-5deg", y: 50, z: 10, opacity: 0 }, "+=0.5")
        .to(".idea-5 span", 0.7, { rotation: 90, x: 8 }, "+=0.4")
        .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=2")
        .staggerFrom(".idea-6 span", 0.8, { scale: 3, opacity: 0, rotation: 15, ease: Expo.easeOut }, 0.2)
        .staggerTo(".idea-6 span", 0.8, { scale: 3, opacity: 0, rotation: -15, ease: Expo.easeOut }, 0.2, "+=1")

        // 5. NOWA SEKCJA: GALERIA (Zamiast balonów)
        .to(".idea-6", 0.5, { opacity: 0 }) // Ukryj poprzednie
        .staggerFromTo(".gallery-img", 1.5,
            { opacity: 0, y: 50, rotation: -15, scale: 0.8 },
            { opacity: 1, y: 0, rotation: (i) => (i%2===0 ? -5 : 5), scale: 1, ease: Elastic.easeOut.config(1, 0.75) },
            0.8 // Czas między zdjęciami
        )
        .from(".gallery-text", 1, { opacity: 0, y: 10 }, "-=0.5")
        .to(".gallery", 0.7, { opacity: 0, y: -50, scale: 0.8 }, "+=3") // Wyjazd galerii

        // 6. FINAŁ
        .from(".six", 0.5, { opacity: 0, y: 30 }) // Pokaż kontener
        .from(".girl-dp", 1, { scale: 0.1, opacity: 0, ease: Elastic.easeOut.config(1, 0.75) })
        .staggerFrom(".wish-hbd span", 0.7, { opacity: 0, y: -50, rotation: 150, skewX: "30deg", ease: Elastic.easeOut.config(1, 0.5) }, 0.1)
        .staggerTo(".wish-hbd span", 0.7, { scale: 1.4, rotationY: 150 }, 0.1, "party")
        .staggerTo(".wish-hbd span", 0.7, { scale: 1, rotationY: 0, color: "#e91e63", ease: Expo.easeOut }, 0.1, "party+=0.5")
        .from(".wish h5", 0.5, { opacity: 0, y: 10, skewX: "-15deg" }, "party")

        // Tło (Serduszka)
        .staggerTo(".eight svg", 1.5, { visibility: "visible", opacity: 0, scale: 80, repeat: 3, repeatDelay: 1.4 }, 0.3)

        // 7. OUTRO
        .to(".six", 0.5, { opacity: 0, y: 30, zIndex: "-1" }, "+=3")
        .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
        .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

    // Restart
    const replyBtn = document.getElementById("replay");
    replyBtn.addEventListener("click", () => {
        tl.restart();
    });
};

// Data & Logic
const fetchData = async () => {
    try {
        const response = await fetch("customize.json");
        if (!response.ok) throw new Error("No JSON");
        const data = await response.json();
        Object.keys(data).forEach((key) => {
            const el = document.getElementById(key);
            if (el && data[key]) {
                if (key === "imagePath") el.setAttribute("src", data[key]);
                else el.innerText = data[key];
            }
        });
    } catch (e) { console.log("Default content used"); }
};

// Init
const resolveFetch = () => {
    return new Promise((resolve) => {
        fetchData().then(() => resolve());
    });
};

resolveFetch().then(animationTimeline);

// Audio Fix (Auto-play on click)
document.addEventListener('click', function musicPlay() {
    const audio = document.getElementById("bg-music");
    audio.volume = 0.5;
    audio.play().catch(() => console.log("Audio blocked"));
    document.removeEventListener('click', musicPlay);
});