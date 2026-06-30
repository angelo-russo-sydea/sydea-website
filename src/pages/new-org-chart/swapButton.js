import React, { forwardRef, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import DashboardIcon from '@mui/icons-material/Dashboard';

const SwapButton = forwardRef(({ onSwapLayout }, ref) => {
  // const [isCycleLayoutOn, setIsCycleLayoutOn] = useState(false);

  const hoverBtnDescription = (
    <p style={{ fontSize: "0.7rem", margin: 0 }}>Swap Layout</p>
  );

  const swapLayout = (event) => {
    event.preventDefault();
    onSwapLayout(event);
  };

  return (
    <Tooltip arrow title={hoverBtnDescription}>
        <IconButton style={{color:'#fece2f'}} onClick={(event) => swapLayout(event)}>
            <DashboardIcon />
        </IconButton>
    </Tooltip>
    // <div>
    //   <Tooltip
    //     title={hoverBtnDescription}
    //     disableinteractive="true"
    //     slotprops={{
    //       tooltip: {
    //         sx: {
    //           bgcolor: "#545859",
    //         },
    //       },
    //     }}
    //   >
    //     <button
    //       className="context-menu-btns"
    //       style={{
    //         backgroundColor: "#4caf50",
    //         color: "white",
    //         borderRadius: "0.5rem",
    //         paddingTop: "0.5rem",
    //         paddingBottom: "0.5rem",
    //         paddingLeft: "1rem",
    //         paddingRight: "1rem",
    //       }}
    //       onClick={(event) => swapLayout(event)}
    //       ref={ref}
    //     >
    //       <DashboardIcon size="2rem" />
    //     </button>
    //   </Tooltip>
    // </div>
  );
});

export default SwapButton;
