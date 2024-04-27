import useResize from "./use-resize";

import { useState } from "react";
import { ResizeCallback } from "./use-resize.types";

const ResizeTest = () => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  const onResizeStart = ({
    event,
    resizable,
    handle,
    direction,
    startPos,
    startSize,
  }) => {
    console.log(`Resize started:
    Direction: ${direction}
    Start Size: ${JSON.stringify(startSize)}
    Start Position: ${JSON.stringify(startPos)}
  `);
  };

  const onResize = ({
    event,
    resizable,
    handle,
    direction,
    startPos,
    startSize,
    delta,
    currSize,
  }: ResizeCallback<HTMLDivElement>) => {
    console.log(`Resizing:
    Direction: ${direction}
    Delta: ${JSON.stringify(delta)}
    Current Size: ${JSON.stringify(currSize)}
  `);
    setWidth(currSize.w);
    setHeight(currSize.h);
  };

  const onResizeEnd = ({
    event,
    resizable,
    handle,
    direction,
    startPos,
    startSize,
    delta,
    currSize,
  }) => {
    console.log(`Resize ended:
    Direction: ${direction}
    Delta: ${JSON.stringify(delta)}
    Final Size: ${JSON.stringify(currSize)}
  `);
    setWidth(currSize.w);
    setHeight(currSize.h);
  };

  const [addTopRef, setAddTopRef] = useState(false);
  const { resizableRef, top, topright, right, bottom, left } =
    useResize<HTMLDivElement>({
      onResizeStart,
      onResize,
      onResizeEnd,
      minSize: { w: 10, h: 10 },
      maxSize: { w: 500, h: 500 },
    });

  return (
    <div
      ref={resizableRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="resizable-box relative bg-red-300"
    >
      {addTopRef && (
        <div
          ref={top}
          className="resize-handle n absolute left-0 top-0 h-[10px] w-full cursor-pointer bg-gray-500"
        ></div>
      )}
      <button onClick={() => setAddTopRef(!addTopRef)}>Toggle Top Ref</button>

      <div
        ref={topright}
        className="resize-handle e absolute right-0 top-0 z-10 h-[10px] w-[10px] cursor-pointer bg-orange-500"
      ></div>

      <div
        ref={right}
        className="resize-handle e absolute right-0 top-0 h-full w-[10px] cursor-pointer bg-gray-500"
      ></div>

      <div
        ref={bottom}
        className="resize-handle s absolute bottom-0 left-0 h-[10px] w-full cursor-pointer bg-gray-500"
      ></div>

      <div
        ref={left}
        className="resize-handle w absolute left-0 top-0 h-full w-[10px] cursor-pointer bg-gray-500"
      ></div>
    </div>
  );
};

export default ResizeTest;
