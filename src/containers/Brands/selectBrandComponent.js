import React, { PropTypes } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class SelectBrandComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      selectedItem: this.props.selectedItem || {},
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.selectedItem = this.selectedItem.bind(this);
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  selectedItem(item) {
    if (this.state.selectedItem.id !== item.id) {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen,
        selectedItem: item,
      });
      if (this.props.onChange) {
        // if there is an onChange function, invoke it.
        this.props.onChange(item);
      }
    }
  }


  render() {
    // use the classSet addon to concat an array of class names together
    return (
      <div>
        <Dropdown group isOpen={this.state.dropdownOpen} size="sm" toggle={this.toggleDropDown}>
          <DropdownToggle caret>
            {this.state.selectedItem.displayName || 'Select Item'}
          </DropdownToggle>
          <DropdownMenu>
            {this.props.brands.map((brand, index) => (
              <DropdownItem
                onClick={() => this.selectedItem(brand)}
                key={index}
              >
                {brand.displayName}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

SelectBrandComponent.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  selectedItem: PropTypes.object,
  brands: PropTypes.arrayOf(PropTypes.object),
};

export default SelectBrandComponent;
