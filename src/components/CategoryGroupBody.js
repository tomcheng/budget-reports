import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class CategoryGroupBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payeeId: PropTypes.string.isRequired
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { categoryGroup } = this.props;

    return <div>{categoryGroup.name}</div>;
  }
}

export default CategoryGroupBody;
