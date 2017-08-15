import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import $ from 'jquery';
import { Grid, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import Feedback from './Feedback.js';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggedIn: false,
      feedback: {}
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      data: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    }).done(function(data) {
      _self.props.onLogin(data);
      _self.setState({
        loggedIn: true,
        feedback: {}
      });
    }).fail(function(response) {
      const feedback = {
        dangerMessages: []
      };
      switch (response.status) {
        case 404:
          feedback.dangerMessages.push("Sorry, no account was found matching the email address and password.");
          break;
        default:
          feedback.dangerMessages.push("Sorry, an unexpected error has occurred.");
          break;
      }
      _self.setState({
        feedback: feedback
      });
    });
  }

  render() {
    if (this.state.loggedIn) {
      return <Redirect to={"/"} />
    }
    return (
      <Grid>
        <Feedback {...this.state.feedback} />
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            controlId="loginEmail"
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

          </Button>
        </form>
      </Grid>
    );
    //TODO: sign up should be by invite-only
    //<Link to={"/profile/new"}>Need an account? Sign Up!</Link>
  }
}
