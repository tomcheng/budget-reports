import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class CategoryBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payeeId: PropTypes.string.isRequired
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    category: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { category } = this.props;

    return <div>{category.name}</div>;
  }
}

export default CategoryBody;
