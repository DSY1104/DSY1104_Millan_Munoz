// Incluye el navbar y el footer modulares en about.html desde la raíz
fetch("/components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar-placeholder").innerHTML = html;
    const script = document.createElement("script");
    script.src = "/assets/js/components/navbar.js";
    document.body.appendChild(script);
  });
fetch("/components/footer.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("footer-placeholder").innerHTML = html;
  });
