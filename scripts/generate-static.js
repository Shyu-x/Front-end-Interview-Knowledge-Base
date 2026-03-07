const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const puppeteer = require('puppeteer');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    return `<pre class="code-block"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// 解析 markdown 中的标题生成目录
function generateToc(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  let idCounter = 0;

  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = 'heading-' + (idCounter++);
      headings.push({ level, text, id });
    }
  });

  return headings;
}

// 生成目录 HTML
function generateTocHtml(toc) {
  if (toc.length === 0) return '';

  let html = '<nav class="toc">\n<h2>目录</h2>\n<ul>\n';
  let currentLevel = 0;

  toc.forEach((item, index) => {
    if (item.level > currentLevel) {
      while (item.level > currentLevel) {
        html += '<ul>\n';
        currentLevel++;
      }
    } else if (item.level < currentLevel) {
      while (item.level < currentLevel) {
        html += '</ul>\n</li>\n';
        currentLevel--;
      }
    } else if (index > 0) {
      html += '</li>\n';
    }
    html += `<li><a href="#${item.id}">${item.text}</a>`;
  });

  while (currentLevel > 0) {
    html += '</li>\n</ul>\n';
    currentLevel--;
  }
  html += '</ul>\n</nav>\n';

  return html;
}

// 为标题添加 ID
function addHeadingIds(markdown) {
  let idCounter = 0;
  return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const id = 'heading-' + (idCounter++);
    return `${hashes} <a id="${id}" href="#${id}">${title}</a>`;
  });
}

// 生成完整的 HTML 文档
function generateHtml(title, content, toc) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.8; color: #333; background: #f5f5f5; padding: 40px 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; background: #fff; padding: 60px; box-shadow: 0 2px 20px rgba(0,0,0,0.1); border-radius: 8px; }
    h1 { font-size: 2.5em; color: #1a1a1a; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1890ff; }
    h2 { font-size: 1.8em; color: #1890ff; margin: 40px 0 20px; padding-top: 20px; }
    h3 { font-size: 1.4em; color: #52c41a; margin: 30px 0 15px; }
    h4, h5, h6 { font-size: 1.1em; color: #333; margin: 20px 0 10px; }
    p { margin: 15px 0; text-align: justify; }
    a { color: #1890ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .code-block { background: #f6f8fa; border-radius: 6px; padding: 16px; margin: 15px 0; overflow-x: auto; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.9em; border: 1px solid #e1e4e8; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.9em; }
    pre code { background: none; padding: 0; }
    ul, ol { margin: 15px 0 15px 30px; }
    li { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e1e4e8; padding: 12px; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
    tr:hover { background: #fafafa; }
    blockquote { border-left: 4px solid #1890ff; padding: 10px 20px; margin: 20px 0; background: #f6f8fa; color: #666; }
    hr { border: none; border-top: 1px solid #e1e4e8; margin: 30px 0; }
    .toc { background: #f6f8fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .toc h2 { font-size: 1.2em; margin-top: 0; padding-top: 0; color: #333; }
    .toc ul { margin: 10px 0 0 0; }
    .toc li { margin: 5px 0; list-style: none; }
    .toc a { color: #555; }
    .toc a:hover { color: #1890ff; }
    .page-break { page-break-before: always; }
    @media print { body { background: #fff; padding: 0; } .container { box-shadow: none; padding: 20px; } }
    img { max-width: 100%; height: auto; margin: 20px 0; }
    .header { position: sticky; top: 0; background: #fff; padding: 10px 0; border-bottom: 1px solid #eee; z-index: 100; }
    .breadcrumb { font-size: 0.9em; color: #666; }
    .volume-badge { display: inline-block; background: #1890ff; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="breadcrumb">
        <span class="volume-badge">前端面试知识大全</span>
        <a href="../目录.html">返回目录</a>
      </div>
    </div>
    <h1>${title}</h1>
    ${generateTocHtml(toc)}
    <div class="content">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

// 转换单个 markdown 文件
async function convertFile(inputPath, outputDir) {
  const markdown = fs.readFileSync(inputPath, 'utf-8');
  const fileName = path.basename(inputPath, '.md');
  const title = fileName;

  // 生成带 ID 的 markdown
  const markdownWithIds = addHeadingIds(markdown);

  // 生成目录
  const toc = generateToc(markdown);

  // 转换为 HTML
  const content = md.render(markdownWithIds);

  // 生成完整 HTML
  const html = generateHtml(title, content, toc);

  // 保存 HTML
  const outputPath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Generated: ${outputPath}`);

  return { outputPath, title };
}

// 使用 Puppeteer 生成 PDF
async function generatePdf(htmlPath, pdfPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; margin-left: 20px;">前端面试知识大全</div>',
    footerTemplate: '<div style="font-size: 10px; margin-right: 20px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' }
  });

  await browser.close();
  console.log(`✓ Generated PDF: ${pdfPath}`);
}

// 主函数
async function main() {
  // 优先处理书籍目录，如果没有书籍目录则处理前端面试题汇总
  const booksDir = path.join(__dirname, '书籍');
  const srcDir = fs.existsSync(booksDir) ? booksDir : path.join(__dirname, '前端面试题汇总');
  const outputDir = path.join(__dirname, 'dist', 'html');
  const pdfDir = path.join(__dirname, 'dist', 'pdf');

  // 创建输出目录
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

  // 查找所有 markdown 文件
  const mdFiles = [];
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.md') && !file.includes('README')) {
        mdFiles.push(fullPath);
      }
    });
  }

  console.log(`🔍 Scanning markdown files from: ${srcDir}`);
  walkDir(srcDir);

  console.log(`📄 Found ${mdFiles.length} markdown files\n`);

  // 转换所有文件
  const convertedFiles = [];
  for (const file of mdFiles) {
    try {
      const result = await convertFile(file, outputDir);
      convertedFiles.push(result);
    } catch (err) {
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }

  // 生成 PDF
  console.log('\n📑 Generating PDFs...');
  for (const file of convertedFiles) {
    try {
      const pdfPath = path.join(pdfDir, file.title + '.pdf');
      await generatePdf(file.outputPath, pdfPath);
    } catch (err) {
      console.error(`✗ Error generating PDF for ${file.title}:`, err.message);
    }
  }

  // 生成合并的 PDF
  console.log('\n📑 Generating combined PDF...');
  const combinedHtmlPath = path.join(outputDir, 'index.html');
  const allContent = convertedFiles.map(f => {
    const html = fs.readFileSync(f.outputPath, 'utf-8');
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/);
    return contentMatch ? contentMatch[1] : '';
  }).join('<div class="page-break"></div>');

  const combinedToc = [];
  convertedFiles.forEach(f => {
    combinedToc.push({ level: 1, text: f.title, id: 'file-' + f.title.replace(/\s+/g, '-') });
  });

  const combinedHtml = generateHtml('前端面试题库 - 完整版', allContent, combinedToc);
  fs.writeFileSync(combinedHtmlPath, combinedHtml, 'utf-8');

  const combinedPdfPath = path.join(pdfDir, '前端面试题库-完整版.pdf');
  await generatePdf(combinedHtmlPath, combinedPdfPath);

  console.log('\n✅ All done!');
  console.log(`📁 HTML files: ${outputDir}`);
  console.log(`📁 PDF files: ${pdfDir}`);
}

main().catch(console.error);
