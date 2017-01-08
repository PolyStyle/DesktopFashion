import React, { PropTypes } from 'react';
import { Button } from 'reactstrap';

class TagComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // GOOD: toggle this.state.isActive on click
  handleClick() {
    const active = !this.state.isActive;
    this.setState({ isActive: active });
  }

  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <tr>
        <th scope="row">{this.props.tag.id}</th>
        <td>{this.props.tag.displayName}</td>
        <td>
          <Button onClick={this.handleClick} color="primary" size="sm">edit</Button>
          <Button color="secondary" size="sm">save</Button>
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
