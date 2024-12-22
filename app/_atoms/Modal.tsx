"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode[];
}

const stopPropergation = (e: React.MouseEvent) => e.stopPropagation();

export default function Modal(props: Props) {
  const { children, className, ...divProps } = props;
  const [trigger, ...portal] = children;
  const [isOpen, set] = useState(false);

  const handleOpen = () => set(true);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    set(false);
  };

  return (
    <>
      <div {...divProps} onClick={handleOpen}>
        {trigger}
      </div>
      {isOpen
        ? createPortal(
            <div
              className="fixed top-0 left-0 w-full h-screen bg-black/20"
              onClick={handleClose}
            >
              <div
                className={`bg-white rounded-lg m-auto ${className}`}
                onClick={stopPropergation}
              >
                {portal}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
