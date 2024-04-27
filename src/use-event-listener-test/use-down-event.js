import { useRef, useEffect } from "react";

const usePointerDownListener = () => {
  const ref = useRef(null);

  const handleDown = (event) => {
    console.log(
      "Pointer down at coordinates (x, y):",
      event.clientX,
      event.clientY,
    );
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("pointerdown", handleDown);
    }

    return () => {
      if (element) {
        element.removeEventListener("pointerdown", handleDown);
      }
    };
  }, []);

  return ref;
};

export default usePointerDownListener;
