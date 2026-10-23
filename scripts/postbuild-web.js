// Run after `expo export --platform web`: wires the PWA bits into dist/index.html.
const fs = require("fs");
const path = require("path");

// Cloudflare Pages silently drops any folder named node_modules, and Expo puts the
// bundled fonts in dist/assets/node_modules. Rename it and fix every reference.
const assets = path.join(__dirname, "..", "dist", "assets");
const from = path.join(assets, "node_modules");
if (fs.existsSync(from)) {
  fs.renameSync(from, path.join(assets, "vendor"));
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  let n = 0;
  for (const f of walk(path.join(__dirname, "..", "dist"))) {
    if (!/\.(js|html|css|json)$/.test(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    if (t.includes("assets/node_modules/")) {
      fs.writeFileSync(f, t.split("assets/node_modules/").join("assets/vendor/"));
      n++;
    }
  }
  console.log("Renamed assets/node_modules -> assets/vendor, rewrote " + n + " file(s)");
}

const file = path.join(__dirname, "..", "dist", "index.html");
let html = fs.readFileSync(file, "utf8");

const head = `
<link rel="manifest" href="./manifest.webmanifest" crossorigin="use-credentials">
<link rel="apple-touch-icon" href="./icons/icon-180.png">
<meta name="theme-color" content="#161826">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Pantry">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<style>html,body{background:#161826;overscroll-behavior:none}</style>
<script>if("serviceWorker"in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js").catch(function(){})})}</script>
`;

// viewport-fit=cover lets the app draw under the iPhone notch/home bar (safe-area insets then work).
html = html.replace(/<meta name="viewport"[^>]*>/i, '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">');
html = html.replace("</head>", head + "</head>");
fs.writeFileSync(file, html);
console.log("PWA tags injected into dist/index.html");
