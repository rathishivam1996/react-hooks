# useResize.js

useResize.js is a lightweight and flexible JavaScript library for creating resizable UI components in React applications. Built with modern React Hooks, it offers customizable resize handles, ARIA accessibility compliance, and optimized performance.

## Features:

- **No CSS Injection:** Does not inject any CSS stylings or wrapper divs, providing full control over the styling of resizable components.
- **Customizable Resize Handles:** Allows developers to choose which resize handles their components want to use, providing flexibility in design and functionality.
- **Built with React Hooks:** Utilizes the latest React Hooks for state management, ensuring modern and efficient code.
- **Thorough Testing:** Thoroughly tested to ensure reliability and stability, reducing the risk of bugs and errors.
- **Aria Accessibility Compliance:** Ensures accessibility compliance by implementing ARIA attributes for screen reader users.
- **Optimized Performance:** Optimized for performance to deliver smooth and responsive user experiences, even with complex resizable components.

## Props for `useResize` Function

### Description:
The `useResize` hook accepts the following props to customize the resizing behavior of components.

### Props:

- `disabled` (optional, default: `false`):
  - Type: `boolean`
  - Description: Specifies whether resizing is disabled.
  
- `detect` (optional, default: `ResizableEventType.Pointer`):
  - Type: `ResizableEventType`
  - Description: Specifies the type of resize events to detect (`ResizableEventType.Mouse`, `ResizableEventType.Touch`, `ResizableEventType.Pointer`).

- `onResizeStart` (optional):
  - Type: `ResizeStartCallback<Target>`
  - Description: A callback function called when resizing starts.

- `onResize` (optional):
  - Type: `ResizeCallback<Target>`
  - Description: A callback function called during resizing.

- `onResizeEnd` (optional):
  - Type: `ResizeEndCallback<Target>`
  - Description: A callback function called when resizing ends.

- `minSize` (optional, default: `{ w: 0, h: 0 }`):
  - Type: `Size`
  - Description: Specifies the minimum size of the resizable component.

- `maxSize` (optional, default: `{ w: Infinity, h: Infinity }`):
  - Type: `Size`
  - Description: Specifies the maximum size of the resizable component.

- `parentRef` (optional):
  - Type: `ResizableRef<Target>`
  - Description: A mutable ref object pointing to the parent element of the resizable component.

- `lockAspectRatio` (optional, default: `false`):
  - Type: `boolean`
  - Description: Specifies whether to lock the aspect ratio of the resizable component during resizing.




