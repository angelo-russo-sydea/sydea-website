import React, { Component } from 'react';
import Cell from '../cell/cell';
import './branch.scss';

export default class Branch extends Component {
  render() {
    const { data } = this.props;
    var hasChildren = false;
    var hasTeam = false;

    if (data.children) {
      hasChildren = data.children.length > 0;
    }
    if (data.team) {
        hasTeam = data.team.length > 0;
      }
    return (
      <div className="branch-page">
        <Cell name={data.name} role={data.role} hasChildren={hasChildren} photo={data.photo} hasTeam={hasTeam} data={data}
        />
      </div>
    )
  }
}
