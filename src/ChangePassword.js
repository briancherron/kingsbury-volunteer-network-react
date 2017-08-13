import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { Grid, FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';

export default class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordChange: {
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
      },
      redirect: false
    }

    this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleNewPasswordConfirmChange = this.handleNewPasswordConfirmChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleCurrentPasswordChange(e) {
    const newPasswordChange = Object.assign({}, this.state.passwordChange);
    newPasswordChange.currentPassword = e.target.value;
    this.setState({
      passwordChange: newPasswordChange
    });
  }

  handleNewPasswordChange(e) {
    const newPasswordChange = Object.assign({}, this.state.passwordChange);
    newPasswordChange.newPassword = e.target.value;
    this.setState({
      passwordChange: newPasswordChange
    });
  }

  handleNewPasswordConfirmChange(e) {
    const newPasswordChange = Object.assign({}, this.state.passwordChange);
    newPasswordChange.newPasswordConfirm = e.target.value;
    this.setState({
      passwordChange: newPasswordChange
    });
  }

  handleSave(e) {
    const _self = this;
    $.ajax({
      type: "PUT",
      url: "/task-tracker/api/auth/change-password",
      contentType: "application/json",
      data: JSON.stringify(this.state.passwordChange)
    }).done(function(data) {
      _self.setState({
        redirect: true
      });
    }).fail(function(response) {
      //TODO: feedback messages
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/"} />
    }

    return(
      <Grid>
        <form>
          <FormGroup>
            <ControlLabel>Current Password</ControlLabel>
            <FormControl
              type="password"
              noValidate
              value={this.state.currentPassword}
              placeholder="Enter your current password"
              onChange={this.handleCurrentPasswordChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>New Password</ControlLabel>
            <FormControl
              type="password"
              noValidate
              value={this.state.newPassword}
              placeholder="Enter your new password"
              onChange={this.handleNewPasswordChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Confirm New Password</ControlLabel>
            <FormControl
              type="password"
              noValidate
              value={this.state.newPasswordConfirm}
              placeholder="Confirm your current password"
              onChange={this.handleNewPasswordConfirmChange}
            />
          </FormGroup>
          <Button
            bsStyle="primary"
            block
            onClick={this.handleSave}
          >
            <Glyphicon glyph="floppy-disk"/> Save
          </Button>
        </form>
      </Grid>
    );
  }
}
