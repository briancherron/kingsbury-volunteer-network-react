import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox, Button, Glyphicon } from 'react-bootstrap';
import CategorySelection from './CategorySelection'

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
        recognitionOptIn: false,
        categories: []
      },
      categories: [],
      redirect: false
    };

    this.handleCategoriesLoaded = this.handleCategoriesLoaded.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleReEnterPasswordChange = this.handleReEnterPasswordChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleRecognitionOptInChange = this.handleRecognitionOptInChange.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleCategoryRemove = this.handleCategoryRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  handleReEnterPasswordChange(e) {
    //TODO
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
    });
  }

  handleSave(e) {
    var _self = this;
    $.ajax({
      type: this.state.user.id ? "PUT" : "POST",
      url: "/task-tracker/api/users/" + (this.state.user.id ? this.state.user.id : ""),
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.user)
    }).done(function(data) {
      _self.props.onUpdate(data);
      _self.setState({
        redirect: true
      });
    }).fail(function(response) {
      console.log(response);
    });
  }

  handleDelete(e) {
    var _self = this;
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
    var categorySelection = <CategorySelection ready={this.handleCategoriesLoaded} allCategories={this.state.categories} selectedCategories={this.state.user.categories} handleCategoryAdd={this.handleCategoryAdd} handleCategoryRemove={this.handleCategoryRemove} />
    const passwordSection = this.state.user
      ? null
      : <div>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              placeholder="Enter a password"
              value={this.state.user.password}
              onChange={this.handlePasswordChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Re-enter Password</ControlLabel>
            <FormControl
              type="password"
              placeholder="Enter a password"
              onChange={this.handleReEnterPasswordChange}
            />
          </FormGroup>
        </div>;
    const buttonRow = this.state.user.id
      ? <Row>
          <Col xs={6}>
            <Button
              bsStyle="primary"
              block
              onClick={this.handleSave}
            >
              <Glyphicon glyph="floppy-disk"/> Save
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              bsStyle="default"
              block
              onClick={this.handleDelete}
            >
              <Glyphicon glyph="trash"/> Delete
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
          {passwordSection}
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

          <FormGroup>
              <Checkbox onChange={this.handleRecognitionOptInChange} checked={this.state.user.recognitionOptIn}>Yes, I would like to be recognized for contributing to completed tasks.</Checkbox>
          </FormGroup>

          {categorySelection}
          {buttonRow}
        </form>
      </Grid>
    );
  }
}
