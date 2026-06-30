import React, { forwardRef } from "react";
import CropFreeIcon from '@mui/icons-material/CropFree';
import { Tooltip } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const FitButton = forwardRef(({ onFitChart }, ref) => {
  const hoverBtnDescription = (
    <p style={{ fontSize: "0.7rem", margin: 0 }}>Fit Chart To Screen</p>
  );

  return (

    // <Button variant="outlined" onClick={(event) => onFitChart(event)} style={{color:'#fece2f'}}>
    //     <AddIcon />
    // </Button>

    <Tooltip arrow title={hoverBtnDescription}>
        <IconButton style={{color:'#fece2f'}} onClick={(event) => onFitChart(event)}>
            <CropFreeIcon />
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
    //         marginRight: "0.5rem",
    //         borderRadius: "0.5rem",
    //         paddingTop: "0.5rem",
    //         paddingBottom: "0.5rem",
    //         paddingLeft: "1rem",
    //         paddingRight: "1rem",
    //       }}
    //       onClick={(event) => onFitChart(event)}
    //       ref={ref}
    //     >
    //       <CropFreeIcon className="bold-icons" size="2rem" />
    //     </button>
    //   </Tooltip>
    // </div>
  );
});

export default FitButton;
