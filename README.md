# MarkItDown Web

A sleek web application to convert any file format to Markdown instantly. Built with FastAPI and deployed on Vercel.

🌐 **Live Demo**: [https://markitdown-web.vercel.app](https://markitdown-bskirbcz9-prahlaads-projects.vercel.app)

📦 **GitHub**: [https://github.com/prahlaadr/markitdown-web](https://github.com/prahlaadr/markitdown-web)

## Features

- **Universal File Conversion**: Support for PDF, DOCX, XLSX, PPTX, images, audio, HTML, CSV, JSON, XML, ZIP, and more
- **Instant Processing**: Fast server-side conversion using Microsoft's MarkItDown library
- **Clean Interface**: Minimalist black & white design with drag-and-drop support
- **Multiple Views**: Preview rendered Markdown or view raw Markdown source
- **Easy Export**: Download converted Markdown files or copy to clipboard
- **Statistics**: Track character, word, and line counts

## Supported Formats

Currently deployed with core document support:

- **Documents**: PDF, Word (DOCX), Excel (XLSX)
- **Web**: HTML
- **Data**: CSV, JSON, XML
- **Text**: Plain text, Markdown

The MarkItDown library supports additional formats (PowerPoint, Images with OCR, Audio transcription, YouTube URLs, EPub, ZIP archives) which can be enabled by adding the appropriate dependencies.

## Local Development

### Prerequisites

- Python 3.10 or higher
- pip or uv for package management

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd markitdown-web
```

2. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the development server:
```bash
uvicorn api.index:app --reload
```

5. Open your browser to `http://localhost:8000`

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

The app will be live at your Vercel URL.

## Usage

1. Drag and drop a file onto the upload area, or click to browse
2. Wait for the conversion to complete
3. View the Markdown in Preview or Raw mode
4. Download the .md file or copy to clipboard
5. Click "New File" to convert another file

## Technical Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Conversion Engine**: Microsoft MarkItDown
- **Deployment**: Vercel Serverless Functions
- **Styling**: Custom CSS with black & white theme

## Limitations

- Maximum file size: 4.5MB (Vercel free tier body size limit)
- Maximum deployment size: 250MB unzipped (optimized to stay within limit)
- Processing timeout: 10 seconds (Vercel free tier)
- Some advanced features require additional dependencies:
  - PowerPoint (PPTX) support
  - Image OCR capabilities
  - Audio transcription
  - YouTube URL processing
  - Azure Document Intelligence integration
  - LLM-powered image captions

To enable additional formats, add the corresponding dependencies to `requirements.txt` and ensure the total package size remains under 250MB.

## License

MIT

## Credits

Powered by [Microsoft MarkItDown](https://github.com/microsoft/markitdown)
