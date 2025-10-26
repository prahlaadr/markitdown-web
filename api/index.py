"""
MarkItDown Web - FastAPI application for file-to-markdown conversion
Author: Prahlad R (https://github.com/prahlaadr)
Powered by: Microsoft MarkItDown (https://github.com/microsoft/markitdown)
License: MIT
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from markitdown import MarkItDown
import os
from pathlib import Path
from io import BytesIO
import tempfile

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

    # Check file size (10MB limit for free tier, adjust as needed)
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    if size > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large (max {MAX_SIZE // 1024 // 1024}MB)"
        )

    if size == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        # Get file extension
        file_extension = ""
        if '.' in file.filename:
            file_extension = file.filename.split('.')[-1].lower()

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
