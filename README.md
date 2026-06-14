# 卓畅作品集 / ZHUO Chang Portfolio

一个个人作品集页面，方向为「极简蓝色社科编辑风 + 液态浅蓝背景 + 项目档案浏览」。当前入口为 `index.html`，背景动效使用本地 Vite + React + Three.js 组件实现，不依赖 CDN 或在线字体。

## 本地打开

首次运行先安装依赖：

```bash
npm install
```

开发预览：

```bash
npm run dev
```

然后访问 Vite 输出的本地地址，通常是：

```text
http://127.0.0.1:5173/
```

背景动效测试页：

```text
http://127.0.0.1:5173/colorbends-test.html
http://127.0.0.1:5173/liquid-test.html
```

## 文件结构

```text
index.html              主入口页面
styles.css              页面视觉、响应式布局和动效
script.js               项目数据、PDF 页面图片浏览、放大预览和交互逻辑
vite.config.js          Vite 多页面构建配置
src/portfolio-background.jsx
                        主站 ColorBends 背景挂载入口
src/components/ColorBends.jsx
                        Three.js shader 背景组件
src/components/ColorBends.css
                        ColorBends 容器样式
colorbends-test.html    ColorBends 背景验证页
liquid-test.html        LiquidEther 背景验证页
assets/images/          PDF 页面导出的 JPG 图片
assets/pdf/             原始 PDF 文件，仅作为本地素材留存，前台不提供下载入口
demo-a.html             早期首页方向 A demo
demo-b.html             早期首页方向 B demo
demo-b-old.html         旧版 B 方案备份
design-previews/        早期设计预览图
```

## 修改项目内容

项目标题、简介、标签、左侧展签文案、外链和页面数量都在 `script.js` 的 `projects` 数组中维护。

替换页面图片时，建议继续使用当前命名方式：

```text
assets/images/portfolio-02.jpg
assets/images/research-01.jpg
assets/images/game-culture-01.jpg
```

如果某个项目需要排除部分页面，不用删除图片文件，只需要在对应项目里设置 `pageNumbers`。例如当前「内容落地」只展示原 PDF 的 02、03、06、07、08、09、10、11 页。

作品外链只在对应项目的 `links` 字段中维护，不放在首页。

## GitHub Pages 部署

1. 将项目推送到 GitHub 仓库。
2. 在本地运行 `npm run build`，确认构建通过。
3. GitHub Pages 推荐使用 Actions 部署 Vite 构建产物。
4. 构建命令为 `npm run build`，发布目录为 `dist`。

## Netlify 部署

Netlify 推荐设置：

```text
Build command: npm run build
Publish directory: dist
```

部署步骤：

1. 在 Netlify 选择 `Add new site` -> `Import an existing project`。
2. 连接 GitHub 仓库。
3. Build command 填 `npm run build`。
4. Publish directory 填 `dist`。
5. 点击 Deploy。

## 上线前检查

- `index.html` 是主入口。
- CSS、JS 和图片均使用项目内路径，不引用 `file:///`。
- 前台没有 PDF 下载或打开原 PDF 的按钮。
- 背景动效依赖本地安装的 `three`、`react`、`react-dom` 和 Vite 构建，不依赖 CDN。
- `colorbends-test.html` 用于验证最终推荐背景，`liquid-test.html` 作为 LiquidEther 备选验证页。
- 图片总量较大时优先保证 PDF 页面可读性，再考虑后续按需压缩。
