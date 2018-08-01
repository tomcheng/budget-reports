import { Component } from "react";
import PropTypes from "prop-types";

class Form extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    initialValues: PropTypes.object
  };

  constructor(props) {
    super();

    this.state = { values: props.initialValues || {} };
  }

  handleChange = ({ name, value }) => {
    this.setState(state => ({
      ...state,
      values: { ...state.values, [name]: value }
    }));
  };

  render() {
    const { children } = this.props;
    const { values } = this.state;

    return children({ values, onChange: this.handleChange });
  }
}

export default Form;
