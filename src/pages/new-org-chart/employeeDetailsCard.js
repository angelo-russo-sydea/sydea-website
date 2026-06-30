import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Draggable from "react-draggable";
// import zIndex from "@mui/material/styles/zIndex";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const styles = {
  card: {
    position: "absolute",
    top: "60px",
    left: "0",
    height: "75%",
    padding: "0 2rem 2rem 2rem",
    margin: "2rem",
    backgroundColor: "#fef9ef",
    borderRadius: "1rem",
    border: "1px solid #d3d3d3",
    overflowY: "scroll",
    cursor: "move",
    filter: "drop-shadow(2px 4px 6px #141414)",
    zIndex: "1101"
  },
  cardCloseBtn: {
    // position: "absolute",
    // top: "10px",
    // right: "10px",
    width: "30px",
    height: "30px",
    color: "#000",
    backgroundColor: "#fef9ef",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #000",
    cursor: "pointer",
  },
  rowHeaderCardBtn: {
    width: "100%", 
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    left: 0,
    backgroundColor: "#fef9ef",
    padding: "1rem 0",
  },
  // card::-webkit-scrollbar: {
  //   display: none;
  // },
  cardHeader: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  cardImg: {
    width: "120px",
    borderRadius: "1rem",
  },
  cardName: {
    fontSize: "1rem",
  },
  cardRole: {
    marginTop: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  cardBody: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
  },
  cardBodyTeamMembers: {
    marginTop: "1rem",
    height: "26vh",
    overflowY: "scroll",
  },
  cardItem: {
    width: "100%",
    margin: "0.5rem 0",
    // display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "space-between",
    // alignItems: "center",
    fontSize: "0.9rem",
  },
  cardItemLabel: {
    margin: "0.5rem 0",
    fontWeight: "bold",
  },
  cardItemValue: {
    textAlign: "justify",
  },
  cardItemTeam: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardItemImg: {
    width: "50px",
    height: "50px",
    margin: "0.2rem",
    borderRadius: "50%",
  },
  cardItemName: {
    marginLeft: "0.5rem",
    fontWeight: "bold",
  },
  cardItemRole: {
    fontSize: "0.8rem",
    marginLeft: "0.5rem",
  },
};

const EmployeeDetailsCard = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (event) => {
    // Salva la posizione di partenza per calcolare lo spostamento
    const style = window.getComputedStyle(event.target, null);
    const x = parseInt(style.getPropertyValue("left"), 10) - event.clientX;
    const y = parseInt(style.getPropertyValue("top"), 10) - event.clientY;
    event.dataTransfer.setData("text/plain", `${x},${y}`);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    const offset = event.dataTransfer.getData("text/plain").split(",");
    const x = event.clientX + parseInt(offset[0], 10);
    const y = event.clientY + parseInt(offset[1], 10);
    setPosition({ x, y });
    event.preventDefault();
  };

  return (
    <Draggable cancel=".btn" handle="strong">
    <div style={styles.card} className="width-detail-card">
      <div style={styles.rowHeaderCardBtn}>
        <div className="box no-cursor">
          <strong className="cursor">
            <DragIndicatorIcon></DragIndicatorIcon>
          </strong>
        </div>
        <button style={styles.cardCloseBtn} onClick={props.handleClose} className="btn">
          <CloseIcon />
        </button>
      </div>
        <div>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardRole}>{props.employee.positionName}</h2>
            { props.employee.team && <h2 style={styles.cardRole}>{props.employee.team}</h2> }
            <p style={styles.cardName}>{props.employee.name}</p>
          </div>
        </div>
      {/* {props.employee.team === "" ? (
        <div>
          <div style={styles.cardHeader}>
            <img
              style={styles.cardImg}
              src={props.employee.imageUrl}
              alt="Profile"
            />
            <h2 style={styles.cardRole}>{props.employee.positionName}</h2>
            <p style={styles.cardName}>{props.employee.name}</p>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.cardItem}>
              <p style={styles.cardItemLabel}>Phone:</p>
              <p style={styles.cardItemValue}>{props.employee.phone}</p>
            </div>
            <div style={styles.cardItem}>
              <p style={styles.cardItemLabel}>Email:</p>
              <p style={styles.cardItemValue}>{props.employee.email}</p>
            </div>
            <div style={styles.cardItem}>
              <p style={styles.cardItemLabel}>Location:</p>
              <p style={styles.cardItemValue}>{props.employee.location}</p>
            </div>
            {props.employee.department && (
              <div style={styles.cardItem}>
                <p style={styles.cardItemLabel}>Department:</p>
                <p style={styles.cardItemValue}>{props.employee.department}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.cardHeader}>
            <h2>{props.employee.team} Team</h2>
          </div>
          <h4>Team Members:</h4>
          <div style={styles.cardBodyTeamMembers}>
            {props.employees
              .filter(
                (employee) => employee.parentId === props.employee.id.toString()
              )
              .map((employee) => (
                <div style={styles.cardItemTeam} key={employee.id}>
                  <img
                    style={styles.cardItemImg}
                    src={employee.imageUrl}
                    alt="Profile"
                  />
                  <p style={styles.cardItemName}>{employee.name}</p>
                  <p style={styles.cardItemRole}>{employee.positionName}</p>
                </div>
              ))}
          </div>
        </div>
      )} */}
      <div style={styles.cardItem}>
        {/* <p style={styles.cardItemLabel}>Description:</p> */}
        {/* <p style={styles.cardItemValue}>{props.employee.description}</p> */}
        <div style={styles.cardItemValue} dangerouslySetInnerHTML={{ __html: props.employee.description }}></div>
      </div>
    </div>
    </Draggable>
  );
};

export default EmployeeDetailsCard;
