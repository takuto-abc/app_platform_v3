# app_platform_v3

source .venv/bin/activate

docker-compose up --build

最新版でインストール
pip install --upgrade -r requirements.txt

開発サーバー起動
cd backend 
uvicorn app.main:app --reload

cd frontend
npm run dev