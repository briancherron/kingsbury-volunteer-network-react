import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import $ from 'jquery';
import AppNav from './AppNav.js'
import Home from './Home.js'
import Tasks from './Tasks.js'
import Task from './Task.js'
import LoginForm from './LoginForm.js'
import Profile from './Profile.js'
import ChangePassword from './ChangePassword.js'
import Categories from './Categories.js'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      visible: false
    };

    this.requireLogin = this.requireLogin.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  //FIXME: this doesn't run when clicking on a link like the 'home' link on the login page...
  requireLogin() {
    //TODO: find a more 'react/react-router' way of doing this other than componentWillMount...
    if (!this.state.user) {
      var _self = this;
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/auth/logged-in",
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        _self.setState({
          user: data
        });
      }).fail(function(response) {
        _self.context.router.history.push("/login");
      }).always(function() {
        _self.setState({
          visible: true
        });
      });
    }
  }

  handleUserUpdate(user) {
    this.setState({
      user: user
    });
  }

  handleLogout() {
    this.context.router.history.push("/login");
    this.setState({
      user: null
    });
  }

  componentWillMount() {
    this.requireLogin();
  }

  render() {
    if(this.state.visible) {
        return(
          <main>
            <AppNav user={this.state.user} handleLogout={this.handleLogout} />
            <Switch>
              <Route exact path="/" render={(props) => <Home user={this.state.user} />} />
              <Route path="/login" render={(props) => <LoginForm onLogin={this.handleUserUpdate} />} />
              <Route exact path="/find-tasks" component={Tasks} />
              <Route exact path="/new-task" render={(props) => <Task {...props} user={this.state.user} />} />
              <Route exact path="/my-tasks" render={(props) => <Tasks user={this.state.user} />} />
              <Route path="/tasks/:id" render={(props) => <Task {...props} user={this.state.user} />} />
              <Route path="/profile/new" component={Profile} />
              <Route path="/profile/" render={(props) => <Profile user={this.state.user} onUpdate={this.handleUserUpdate} />} />
              <Route path="/change-password" render={(props) => <ChangePassword user={this.state.user} />} />
              <Route path="/skills-and-interests" component={Categories} />
            </Switch>
          </main>
      );
    }

    return null;
  }
}

Main.contextTypes = {
  router: React.PropTypes.object
}
