# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# backend ディレクトリ内の requirements.txt をコピー
COPY backend/requirements.txt ./requirements.txt

# パッケージのインストール
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# backend ディレクトリ内の全ソースコードをコピー
COPY backend/ ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
