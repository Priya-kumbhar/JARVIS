// Electron main process — CommonJS (must stay CJS, Electron requires it)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 720,
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
