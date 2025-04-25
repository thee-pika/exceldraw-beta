import RoomCanvas from "@/app/components/RoomCanvas";
import React from "react";

const CanvasPage = async ({
  params,
}: {
  params: {
    roomId: string;
  };
}) => {
  const roomId = (await params).roomId;

  return <RoomCanvas roomId={roomId} />;
};

export default CanvasPage;
