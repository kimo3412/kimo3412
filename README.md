# GIRIMI 静态站点使用教程

本教程将教你如何管理和更新你的个人网站。

---

## 📁 站点结构

```
kimo3412/
├── index.html          ← 首页
├── links.html          ← 社交链接页
├── 404.html            ← 错误页面
├── css/style.css       ← 共享样式
├── js/main.js          ← 共享脚本
├── projects/           ← 项目详情
│   └── portfolio-2024.html
└── blog/               ← 博客
    ├── index.html      ← 博客列表
    └── hello-world.html
```

---

## 🔗 如何添加新链接

打开 `links.html`，找到 `<!-- ===== 实用工具区域 ===== -->` 注释，复制以下代码：

```html
<a href="你的链接" target="_blank"
    class="link-card reveal glass-panel block w-full p-5 rounded-2xl text-center font-semibold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
    style="transition-delay: 0.45s;">
    <i data-lucide="globe" class="w-5 h-5 text-blue-500"></i>
    <span>链接名称</span>
</a>
```

### 常用图标

| 图标名 | 用途 |
|--------|------|
| `globe` | 网站 |
| `github` | GitHub |
| `youtube` | YouTube |
| `twitter` | Twitter/X |
| `instagram` | Instagram |
| `music` | 音乐 |
| `bot` | AI工具 |
| `wrench` | 工具 |
| `book-open` | 博客/文档 |

**完整图标**: https://lucide.dev/icons

---

## 📝 如何添加博客文章

### 步骤 1: 创建文章文件

复制 `blog/hello-world.html`，重命名为 `blog/新文章名.html`

### 步骤 2: 修改文章内容

打开新文件，修改以下部分：

```html
<!-- 修改标题 -->
<title>文章标题 | GIRIMI Blog</title>

<!-- 修改日期 -->
<p class="text-sm text-primary-500 font-semibold mb-4 font-mono">2025-01-07</p>

<!-- 修改大标题 -->
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
    文章标题
</h1>

<!-- 修改正文 (在 blog-post-content div 内) -->
<p>你的文章内容...</p>
```

### 步骤 3: 添加到博客列表

打开 `blog/index.html`，在文章列表中添加：

```html
<a href="新文章名.html" class="reveal block glass-panel rounded-3xl p-8 hover:shadow-xl transition-all group">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <p class="text-xs text-slate-400 mb-2 font-mono">2025-01-07</p>
            <h2 class="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                文章标题
            </h2>
            <p class="text-slate-500 text-sm line-clamp-2">
                文章摘要...
            </p>
        </div>
        <div class="flex items-center gap-2 text-primary-500 font-semibold text-sm shrink-0">
            阅读 <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </div>
    </div>
</a>
```

---

## 🎨 如何添加新项目

### 步骤 1: 创建项目文件

复制 `projects/portfolio-2024.html`，重命名为 `projects/新项目名.html`

### 步骤 2: 修改项目内容

修改标题、描述、技术栈标签等。

### 步骤 3: 在首页添加项目卡片

打开 `index.html`，找到项目区域，添加新的项目卡片。

---

## 🚀 部署到 Cloudflare

1. 将所有文件推送到 GitHub:
   ```bash
   git add .
   git commit -m "更新网站"
   git push
   ```

2. Cloudflare Pages 会自动检测并部署更新

---

## 🎨 自定义颜色

编辑 `css/style.css` 中的颜色值：

- 主色调: `#ec4899` (粉色)
- 深色模式背景: `#09090b`
- 浅色模式背景: `#FAFAFA`

---

## ❓ 常见问题

**Q: 图标不显示？**  
A: 确保使用了正确的 Lucide 图标名，参考 https://lucide.dev/icons

**Q: 样式不生效？**  
A: 检查是否正确引用了 `css/style.css`

**Q: 如何修改深色模式？**  
A: 在 CSS 中添加 `.dark` 前缀，如 `.dark .text-gradient`
