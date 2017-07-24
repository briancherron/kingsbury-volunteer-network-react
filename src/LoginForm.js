import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import $ from 'jquery';
import { Grid, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      validationState: null,
      loggedIn: false

    };
    this.getValidationState = this.getValidationState.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getValidationState() {
    return this.state.validationState;
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmit(e) {
    var _self = this;
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/auth/login",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    }).done(function(data) {
      _self.setState({
        validationState: "success"
      });
      _self.props.onLogin(data);
      _self.setState({
        loggedIn: true
      });
    }).fail(function(response) {
      _self.setState({
        validationState: "error"
      });
    });
  }

  render() {
    if (this.state.loggedIn) {
      return <Redirect to={"/"} />
    }
    return (
      <Grid>
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            controlId="loginEmail"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Email Address</ControlLabel>
            <FormControl
              type="email"
              noValidate
              value={this.state.email}
              placeholder="Email Address"
              onChange={this.handleEmailChange} />
          </FormGroup>

          <FormGroup
            controlId="loginPassword"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              placeholder="Password"
              onChange={this.handlePasswordChange} />
          </FormGroup>

          <Button
            bsStyle="primary"
            block
            type="submit"
          >
            Log in
          </Button>

          <Button
            bsStyle="link"
            block
            onClick={this.handleSignUpClick}
          >
            <Link to={"/profile/new"}>Need an account? Sign Up!</Link>
          </Button>
        </form>
      </Grid>
    );
  }
}
