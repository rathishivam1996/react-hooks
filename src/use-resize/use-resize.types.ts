import {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  PointerEventHandler,
  TouchEvent as ReactTouchEvent,
  TouchEventHandler,
  MutableRefObject,
} from "react";

export enum ResizableEventType {
  Mouse = "mouse",
  Touch = "touch",
  Pointer = "pointer",
}

export type ResizableDomEvents = MouseEvent | TouchEvent | PointerEvent;
export type ResizableReactEvents<Target extends Element = Element> =
  | ReactMouseEvent<Target>
  | ReactTouchEvent<Target>
  | ReactPointerEvent<Target>;

export type Position = {
  x: number;
  y: number;
};

export interface Delta {
  deltaX: number;
  deltaY: number;
}

export type Size = {
  w: number;
  h: number;
};

export type Direction =
  | "top"
  | "topright"
  | "right"
  | "bottomright"
  | "bottom"
  | "bottomleft"
  | "left"
  | "topleft";

export type HandleRefs<Target extends Element> = {
  top: MutableRefObject<Target | null>;
  topright: MutableRefObject<Target | null>;
  right: MutableRefObject<Target | null>;
  bottomright: MutableRefObject<Target | null>;
  bottom: MutableRefObject<Target | null>;
  bottomleft: MutableRefObject<Target | null>;
  left: MutableRefObject<Target | null>;
  topleft: MutableRefObject<Target | null>;
};

export type ResizableRef<Target extends Element> =
  MutableRefObject<Target | null>;

export type ResizeStartCallback<Target extends Element> = (props: {
  event: ResizableDomEvents;
  resizable: Target;
  handle: Target;
  direction: Direction;
  startPos: Position;
  startSize: Size;
}) => void;

export type ResizeCallback<Target extends Element> = (props: {
  event: ResizableDomEvents;
  resizable: Target;
  handle: Target;
  direction: Direction;
  startPos: Position;
  startSize: Size;
  delta: Delta;
  currSize: Size;
}) => void;

export type ResizeEndCallback<Target extends Element> = ResizeCallback<Target>;

export type ResizableResult<T extends Element> = {
  resizableRef: ResizableRef<T>;
} & HandleRefs<T> & {
    isResizing: boolean;
  };

// export type ResizableResult<
//   T extends ResizableHandlers<Target> | ResizableEmptyHandlers,
//   Target extends Element = Element,
// > = T;

type ResizableEmptyHandlers = Record<never, never>;

interface ResizableMouseHandlers<Target extends Element = Element> {
  onMouseDown: MouseEventHandler<Target>;
  onMouseMove: MouseEventHandler<Target>;
  onMouseUp: MouseEventHandler<Target>;
  onMouseLeave?: MouseEventHandler<Target>;
}
interface ResizableTouchHandlers<Target extends Element = Element> {
  onTouchStart: TouchEventHandler<Target>;
  onTouchMove: TouchEventHandler<Target>;
  onTouchEnd: TouchEventHandler<Target>;
}

interface ResizablePointerHandlers<Target extends Element = Element> {
  onPointerDown: PointerEventHandler<Target>;
  onPointerMove: PointerEventHandler<Target>;
  onPointerUp: PointerEventHandler<Target>;
  onPointerLeave?: PointerEventHandler<Target>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ResizableHandlers<Target extends Element = Element> =
  | ResizableMouseHandlers<Target>
  | ResizableTouchHandlers<Target>
  | ResizablePointerHandlers<Target>
  | ResizableEmptyHandlers;
