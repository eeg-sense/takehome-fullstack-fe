from fastapi import APIRouter, WebSocket
import asyncio
import json
import random
import time

router = APIRouter()
active_connections = set()
sending_task = None

async def send_data():
    global sending_task

    last_sent_timestamp = None

    while active_connections:
        timestamp = int(time.time())
        if timestamp != last_sent_timestamp:
            last_sent_timestamp = timestamp
            sample = [random.uniform(0, 20) for _ in range(10)]
            data = {"timestamp": timestamp, "values": sample}

            for connection in list(active_connections):
                try:
                    await connection.send_text(json.dumps(data))
                except Exception:
                    active_connections.remove(connection)

        await asyncio.sleep(0.1)
    sending_task = None

@router.websocket("/ws")
async def websocket_handler(websocket: WebSocket):
    global sending_task

    await websocket.accept()
    active_connections.add(websocket)

    if sending_task is None:
        sending_task = asyncio.create_task(send_data())

    try:
        while True:
            await websocket.receive_text()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        active_connections.remove(websocket)

        if not active_connections and sending_task:
            sending_task.cancel()
            sending_task = None
