import { useCallback, useEffect, useRef, useState } from "react";
import {
  Direction,
  HandleRefs,
  Position,
  ResizableDomEvents,
  ResizableEventType,
  ResizableRef,
  ResizableResult,
  Size,
  UseResizeProps,
} from "./use-resize.types";
import {
  calculateDeltas,
  calculateNewSize,
  getCurrentPosition,
  getMaxBounds,
  getSize,
  isRecognisableEvent,
} from "./use-resize.utils";

type ResizableState<Target extends Element> = {
  resizableRef: ResizableRef<Target>;
  handleRefs: HandleRefs<Target>;
  isResizing: boolean;
  startDirection: Direction | null;
  startPos: Position | null;
  startSize: Size | null;
};

type EventRemoveCallback = () => void;
type EventListenersMap = Map<Direction, Array<EventRemoveCallback>>;

function useResize<Target extends Element = Element>({
  disabled = false,
  detect = ResizableEventType.Pointer,
  onResizeStart,
  onResize,
  onResizeEnd,
  minSize = {
    w: 0,
    h: 0,
  },
  maxSize = {
    w: Infinity,
    h: Infinity,
  },
  parentRef,
  lockAspectRatio = false,
}: UseResizeProps<Target>): ResizableResult<Target> {
  const initialState: ResizableState<Target> = {
    resizableRef: useRef(null),
    handleRefs: {
      top: useRef(null),
      topright: useRef(null),
      right: useRef(null),
      bottomright: useRef(null),
      bottom: useRef(null),
      bottomleft: useRef(null),
      left: useRef(null),
      topleft: useRef(null),
    },
    isResizing: false,
    startDirection: null,
    startPos: null,
    startSize: null,
  };

  const [state, setState] = useState(initialState);

  const handlePointerDown = useCallback(
    (direction: Direction, event: ResizableDomEvents) => {
      const resizable = state.resizableRef?.current;
      const handle = state.handleRefs[direction]?.current;

      if (!isRecognisableEvent(event) || disabled || !resizable || !handle) {
        return;
      }
      const rect: DOMRect | undefined = getSize(state.resizableRef);
      const startPos = getCurrentPosition(event);

      if (!rect) {
        // eslint-disable-next-line no-console
        console.warn(
          "Invalid resizableRef: expected an HTMLElement or a RefObject.",
        );
        return;
      }

      if (!startPos) {
        // eslint-disable-next-line no-console
        console.warn(
          "Invalid event type: Unable to get initail position from event",
        );
        return;
      }

      const { width, height } = rect;

      setState((prevState) => ({
        ...prevState,
        isResizing: true,
        startDirection: direction,
        startPos: startPos,
        startSize: {
          w: width,
          h: height,
        },
      }));

      // Call the start callback with the latest state data
      if (onResizeStart) {
        onResizeStart({
          event: event,
          resizable: resizable,
          handle: handle,
          direction: direction,
          startSize: { w: width, h: height },
          startPos: startPos,
        });
      }
    },
    [onResizeStart, disabled, state.resizableRef, state.handleRefs],
  );

  // useEffect(() => {
  //   if (state.isResizing && onResizeStart) {
  //     onResizeStart({
  //       direction: state.initialDirection,
  //       size: state.initialSize,
  //       startPos: state.startPos,
  //     });
  //   }
  // }, [
  //   state.isResizing,
  //   state.initialDirection,
  //   state.initialSize,
  //   onResizeStart,
  // ]);

  const handlePointerMove = useCallback(
    (event: ResizableDomEvents) => {
      const { isResizing, startDirection, startPos, startSize } = state;

      if (!isResizing || disabled || !startDirection || !startPos || !startSize)
        return;

      const resizable = state.resizableRef?.current;
      const handle = state.handleRefs[startDirection]?.current;

      if (!resizable || !handle) return;

      const newPosition = getCurrentPosition(event);

      if (!newPosition) {
        // eslint-disable-next-line no-console
        console.warn(
          "Invalid event type: Unable to get initial position from event",
        );
        return;
      }

      const { deltaX, deltaY } = calculateDeltas(startPos, newPosition);

      const maxBounds = getMaxBounds(maxSize, parentRef);
      const newSize = calculateNewSize(
        startSize,
        startDirection,
        deltaX,
        deltaY,
        minSize,
        maxBounds,
        lockAspectRatio,
      );

      onResize?.({
        event,
        resizable,
        handle,
        direction: startDirection,
        startPos,
        startSize,
        delta: { deltaX, deltaY },
        currSize: newSize,
      });
    },
    [onResize, state, disabled, maxSize, minSize, parentRef, lockAspectRatio],
  );

  const handlePointerUp = useCallback(
    (event: ResizableDomEvents) => {
      const { isResizing, startDirection, startPos, startSize } = state;

      if (!isResizing || disabled || !startDirection || !startPos || !startSize)
        return;

      const resizable = state.resizableRef?.current;
      const handle = state.handleRefs[startDirection]?.current;

      if (!resizable || !handle) return;

      const newPosition = getCurrentPosition(event);

      if (!newPosition) {
        // eslint-disable-next-line no-console
        console.warn(
          "Invalid event type: Unable to get initial position from event",
        );
        return;
      }

      const { deltaX, deltaY } = calculateDeltas(startPos, newPosition);

      const maxBounds = getMaxBounds(maxSize, parentRef);
      const newSize = calculateNewSize(
        startSize,
        startDirection,
        deltaX,
        deltaY,
        minSize,
        maxBounds,
        lockAspectRatio,
      );

      setState((prevState) => {
        return { ...prevState, isResizing: false };
      });

      onResizeEnd?.({
        event,
        resizable,
        handle,
        direction: startDirection,
        startPos,
        startSize,
        delta: { deltaX, deltaY },
        currSize: newSize,
      });
    },
    [
      onResizeEnd,
      state,
      disabled,
      maxSize,
      minSize,
      parentRef,
      lockAspectRatio,
    ],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const eventListenersMap: EventListenersMap = new Map();

    const addEventListeners = (eventType: string) => {
      Object.keys(state.handleRefs).forEach((key) => {
        const direction = key as Direction;
        const ref = state.handleRefs[direction]?.current;

        if (ref) {
          const handleEventDownDirection = (event: Event) => {
            if (isRecognisableEvent(event)) {
              handlePointerDown(direction, event);
            }
          };

          ref.addEventListener(eventType, handleEventDownDirection);

          if (!eventListenersMap.has(direction)) {
            eventListenersMap.set(direction, []);
          }

          eventListenersMap.get(direction)?.push(() => {
            ref.removeEventListener(eventType, handleEventDownDirection);
          });
        }
      });
    };

    switch (detect) {
      case ResizableEventType.Mouse:
        addEventListeners("mousedown");
        break;
      case ResizableEventType.Pointer:
        addEventListeners("pointerdown");
        break;
      case ResizableEventType.Touch:
        addEventListeners("touchstart");
        break;
    }

    return () => {
      eventListenersMap.forEach((listeners) => {
        listeners.forEach((clb) => clb());
      });
    };
  }, [handlePointerDown, state.handleRefs, detect]);

  // effect for move and up listeners
  useEffect(() => {
    if (state.isResizing && window) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp, state.isResizing]);

  return {
    resizableRef: state.resizableRef,
    ...state.handleRefs,
    isResizing: state.isResizing,
  };
}

export default useResize;
