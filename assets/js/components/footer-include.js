// Incluye el footer modular en el placeholder
fetch("/components/footer.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("footer-placeholder").innerHTML = html;
  });
