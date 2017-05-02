/* eslint-disable no-magic-numbers */
import React from 'react';

export default class RectDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 200,
      height: 200
    };
  }

  componentDidMount() {
    setInterval(
      () =>
        this.setState(state => ({
          width: state.width + 10,
          height: state.height + 10
        })),
      5000
    );
  }

  render() {
    return <rect width={this.state.width} height={this.state.height} />;
  }
}
