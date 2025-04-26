import React, { ReactNode } from "react";

const IconButton = ({
  activated,
  icon,
  onClick,
}: {
  activated: boolean;
  icon: ReactNode;
  onClick: () => void;
}) => {
  return (
    <div
      className={`rounded-full cursor-pointer border ml-4 p-2 bg-gray-300  ${activated ? "bg-red-700": "hover:bg-gray-50"}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default IconButton;
