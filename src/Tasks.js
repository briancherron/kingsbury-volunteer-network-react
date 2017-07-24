import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import { Grid, FormGroup, FormControl, Button, Glyphicon, InputGroup, Table } from 'react-bootstrap';

export default class Tasks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      statuses: [],
      categories: [],
      filter: {
        query: "",
        statusId: -1,
        userId: this.props.user ? this.props.user.id : -1,
        categoryId: -1
      },
      tasks: []
    }

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const _self = this;
    $.when(
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/users",
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        _self.setState({
          users: data
        });
      }),
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/tasks/statuses",
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        _self.setState({
          statuses: data
        });
      }),
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/categories",
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        _self.setState({
          categories: data
        });
      })
    ).then(function() {
      _self.search();
    });
  }

  componentWillReceiveProps(nextProps) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.userId = nextProps.user ? nextProps.user.id : -1;
    newFilter.statusId = -1;
    newFilter.categoryId = -1;
    newFilter.query = "";
    this.setState({
      filter: newFilter
    }, function() {
      this.search();
    });
  }

  search(e) {
    if (e) {
      e.preventDefault();
    }
    const _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/tasks/",
      contentType: "application/json",
      dataType: "json",
      data: this.state.filter
    }).done(function(data) {
      _self.setState({
        tasks: data
      });
    });
  }

  handleQueryChange(e) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.query = e.target.value;
    this.setState({
      filter: newFilter
    });
  }

  handleStatusChange(e) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.statusId = e.target.value;
    this.setState({
      filter: newFilter
    });
  }

  handleUserChange(e) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.userId = e.target.value;
    this.setState({
      filter: newFilter
    });
  }

  handleCategoryChange(e) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.categoryId = e.target.value;
    this.setState({
      filter: newFilter
    });
  }

  render() {
    const statusOptions = this.state.statuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>);
    const statuses =
      <FormControl componentClass="select" style={{width: this.props.user ? '20%' : '15%'}} value={this.state.filter.statusId} onChange={this.handleStatusChange}>
        <option value="-1">All Statuses</option>
        {statusOptions}
      </FormControl>;
    const categoryOptions = this.state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>);
    const categories =
      <FormControl componentClass="select" style={{width: this.props.user ? '20%' :'15%'}} onChange={this.handleCategoryChange}>
        <option value="-1">All Categories</option>
        {categoryOptions}
      </FormControl>
    const participantOptions = this.state.users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>);
    const participants = this.props.user
      ? null
      : <FormControl componentClass="select" style={{width: '15%'}} onChange={this.handleUserChange}>
          <option value="-1">All Participants</option>
          {participantOptions}
        </FormControl>;
    const tasks = this.state.tasks.map((task) =>
      <tr key={task.id}>
        <td>{task.name}</td>
        <td>{task.date}</td>
        <td>{task.status.name}</td>
        <td className="text-center"><Link to={"/tasks/" + task.id}><Glyphicon glyph="edit" /></Link></td>
      </tr>);

    return (
      <Grid>
        <form onSubmit={this.search}>
          <FormGroup>
            <InputGroup>
              <FormControl type="search" style={{width: this.props.user ? '60%' : '55%'}} onChange={this.handleQueryChange} />
              {statuses}
              {categories}
              {participants}
              <InputGroup.Button>
                <Button type="submit">
                  <Glyphicon glyph="search" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>

        <Table striped bordered hover condensed>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks}
          </tbody>
        </Table>
      </Grid>
    );
  }
}
