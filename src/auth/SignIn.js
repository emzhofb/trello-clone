import React, { Component } from "react";
import firebase from "../firebase/index";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  _userSignIn = e => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        console.log(error);
      });

    e.preventDefault();
  };

  _handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div>
        <Form>
          <div className="container">
            <h3>Sign In</h3>
            <FormGroup>
              <Label>Email Address</Label>
              <Input
                value={this.state.email}
                onChange={this._handleChange}
                type="email"
                name="email"
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                value={this.state.password}
                onChange={this._handleChange}
                type="password"
                name="password"
                placeholder="Password"
              />
            </FormGroup>
            <Button color="success" type="submit" onClick={this._userSignIn}>
              Sign In
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default SignIn;
