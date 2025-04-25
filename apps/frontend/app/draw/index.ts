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
    };

export const initDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) => {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);
  console.log("existingShapes ", existingShapes);
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

    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    console.log("sending req");
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };

    console.log("shape shape ", shape);
    existingShapes.push(shape);
    console.log("after pushed existingShapes ", existingShapes);

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
      console.log("moved");

      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, ctx, canvas);

      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
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
