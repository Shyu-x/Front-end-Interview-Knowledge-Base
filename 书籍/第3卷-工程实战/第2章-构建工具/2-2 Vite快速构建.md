# Vite快速构建

> 本章节深入讲解Vite的核心原理、配置与实战应用。

---

## 第三部分：Vite 深度讲解

### 3.1 Vite 核心原理

#### 3.1.1 开发模式与生产构建

**开发模式（Serve）**
Vite 开发时使用原生 ES 模块，不需要打包：
- 启动开发服务器
- 按需加载模块，只处理当前需要的文件
- 利用浏览器原生 ES 模块支持
- HMR 基于 ESM，无需刷新页面

**生产构建（Build）**
生产环境使用 Rollup 进行优化打包：
- 预配置 Rollup 进行代码打包
- 支持代码分割、Tree Shaking
- 生成优化后的静态资源

#### 3.1.2 Vite 工作流程

```
开发阶段：
浏览器请求 → ESM 模块加载 → Vite 服务器处理 → 返回模块内容

生产构建阶段：
Vite 读取配置 → Rollup 打包 → 代码优化 → 输出静态文件
```

### 3.2 Vite 深入配置

```javascript
// vite.config.js 完整示例
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 项目根目录
  root: '.',

  // 公共基础路径
  base: '/',

  // 环境变量
  envPrefix: ['VITE_', 'APP_'],

  // 解析配置
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  // CSS 配置
  css: {
    // CSS Modules 配置
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    },
    // PostCSS 配置
    postcss: './postcss.config.js',
    // 预处理器选项
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // 开发服务器配置
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: {
      overlay: true
    }
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },

  // 依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },

  // ESBuild 配置
  esbuild: {
    drop: ['console', 'debugger']
  }
});
```

### 3.3 Vite 核心特性

#### 3.3.1 依赖预构建

Vite 会使用 esbuild 将依赖预构建为 ESM 模块：

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 需要预构建的依赖
    include: ['vue', 'vue-router', 'pinia', 'axios'],
    // 排除不需要预构建的依赖
    exclude: ['@vue/reactivity']
  }
});
```

#### 3.3.2 模块热替换

Vite 提供极速的 HMR：

```javascript
// Vite 自动处理 HMR
// 无需额外配置

// 手动处理 HMR
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('模块已更新');
  });
}
```

#### 3.3.3 资源处理

```javascript
// 图片导入
import imgUrl from './img.png';

// CSS 导入
import './style.css';

// URL 资源
new URL('./img.png', import.meta.url);
```

### 3.4 Vite 插件系统

#### 3.4.1 常用插件

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    autoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts'
    }),
    components({
      dts: 'src/components.d.ts'
    }),
    visualizer()
  ]
});
```

#### 3.4.2 自定义插件

```javascript
// my-plugin.js
export function myPlugin() {
  return {
    name: 'my-plugin',

    // 构建开始时调用
    buildStart() {
      console.log('构建开始');
    },

    // 解析 ID
    resolveId(source) {
      if (source.startsWith('@custom/')) {
        return source.replace('@custom/', '/src/custom/');
      }
      return null;
    },

    // 转换代码
    transform(code, id) {
      if (id.endsWith('.custom')) {
        return {
          code: code.replace(/__VERSION__/g, '1.0.0')
        };
      }
    },

    // 生成输出文件
    generateBundle(options, bundle) {
      // 添加额外文件
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify({ version: '1.0.0' })
      });
    }
  };
}

// 使用
import { myPlugin } from './my-plugin';

export default defineConfig({
  plugins: [myPlugin()]
});
```

### 3.5 Vite 性能优化

#### 3.5.1 构建优化

```javascript
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['lodash', 'axios', 'dayjs']
        }
      }
    },

    // 压缩配置
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    // CSS 代码分割
    cssCodeSplit: true,

    // 目标浏览器
    target: 'es2015'
  }
});
```

#### 3.5.2 开发优化

```javascript
export default defineConfig({
  server: {
    // 启用 gzip 压缩
    compress: true,

    // 端口
    port: 3000,

    // 严格端口
    strictPort: true,

    // 超时时间
    timeout: 60000,

    // 代理配置优化
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
        }
      }
    }
  },

  optimizeDeps: {
    // 预构建优化
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash'],
    // 缓存目录
    cacheDir: 'node_modules/.vite'
  }
});
```

### 3.6 Vite 与其他工具对比

| 特性 | Webpack | Vite | Rollup |
|------|---------|------|--------|
| 开发启动 | 全量打包 | 按需加载 | 不支持 |
| 热更新 | 重新打包 | 基于 ESM | 不支持 |
| 生产构建 | Webpack | Rollup | Rollup |
| 配置复杂度 | 高 | 低 | 中 |
| 生态 | 丰富 | 成长中 | 专注于库 |

### 3.7 实际项目配置示例

#### 3.7.1 Vue 3 + TypeScript 项目

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import vitePluginVueScriptSetup from 'unplugin-vue-script-setup/vite';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginVueScriptSetup()
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },

  build: {
    target: 'es2015',
    cssCodeSplit: true
  }
});
```

#### 3.7.2 React + TypeScript 项目

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],

  esbuild: {
    jsxInject: `import React from 'react'`
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['lodash', 'axios']
        }
      }
    }
  }
});
```

---

*本章节完*
