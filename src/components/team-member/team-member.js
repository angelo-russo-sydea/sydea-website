import React from 'react';
import './team-member.scss';

const TeamMember = ({ name, role, photo }) => {
  return (
    <div className="team-member">
      {photo && (
        <div className="team-photo">
          <img src={photo} alt={name} />
        </div>
      )}
      <div className="team-details">
        <p className="team-name">{name}</p>
        {role && <p className="team-role">{role}</p>}
      </div>
    </div>
  );
};

export default TeamMember;
