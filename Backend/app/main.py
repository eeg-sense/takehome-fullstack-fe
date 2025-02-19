from fastapi import FastAPI
from app.api.websocket_handler import router as websocket_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

app.include_router(websocket_router)
print(app.routes)