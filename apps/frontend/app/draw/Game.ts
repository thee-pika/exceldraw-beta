import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export class Game {
  private socket: WebSocket;
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private SelectedTool: Tool = "circle";

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    roomId: string,
    SelectedTool: Tool
  ) {
    this.canvas = canvas;
    this.socket = socket;
    this.roomId = roomId;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.clicked = false;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
    this.SelectedTool = SelectedTool;
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
  }

  setTool(tool: Tool) {
    this.SelectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
  }

  mouseDownHandler = (e: any) => {
    this.clicked = true;

    this.startX = e.clientX;
    this.startY = e.clientY;
  };

  mouseUpHandler = (e: any) => {
    this.clicked = false;
    const width = Math.abs(e.clientX - this.startX);
    const height = Math.abs(e.clientY - this.startY);

    let shape: Shape | null = null;

    const selectedTool = this.SelectedTool;
    console.log("selectedTool", selectedTool);

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
      console.log("shape shape ", shape);
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      const centerX = Math.min(this.startX, e.clientX) + radius;
      const centerY = Math.min(this.startY, e.clientY) + radius;
      shape = {
        type: "circle",
        centerX,
        centerY,
        radius,
      };

      console.log("shape shape ", shape);
    }

    if (!shape) {
      console.log("no shape found!!");
      return;
    }

    this.existingShapes.push(shape);
    console.log("after existingShapes ", this.existingShapes);
    console.log("shape", shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: Number(this.roomId),
      })
    );

    this.clearCanvas();
  };

  mouseMoveHandler = (e: any) => {
    if (this.clicked) {
      const width = Math.abs(e.clientX - this.startX);
      const height = Math.abs(e.clientY - this.startY);

      this.clearCanvas();

      this.ctx.strokeStyle = "rgba(255, 255, 255)";

      const selectedTool = this.SelectedTool;

      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else {
        const radius = Math.max(width, height) / 2;
        const centerX = Math.min(this.startX, e.clientX) + radius;
        const centerY = Math.min(this.startY, e.clientY) + radius;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape: Shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }
}
