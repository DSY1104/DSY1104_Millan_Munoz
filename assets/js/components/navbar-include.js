// Incluye el navbar modular en el placeholder
// Detecta la profundidad del directorio para ajustar rutas
function getNavbarPath() {
  const currentPath = window.location.pathname;
  
  // Count how many directories deep we are from the root
  const pathSegments = currentPath.split('/').filter(segment => segment !== '');
  
  // Remove the filename if it exists (ends with .html)
  if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.html')) {
    pathSegments.pop();
  }
  
  const depth = pathSegments.length;
  
  // Build relative path to components/navbar.html
  let navbarPath;
  if (depth === 0) {
    // Root directory
    navbarPath = "components/navbar.html";
  } else if (depth === 1) {
    // One level deep (e.g., /pages/)
    navbarPath = "../components/navbar.html";
  } else {
    // Two or more levels deep (e.g., /pages/user/)
    navbarPath = "../../components/navbar.html";
  }
  
  return navbarPath;
}

function getRelativePath(basePath, depth) {
  if (depth <= 1) {
    return basePath;
  } else if (depth === 2) {
    return basePath.startsWith("pages/")
      ? basePath.replace("pages/", "")
      : `../${basePath}`;
  } else {
    return basePath.startsWith("pages/")
      ? `../${basePath}`
      : `../../${basePath}`;
  }
}

fetch(getNavbarPath())
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch navbar: ${res.status} ${res.statusText}`);
    }
    return res.text();
  })
  .then((html) => {
    // Get directory depth for path adjustments
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    
    // Remove filename if present
    if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.html')) {
      pathSegments.pop();
    }
    
    const depth = pathSegments.length;

    // Adjust paths based on depth
    if (depth === 0) {
      // Root level - no changes needed
    } else if (depth === 1) {
      // One level deep (e.g., /pages/)
      html = html.replace(/href="index\.html"/g, 'href="../index.html"');
      html = html.replace(/src="assets\/image\/icon\/login\.svg"/g, 'src="../assets/image/icon/login.svg"');
    } else {
      // Two or more levels deep (e.g., /pages/user/)
      html = html.replace(/href="index\.html"/g, 'href="../../index.html"');
      html = html.replace(/href="pages\//g, 'href="../');
      html = html.replace(/href="profile\.html"/g, 'href="profile.html"');
      html = html.replace(/src="assets\/image\/icon\/login\.svg"/g, 'src="../../assets/image/icon/login.svg"');
    }

    document.getElementById("navbar-placeholder").innerHTML = html;

    // Load navbar JavaScript with correct path
    const script = document.createElement("script");
    let jsPath;
    if (depth === 0) {
      jsPath = "assets/js/components/navbar.js";
    } else if (depth === 1) {
      jsPath = "../assets/js/components/navbar.js";
    } else {
      jsPath = "../../assets/js/components/navbar.js";
    }
    
    script.src = jsPath;
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
