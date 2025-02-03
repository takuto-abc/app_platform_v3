# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json と package-lock.json (または yarn.lock) をコピーして依存関係をインストール
COPY frontend/package*.json ./
RUN npm install

# フロントエンドのコード全体をコピー
COPY frontend/ ./

# Next.js のデフォルトポート（例: 3000）を公開
EXPOSE 3000

# 開発サーバーの起動
CMD ["npm", "run", "dev"]
