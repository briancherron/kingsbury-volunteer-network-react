import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, Glyphicon, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import CategorySelection from './CategorySelection';
import Feedback from './Feedback.js';
import Comment from './Comment.js';

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
      dateAdded: new Date().toISOString().substring(0, 10),
      description: "",
      notes: "",
      categories: [],
      users: [],
      audience: this.props.user && this.props.user.admin ? { id: "", name: ""} : { id: 2, name: "All Users"},
      comments: []
    }
    this.state = {
      task: Object.assign({}, this.newTask),
      addMe: false,
      invitationUsers: [],
      categories: [],
      users: [],
      statuses: [],
      categoriesReady: false,
      usersReady: false,
      statusesReady: false,
      showInviteModal: false,
      showDeleteModal: false,
      feedback: {},
      invitationMessage: "",
      audiences: [],
      audiencesReady: false,
      newComment: {}
    };

    this.loadTask = this.loadTask.bind(this);
    this.handleCategoriesLoaded = this.handleCategoriesLoaded.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
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
    this.sendInvitations = this.sendInvitations.bind(this);
    this.handleInvitationMessageChange = this.handleInvitationMessageChange.bind(this);
    this.handleAudienceChange = this.handleAudienceChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
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
      if (_self.state.categoriesReady && _self.state.usersReady && _self.state.audiencesReady) {
        _self.loadTask(_self.props.match.params.id);
      }
    });
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/tasks/statuses",
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      //const task = Object.assign({}, _self.state.task);
      //task.status = data[0];
      _self.setState({
        statuses: data,
        //task: task,
        statusesReady: true
      });
      if (_self.state.categoriesReady && _self.state.usersReady && _self.state.audiencesReady) {
        _self.loadTask(_self.props.match.params.id);
      }
    });
    if (_self.props.user && _self.props.user.admin) {
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/tasks/audiences",
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        _self.setState({
          audiences: data,
          audiencesReady: true
        });
        if (_self.state.categoriesReady && _self.state.usersReady && _self.state.audiencesReady) {
          _self.loadTask(_self.props.match.params.id);
        }
      });
    } else {
      this.setState({
        audiencesReady: true
      });
      if (_self.state.categoriesReady && _self.state.usersReady && _self.state.audiencesReady) {
        _self.loadTask(_self.props.match.params.id);
      }
    }
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
        data.date = new Date(data.date).toISOString().substring(0, 10);
        data.dateAdded = new Date(data.dateAdded).toISOString().substring(0, 10);
        const newState = Object.assign({}, _self.state);
        newState.addMe = false;
        newState.task = data;
        newState.task.categories.forEach(function(tc) {
          newState.categories.find(function(c) {
            return tc.id === c.id;
          }).added = true;
        });
        newState.task.users.forEach(function(tu) {
          newState.users = newState.users.filter(function(u) {
            return tu.user.id !== u.id;
          });
        });
        newState.newComment = {
          id: 0,
          taskId: data.id,
          text: ""
        }
        _self.setState(newState);
      }).fail(function(response) {
        console.log(response);
      });
    } else {
      this.setState({
        task: Object.assign({}, this.newTask)
      });
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

  handleAudienceChange(e) {
    const newState = Object.assign({}, this.state);
    newState.task.audience = {
      id: Number(e.target.value),
      name: e.target.selectedOptions[0].text
    };
    if (e.target.value === Number(1)) {
      newState.invitationUsers = newState.invitationUsers.filter((user) => user.admin);
    } else {

    }
    this.setState(newState);
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

  handleNotesChange(e) {
    const task = Object.assign({}, this.state.task);
    task.notes = e.target.value;
    this.setState({
      task: task
    });
  }

  handleCategoryAdd(category) {
    const newState = Object.assign({}, this.state);
    const addedCategory = this.state.task.categories.find((c) => c.id === category.id);
    if (addedCategory) {
      this.setState(function(previousState) {
        newState.task.categories = previousState.task.categories.filter((c) => c.id !== category.id);;
        newState.categories.find(function(c) {
          return c.id === category.id;
        }).added = false;

        return newState;
      });
    } else {
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
  }

  updateCategories() {
    const _self = this;
    return $.ajax({
      type: "PUT",
      url: "/task-tracker/api/tasks/" + _self.state.task.id + "/interests-or-skills",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.task.categories)
    }).done(function(data) {
      const newState = Object.assign({}, _self.state);
      newState.task.categories.forEach(function(tc) {
        newState.categories.find(function(c) {
          return tc.id === c.id;
        }).added = true;
      });
      _self.setState(newState);
    }).fail(function(response) {
      console.log(response);
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
    }, function() {
      this.updateCategories();
    });
  }

  handleUserAdd(e) {
    const _self = this;
    this.setState({
      addMe: true
    }, function() {
      if (this.state.task.id) {
        _self.addMe().then(function() {
          const newState = Object.assign({}, _self.state);
          newState.task.users.push({
            user: _self.props.user,
            statusId: 2
          });
          newState.users = newState.users.filter(function(user) {
            return user.id !== _self.props.user.id;
          });
          _self.setState(newState);
        });
      } else {
        const newState = Object.assign({}, _self.state);
        newState.task.users.push({
          user: _self.props.user,
          statusId: 2
        });
        newState.users = newState.users.filter(function(user) {
          return user.id !== _self.props.user.id;
        });
        _self.setState(newState);
      }
    });
  }

  addMe() {
    return $.ajax({
      type: "POST",
      url: "/task-tracker/api/tasks/" + this.state.task.id + "/add-me",
      contentType: "application/json",
      dataType: "json"
    });
  }

  handleUserRemove(e) {
    const _self = this;
    this.setState({
      addMe: false
    }, function() {
      if (this.state.task.id) {
        $.ajax({
          type: "DELETE",
          url: "/task-tracker/api/tasks/" + this.state.task.id + "/remove-me",
          contentType: "application/json",
          dataType: "json"
        }).done(function(data) {
          const newState = Object.assign({}, _self.state);
          newState.task.users = newState.task.users.filter((user) => user.user.id !== _self.props.user.id);
          newState.users.push(_self.props.user);
          _self.setState(newState);
        }).fail(function(response) {
          //TODO
        });
      } else {
        const newState = Object.assign({}, _self.state);
        newState.task.users = newState.task.users.filter((user) => user.user.id !== _self.props.user.id);
        newState.users.push(_self.props.user);
        _self.setState(newState);
      }
    });
  }

  handleSave(e) {
    var _self = this;
    const isNewTask = !_self.state.task.id;
    $.ajax({
      type: isNewTask ? "POST" : "PUT",
      url: "/task-tracker/api/tasks/" + (isNewTask ? "" : this.state.task.id),
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.task)
    }).done(function(data) {

      _self.setState({
        feedback: {},
        task: data
      });
      if (isNewTask) {
        _self.sendInvitations().then(function() {
          _self.updateCategories().then(function() {
            if (_self.state.addMe) {
              _self.addMe().then(function() {
                _self.props.history.push("/find-tasks");
              });
            } else {
              _self.props.history.push("/find-tasks");
            }
          });
        });
      } else {
        _self.props.history.push("/find-tasks");
      }
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
    const newState = Object.assign({}, this.state);
    this.state.invitationUsers.forEach(function(invitationUser) {
      const user = newState.users.find((user) => user.id === invitationUser.user.id);
      if (user) {
        user.statusId = 0;
      }
    });
    newState.invitationUsers = [];
    newState.showInviteModal = false;

    this.setState(newState);
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
      const invitationUser = Object.assign({}, user);
      user.statusId = 1;
      /*newState.task.users.push({
        user: invitationUser,
        statusId: 1
      });*/
      newState.invitationUsers.push({
        user: invitationUser,
        statusId: 1
      });
      this.setState(newState);
    } else {
      const invitationUser = this.state.invitationUsers.find((invitationUser) => invitationUser.user.id === Number(e.currentTarget.dataset.id));
      if (invitationUser) {
        const newState = Object.assign({}, this.state);
        const user = newState.users.find((user) => user.id === Number(e.currentTarget.dataset.id));
        user.statusId = 0;
        newState.invitationUsers = newState.invitationUsers.filter((user) => user.user.id !== invitationUser.user.id);
        newState.task.users = newState.task.users.filter((user) => user.user.id !== invitationUser.user.id);
        this.setState(newState);
      }
    }
  }

  handleInvitationMessageChange(e) {
    this.setState({
      invitationMessage: e.target.value
    });
  }

  sendInvitations() {
    if (this.state.task.id) {
      const _self = this;
      return $.ajax({
        type: "POST",
        url: "/task-tracker/api/tasks/" + this.state.task.id + "/send-invitations",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          invitees: _self.state.invitationUsers,
          message: _self.state.invitationMessage
        })
      }).done(function(data) {
        const newState = Object.assign({}, _self.state);
        newState.invitationUsers.forEach((user) => newState.task.users.push(user));
        newState.task.users.forEach(function(tu) {
          newState.users = newState.users.filter(function(u) {
            return tu.user.id !== u.id;
          });
        });
        _self.setState(newState);
        _self.closeInviteModal();
      }).fail(function(response) {
        console.log(response);
      });
    }
  }

  handleCommentChange(newText, commentId) {
    if (commentId === 0) {
      const newComment = Object.assign(this.state.newComment);
      newComment.text = newText;
      this.setState({
        newComment: newComment
      });
    } else {
      const newState = Object.assign({}, this.state);
      newState.task.comments.find((comment) => comment.id === commentId).text = newText;
      this.setState(newState);
    }
  }

  saveComment(commentId) {
    const _self = this;
    if (commentId === 0) {
      $.ajax({
        type: "POST",
        url: "/task-tracker/api/tasks/" + this.state.task.id + "/comments/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(this.state.newComment)
      }).done(function(data) {
        const newState = _self.state;
        newState.task.comments.push(data);
        newState.newComment.text = "";
        _self.setState(newState);
      });
    } else {
      $.ajax({
        type: "PUT",
        url: "/task-tracker/api/tasks/" + this.state.task.id + "/comments/" + commentId,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(this.state.task.comments.find((comment) => comment.id === commentId))
      });
    }
  }

  deleteComment(commentId) {
    const _self = this;
    $.ajax({
      type: "DELETE",
      url: "/task-tracker/api/tasks/" + this.state.task.id + "/comments/" + commentId,
      dataType: "json"
    }).done(function(data) {
      const newState = Object.assign({}, _self.state);
      newState.task.comments = newState.task.comments.filter((comment) => comment.id !== commentId);
      _self.setState(newState);
    });
  }

  render() {
    const categorySelection = <CategorySelection ready={this.handleCategoriesLoaded} allCategories={this.state.categories} selectedCategories={this.state.task.categories} handleCategoryAdd={this.handleCategoryAdd} handleCategoryRemove={this.handleCategoryRemove} handleSave={this.updateCategories} id={this.state.task.id} />

    const selectedUsers = this.state.task.users.length
      ? this.state.task.users.map((tu) => <ListGroupItem key={tu.user.id}>{tu.user.firstName} {tu.user.lastName} <Glyphicon className="pull-right" glyph={tu.statusId === 1 ? "hourglass" : "check"}> <em>{tu.statusId === 1 ? 'pending' : 'participating'}</em></Glyphicon></ListGroupItem>)
      : null;
    const addRemoveUser = this.state.usersReady && this.state.users.find((user) => user.id === this.props.user.id)
      ? <Button bsStyle="link" onClick={this.handleUserAdd}><Glyphicon glyph="plus" /> Add me</Button>
      : <Button bsStyle="link" onClick={this.handleUserRemove}><Glyphicon glyph="trash" /> Remove me</Button>;
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
    const users = this.state.users.length > 1
      ? this.state.users.map((user) => user.id !== this.props.user.id && (user.admin || this.state.task.audience.id !== 1)
        ? <ListGroupItem key={user.id} data-id={user.id} onClick={this.handleUserInvite} disabled={user.statusId > 0}>{user.firstName} {user.lastName} <a className="pull-right"><Glyphicon glyph={user.statusId === 1 ? "hourglass" : user.statusId === 2 ? "check" : "plus"} /></a></ListGroupItem>
        : null)
      : <p><em>No participants available to invite</em></p>;
    const inviteUser = <Button bsStyle="link" onClick={this.openInviteModal}><Glyphicon glyph="envelope" /> Invite a participant</Button>;
    const audiences = this.state.audiences.map((audience) => <option key={audience.id} value={audience.id}>{audience.name}</option>);
    const audience = this.props.user && this.props.user.admin
      ? <Col xs={12} md={2}>
          <FormGroup>
            <ControlLabel>Audience</ControlLabel>
            <FormControl
              componentClass="select"
              value={this.state.task.audience.id}
              onChange={this.handleAudienceChange}
            >
              <option value=""></option>
              {audiences}
            </FormControl>
          </FormGroup>
        </Col>
      : null;
    const userAdded = this.state.task.id
      ? this.state.task.userAdded
        ? this.state.task.userAdded.firstName + " " + this.state.task.userAdded.lastName
        : ""
      : this.props.user
        ? this.props.user.firstName + " " + this.props.user.lastName
        : "";
    const comments = this.state.task.comments.map((comment) => <Comment key={comment.id} comment={comment} handleCommentChange={this.handleCommentChange} saveComment={this.saveComment} deleteComment={this.deleteComment} user={this.props.user} />);
    const newComment = this.state.task.id
      ? <Comment comment={this.state.newComment} handleCommentChange={this.handleCommentChange} saveComment={this.saveComment} />
      : null;


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
                  maxLength="100"
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={2}>
              <FormGroup>
                <ControlLabel>Needs Completed By</ControlLabel>
                <FormControl
                  type="date"
                  value={this.state.task.date}
                  placeholder="A date for the task"
                  onChange={this.handleDateChange}
                />
              </FormGroup>
            </Col>
            {audience}
            <Col xs={12} md={2}>
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

          <Row>
            <Col xs={12} md={4}>
              <FormGroup>
                <ControlLabel>Added By</ControlLabel>
                <FormControl
                  type="text"
                  readOnly
                  value={userAdded}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={2}>
              <FormGroup>
                <ControlLabel>Date Added</ControlLabel>
                <FormControl
                  type="date"
                  readOnly
                  value={this.state.task.dateAdded}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  id="taskDescription"
                  componentClass="textarea"
                  value={this.state.task.description}
                  placeholder="A description of the task"
                  onChange={this.handleDescriptionChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <ControlLabel>Notes</ControlLabel>
                <FormControl
                  value={this.state.task.notes}
                  componentClass="textarea"
                  placeholder="Notes or instructions for the task"
                  onChange={this.handleNotesChange}
                />
              </FormGroup>
            </Col>
          </Row>

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

          {this.state.task.id ? <h3>Comments</h3> : null}
          {comments}
          {newComment}
        </form>
        <Modal show={this.state.showInviteModal} onHide={this.closeInviteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Invite a participant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {users}
            </ListGroup>
            <FormGroup>
              <ControlLabel>Message</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={this.state.invitationMessage}
                placeholder="Enter a message to send with the invitation"
                onChange={this.handleInvitationMessageChange}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            {this.state.task.id ? <Button bsStyle="primary" onClick={this.sendInvitations} disabled={!this.state.invitationUsers.length}><Glyphicon glyph="envelope" /> Send Invitations</Button> : null}
            <Button bsStyle="default" onClick={this.closeInviteModal}>Close</Button>
          </Modal.Footer>
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
