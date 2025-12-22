# Use official Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (gcc needed for some packages)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download BERT model to reduce cold start time
RUN python -c "from transformers import AutoTokenizer, TFBertForMaskedLM; \
    AutoTokenizer.from_pretrained('bert-base-uncased'); \
    TFBertForMaskedLM.from_pretrained('bert-base-uncased')"

# Copy application code
COPY . .

# Expose port (Azure will use this)
EXPOSE 8000

# Run the application with uvicorn (NOT Lambda handler!)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
