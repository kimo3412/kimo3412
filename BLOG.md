# 博客使用指南

> 本仓库 `blog/` 目录的维护文档。新增 / 修改 / 删除博客都看这份。

---

## 📁 目录结构

```
blog/
├── index.html               ← 博客列表
├── hello-world.html         ← 示例文章
├── website-iterations.html
└── design-rambles.html
```

文章 = 单独的 HTML 文件，跟主页共用 `css/style.css` 和 `js/main.js`。

---

## ✍️ 添加新文章

### 步骤 1：复制模板

```bash
cp blog/hello-world.html blog/你的-slug.html
```

文件名用英文 slug（如 `my-first-post.html`），不用日期，方便 SEO。中文标题不挡事，文件名干净就行。

### 步骤 2：修改 4 个地方

打开新文件，改：

```html
<title>你的文章标题 | GIRIMI Blog</title>

<p class="text-sm text-primary-500 font-semibold mb-4 font-mono">2026-XX-XX</p>

<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
    你的文章标题
</h1>

<!-- 正文写在 <div class="blog-post-content"> 里 -->
```

外加 `<meta name="description">` 和 og: 描述写一句中文摘要，搜索结果会显示。

### 步骤 3：加到列表

打开 `blog/index.html`，复制最新一张 `<a class="...Post Card...">` 卡片，改：

- `href` 指向新文件
- 日期
- 标题 h2
- 摘要 p
- `transition-delay: 0.Ns`（按 0.05s 递增）

模板：

```html
<!-- Post Card N -->
<a href="新文章-slug.html"
    class="magnetic reveal block glass-panel rounded-3xl p-8 hover:shadow-xl hover:shadow-pink-500/5 transition-all group" data-tilt
    style="transition-delay: 0.Ns;">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <p class="text-xs text-slate-400 mb-2 font-mono">2026-XX-XX</p>
            <h2 class="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                文章标题
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                一句话摘要...
            </p>
        </div>
        <div class="flex items-center gap-2 text-primary-500 font-semibold text-sm shrink-0">
            阅读 <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
        </div>
    </div>
</a>
```

> `data-tilt` 让卡片有 3D 倾斜 hover 效果；`reveal` 是滚动入场淡入。

### 步骤 4：同步到 README

打开 `README.md`，在 "Recent Blog Posts" 段加一行：

```markdown
- [文章标题](blog/文章-slug.html) · 2026-XX-XX · 一句话简介
```

---

## 🖼️ 添加图片

把图片放进 `assets/images/`，在文章里用相对路径：

```html
<!-- 基础图片 -->
<img src="../assets/images/你的图.jpg" alt="描述" class="rounded-2xl my-8 w-full">

<!-- 带说明 -->
<figure class="my-8">
    <img src="../assets/images/你的图.jpg" alt="描述" class="rounded-2xl w-full">
    <figcaption class="text-center text-sm text-slate-400 mt-3">图片说明</figcaption>
</figure>
```

> 文章在 `blog/` 子目录，所以路径前要加 `../`。

---

## 🗑️ 删除文章

1. 删 `blog/xxx.html`
2. 删 `blog/index.html` 列表里对应的 `<a>` 卡片
3. 如果有图，删 `assets/images/xxx.*`
4. README "Recent Blog Posts" 段也删掉对应一行

---

## ✏️ 修改现有文章

直接编辑 `blog/xxx.html`，改完 push 即可。

---

## 🎨 写作样式

文章正文写在 `<div class="blog-post-content">` 里，CSS 在 `css/style.css` 约 165 行。继承样式：

- `h2` 标题 — 加粗 + 上下 margin
- `p` 段落 — 行高 1.8，段间距 1.25rem
- `code` 行内代码 — 粉色背景小框
- `img` 图片 — 你自己加 `rounded-2xl my-8 w-full` 等 class

支持的标签：`<p>` `<h2>` `<h3>` `<strong>` `<em>` `<code>` `<ul>` `<ol>` `<li>` `<a>` `<img>` `<figure>` `<figcaption>` `<blockquote>` 都行。

---

## 🎬 给文章加动效

复用主页的动效（自动生效）：

- `class="reveal"` — 滚动到时淡入
- `data-tilt` — hover 3D 倾斜
- `<h1 data-scramble>` — 标题字符乱码进场
- `<span data-roles data-roles-list='["词1","词2"]'>默认词</span>` — 文字轮换

写法跟主页一样，直接套 class 或属性即可。

---

## 🚀 部署

文章改完：

```bash
git add .
git commit -m "新增博客：xxx"
git push
```

Cloudflare Pages 监听 `main` 分支推送，自动部署。1-2 分钟线上生效。

---

## ❓ 常见问题

**Q: 文章发布日期能晚于当前吗？**
A: 可以。文章按 `blog/index.html` 列表里的 `transition-delay` 顺序展示，跟日期关系不大。

**Q: 文章里能用 Tailwind 任意 class 吗？**
A: 可以。CDN 模式下 Tailwind JIT 在浏览器里编译任何 class，跟主页用同一份。

**Q: 图片放在 `assets/` 还是 `assets/images/`？**
A: 统一放 `assets/images/`。这是主页和博客共用的图片目录。

**Q: 想给文章加封面图（列表卡片上显示）？**
A: 当前 `blog/index.html` 列表卡片没显示封面。要加的话改卡片结构——在 `<a>` 内部加个 `<img>` 或 `<div class="aspect-video bg-...">`。
