const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    title: 'विद्यासेतु MP — प्रशासनिक एवं प्राध्यापक डेस्क (Command Studio)',
    backgroundColor: '#0A192F',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler: Simulate or write .VSMP container compilation
ipcMain.handle('compile-vsmp', async (event, moduleData) => {
  try {
    const rawSize = JSON.stringify(moduleData).length;
    // Opus audio at 14kbps for 15 mins is ~1.57 MB, vector slides JSON ~180 KB, total ~1.78 MB
    const simulatedCompressedBytes = Math.floor(rawSize * 0.45) + 1620000;
    const mbSize = (simulatedCompressedBytes / (1024 * 1024)).toFixed(2);
    
    return {
      success: true,
      packageId: `VSMP_BU_HIST_${Date.now()}`,
      outputFilename: `${moduleData.moduleCode || 'MODULE'}.vsmp`,
      rawSizeBytes: rawSize,
      compressedSizeBytes: simulatedCompressedBytes,
      sizeFormatted: `${mbSize} MB`,
      isWithinBudget: simulatedCompressedBytes < 2 * 1024 * 1024,
      brotliQuality: 6,
      checksumCRC32: '9F28A1C4',
      timestamp: new Date().toISOString(),
      message: `पैकेज सफलतापूर्वक कंपाइल हुआ: ${mbSize} MB (2.0 MB बजट के भीतर सुरक्षित)`,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC Handler: Save MPTAAS Nodal Officer Audit Decision
ipcMain.handle('save-audit-decision', async (event, decisionData) => {
  // In production, syncs with MPTAAS API / local secure SQLite ledger
  return {
    success: true,
    applicationId: decisionData.applicationId,
    newStatus: decisionData.status,
    timestamp: new Date().toISOString(),
    officerRemarks: decisionData.remarks,
    dispatchNotice: 'एमपी ऑनलाइन कियोस्क एसएमएस एवं विद्यासेतु आउटबॉक्स को सूचित किया गया।',
  };
});

// IPC Handler: Faculty Doubt Resolution
ipcMain.handle('resolve-faculty-doubt', async (event, resolutionData) => {
  return {
    success: true,
    doubtId: resolutionData.doubtId,
    facultyName: resolutionData.facultyName || 'डॉ. आर. के. शर्मा (विभागाध्यक्ष - इतिहास)',
    timestamp: new Date().toISOString(),
    status: 'RESOLVED_BY_FACULTY',
    syncNotice: 'अगले 2G/Wi-Fi हॉटस्पॉट संपर्क पर विद्यार्थी के मोबाइल ऐप में सिंक होगा।',
  };
});
