import React, { Component } from "react";
import firebase from "../firebase/index";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      message: ""
    };
  }

  _userSignUp = e => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        // console.log(error.message);
        this.setState({
          message: error.message
        });
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
            <h3>Sign Up</h3>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                value={this.state.name}
                onChange={this._handleChange}
                type="text"
                name="name"
                placeholder="Full Name"
              />
            </FormGroup>
            <Label>Email Address</Label>
            <br />
            <Input
              value={this.state.email}
              onChange={this._handleChange}
              type="email"
              name="email"
              placeholder="Email"
            />
            <br />
            <Label>Password</Label>
            <br />
            <Input
              value={this.state.password}
              onChange={this._handleChange}
              type="password"
              name="password"
              placeholder="Password"
            />
            <br />
            <Button color="info" type="submit" onClick={this._userSignUp}>
              Sign Up
            </Button>
            <br />
            <br />
            <small>{this.state.message}</small>
          </div>
        </Form>
      </div>
    );
  }
}

export default SignUp;
