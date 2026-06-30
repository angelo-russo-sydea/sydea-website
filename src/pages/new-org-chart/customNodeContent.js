import React from "react";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import HelpIcon from '@mui/icons-material/Help';

const styles = {
  nodeContainer: {
    minHeight: "150px",
    // backgroundColor: "#227c9d",
    backgroundColor: "#141414",
    color: "#227c9d",
    display: "flex",
    justifyContent: "center",
    borderRadius: "1rem",
    border: "2px solid #fece2f"
  },
  nodeDetails: {
    width: "100%",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  nodeContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "0.4rem"
  },
  nodeTeam: {
    width: "100%",
    textAlign: "center",
  },
  nodeTeamName: {
    marginBottom: "0.5rem",
    color: "#fef9ef",
    fontSize: "1.4rem",
    fontWeight: "bold",
  },
  nodeTeamMemberImg: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    margin: "0.2rem",
  },
  nodeImg: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "50%"
  },
  nodeInfo: {
    // marginLeft: "1.5rem",
    color: "#fef9ef",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  nodeName: {
    paddingBottom: "0.3rem",
    fontSize: "1rem"
  },
  nodeRole: {
    paddingBottom: "0.5rem",
    fontSize: "1.4rem",
    fontWeight: "bold",
    // color: '#fece2f'
  },
  nodeDepartment: {
    padding: "0.5rem",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffcb77",
    borderRadius: "1rem",
    color: "#227c9d",
  },
  icon: {
    marginRight: "0.5rem",
  },
};

const CustomNodeContent = (props) => {
  return (
    <>
      <div style={styles.nodeContainer} className={`${props.data.mainArea ? 'node-main-area':''}`}>
        <div style={styles.nodeDetails}>
          {props.data.team === "" ? (
            <div style={styles.nodeContent}>
                {
                    props.data.imageUrl && 
                    <img
                        style={styles.nodeImg}
                        src={props.data.imageUrl}
                        alt="Profile"
                    />
                }
              <div style={styles.nodeInfo}>
                {/* <div style={styles.nodeName}>{props.data.name}</div> */}
                <div style={styles.nodeRole}>{props.data.positionName}</div>
                <div style={styles.nodeName}>{props.data.name}</div>
                {
                  // props.data.description && <HelpIcon className="help-icon-org-chart"/>
                  props.data.description && <img src={require("../../assets/icons/search.png")} className="help-icon-org-chart" />
                }
                {props.data.department && (
                  <div style={styles.nodeDepartment}>
                    <CorporateFareIcon style={styles.icon} />
                    <div>{props.data.department}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.nodeTeam}>
                {
                  props.data.description && <img src={require("../../assets/icons/search.png")} className="help-icon-org-chart" />
                }
              <div style={styles.nodeTeamName}>{props.data.team}</div>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  {props._children !== null && props._children !== undefined && (() => {
                    const childrenWithImage = props._children.filter(child => child.data.imageUrl);

                    return (
                      <>
                        {childrenWithImage.slice(0, 2).map((child) => (
                          <img
                            key={child.data.id}
                            style={styles.nodeTeamMemberImg}
                            src={child.data.imageUrl}
                            alt="team member"
                          />
                        ))}
                        {childrenWithImage.length > 2 && (
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              margin: '0.2rem',
                              border: '1px solid',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                            }}
                          >
                            <span>+ {childrenWithImage.length - 2}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomNodeContent;
