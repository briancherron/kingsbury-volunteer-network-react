import React, { Component } from 'react';
import $ from 'jquery';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';

export default class Comment extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      oldComment: ""
    };

    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  handleCommentChange(e) {
    this.props.handleCommentChange(e.target.value, this.props.comment.id);
  }

  saveComment(e) {
    this.props.saveComment(this.props.comment.id);
    this.setState({
      editing: false
    });
  }

  deleteComment(e) {
    this.props.deleteComment(this.props.comment.id);
  }

  editComment(e) {
    const oldComment = this.props.comment.text;
    this.setState({
      editing: true,
      oldComment: oldComment
    });
  }

  cancelEdit(e) {
    this.setState({
      editing: false
    });
    this.props.handleCommentChange(this.state.oldComment, this.props.comment.id);
  }

  render() {
    const newComment = !this.props.comment.id
    let commentActions = null;
    if (!newComment && this.props.comment.user.id === this.props.user.id) {
      commentActions = (
        <span>
          <Button bsStyle="link" onClick={this.editComment}><Glyphicon glyph="edit" /></Button>
          <Button bsStyle="link" onClick={this.deleteComment}><Glyphicon glyph="trash" /></Button>
        </span>
      );
    }
    return (
      <Row>
          {newComment
            ? <Col xs={12}>
                <FormGroup>
                  <FormControl
                      componentClass="textarea"
                      value={this.props.comment.text}
                      placeholder="Add a comment"
                      onChange={this.handleCommentChange}
                    />
                </FormGroup>
                <Button bsStyle="primary" onClick={this.saveComment}>Add Comment</Button>
              </Col>
            : this.state.editing
              ? <Col xs={12}>
                  <FormGroup>
                    <FormControl
                        componentClass="textarea"
                        value={this.props.comment.text}
                        placeholder="Add a comment"
                        onChange={this.handleCommentChange}
                      />
                  </FormGroup>
                  <Button bsStyle="primary" onClick={this.saveComment}>Update Comment</Button>&nbsp;
                  <Button bsStyle="default" onClick={this.cancelEdit}>Cancel</Button>
                </Col>
              : <Col xs={12}>
                  <blockquote>
                    {this.props.comment.text} {commentActions}
                    <small>
                      {this.props.comment.user.firstName + " " + this.props.comment.user.lastName + " " + new Date(this.props.comment.dateAdded).toLocaleString()}
                    </small>
                  </blockquote>
                </Col>
          }
      </Row>
    );
  }
}
