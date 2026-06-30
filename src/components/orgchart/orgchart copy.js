import React from 'react';
import './orgchart.scss';
import TeamMember from '../team-member/team-member';

export const OrgChart = ({ tree, NodeComponent }) => {

  const renderChildren = (node) => {

    const teamMembers = node.team || [];

    const hasSiblingRight = (childIndex) => {
      return (node.children || []).length > childIndex + 1;
    };

    const hasSiblingLeft = (childIndex) => {
      return childIndex > 0;
    };

    const nodeLineBelow = (
      <td colSpan={(node.children || []).length * 2} className="nodeGroupCellLines">
        <table className="nodeLineTable">
          <tbody>
            <tr>
              <td colSpan={2} className="nodeLineCell nodeGroupLineVerticalMiddle" />
              <td colSpan={2} className="nodeLineCell" />
            </tr>
          </tbody>
        </table>
      </td>
    );

    const childrenLinesAbove = (node.children || []).map((child, childIndex) => (
      <td colSpan="2" className="nodeGroupCellLines" key={childIndex}>
        <table className="nodeLineTable">
          <tbody>
            <tr>
              <td colSpan={2} className={`nodeLineCell nodeGroupLineVerticalMiddle${hasSiblingLeft(childIndex) ? ' nodeLineBorderTop' : ''}`} />
              <td colSpan={2} className={`nodeLineCell${hasSiblingRight(childIndex) ? ' nodeLineBorderTop' : ''}`} />
            </tr>
          </tbody>
        </table>
      </td>
    ));

    const children = (node.children || []).map((child, childIndex) => (
      <td colSpan="2" className="nodeGroupCell" key={childIndex}>
        {renderChildren(child)}
      </td>
    ));

    const renderTeam = (team, isDxToSx) => {
      return team.map((leader, leaderIndex) => (
        // <div className='d-flex row-team align-items-center'>
        //   <div className='row-team-member' style={{width:'50%', order: isDxToSx ? 0 : 1}}>
        //        {leader.team && leader.team.map((member, memberIndex) => (
        //          <div key={memberIndex} className="team-member">
        //            <p className='m-0 team-leader-name text-end' style={{fontSize:'12px'}}>{member.name}</p>
        //          </div>
        //        ))}
        //   </div>
        //   <div key={leaderIndex} className='p-1' style={{width:'50%',  order: isDxToSx ? 1 : 0}}>
        //     <p className='m-0 team-leader-name fw-bold text-center'>{leader.name}</p>
        //   </div>
        // </div>
        <tr key={leaderIndex}>
          {/* Colonna per il capo del team */}
          <td className="nodeGroupCell">
            <NodeComponent node={leader} />
          </td>
  
          {/* Colonna per i membri del team */}
          <td className="team-members">
            <div className="team-members-container">
              {leader.team && leader.team.map((member, memberIndex) => (
                <div key={memberIndex} className="team-member">
                  <NodeComponent node={member} />
                </div>
              ))}
            </div>
          </td>
        </tr>
      ));
    };

    return (
      <table className="orgNodeChildGroup">
        <tbody style={{position: 'relative'}}>
          <tr>
            <td className="nodeCell" colSpan={(node.children || []).length * 2}>
              <NodeComponent node={node} />
            </td>
          </tr>
          <tr>
            {(node.children || []).length > 0 && nodeLineBelow}
          </tr>
          <tr>
            {childrenLinesAbove}
          </tr>
          <tr>
            {children}
          </tr>
          <tr className={`${node.teamDxToSx ? 'team-dx-sx' : 'team-sx-dx'}`}>
          {node.team && renderTeam(node.team, node.teamDxToSx)}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="reactOrgChart">
      {renderChildren(tree)}
    </div>
  );
};
