import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap';
import Feedback from './Feedback.js';

export default class Invitation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      feedback: {}
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
  }

  handleFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  handleLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  sendInvitation(e) {
    e.preventDefault();
    const _self = this;
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/invitations/send",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        firstName: _self.state.firstName,
        lastName: _self.state.lastName,
        email: _self.state.email
      })
    }).done(function(data) {
      _self.setState({
        feedback: {}
      });
      _self.props.history.push("/");
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
    });
  }

  render() {
    return (
      <Grid>
        <form onSubmit={this.sendInvitation}>
          <Feedback {...this.state.feedback} />
          <h4>Invite a volunteer to join the network</h4>
          <FormGroup>
            <ControlLabel>First Name</ControlLabel>
              <FormControl type="text" onChange={this.handleFirstNameChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Last Name</ControlLabel>
              <FormControl type="text" onChange={this.handleLastNameChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Email Address</ControlLabel>
              <FormControl type="email" onChange={this.handleEmailChange} />
          </FormGroup>
          <Button bsStyle="primary" block type="submit">
            <Glyphicon glyph="envelope" /> Send Invitation
          </Button>
        </form>
      </Grid>
    );
  }
}
