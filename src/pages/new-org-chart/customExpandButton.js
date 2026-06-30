import React from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const styles = {
  expandBtn: {
    width: "40px",
    height: "30px",
    margin: "auto",
    color: "#f7f7f7",
    backgroundColor: "#141414",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #fece2f",
    borderRadius: "0.3rem",
    cursor: "pointer",
  },
  flex: {
    display: "flex",
  },
};

const CustomExpandButton = (node) => {
  return (

    node && (
      <div style={styles.expandBtn}>
        <span>{node.data._directSubordinates}</span>
        <span style={styles.flex}>
          {node.children ? <KeyboardArrowUpIcon style={{fontSize:'inherit'}}/> : <KeyboardArrowDownIcon style={{fontSize:'inherit'}}/>}
        </span>
      </div>
    )

  );
};

export default CustomExpandButton;
