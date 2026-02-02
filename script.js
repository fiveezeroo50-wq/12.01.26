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

<script>
function validateForm() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let error = document.getElementById("error");

  error.innerHTML = "";

  if (name === "" || email === "") {
    error.innerHTML = "Visi lauki ir obligāti!";
    return false;
  }

  if (!email.includes("@")) {
    error.innerHTML = "E-pasta adrese nav derīga!";
    return false;
  }

  alert("Forma veiksmīgi iesniegta!");
  return true;
}
</script>

