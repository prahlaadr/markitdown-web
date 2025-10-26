# MarkItDown Web

A sleek web application to convert any file format to Markdown instantly. Built with FastAPI and deployed on Vercel.

## Features

- **Universal File Conversion**: Support for PDF, DOCX, XLSX, PPTX, images, audio, HTML, CSV, JSON, XML, ZIP, and more
- **Instant Processing**: Fast server-side conversion using Microsoft's MarkItDown library
- **Clean Interface**: Minimalist black & white design with drag-and-drop support
- **Multiple Views**: Preview rendered Markdown or view raw Markdown source
- **Easy Export**: Download converted Markdown files or copy to clipboard
- **Statistics**: Track character, word, and line counts

## Supported Formats

- **Documents**: PDF, Word (DOCX), PowerPoint (PPTX), Excel (XLSX, XLS), EPUB
- **Media**: Images (with EXIF and OCR), Audio (with transcription)
- **Web**: HTML, RSS, Wikipedia URLs, YouTube URLs
- **Data**: CSV, JSON, XML
- **Archives**: ZIP files (processes all contents)

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

- Maximum file size: 10MB (Vercel free tier limit)
- Processing timeout: 60 seconds
- Some advanced features (Azure Document Intelligence, LLM image captions) are not enabled by default

## License

MIT

## Credits

Powered by [Microsoft MarkItDown](https://github.com/microsoft/markitdown)
