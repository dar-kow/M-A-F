import React from "react";
import "..//styles/Loader.scss";

const Loader: React.FC = () => {
  // Loader component: displays a loading spinner
  return (
    <div className="loader-container" data-testid="loader_container">
      <div className="loader" data-testid="loader_spinner"></div>
    </div>
  );
};

export default Loader;
