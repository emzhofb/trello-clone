import React, { Component } from "react";
import Data from "../components/Data";
import Navigation from "./Navigation";

class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <Navigation />
        </div>
        <div>
          <Data />
        </div>
      </div>
    );
  }
}

export default Home;
