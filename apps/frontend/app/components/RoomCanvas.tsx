"use client"
import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const WS_Url = process.env.NEXT_PUBLIC_WS_URL;
    if (!WS_Url) {
      return;
    }
    const ws = new WebSocket(
      `${WS_Url}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMzFhYThjYS00ZjUwLTQ2MWItYTBmMy1hMWUwYTUzYzEyMWYiLCJpYXQiOjE3NDU1ODYzMDZ9.fNcsng1k2MZcqkB0Q6-cwCB7ooinjKEBd2tdJkTWfWY`
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room"
      }))
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server ....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
};

export default RoomCanvas;
