const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const output = document.getElementById('output');
const fileName = document.getElementById('fileName');
const previewTab = document.getElementById('previewTab');
const rawTab = document.getElementById('rawTab');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newFileBtn = document.getElementById('newFileBtn');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');

let currentMarkdown = '';
let currentFileName = '';
let viewMode = 'preview';

// Drag and drop handlers
dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

async function handleFile(file) {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`File too large! Maximum size is ${maxSize / 1024 / 1024}MB.`);
        return;
    }

    // Show loading state
    dropzone.style.display = 'none';
    result.style.display = 'none';
    loading.style.display = 'block';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            currentMarkdown = data.markdown;
            currentFileName = data.fileName;
            fileName.textContent = data.fileName;

            updateStats();
            renderOutput();

            loading.style.display = 'none';
            result.style.display = 'block';
        } else {
            throw new Error(data.error || 'Conversion failed');
        }
    } catch (err) {
        alert('Error: ' + err.message);
        loading.style.display = 'none';
        dropzone.style.display = 'block';
    }
}

function updateStats() {
    const chars = currentMarkdown.length;
    const words = currentMarkdown.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = currentMarkdown.split('\n').length;

    charCount.textContent = `Characters: ${chars.toLocaleString()}`;
    wordCount.textContent = `Words: ${words.toLocaleString()}`;
    lineCount.textContent = `Lines: ${lines.toLocaleString()}`;
}

function renderOutput() {
    if (viewMode === 'preview') {
        output.innerHTML = `<div class="markdown-preview">${markdownToHtml(currentMarkdown)}</div>`;
    } else {
        output.innerHTML = `<pre class="markdown-raw">${escapeHtml(currentMarkdown)}</pre>`;
    }
}

function markdownToHtml(markdown) {
    // Basic markdown rendering (enhanced version)
    let html = markdown;

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    return html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Tab switching
previewTab.addEventListener('click', () => {
    viewMode = 'preview';
    previewTab.classList.add('active');
    rawTab.classList.remove('active');
    renderOutput();
});

rawTab.addEventListener('click', () => {
    viewMode = 'raw';
    rawTab.classList.add('active');
    previewTab.classList.remove('active');
    renderOutput();
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(currentMarkdown);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Copied!
        `;
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        alert('Failed to copy to clipboard');
    }
});

// Download markdown
downloadBtn.addEventListener('click', () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Remove extension from original filename and add .md
    const baseFileName = currentFileName.replace(/\.[^/.]+$/, '');
    a.download = `${baseFileName}.md`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// New file button
newFileBtn.addEventListener('click', () => {
    result.style.display = 'none';
    dropzone.style.display = 'block';
    fileInput.value = '';
    currentMarkdown = '';
    currentFileName = '';
});
