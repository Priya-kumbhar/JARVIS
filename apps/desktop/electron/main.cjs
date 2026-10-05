// Electron main process — CommonJS (must stay CJS, Electron requires it)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app, BrowserWindow } = require("electron");
const path = require("path");

// Enable WebGL before the app is ready — required for Live2D + Pixi.js
// Without these, gl.getParameter() returns 0 inside the GPU sandbox
app.commandLine.appendSwitch("enable-webgl");
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("disable-gpu-sandbox");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 900,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
