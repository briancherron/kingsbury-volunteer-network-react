import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';
import CategorySelection from './CategorySelection'

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.newTask = {
      name: "",
      status: {},
      date: "",
      description: "",
      categories: [],
      users: [],
      partners: []
    }
    this.state = {
      task: Object.assign({}, this.newTask),
      categories: [],
      users: [],
      partners: [],
      statuses: [],
      categoriesReady: false,
      usersReady: false,
      statusesReady: false,
      partnersReady: false
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
    this.handlePartnerChange = this.handlePartnerChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    var _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/users",
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      data.forEach(function(user) {
        user.checked = false;
      });
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
            return tu.id === u.id;
          }).added = true;
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
      newState.task.users = previousState.task.users.concat([{
        id: userId,
        email: userEmail,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName
      }]);
      newState.users.find(function(user) {
        return user.id === userId;
      }).added = true;

      return newState;
    });
  }

  handleUserRemove(e) {
    const userId = this.props.user.id;
    const newState = Object.assign({}, this.state);
    this.setState(function(previousState) {
      newState.task.users = previousState.task.users.filter(function(user) {
          return user.id !== userId;
      });
      newState.users.find(function(user) {
        return user.id === userId;
      }).added = false;

      return newState;
    });
  }

  handleUserChange(e) {
    const newState = Object.assign({}, this.state);
    const id = Number(e.target.dataset.id);
    const email = e.target.dataset.email;
    if (e.target.checked) {
      this.setState(function(previousState) {
        newState.task.users = previousState.task.users.concat([{
          id: id,
          email: email
        }]);
        newState.users.find(function(user) {
          return user.id === id;
        }).checked = true;

        return newState;
      });
    } else {
      this.setState(function(previousState) {
        newState.task.users = previousState.task.users.filter(function(user) {
            return user.id !== id;
        });
        newState.users.find(function(user) {
          return user.id === id;
        }).checked = false;

        return newState;
      });
    }
  }

  handlePartnerChange(e) {
    const task = Object.assign({}, this.state.task);
    const id = Number(e.target.dataset.id);
    const name = e.target.dataset.name;
    if (e.target.checked) {
      this.setState(function(previousState) {
        task.partners = previousState.task.partners.concat([{
          id: id,
          name: name
        }]);

        return {
          task: task
        };
      });
    } else {
      this.setState(function(previousState) {
        task.users = previousState.task.partners.filter(function(partner) {
            return partner.id !== id;
        });

        return {
          task: task
        };
      });
    }
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
      _self.props.history.push("/find-tasks");
    }).fail(function(response) {
      console.log(response);
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

  render() {
    var categorySelection = <CategorySelection ready={this.handleCategoriesLoaded} allCategories={this.state.categories} selectedCategories={this.state.task.categories} handleCategoryAdd={this.handleCategoryAdd} handleCategoryRemove={this.handleCategoryRemove} />

    const selectedUsers = this.state.task.users.length
      ? this.state.task.users.map((user) => <ListGroupItem key={user.id}>{user.firstName} {user.lastName}</ListGroupItem>)
      : null;
    const addRemoveUser = this.state.usersReady && this.state.users.find((user) => user.id === this.props.user.id).added
      ? <Button bsStyle="link" onClick={this.handleUserRemove}><Glyphicon glyph="trash" /></Button>
      : <Button bsStyle="link" onClick={this.handleUserAdd}><Glyphicon glyph="plus" /></Button>;
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
                </ControlLabel>
                {selectedUsersList}
              </FormGroup>
            </Col>
          </Row>

          {buttonRow}
        </form>
      </Grid>
    );
  }
}
