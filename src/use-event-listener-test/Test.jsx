import usePointerDownListener from "./use-down-event";

function MyComponent() {
  const componentRef = usePointerDownListener();

  return (
    <div
      className="flex aspect-square w-[200px] items-center justify-center bg-red-300"
      ref={componentRef}
    >
      <p>Handle Down Test</p>
    </div>
  );
}

export default MyComponent;
