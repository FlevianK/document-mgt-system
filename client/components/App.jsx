import React, { PropTypes } from "react";
import Header from "./Common/Header.jsx";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
}
App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
