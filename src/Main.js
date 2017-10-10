import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import $ from 'jquery';
import { Glyphicon } from 'react-bootstrap';
import AppNav from './AppNav.js';
import Home from './Home.js';
import Tasks from './Tasks.js';
import Task from './Task.js';
import LoginForm from './LoginForm.js';
import Profile from './Profile.js';
import ChangePassword from './ChangePassword.js';
import Categories from './Categories.js';
import Invitation from './Invitation.js';
import Introduction from './Introduction.js';
import ForgotPassword from './ForgotPassword.js';
import ResetPassword from './ResetPassword.js';

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

    const _self = this;
    $(document).ajaxError(function(event, response) {
      if (response.status === 401 || response.status === 403) {
        if (window.location.pathname.indexOf("/join") !== 0
          && window.location.pathname.indexOf("/forgot-password") !== 0
          && window.location.pathname.indexOf("/reset-password") !== 0) {
          _self.setState({
            user: null
          });
          _self.context.router.history.push("/login");
        }
      }
    });
    $(document).ajaxStart(function() {
      $(".loading-shield").show();
    });
    $(document).ajaxStop(function() {
      $(".loading-shield").hide();
    });
  }

  //FIXME: this doesn't run when clicking on a link like the 'home' link on the login page...
  requireLogin() {
    //TODO: find a more 'react/react-router' way of doing this other than componentWillMount...
    if (!this.state.user) {
      this.setState({
        visible: false
      });

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
        if (window.location.pathname.indexOf("/join/") === 0) {
          _self.context.router.history.push("/profile");
        }
      }).fail(function(response) {
        /*if (window.location.pathname.indexOf("/join/") !== 0) {
          _self.context.router.history.push("/login");
        }*/
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
            <div className="loading-shield"><div className="shield"></div><div className="spinner glyphicon glyphicon-hourglass"></div></div>
            <AppNav user={this.state.user} handleLogout={this.handleLogout} />
            <Switch>
              <Route exact path="/" render={(props) => <Home user={this.state.user}  requireLogin={this.requireLogin} visible={this.state.visible} />} />
              <Route path="/login" render={(props) => <LoginForm onLogin={this.handleUserUpdate} />} />
              <Route exact path="/find-tasks" render={(props) => <Tasks {...props} user={this.state.user} myTasks={false} />} />
              <Route exact path="/new-task" render={(props) => <Task {...props} user={this.state.user} />} />
              <Route exact path="/my-tasks" render={(props) => <Tasks {...props} user={this.state.user} myTasks={true} />} />
              <Route path="/tasks/:id" render={(props) => <Task {...props} user={this.state.user} />} />
              <Route path="/profile/" render={(props) => <Profile {...props} user={this.state.user} onUpdate={this.handleUserUpdate} />} />
              <Route path="/change-password" render={(props) => <ChangePassword user={this.state.user} />} />
              <Route path="/skills-and-interests" component={Categories} />
              <Route path="/send-invitation/" component={Invitation} />
              <Route path="/join/:id" render={(props) => <Profile {...props} user={this.state.user} onUpdate={this.handleUserUpdate} />} />
              <Route path="/introduction" render={(props) => <Introduction {...props} user={this.state.user} />} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
            </Switch>
            <footer className="footer">
              <div className="container">
                <p className="text-muted pull-right">
                  Developed by Brian Herron <a href="mailto:briancherron@gmail.com"><Glyphicon glyph="envelope" /></a>
                </p>
              </div>
            </footer>
          </main>
      );
    }

    return null;
  }
}

Main.contextTypes = {
  router: React.PropTypes.object
}
