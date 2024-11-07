import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function Popup() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ height: 300, width: 300 }}>
      <header>
        <p>This is Popup Page</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
