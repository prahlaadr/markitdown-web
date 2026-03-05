"""
MarkItDown Web - FastAPI application for file-to-markdown conversion
Author: Prahlad R (https://github.com/prahlaadr)
Powered by: Microsoft MarkItDown (https://github.com/microsoft/markitdown)
License: MIT
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from markitdown import MarkItDown
from pathlib import Path
from io import BytesIO

app = FastAPI(
    title="MarkItDown Web",
    description="Convert any file to Markdown",
    version="1.0.0"
)

# Setup paths
BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# Initialize MarkItDown converter
md_converter = MarkItDown(enable_plugins=False)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the main page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/convert")
async def convert_file(file: UploadFile = File(...)):
    """Convert uploaded file to Markdown"""

    # Read file content
    content = await file.read()
    size = len(content)

    # Vercel free tier body limit is 4.5MB
    MAX_SIZE = 4_500_000
    if size > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large (max 4.5MB)"
        )

    if size == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        # Get file extension (markitdown expects dot prefix e.g. ".pdf")
        file_extension = ""
        if '.' in file.filename:
            file_extension = "." + file.filename.rsplit('.', 1)[-1].lower()

        # Convert to markdown using MarkItDown
        file_stream = BytesIO(content)

        result = md_converter.convert_stream(
            file_stream,
            file_extension=file_extension
        )

        return JSONResponse({
            "success": True,
            "markdown": result.text_content,
            "fileName": file.filename
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "markitdown-web",
        "version": "1.0.0"
    }

# Required for Vercel
handler = app
