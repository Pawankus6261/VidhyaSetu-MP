const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  compileVsmp: (moduleData) => ipcRenderer.invoke('compile-vsmp', moduleData),
  saveAuditDecision: (decisionData) => ipcRenderer.invoke('save-audit-decision', decisionData),
  resolveFacultyDoubt: (resolutionData) => ipcRenderer.invoke('resolve-faculty-doubt', resolutionData),
});
