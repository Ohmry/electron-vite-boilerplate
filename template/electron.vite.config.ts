import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': path.resolve(__dirname, 'src/main'),
        '@core': path.resolve(__dirname, 'src/core')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@core': path.resolve(__dirname, 'src/core')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': path.resolve(__dirname, 'src/renderer/src'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@css': path.resolve(__dirname, 'src/renderer/assets/css')
      }
    }
  }
})
