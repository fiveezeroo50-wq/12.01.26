console.log("JS pieslēgts un darbojas");

function changeText() {
    let paragraph = document.querySelector("main p");

    if (paragraph.innerText.includes("Wikipedia")) {
        paragraph.innerText = "JS funkciju!";
        paragraph.style.color = "green";
        paragraph.style.fontWeight = "bold";
    } else {
        paragraph.innerText = "Wikipedia ir brīva daudzvalodu tiešsaistes enciklopēdija, kuru veido brīvprātīgie no visas pasaules.";
        paragraph.style.color = "black";
        paragraph.style.fontWeight = "normal";
    }
}

