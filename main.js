const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let window;

function createWindow() {

    const { width, height } =
        screen.getPrimaryDisplay().workAreaSize;

    window = new BrowserWindow({
        width: 450,
        height: 220,

        x: width - 450 - 20,
        y: 100,

        frame: false,
        transparent: true,
        resizable: false,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    window.loadFile("index.html");
}

ipcMain.on("close-widget", () => {
    if (window) {
        window.close();
    }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});