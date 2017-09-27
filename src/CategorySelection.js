import React, { Component } from 'react';
import $ from 'jquery';
import { FormGroup, ControlLabel, ListGroup, ListGroupItem, Button, Glyphicon, Modal } from 'react-bootstrap';

export default class CategorySelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCategoryAdd = this.handleCategoryAdd.bind(this);
    this.handleCategoryRemove = this.handleCategoryRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillMount() {
    var _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/categories/",
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      data.forEach(function(category) {
        category.added = false;
      });
      _self.props.ready(data);
    });
  }

  openModal() {
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
    });

  }

  handleSave() {
    this.props.handleSave();
    this.closeModal();
  }

  handleCategoryAdd(e) {
    this.props.handleCategoryAdd({
      id: Number(e.currentTarget.dataset.id),
      name: e.currentTarget.dataset.name
    });
  }

  handleCategoryRemove(e) {
    this.props.handleCategoryRemove({
      id: Number(e.target.dataset.id),
      name: e.target.dataset.name
    });
  }

  render() {
    //const categories = this.props.categories.length
    //  ? this.props.categories.map((category) => <Checkbox key={category.id} data-id={category.id} data-name={category.name} onChange={this.handleCategoryChange} checked={category.checked}>{category.name}</Checkbox>)
    //  : <p><em>No skills &amp; interests found</em></p>;
    const selectedCategories = this.props.selectedCategories.length
      ? this.props.selectedCategories.map((category) => <ListGroupItem key={category.id}>{category.name} <Button bsStyle="link" className="pull-right"><Glyphicon glyph="trash" data-id={category.id} data-name={category.name} onClick={this.handleCategoryRemove} /></Button></ListGroupItem>)
      : null;
    const selectedCategoriesList = this.props.selectedCategories.length
      ? <ListGroup>{selectedCategories}</ListGroup>
      : <p><em>No interests or skills selected</em></p>;
    const allCategories = this.props.allCategories.length
      ? this.props.allCategories.map((category) => <ListGroupItem key={category.id} disabled={category.added} data-id={category.id} data-name={category.name} onClick={this.handleCategoryAdd}>{category.name} <a className="pull-right"><Glyphicon glyph={category.added ? "trash" : "plus"} /></a></ListGroupItem>)
      : null;

    return <FormGroup>
            <ControlLabel>{this.props.header} <Button bsStyle="link" onClick={this.openModal}><Glyphicon glyph="plus" /> Add an interest or skill</Button></ControlLabel>
            {selectedCategoriesList}
            <Modal show={this.state.showModal} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Update interests or skills</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ListGroup>
                  {allCategories}
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                {this.props.id ? <Button bsStyle="primary" onClick={this.handleSave}><Glyphicon glyph="floppy-disk" /> Update Interests or Skills</Button> : null}
                <Button bsStyle="default" onClick={this.closeModal}>Close</Button>
              </Modal.Footer>
            </Modal>
          </FormGroup>;
  }
}
