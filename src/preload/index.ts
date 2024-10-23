import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义为渲染进程提供的API
const api = {
  /**
   * 打开文件系统对话框，选择目录并返回选择的路径
   */
  openFileDialog: async () => {
    try {
      const result = await ipcRenderer.invoke('dialog:openFile')
      return result
    } catch (error) {
      console.error('Error in openFileDialog:', error)
      return null
    }
  }
}

// 使用 `contextBridge` API 将 Electron API 暴露给渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (在 dts 文件中定义)
  window.electron = electronAPI
  // @ts-ignore (在 dts 文件中定义)
  window.api = api
}
