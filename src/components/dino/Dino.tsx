import React from "react";
import "./style.scss";

const Dino = () => {
  return (
    <div className="dino-container">
      <div className="dino">
        <div className="eye"></div>
        <div className="mouth"></div>
      </div>
      <div className="ground"></div>
    </div>
  );
};

export default Dino;
