import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";

const DataToggle = ({ onDataChange, isToggleOn }) => {

  const handleChange = (event) => {
    event.preventDefault();
    onDataChange(event);
  };

  return (
    <div>
        <span className={!isToggleOn ? "label_txt_unchecked" : "label_txt"}>OFF</span>
        <label className="switch">
          <input
            checked={isToggleOn}
            type={"checkbox"}
            onChange={(event) => handleChange(event)}
          />
          <span className="slider"></span>
        </label>
        <span className={isToggleOn ? "label_txt_checked" : "label_txt"}>ON</span>
    </div>
  );
};

export default DataToggle;
