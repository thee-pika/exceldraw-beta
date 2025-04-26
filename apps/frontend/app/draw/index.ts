import axios from "axios";

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
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export const initDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  selectedTool: string
) => {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, ctx, canvas);
    }
  };

  clearCanvas(existingShapes, ctx, canvas);

  let startX = 0;
  let startY = 0;
  let clicked = false;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    console.log("selectedTool selectedTool:", selectedTool);

    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;

    clicked = false;
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);

    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      const centerX = Math.min(startX, e.clientX) + radius;
      const centerY = Math.min(startY, e.clientY) + radius;

      shape = {
        type: "circle",
        centerX,
        centerY,
        radius,
      };
    } else if (selectedTool === "line") {
      // const radius = Math.max(width, height) / 2;
      // const centerX = Math.min(startX, e.clientX) + radius;
      // const centerY = Math.min(startY, e.clientY) + radius;

      shape = {
        type: "line",
        startX,
        startY,
        endX: e.clientX,
        endY: e.clientY,
      };
    }

    if (!shape) {
      console.log("no shape found!!");
      return;
    }

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: Number(roomId),
      })
    );

    clearCanvas(existingShapes, ctx, canvas);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);

      clearCanvas(existingShapes, ctx, canvas);

      ctx.strokeStyle = "rgba(255, 255, 255)";

      if (selectedTool === "rect") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = Math.min(startX, e.clientX) + radius;
        const centerY = Math.min(startY, e.clientY) + radius;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      } else if (selectedTool === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
      }
    }
  });
};

const clearCanvas = (
  existingShapes: Shape[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape: Shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  });
};

const getExistingShapes = async (roomId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/chats/${roomId}`
  );

  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
};
