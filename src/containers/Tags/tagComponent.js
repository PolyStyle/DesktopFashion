import React, { PropTypes } from 'react';
import { Button, Input, Badge } from 'reactstrap';

class TagComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEdited: false,
      value: props.tag.displayName,
      index: props.index,
      id: props.tag.id,
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
    }, this.props.saveHandler(this.state));
  }

  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <tr>
        <th scope="row">{this.props.tag.id || <Badge color="default" pill>new</Badge>}</th>
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
  index: PropTypes.number,
  saveHandler: PropTypes.function,
};

export default TagComponent;
