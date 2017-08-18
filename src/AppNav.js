import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';
import $ from 'jquery';
import { Navbar, Nav, NavItem, Glyphicon, NavDropdown, MenuItem } from 'react-bootstrap';


export default class AppNav extends Component {

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout(e) {
    const _self = this;
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/auth/logout"
    }).done(function(data) {
      _self.props.handleLogout();
    }).fail(function(response) {
      console.log(response);
    });
  }

  render() {
    const username = this.props.user ? this.props.user.firstName : null;
    let toggle = null;
    let navigation = null;
    if (this.props.user) {
      toggle = <Navbar.Toggle />;
      navigation =
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to={"/new-task"}>
              <NavItem><Glyphicon glyph="file" /><span className="hidden-sm"> New Task</span></NavItem>
            </LinkContainer>
            <LinkContainer to={"/my-tasks"}>
              <NavItem><Glyphicon glyph="tasks" /><span className="hidden-sm"> My Tasks</span></NavItem>
            </LinkContainer>
            <LinkContainer to={"/find-tasks"}>
              <NavItem><Glyphicon glyph="search" /><span className="hidden-sm"> Find Tasks</span></NavItem>
            </LinkContainer>
            <LinkContainer to={"/skills-and-interests"}>
              <NavItem><Glyphicon glyph="wrench" /><span className="hidden-sm"> Skills &amp; Interests</span></NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavDropdown title={<span><Glyphicon glyph='user' /> <span className="hidden-xs">{username}</span></span>} id="user-nav-dropdown" className="hidden-xs">
              <LinkContainer to={"/profile"}>
                <MenuItem><Glyphicon glyph="edit" /> Edit Profile</MenuItem>
              </LinkContainer>
              <LinkContainer to={"/change-password"}>
                <MenuItem><Glyphicon glyph="lock" /> Change Password</MenuItem>
              </LinkContainer>
              <MenuItem onClick={this.logout}><Glyphicon glyph="log-out" /> Log out</MenuItem>
            </NavDropdown>
            <NavItem><hr className="visible-xs" /></NavItem>
            <LinkContainer to={"/profile"} className="visible-xs">
              <NavItem><Glyphicon glyph="edit" /><span className="hidden-sm"> Edit Profile</span></NavItem>
            </LinkContainer>
            <LinkContainer to={"/change-password"} className="visible-xs">
              <NavItem><Glyphicon glyph="lock" /><span className="hidden-sm"> Change Password</span></NavItem>
            </LinkContainer>
            <NavItem onClick={this.logout} className="visible-xs"><Glyphicon glyph="log-out" /><span className="hidden-sm"> Log out</span></NavItem>
          </Nav>
        </Navbar.Collapse>;
    } else {
      toggle = null;
      navigation = null;
    }

    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand style={{ padding: '2px 10px' }}>
            <Link to={this.props.user ? "/" : "/login"}>
              <img src="/logo.png" alt="kingsbury country day school logo" />
              <Navbar.Text>
                <span className="visible-xs visible-sm visible-md">Volunteer Network</span>
                <span className="visible-lg">Kingsbury Community Volunteer Network</span>
              </Navbar.Text>
            </Link>
          </Navbar.Brand>
          {toggle}
        </Navbar.Header>
        {navigation}
      </Navbar>
    );
  }
}
