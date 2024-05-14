/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import useResize from "./use-resize";

import { MutableRefObject, useState } from "react";
import {
  ResizeCallback,
  ResizeEndCallback,
  ResizeStartCallback,
} from "./use-resize.types";

const ResizeTest = ({
  parentRef,
}: {
  parentRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);

  const onResizeStart: ResizeStartCallback<HTMLDivElement> = ({
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

  const onResize: ResizeCallback<HTMLDivElement> = ({
    event,
    resizable,
    handle,
    direction,
    startPos,
    startSize,
    delta,
    currSize,
  }) => {
    console.log(`Resizing:
    Direction: ${direction}
    Delta: ${JSON.stringify(delta)}
    Current Size: ${JSON.stringify(currSize)}
  `);
    setWidth(currSize.w);
    setHeight(currSize.h);
  };

  const onResizeEnd: ResizeEndCallback<HTMLDivElement> = ({
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
    event: ${event.target}
    startPos: ${JSON.stringify(startPos)}
    startSize: ${JSON.stringify(startSize)}
    Direction: ${direction}
    Delta: ${JSON.stringify(delta)}
    Final Size: ${JSON.stringify(currSize)}
  `);
    console.dir(resizable);
    console.dir(handle);

    setWidth(currSize.w);
    setHeight(currSize.h);
  };

  const {
    resizableRef,
    top,
    topright,
    right,
    bottomright,
    bottom,
    bottomleft,
    left,
    topleft,
  } = useResize<HTMLDivElement>({
    disabled: false,
    onResizeStart,
    onResize,
    onResizeEnd,
    minSize: { w: 100, h: 100 },
    maxSize: { w: 500, h: 500 },
    parentRef: parentRef,
    lockAspectRatio: true,
  });

  return (
    <div
      ref={resizableRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="resizable-box relative bg-red-300"
    >
      <div
        ref={top}
        className="resize-handle t absolute left-0 top-0 h-[10px] w-full cursor-pointer bg-gray-500"
      ></div>

      <div
        ref={topright}
        className="resize-handle tr absolute right-0 top-0 z-10 h-[10px] w-[10px] cursor-pointer bg-orange-500"
      ></div>

      <div
        ref={right}
        className="resize-handle r absolute right-0 top-0 h-full w-[10px] cursor-pointer bg-gray-500"
      ></div>

      <div
        ref={bottomright}
        className="resize-handle br absolute bottom-0 right-0 z-10 h-[10px] w-[10px] cursor-pointer bg-blue-500"
      ></div>

      <div
        ref={bottom}
        className="resize-handle b absolute bottom-0 left-0 h-[10px] w-full cursor-pointer bg-gray-500"
      ></div>

      <div
        ref={bottomleft}
        className="resize-handle bl absolute bottom-0 left-0 z-10 h-[10px] w-[10px] cursor-pointer bg-red-900"
      ></div>

      <div
        ref={left}
        className="resize-handle l absolute left-0 top-0 h-full w-[10px] cursor-pointer bg-gray-500"
      ></div>

      <div
        ref={topleft}
        className="resize-handle tl absolute left-0 top-0 z-10 h-[10px] w-[10px] cursor-pointer bg-green-900"
      ></div>
    </div>
  );
};

export default ResizeTest;
