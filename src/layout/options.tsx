import React from "react";
import ReactDOM from "react-dom/client";

function Options() {
  return (
    <div>
      <header>
        <h1>Title test</h1>
        <button>button</button>
      </header>
    </div>
  );
}

const index = document.createElement("div");
index.id = "options";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
