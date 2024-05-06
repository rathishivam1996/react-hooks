import { MutableRefObject, useRef } from "react";
import "./App.css";
import ResizeTest from "./use-resize/use-resize-component";
// import Counter from "./use-resize/use-counter";

function App() {
  const parentRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  return (
    <div className="flex h-full w-full flex-col bg-blue-200">
      <div className="h-[64px] bg-red-50"></div>
      <main className="flex flex-1 items-center justify-center overflow-y-auto overflow-x-hidden bg-blue-100">
        <div
          ref={parentRef}
          className="m-[20px] flex h-[400px] w-[400px] items-center justify-center bg-slate-800"
        >
          <ResizeTest parentRef={parentRef} />

          {/* <Counter /> */}
        </div>
      </main>
    </div>
  );
}

export default App;
