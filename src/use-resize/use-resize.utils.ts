import {
  Delta,
  Direction,
  Position,
  ResizableDomEvents,
  ResizableRef,
  Size,
} from "./use-resize.types";

// utils.ts
type ElementInput<Target extends Element> = Target | React.RefObject<Target>;

export function getSize<Target extends Element>(
  elementInput: ElementInput<Target>,
): DOMRect | undefined {
  const element =
    "current" in elementInput ? elementInput.current : elementInput;

  return element?.getBoundingClientRect();
}

export function getMaxBounds<Target extends Element>(
  maxSize?: Size,
  parentRef?: ResizableRef<Target>,
): Size {
  // If neither maxSize nor parentRef is provided, return Infinity for both width and height
  if (!maxSize && !parentRef) return { w: Infinity, h: Infinity };

  // If parentRef is provided, get its size
  let parentSize: Size | undefined;
  if (parentRef) {
    const rect = getSize(parentRef);
    if (rect) parentSize = { w: rect.width, h: rect.height };
  }

  // If only maxSize is provided, return it
  if (maxSize && !parentSize) return maxSize;

  // If only parentSize is provided, return it
  if (!maxSize && parentSize) return parentSize;

  // If both maxSize and parentSize are provided, return the minimum of the two
  if (maxSize && parentSize) {
    return {
      w: Math.min(maxSize.w, parentSize.w),
      h: Math.min(maxSize.h, parentSize.h),
    };
  }

  // If none of the above conditions are met, return Infinity for both width and height
  return { w: Infinity, h: Infinity };
}

export function isTouchEvent(event: Event): event is TouchEvent {
  return "touches" in event;
}

export function isMouseEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

export function isPointerEvent(event: Event): event is PointerEvent {
  return event instanceof PointerEvent;
}

export function isRecognisableEvent(event: Event): event is ResizableDomEvents {
  return isMouseEvent(event) || isTouchEvent(event) || isPointerEvent(event);
}

export function isSSR(): boolean {
  return typeof window === "undefined";
}

export function getCurrentPosition(
  event: MouseEvent | TouchEvent | PointerEvent,
): { x: number; y: number } | null {
  if (isTouchEvent(event)) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    };
  }

  if (isMouseEvent(event) || isPointerEvent(event)) {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }

  return null;
}

export function calculateDeltas(prevPos: Position, newPos: Position): Delta {
  return {
    deltaX: newPos.x - prevPos.x,
    deltaY: newPos.y - prevPos.y,
  };
}

const hasDirection = (
  dir: "top" | "right" | "bottom" | "left",
  target: string,
): boolean => target.includes(dir);

function clamp(value: number, minValue?: number, maxValue?: number): number {
  return Math.min(Math.max(value, minValue ?? 0), maxValue ?? Infinity);
}

export function calculateNewSize(
  currentSize: Size,
  handleDirection: Direction,
  deltaX: number,
  deltaY: number,
  minSize?: Size,
  maxSize?: Size,
  lockAspectRatio = false,
): Size {
  const newSize: Size = { ...currentSize };
  const ratio = currentSize.w / currentSize.h;

  if (hasDirection("right", handleDirection)) {
    const newWidth = currentSize.w + deltaX;

    const clampedWidth = clamp(newWidth, minSize?.w, maxSize?.w);

    newSize.w = clampedWidth;

    if (lockAspectRatio) {
      const newHeight = newWidth / ratio;
      const clampedHeight = clamp(newHeight, minSize?.h, maxSize?.h);

      newSize.h = clampedHeight;
    }
  }

  if (hasDirection("left", handleDirection)) {
    const newWidth = currentSize.w - deltaX;
    const clampedWidth = clamp(newWidth, minSize?.w, maxSize?.w);
    newSize.w = clampedWidth;

    if (lockAspectRatio) {
      const newHeight = newWidth / ratio;
      const clampedHeight = clamp(newHeight, minSize?.h, maxSize?.h);
      newSize.h = clampedHeight;
    }
  }

  if (hasDirection("bottom", handleDirection)) {
    const newHeight = currentSize.h + deltaY;
    const clampedHeight = clamp(newHeight, minSize?.h, maxSize?.h);
    newSize.h = clampedHeight;
    if (lockAspectRatio) {
      const newWidth = newHeight * ratio;
      const clampedWidth = clamp(newWidth, minSize?.w, maxSize?.w);
      newSize.w = clampedWidth;
    }
  }

  if (hasDirection("top", handleDirection)) {
    const newHeight = currentSize.h - deltaY;
    const clampedHeight = clamp(newHeight, minSize?.h, maxSize?.h);
    newSize.h = clampedHeight;
    if (lockAspectRatio) {
      const newWidth = newHeight * ratio;
      const clampedWidth = clamp(newWidth, minSize?.w, maxSize?.w);
      newSize.w = clampedWidth;
    }
  }

  return newSize;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function adjustForAspectRatio(
  direction: Direction,
  currentSize: Size,
  deltaX: number,
  deltaY: number,
): Delta {
  let newDeltaX = deltaX;
  let newDeltaY = deltaY;

  const aspectRatio = currentSize.w / currentSize.h;

  switch (direction) {
    case "right":
    case "left":
      newDeltaY = deltaX / aspectRatio;
      break;
    case "top":
    case "bottom":
      newDeltaX = deltaY * aspectRatio;
      break;
    case "topright":
    case "bottomright":
    case "bottomleft":
    case "topleft":
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newDeltaY = deltaX / aspectRatio;
      } else {
        newDeltaX = deltaY * aspectRatio;
      }
      break;
    default:
      // If resize direction is not recognized, return unchanged deltas
      break;
  }

  return { deltaX: Math.abs(newDeltaX), deltaY: Math.abs(newDeltaY) };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateWidth(
  currentSize: Size,
  direction: Direction,
  deltaX: number,
  minSize?: Size,
  maxSize?: Size,
): Size {
  const isLeftDirection =
    direction === "left" ||
    direction === "topleft" ||
    direction === "bottomleft";

  const newWidth = currentSize.w + (isLeftDirection ? -deltaX : deltaX);

  const clampedWidth = Math.min(
    Math.max(newWidth, minSize?.w ?? 0),
    maxSize?.w ?? Infinity,
  );

  return { ...currentSize, w: clampedWidth };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateHeight(
  currentSize: Size,
  direction: Direction,
  deltaY: number,
  minSize?: Size,
  maxSize?: Size,
): Size {
  const isTopDirection =
    direction === "top" || direction === "topleft" || direction === "topright";

  const newHeight = currentSize.h + (isTopDirection ? -deltaY : deltaY);

  const clampedHeight = Math.min(
    Math.max(newHeight, minSize?.h ?? 0),
    maxSize?.h ?? Infinity,
  );

  return { ...currentSize, h: clampedHeight };
}

type ResizeDirection = "horizontal" | "vertical" | "diagonal";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getResizeDirection(handleDirection: Direction): ResizeDirection {
  if (["top", "bottom"].includes(handleDirection)) {
    return "vertical";
  } else if (["left", "right"].includes(handleDirection)) {
    return "horizontal";
  } else {
    return "diagonal";
  }
}
