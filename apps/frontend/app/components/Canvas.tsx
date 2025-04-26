"use client";
import { Circle, Minus, RectangleHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { config } from "dotenv";
import IconButton from "./IconButton";
import { Game } from "../draw/Game";
config();

export type Tool = "circle" | "rect" | "line";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [game, setGame] = useState<Game>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    game?.setTool(selectedTool);

  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
   
      const canvas = canvasRef.current;
      const g = new Game(canvas,socket ,roomId,selectedTool)
      setGame(g);
      console.log("selectedTool in selected place ", selectedTool);
      // initDraw(canvas, roomId, socket, selectedTool);
      return () => {
        g.destroy();
      }
    }
  }, [canvasRef, selectedTool]);

  return (
    <div className="bg-black h-[100vh]">
      <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef} />
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
};

const TopBar = ({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) => {
  return (
    <div className="fixed top-10 left-10 flex">
      <IconButton
        activated={selectedTool === "circle"}
        icon={<Circle />}
        onClick={() => setSelectedTool("circle")} 
      />
      <IconButton
        activated={selectedTool === "rect"}
        icon={<RectangleHorizontal />}
        onClick={() => setSelectedTool("rect")} 
      />
      <IconButton
        activated={selectedTool === "line"}
        icon={<Minus />}
        onClick={() => setSelectedTool("line")} 
      />
    </div>
  );
};

export default Canvas;
