// Incluye el navbar modular en el placeholder
fetch("/components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    // Get directory depth for path adjustments
    const currentPath = window.location.pathname;
    const pathSegments = currentPath
      .split("/")
      .filter((segment) => segment !== "");

    // Remove filename if present
    if (
      pathSegments.length > 0 &&
      pathSegments[pathSegments.length - 1].includes(".html")
    ) {
      pathSegments.pop();
    }

    const depth = pathSegments.length;

    // Adjust paths based on depth
    if (depth === 0) {
      // Root level - no changes needed
    } else if (depth === 1) {
      // One level deep (e.g., /pages/)
      html = html.replace(/href="index\.html"/g, 'href="../index.html"');
      html = html.replace(
        /src="assets\/image\/icon\/login\.svg"/g,
        'src="../assets/image/icon/login.svg"'
      );
    } else {
      // Two or more levels deep (e.g., /pages/user/)
      html = html.replace(/href="index\.html"/g, 'href="../../index.html"');
      html = html.replace(/href="pages\//g, 'href="../');
      html = html.replace(/href="profile\.html"/g, 'href="profile.html"');
      html = html.replace(
        /src="assets\/image\/icon\/login\.svg"/g,
        'src="../../assets/image/icon/login.svg"'
      );
    }

    document.getElementById("navbar-placeholder").innerHTML = html;

    // Load navbar JavaScript with correct path
    const script = document.createElement("script");
    script.src = "/assets/js/components/navbar.js";
    document.body.appendChild(script);
  })
  .catch((error) => {
    console.error("Error loading navbar:", error);
    // Fallback navbar content
    document.getElementById("navbar-placeholder").innerHTML = `
      <nav class="navbar">
        <div class="navbar-container">
          <a href="../../index.html" class="navbar-brand">LevelUp</a>
          <p style="color: white;">Error loading navigation</p>
        </div>
      </nav>
    `;
  });
