// Incluye el navbar modular en el placeholder
fetch("components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar-placeholder").innerHTML = html;
    // Inicializa el JS del navbar después de insertar el HTML
    const script = document.createElement("script");
    script.src = "assets/js/components/navbar.js";
    document.body.appendChild(script);
  });
