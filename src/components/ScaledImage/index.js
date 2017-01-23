import React, { PropTypes } from 'react';
import axios from 'axios';

export default class ScaledImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  componentDidMount() {
    if (this.props.id && this.props.width) {
      this.renderImage(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && nextProps.width) {
      if (nextProps.id !== this.props.id) {
        this.renderImage(nextProps);
      }
    }
  }

  renderImage(props) {
    const url = `http://localhost:3000/images/${props.id}/${props.width}`;
    const fetchImage = axios.get(url);
    const self = this;
    fetchImage.then((result) => {
      self.setState({
        url: result.data.url,
      });
    });
  }

  render() {
    return (
      <img className={this.props.styles} src={this.state.url} alt="Product Logo" />
    );
  }
}


ScaledImage.defaultProps = {
  width: 200,
};

ScaledImage.propTypes = {
  styles: PropTypes.string,
  id: PropTypes.number,
  width: PropTypes.number,
};
