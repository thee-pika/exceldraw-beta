"use client";
import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";
import { config } from "dotenv";
config();

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div className="bg-black">
      <canvas width={2000} height={1000} ref={canvasRef} />
    </div>
  );
};

export default Canvas;
