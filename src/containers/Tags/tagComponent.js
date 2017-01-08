import React, { PropTypes } from 'react';
import { Button, Input } from 'reactstrap';

class TagComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEdited: false,
      value: props.tag.displayName,
      tempValue: props.tag.displayName,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // GOOD: toggle this.state.isActive on click
  handleClick() {
    const active = !this.state.isEdited;
    this.setState({ isEdited: active });
  }

  handleChange(event) {
    this.setState({ tempValue: event.target.value });
  }

  handleSave(event) {
    console.log(event.target.value);
    this.setState({
      value: this.state.tempValue,
      isEdited: false,
    });
  }

  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <tr>
        <th scope="row">{this.props.tag.id}</th>
        <td>
          {!this.state.isEdited && this.state.value}
          {this.state.isEdited &&
            <Input type="text" placeholder={this.state.value} value={this.state.tempValue} onChange={this.handleChange} />}
        </td>
        <td>
          {!this.state.isEdited && <Button onClick={this.handleClick} color="primary" size="sm">edit</Button>}
          {this.state.isEdited && <Button onClick={this.handleClick} color="secondary" size="sm">cancel</Button>}
          {this.state.isEdited && <Button onClick={this.handleSave} color="success" size="sm">save</Button>}
        </td>
      </tr>
    );
  }
}

TagComponent.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.number,
    displayName: PropTypes.string,
  }),
};

export default TagComponent;
