import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, Glyphicon, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import CategorySelection from './CategorySelection';
import Feedback from './Feedback.js';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.newTask = {
      name: "",
      status: {
        id: 1,
        name: "Not Started"
      },
      date: "",
      description: "",
      categories: [],
      users: []
    }
    this.state = {
      task: Object.assign({}, this.newTask),
      categories: [],
      users: [],
      statuses: [],
      categoriesReady: false,
      usersReady: false,
      statusesReady: false,
      showInviteModal: false,
      showDeleteModal: false,
      feedback: {}
    };

    this.loadTask = this.loadTask.bind(this);
    this.handleCategoriesLoaded = this.handleCategoriesLoaded.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleCategoryRemove = this.handleCategoryRemove.bind(this);
    this.handleUserAdd = this.handleUserAdd.bind(this);
    this.handleUserRemove = this.handleUserRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.openInviteModal = this.openInviteModal.bind(this);
    this.closeInviteModal = this.closeInviteModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.handleUserInvite = this.handleUserInvite.bind(this);
  }

  componentDidMount() {
    var _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/users",
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      _self.setState({
        users: data,
        usersReady: true
      });
      if (_self.state.categoriesReady && _self.state.statusesReady) {
        _self.loadTask(_self.props.match.params.id);
      }
    });
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/tasks/statuses",
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      const task = Object.assign({}, _self.state.task);
      task.status = data[0];
      _self.setState({
        statuses: data,
        task: task,
        statusesReady: true
      });
      if (_self.state.categoriesReady && _self.state.usersReady) {
        _self.loadTask(_self.props.match.params.id);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.loadTask(null);
  }

  loadTask(id) {
    if (id) {
      var _self = this;
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/tasks/" + id,
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        const newState = Object.assign({}, _self.state);
        newState.task = data;
        newState.task.categories.forEach(function(tc) {
          newState.categories.find(function(c) {
            return tc.id === c.id;
          }).added = true;
        });
        newState.task.users.forEach(function(tu) {
          newState.users.find(function(u) {
            return tu.user.id === u.id;
          }).statusId = tu.statusId;
        });
        _self.setState(newState);
      }).fail(function(response) {
        console.log(response);
      });
    } else {
      this.setState({
        task: Object.assign({}, this.newTask)
      })
    }
  }

  handleCategoriesLoaded(categories) {
    this.setState({
      categories: categories,
      categoriesReady: true
    });
    if (this.state.usersReady && this.state.statusesReady) {
      this.loadTask();
    }
  }

  handleNameChange(e) {
    const task = Object.assign({}, this.state.task);
    task.name = e.target.value;
    this.setState({
      task: task
    });
  }

  handleStatusChange(e) {
    const task = Object.assign({}, this.state.task);
    task.status = {
      id: e.target.value,
      name: e.target.selectedOptions[0].text
    };
    this.setState({
      task: task
    });
  }

  handleDateChange(e) {
    const task = Object.assign({}, this.state.task);
    task.date = e.target.value;
    this.setState({
      task: task
    });
  }

  handleDescriptionChange(e) {
    const task = Object.assign({}, this.state.task);
    task.description = e.target.value;
    this.setState({
      task: task
    });
  }

  handleCategoryAdd(category) {
    const newState = Object.assign({}, this.state);
    this.setState(function(previousState) {
      newState.task.categories = previousState.task.categories.concat([{
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
      newState.task.categories = previousState.task.categories.filter(function(c) {
          return c.id !== category.id;
      });
      newState.categories.find(function(c) {
        return c.id === category.id;
      }).added = false;

      return newState;
    });
  }

  handleUserAdd(e) {
    const userId = this.props.user.id;
    const userEmail = this.props.user.email;
    const newState = Object.assign({}, this.state);
    this.setState(function(previousState) {
      const existingUser = newState.task.users.find((tu) => tu.user.id === userId);
      if (existingUser) {
        existingUser.statusId = 2;
      } else {
        newState.task.users = previousState.task.users.concat([{
          user: {
            id: userId,
            email: userEmail,
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName
          },
          statusId: 2
        }]);
      }
      newState.users.find(function(user) {
        return user.id === userId;
      }).statusId = 2;

      return newState;
    });
  }

  handleUserRemove(e) {
    const userId = this.props.user.id;
    const newState = Object.assign({}, this.state);
    this.setState(function(previousState) {
      newState.task.users = previousState.task.users.filter(function(tu) {
          return tu.user.id !== userId;
      });
      newState.users.find(function(user) {
        return user.id === userId;
      }).statusId = 0;

      return newState;
    });
  }

  handleSave(e) {
    var _self = this;
    $.ajax({
      type: this.state.task.id ? "PUT" : "POST",
      url: "/task-tracker/api/tasks/" + (this.state.task.id ? this.state.task.id : ""),
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.task)
    }).done(function(data) {
      _self.setState({
        feedback: {}
      });
      _self.props.history.push("/find-tasks");
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
    });
  }

  handleDelete(e) {
    var _self = this;
    $.ajax({
      type: "DELETE",
      url: "/task-tracker/api/tasks/" + this.state.task.id,
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      _self.props.history.push("/find-tasks");
    }).fail(function(response) {
      console.log(response);
    });
  }

  openInviteModal() {
    this.setState({
      showInviteModal: true
    });
  }

  closeInviteModal() {
    this.setState({
      showInviteModal: false
    });
  }

  openDeleteModal() {
    this.setState({
      showDeleteModal: true
    });
  }

  closeDeleteModal() {
    this.setState({
      showDeleteModal: false
    });
  }

  handleUserInvite(e) {
    if (!e.currentTarget.classList.contains("disabled")) {
      const newState = Object.assign({}, this.state);
      const user = newState.users.find((user) => user.id === Number(e.currentTarget.dataset.id));
      const taskUser = Object.assign({}, user);
      user.statusId = 1;
      newState.task.users.push({
        user: taskUser,
        statusId: 1
      });
      this.setState(newState);
      this.closeInviteModal();
    }
  }

  render() {
    const categorySelection = <CategorySelection ready={this.handleCategoriesLoaded} allCategories={this.state.categories} selectedCategories={this.state.task.categories} handleCategoryAdd={this.handleCategoryAdd} handleCategoryRemove={this.handleCategoryRemove} />

    const selectedUsers = this.state.task.users.length
      ? this.state.task.users.map((tu) => <ListGroupItem key={tu.user.id}>{tu.user.firstName} {tu.user.lastName} <Glyphicon className="pull-right" glyph={tu.statusId === 1 ? "hourglass" : "check"} /></ListGroupItem>)
      : null;
    const addRemoveUser = this.state.usersReady && this.state.users.find((user) => user.id === this.props.user.id).statusId === 2
      ? <Button bsStyle="link" onClick={this.handleUserRemove}><Glyphicon glyph="trash" /> Remove me</Button>
      : <Button bsStyle="link" onClick={this.handleUserAdd}><Glyphicon glyph="plus" /> Add me</Button>;
    const selectedUsersList = this.state.task.users.length
      ? <ListGroup>{selectedUsers}</ListGroup>
      : <p><em>No participants</em></p>;
    const statuses = this.state.statuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>);
    const buttonRow = this.state.task.id
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
              onClick={this.openDeleteModal}
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
    const users = this.state.users.length
      ? this.state.users.map((user) => user.id !== this.props.user.id ? <ListGroupItem key={user.id} data-id={user.id} onClick={this.handleUserInvite} disabled={user.statusId > 0}>{user.firstName} {user.lastName} <a className="pull-right"><Glyphicon glyph={user.statusId === 1 ? "hourglass" : user.statusId === 2 ? "check" : "plus"} /></a></ListGroupItem> : null)
      : <p><em>No participants found</em></p>;
    const inviteUser = <Button bsStyle="link" onClick={this.openInviteModal}><Glyphicon glyph="envelope" /> Invite a participant</Button>;

    return(
      <Grid>
        <Feedback {...this.state.feedback} />
        <form>
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.task.name}
                  placeholder="A name for the task"
                  onChange={this.handleNameChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={3}>
              <FormGroup>
                <ControlLabel>Date</ControlLabel>
                <FormControl
                  type="date"
                  value={this.state.task.date}
                  placeholder="A date for the task"
                  onChange={this.handleDateChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={3}>
              <FormGroup>
                <ControlLabel>Status</ControlLabel>
                <FormControl
                  componentClass="select"
                  value={this.state.task.status.id}
                  onChange={this.handleStatusChange}
                >
                  {statuses}
                </FormControl>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={this.state.task.description}
              placeholder="A description of the task"
              onChange={this.handleDescriptionChange}
            />
          </FormGroup>

          <Row>
            <Col xs={12} md={6}>
              {categorySelection}
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <ControlLabel>
                  Participants
                  {addRemoveUser}
                  {inviteUser}
                </ControlLabel>
                {selectedUsersList}
              </FormGroup>
            </Col>
          </Row>

          {buttonRow}
        </form>
        <Modal show={this.state.showInviteModal} onHide={this.closeInviteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Invite a participant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {users}
            </ListGroup>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this task?
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={this.handleDelete}
            >
              <Glyphicon glyph="trash"/> Yes, delete this task
            </Button>
            <Button
              bsStyle="default"
              onClick={this.closeDeleteModal}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Grid>
    );
  }
}
