import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, FormGroup, FormControl, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class Tasks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      statuses: [],
      categories: [],
      audiences: [],
      filter: {
        query: "",
        statusId: -1,
        userId: this.props.myTasks ? this.props.user.id : -1,
        categoryId: -1,
        audienceId: -1
      },
      tasks: []
    }

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleAudienceChange = this.handleAudienceChange.bind(this);
    this.search = this.search.bind(this);
    this.showTask = this.showTask.bind(this);
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
      }),
      $.ajax({
        type: "GET",
        url: "/task-tracker/api/tasks/audiences",
        contentType: "application/json",
        dataType: "json"
      }).done(function(data) {
        _self.setState({
          audiences: data
        });
      })
    ).then(function() {
      _self.search();
    });
  }

  componentWillReceiveProps(nextProps) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.userId = nextProps.myTasks ? nextProps.user.id : -1;
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
      data.forEach((task) => task.statusName = task.status.name);
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

  handleAudienceChange(e) {
    const newFilter = Object.assign({}, this.state.filter);
    newFilter.audienceId = e.target.value;
    this.setState({
      filter: newFilter
    });
  }

  showTask(task) {
    this.props.history.push("/tasks/" + task.id);
  }

  columnClassName(column, row, rowIndex, columnIndex) {
    return row.status.id === 3 ? "strikethrough" : "";
  }

  formatDate(date) {
    return date !== null ? new Date(date).toLocaleDateString() : null;
  }

  render() {
    const adminUser = this.props.user && this.props.user.admin;
    const filterWidth = this.props.myTasks
      ? adminUser ? "16%" : "24%"
      : adminUser ? "12%" : "16%";
    const audienceOptions = this.state.audiences.map((audience) => <option key={audience.id} value={audience.id}>{audience.name}</option>);
    const audiences = this.props.user && this.props.user.admin
      ? <FormControl componentClass="select" style={{width: filterWidth}} value={this.state.filter.audienceId} onChange={this.handleAudienceChange}>
          <option value="-1">All Audiences</option>
          {audienceOptions}
        </FormControl>
      : null;
    const statusOptions = this.state.statuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>);
    const statuses =
      <FormControl componentClass="select" style={{width: filterWidth}} value={this.state.filter.statusId} onChange={this.handleStatusChange}>
        <option value="-1">All Statuses</option>
        {statusOptions}
      </FormControl>;
    const categoryOptions = this.state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>);
    const categories =
      <FormControl componentClass="select" style={{width: filterWidth}} onChange={this.handleCategoryChange}>
        <option value="-1">All Interests or Skills</option>
        {categoryOptions}
      </FormControl>
    const participantOptions = this.state.users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>);
    const participants = this.props.myTasks
      ? null
      : <FormControl componentClass="select" style={{width: filterWidth}} onChange={this.handleUserChange}>
          <option value="-1">All Participants</option>
          {participantOptions}
        </FormControl>;

    const options = {
      onRowClick: this.showTask
    }



    return (
      <Grid>
        <form onSubmit={this.search}>
          <FormGroup>
            <InputGroup>
              <FormControl type="search" placeholder="Enter a search term" style={{width: '52%'}} onChange={this.handleQueryChange} />
              {audiences}
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

        <BootstrapTable data={this.state.tasks} options={options} keyField="id" multiColumnSort={2} striped hover>
          <TableHeaderColumn dataField="name" width="50%" columnClassName={this.columnClassName} dataSort>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="dateAdded" dataFormat={this.formatDate} columnClassName={this.columnClassName} dataSort>Date Added</TableHeaderColumn>
          <TableHeaderColumn dataField="date" dataFormat={this.formatDate} columnClassName={this.columnClassName} dataSort>Needs Completed By</TableHeaderColumn>
          <TableHeaderColumn dataField="statusName" columnClassName={this.columnClassName} dataSort>Status</TableHeaderColumn>
        </BootstrapTable>
      </Grid>
    );
  }
}
