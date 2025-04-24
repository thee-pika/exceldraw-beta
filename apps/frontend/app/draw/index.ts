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

export const initDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = [];

  if (!ctx) {
    return;
  }

  //   ctx.fillStyle = "rgba(0, 0, 0)";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    existingShapes.push({
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    });
    
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
