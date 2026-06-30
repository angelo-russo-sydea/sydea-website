import React, { Component, useState } from 'react';
import './cell.scss';
import Branch from '../branch/branch';
import { OrgChartTeam } from '../orgchart/orgchartTeam';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      teamData: null
    };
  }

  showDetailTeam = () => {
    this.setState({
      showAlert: true,
      teamData: this.props.data.team
    });
  }

  closeAlert = () => {
    this.setState({ showAlert: false });
  }

  renderNodeInTable = (node) => {
    const hasSiblingRight = (index) => node.children && node.children.length > index + 1;
    const hasSiblingLeft = (index) => index > 0;

    const childrenLinesAbove = node.children?.map((child, index) => (
      <td colSpan="2" key={index} className="nodeLineCell">
        <table className="nodeLineTable">
          <tbody>
            <tr>
              <td colSpan={2} className={`nodeLineCell nodeGroupLineVerticalMiddle${hasSiblingLeft(index) ? ' nodeLineBorderTop' : ''}`} />
              <td colSpan={2} className={`nodeLineCell${hasSiblingRight(index) ? ' nodeLineBorderTop' : ''}`} />
            </tr>
          </tbody>
        </table>
      </td>
    ));

    const childrenNodes = node.children?.map((child, index) => (
      <td colSpan="2" key={index} className="nodeGroupCell">
        {this.renderNodeInTable(child)}
      </td>
    ));

    return (
      <table className="orgNodeChildGroup alert-node-table">
        <tbody>
          <tr>
            <td colSpan={(node.children?.length || 1) * 2} className="nodeCell">
              <div className="node-content">
                <p className="fw-bold">{node.name}</p>
                <p>{node.role}</p>
              </div>
            </td>
          </tr>
          {node.children && node.children.length > 0 && (
            <>
              <tr>
                <td colSpan={(node.children?.length || 1) * 2} className="nodeGroupCellLines">
                  <table className="nodeLineTable">
                    <tbody>
                      <tr>
                        <td colSpan={2} className="nodeLineCell nodeGroupLineVerticalMiddle" />
                        <td colSpan={2} className="nodeLineCell" />
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>{childrenLinesAbove}</tr>
              <tr>{childrenNodes}</tr>
            </>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    const { name, role, hasChildren, photo, hasTeam, data } = this.props;
    const { showAlert, teamData } = this.state;
    // const [treeData, setTreeData] = useState(data.team);

    const MyNodeComponent = ({ node }) => {
        return <div
        //   onDrop={() => onDrop()}
        //   onDragOver={(event) => dragOver(event, node)}
        //   draggable="true"
        //   onDragStart={() => drag(node)}
          >
          <Branch data={node} />
        </div>;
      };

    return (
      <div className="cell-page">
        <div className="title-area">
          <p className="title-text fw-bold m-0">
            {role}
          </p>
        </div>
        <p className="role-area m-0">{name}</p>

        {hasChildren && <div className="oval" />}

        {hasTeam && (
          <div className="box-icon-view" onClick={this.showDetailTeam}>
            <svg viewBox="0 0 851.6 851.6">
              <circle cx="425.8" cy="425.8" r="425.8" style={{fill:'#141414'}}/>
              <circle cx="425.8" cy="425.8" r="322.64" style={{fill:'#fece2f'}}/>
              <polygon points="209.74 343.32 428.52 562.07 641.86 348.75 588.08 294.96 428.52 454.53 263.52 289.53 209.74 343.32" style={{fill:'#141414', fillRule:'evenodd'}}/>
            </svg>
          </div>
        )}

        {showAlert && (
            <div className='overlay-modal-org-chart d-flex align-items-center justify-content-center' onClick={this.closeAlert}>
                <div className="modal-box-org-chart p-3">
                    <div className="alert-content" onClick={(e) => e.stopPropagation()}>
                        {/* {teamData && teamData.map((member, index) => (
                            this.renderNodeInTable(member)
                        ))} */}
                        <div className='d-flex justify-content-end'>
                            <IconButton aria-label="close" onClick={this.closeAlert} className='btn-close-modal-org'>
                                <CloseOutlinedIcon style={{color:'#9c9c9c'}}/>
                            </IconButton>
                        </div>
                        <div className="box-org">
                            <OrgChartTeam tree={data} NodeComponent={MyNodeComponent} />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }
}
