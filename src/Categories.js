import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, FormGroup, FormControl, Button } from 'react-bootstrap';

export default class Categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newCategory: "",
      categories: []
    }

    this.handleNewCategoryChange = this.handleNewCategoryChange.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
    this.handleCategoryDelete = this.handleCategoryDelete.bind(this);
  }

  componentDidMount() {
    const _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/categories",
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      _self.setState({
        categories: data
      });
    });
  }

  handleNewCategoryChange(e) {
    this.setState({
      newCategory: e.target.value
    });
  }

  handleCategoryAdd(e) {
    const _self = this;
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/categories",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        name: this.state.newCategory
      })
    }).done(function(data) {
      const newState = Object.assign({}, _self.state);
      newState.newCategory = "";
      newState.categories.push(data);

      _self.setState(newState);
    }).fail(function(response) {
      console.log(response);
    });
  }

  handleCategoryChange(e) {
    const newState = Object.assign({}, this.state);
    newState.categories.find(category => category.id === Number(e.target.id)).name = e.target.value;

    this.setState({
      categories: newState.categories
    });
  }

  handleCategoryUpdate(e) {
    const _self = this;
    const category = this.state.categories.find(category => category.id === Number(e.target.dataset.id));
    $.ajax({
      type: "PUT",
      url: "/task-tracker/api/categories/" + e.target.dataset.id,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        id: category.id,
        name: category.name
      })
    }).done(function(data) {
      var newState = Object.assign({}, _self.state);
      newState.categories.forEach(function(item) {
        if (item.id === category.id) {
          item = data;
        }
      });

      _self.setState(newState);
    }).fail(function(response) {
      console.log(response);
    });
  }

  handleCategoryDelete(e) {
    var _self = this;
    const categoryId = Number(e.target.dataset.id);
    $.ajax({
      type: "DELETE",
      url: "/task-tracker/api/categories/" + categoryId,
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      const newState = Object.assign({}, _self.state);
      newState.categories = newState.categories.filter(category => category.id !== categoryId);

      _self.setState(newState);
    }).fail(function(response) {
      console.log(response);
    });
  }

  render() {
    const categoryRows = this.state.categories.map((category) =>
      <div key={category.id}>
        <FormGroup>
          <FormControl type="text" id={category.id.toString()} value={category.name} onChange={this.handleCategoryChange} />
        </FormGroup>
        <Button onClick={this.handleCategoryUpdate} data-id={category.id.toString()}>Save</Button>
        <Button onClick={this.handleCategoryDelete} data-id={category.id.toString()}>Delete</Button>
      </div>);

    return (
      <Grid>
        <div className="form-inline">
          <FormGroup>
            <FormControl type="text" id="new-category" value={this.state.newCategory} onChange={this.handleNewCategoryChange} />
          </FormGroup>
          <Button onClick={this.handleCategoryAdd}>Add</Button>
          {categoryRows}
        </div>
      </Grid>
    );
  }
}
