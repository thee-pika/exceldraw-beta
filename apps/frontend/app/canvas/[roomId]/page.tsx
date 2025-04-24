"use client";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.strokeStyle = "rgba(255, 255, 255)";
      let startX = 0;
      let startY = 0;
      let clicked = false;

      canvas.addEventListener("mousedown", (e) => {
        clicked = true;

        startX = e.clientX;
        startY = e.clientY;
      });

      canvas.addEventListener("mouseup", (e) => {
        clicked = false;

        console.log("mouseup", e.clientX);
        console.log("mouseup ", e.clientY);
      });

      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          console.log("moved");

          const width = e.clientX - startX;
          const height = e.clientY - startY;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "rgba(0, 0, 0)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "rgba(255, 255, 255)";
          ctx.strokeRect(startX, startY, width, height);
        }
      });
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas width={2000} height={1000} ref={canvasRef} />
    </div>
  );
}
