import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { Grid, FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';
import Feedback from './Feedback.js';

export default class ResetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
      feedback: {},
      redirect: false
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleCodeChange(e) {
    this.setState({
      code: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmit(e) {
    const _self = this;
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/auth/reset-password",
      contentType: "application/json",
      data: JSON.stringify({
        email: this.state.email,
        passwordResetKey: this.state.code,
        password: this.state.password
      })
    }).done(function(data) {
      _self.setState({
        redirect: true
      });
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/"} />
    }

    return(
      <Grid>
        <Feedback {...this.state.feedback} />
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Email Address</ControlLabel>
            <FormControl
              type="email"
              noValidate
              value={this.state.email}
              placeholder="Enter email addresss"
              onChange={this.handleEmailChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Code</ControlLabel>
            <FormControl
              type="text"
              value={this.state.code}
              placeholder="Enter code"
              onChange={this.handleCodeChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>New Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              placeholder="Enter new password"
              onChange={this.handlePasswordChange}
            />
          </FormGroup>
          <Button
            bsStyle="primary"
            block
            onClick={this.handleSubmit}
          >
            <Glyphicon glyph="floppy-disk"/> Reset Password
          </Button>
        </form>
      </Grid>
    );
  }
}
