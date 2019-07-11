import React from 'react';
import {TextForm} from './TextForm';

export default class Column extends React.Component {

  state = {
    visibility: false
  }

  handleVisibilityFalse = ()=>{
    this.setState({visibility:false})
  }

  handleVisibilityTrue = ()=>{
    this.setState({visibility:true})
  }

  render(){
    return (
      <div className="Column" key={this.props.columnId}>
        <div className="columnHeader">
          <div className="Column__title">{this.props.title}</div>
          <button className="addButton" onClick={this.handleVisibilityTrue}><span>+</span></button>
        </div>
        {this.props.children}
        {(this.state.visibility ||  this.props.isDoubleClick) && <TextForm handleVisibilityFalse={this.handleVisibilityFalse} onSubmit={this.props.addCard} placeholder="New item..." />}
      </div>
    );
  }
}
