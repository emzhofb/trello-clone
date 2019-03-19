import React, { Component } from "react";
import Home from "./partials/Home";
import firebase from "./firebase/index";
import Page from "./auth/Page";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  };
  render() {
    return <div>{this.state.user ? <Home /> : <Page />}</div>;
  }
}

export default App;
