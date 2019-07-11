import React, {Component} from 'react';

//this is a textbox component which is shown when the user clicks on + button
export class TextForm extends Component {
  onSubmit = event => {
    const form = event.target;
    event.preventDefault();
    this.props.onSubmit(form.input.value);
    form.reset();
    this.props.handleVisibilityFalse();
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} ref={node => (this.form = node)}>
        <input
          type="text"
          className="TextForm__input"
          name="input"
          placeholder={this.props.placeholder}
        />
      </form>
    );
  }
}
