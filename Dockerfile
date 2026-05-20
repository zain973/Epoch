# --- Stage 1: Build dependencies ---
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies required for compiling certain Python packages (e.g., psycopg2 if not using binary)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies to a local user directory
RUN pip install --no-cache-dir --user -r requirements.txt

# --- Stage 2: Final lightweight runtime ---
FROM python:3.11-slim AS runner

WORKDIR /app

# Install runtime dependencies for PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-privileged user for security
RUN useradd -u 888 appuser && chown -R appuser:appuser /app
USER appuser

# Copy installed dependencies and project files
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . .

# Ensure the local pip binaries are in the PATH
ENV PATH=/home/appuser/.local/bin:$PATH

EXPOSE 8000

# Production command: Multiple workers to handle the heavy concurrent timeline reads
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
