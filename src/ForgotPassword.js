import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { Grid, FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';
import Feedback from './Feedback.js';

export default class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      feedback: {}
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleSubmit(e) {
    const _self = this;
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/auth/forgot-password",
      contentType: "application/json",
      data: this.state.email
    }).done(function(data) {
      _self.setState({
        feedback: data
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
              placeholder="Enter your email addresss"
              onChange={this.handleEmailChange}
            />
          </FormGroup>
          <Button
            bsStyle="primary"
            block
            onClick={this.handleSubmit}
          >
            <Glyphicon glyph="envelope"/> Reset Password
          </Button>
        </form>
      </Grid>
    );
  }
}
