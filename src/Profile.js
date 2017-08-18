import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';
import CategorySelection from './CategorySelection.js';
import Feedback from './Feedback.js';

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        password: "",
        phone: "",
        firstName: "",
        lastName: "",
        recognitionOptIn: true,
        categories: [],
      },
      joining: false,
      categories: [],
      redirect: false,
      feedback: {}
    };

    this.handleCategoriesLoaded = this.handleCategoriesLoaded.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleRecognitionOptInChange = this.handleRecognitionOptInChange.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleCategoryRemove = this.handleCategoryRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
  }

  handleCategoriesLoaded(categories) {
    this.setState({
      categories: categories,
      categoriesReady: true
    });
    this.loadUser();
  }

  loadUser() {
    var _self = this;
    if (_self.props.user) {
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/users/" + _self.props.user.id,
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        const newState = Object.assign({}, _self.state);
        newState.user = data;
        newState.user.categories.forEach(function(tc) {
          newState.categories.find(function(c) {
            return tc.id === c.id;
          }).added = true;
        });
        _self.setState(newState);
      }).fail(function(response) {
        console.log(response);
      });
    } else {
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/invitations/" + this.props.match.params.id,
        dataType: "json"
      }).done(function(data) {
        const newState = Object.assign({}, _self.state);
        newState.user.id = data.id;
        newState.user.email = data.email;
        newState.user.firstName = data.firstName;
        newState.user.lastName = data.lastName;
        newState.joining = true;
        _self.setState(newState);
      }).fail(function(response) {
        console.log(response);
      });
    }
  }

  handleEmailChange(e) {
    const user = Object.assign({}, this.state.user);
    user.email = e.target.value;
    this.setState({
      user: user
    });
  }

  handlePasswordChange(e) {
    const user = Object.assign({}, this.state.user);
    user.password = e.target.value;
    this.setState({
      user: user
    });
  }

  handlePhoneChange(e) {
    const user = Object.assign({}, this.state.user);
    user.phone = e.target.value;
    this.setState({
      user: user
    });
  }

  handleFirstNameChange(e) {
    const user = Object.assign({}, this.state.user);
    user.firstName = e.target.value;
    this.setState({
      user: user
    });
  }

  handleLastNameChange(e) {
    const user = Object.assign({}, this.state.user);
    user.lastName = e.target.value;
    this.setState({
      user: user
    });
  }

  handleRecognitionOptInChange(e) {
    const user = Object.assign({}, this.state.user);
    user.recognitionOptIn = e.target.checked;
    this.setState({
      user: user
    });
  }

  handleCategoryAdd(category) {
    const newState = Object.assign({}, this.state);
    this.setState(function(previousState) {
      newState.user.categories = previousState.user.categories.concat([{
        id: category.id,
        name: category.name
      }]);
      newState.categories.find(function(c) {
        return c.id === category.id;
      }).added = true;

      return newState;
    });
  }

  handleCategoryRemove(category) {
    const newState = Object.assign({}, this.state);
    this.setState(function(previousState) {
      newState.user.categories = previousState.user.categories.filter(function(c) {
          return c.id !== category.id;
      });
      newState.categories.find(function(c) {
        return c.id === category.id;
      }).added = false;

      return newState;
    }, function() {
      this.updateCategories();
    });
  }

  updateCategories() {
    return $.ajax({
      type: "PUT",
      url: "/task-tracker/api/users/" + this.state.user.id + "/interests-or-skills",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.user.categories)
    });
  }

  handleSave(e) {
    var _self = this;
    $.ajax({
      type: "PUT",
      url: !_self.state.joining ? "/task-tracker/api/users/" + (this.state.user.id ? this.state.user.id : "") :  "/task-tracker/api/users/join/",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.user)
    }).done(function(data) {
      _self.props.onUpdate(data);
      _self.setState({
        redirect: true
      });
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
    });
  }

  handleDelete(e) {
    const _self = this;
    $.ajax({
      type: "DELETE",
      url: "/task-tracker/api/users/" + this.state.user.id,
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      _self.setState({
        redirect: true
      });
    }).fail(function(response) {
      console.log(response);
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/"} />
    }
    var categorySelection = <CategorySelection ready={this.handleCategoriesLoaded} allCategories={this.state.categories} selectedCategories={this.state.user.categories} handleCategoryAdd={this.handleCategoryAdd} handleCategoryRemove={this.handleCategoryRemove} id={this.state.user.id} handleSave={this.updateCategories} />
    const passwordSection = !this.state.joining
      ? null
      : <div>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <span className="help-block" id="helpBlock">Passwords must be at least 8 characters long and contain at least one letter and one number.</span>
            <FormControl
              type="password"
              placeholder="Enter a password"
              value={this.state.user.password}
              onChange={this.handlePasswordChange}
            />
          </FormGroup>
        </div>;
    const buttonRow = this.state.joining
      ? <Row>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              block
              onClick={this.handleSave}
            >
              <Glyphicon glyph="floppy-disk"/> Join the Network
            </Button>
          </Col>
        </Row>
      : <Row>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              block
              onClick={this.handleSave}
            >
              <Glyphicon glyph="floppy-disk"/> Save
            </Button>
          </Col>
        </Row>;

    return(
      <Grid>
        <Feedback {...this.state.feedback} />
        <form>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type="email"
              noValidate
              value={this.state.user.email}
              placeholder="Enter an email address"
              onChange={this.handleEmailChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              type="text"
              placeholder="Enter a first name"
              value={this.state.user.firstName}
              onChange={this.handleFirstNameChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              type="text"
              placeholder="Enter a last name"
              value={this.state.user.lastName}
              onChange={this.handleLastNameChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Phone Number</ControlLabel>
            <FormControl
              type="tel"
              placeholder="Enter a phone number"
              value={this.state.user.phone}
              onChange={this.handlePhoneChange}
            />
          </FormGroup>

          {passwordSection}

          {/*<FormGroup>
              <Checkbox onChange={this.handleRecognitionOptInChange} checked={this.state.user.recognitionOptIn}>Yes, I would like to be recognized for contributing to completed tasks.</Checkbox>
          </FormGroup>*/}

          {categorySelection}
          {buttonRow}
        </form>
      </Grid>
    );
  }
}
