// Incluye el hero modular en el placeholder
fetch("components/hero.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("hero-placeholder").innerHTML = html;
  });
