import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, Row, Col, FormGroup, FormControl, Button, Glyphicon, Modal } from 'react-bootstrap';
import Feedback from './Feedback.js';

export default class Categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newCategory: "",
      categories: [],
      feedback: {},
      showDeleteModal: false,
      selectedCategoryId: ""
    }

    this.handleNewCategoryChange = this.handleNewCategoryChange.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
    this.handleCategoryDelete = this.handleCategoryDelete.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  componentDidMount() {
    const _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/categories/",
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
      url: "/task-tracker/api/categories/",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        name: this.state.newCategory
      })
    }).done(function(data) {
      const newState = Object.assign({}, _self.state);
      newState.newCategory = "";
      newState.categories.push(data);
      newState.feedback = {};

      _self.setState(newState);
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
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
      newState.feedback = {};

      _self.setState(newState);
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
    });
  }

  handleCategoryDelete(e) {
    var _self = this;
    const categoryId = Number(this.state.selectedCategoryId);
    $.ajax({
      type: "DELETE",
      url: "/task-tracker/api/categories/" + categoryId,
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      const newState = Object.assign({}, _self.state);
      newState.categories = newState.categories.filter(category => category.id !== categoryId);
      newState.showDeleteModal = false;

      _self.setState(newState);
    }).fail(function(response) {
      console.log(response);
    });
  }

  openDeleteModal(e) {
    this.setState({
      showDeleteModal: true,
      selectedCategoryId: e.target.dataset.id
    });
  }

  closeDeleteModal() {
    this.setState({
      showDeleteModal: false
    });
  }

  render() {
    const editHeader = this.state.categories.length
      ? <h4>Edit existing skills or interests</h4>
      : null;
    const categoryRows = this.state.categories.map((category) =>
      <Row key={category.id}>
        <Col xs={8}>
          <FormGroup>
            <FormControl type="text" id={category.id.toString()} value={category.name} onChange={this.handleCategoryChange} />
          </FormGroup>
        </Col>
        <Col xs={2}>
          <Button onClick={this.handleCategoryUpdate} data-id={category.id.toString()} block><Glyphicon glyph="floppy-disk" /><span className="hidden-xs"> Save</span></Button>
        </Col>
        <Col xs={2}>
          <Button onClick={this.openDeleteModal} data-id={category.id.toString()} block><Glyphicon glyph="trash" /><span className="hidden-xs"> Delete</span></Button>
        </Col>
      </Row>);

    return (
      <Grid>
        <Feedback {...this.state.feedback} />
        <h4>Add a new skill or interest</h4>
        <Row>
          <Col xs={8}>
            <FormGroup>
              <FormControl type="text" id="new-category" value={this.state.newCategory} onChange={this.handleNewCategoryChange} />
            </FormGroup>
          </Col>
          <Col xs={2}>
            <Button onClick={this.handleCategoryAdd} block><Glyphicon glyph="plus" /><span className="hidden-xs"> Add</span></Button>
          </Col>
        </Row>
        {editHeader}
        {categoryRows}
        <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete skill or interest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this skill or interest?
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={this.handleCategoryDelete}
            >
              <Glyphicon glyph="trash"/> Yes, delete this skill or interest
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
