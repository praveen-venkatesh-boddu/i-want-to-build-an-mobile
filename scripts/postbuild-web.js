// Run after `expo export --platform web`: wires the PWA bits into dist/index.html.
const fs = require("fs");
const path = require("path");

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
