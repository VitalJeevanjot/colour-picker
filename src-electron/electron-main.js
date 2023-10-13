import { app, BrowserWindow, desktopCapturer, ipcMain } from "electron";
import path from "path";
import os from "os";
import { event } from "quasar";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow, coloursPointerViewer;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    frame: false,
    width: 500,
    height: 450,
    minWidth: 500,
    minHeight: 450,
    useContentSize: true,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      // devTools: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });
  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function getStreams(event) {
  try {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });
    return sources.map((a) => a.id);
  } catch (err) {
    console.log(err);
    return [err.toString()];
  }
}

function manageEyeDropper(event, val) {
  if (val == true) {
    mainWindow.setFullScreen(true);
    mainWindow.setAlwaysOnTop(true);
  } else {
    mainWindow.setFullScreen(false);
    mainWindow.setAlwaysOnTop(false);
  }
}

function printLog(event, val) {
  console.log(val.toString());
}

function changeAppState(event, state) {
  if (state == "minimise") {
    mainWindow.minimize();
  } else if (state == "maximise") {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  } else if (state == "exit") {
    app.quit();
  }
}

function getAppMaximised() {
  return mainWindow.isMaximized();
}

app.whenReady().then(() => {
  ipcMain.handle("get:streams", getStreams);
  ipcMain.on("manage:eyedropperview", manageEyeDropper);
  ipcMain.on("log:print", printLog);
  ipcMain.on("modify:appState", changeAppState);
  ipcMain.handle("get:appSize", getAppMaximised);
  createWindow();
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
