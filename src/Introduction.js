import React, { Component } from 'react';
import $ from 'jquery';
import { Grid, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap';
import Feedback from './Feedback.js';

export default class Invitation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      introduction: ""
    }

    this.handleIntroductionChange = this.handleIntroductionChange.bind(this);
    this.saveIntroduction = this.saveIntroduction.bind(this);
  }

  componentWillMount() {
    const _self = this;
    $.ajax({
      type: "GET",
      url: "/task-tracker/api/introduction",
      dataType: "text"
    }).done(function(data) {
      _self.setState({
        introduction: data
      });
    });
  }

  handleIntroductionChange(e) {
    this.setState({
      introduction: e.target.value
    });
  }

  saveIntroduction(e) {
    e.preventDefault();
    const _self = this;
    $.ajax({
      type: "POST",
      url: "/task-tracker/api/introduction",
      contentType: "text/plain",
      dataType: "text",
      data: _self.state.introduction
    }).done(function(data) {
      _self.setState({
        feedback: {}
      });
      _self.props.history.push("/");
    }).fail(function(response) {
      _self.setState({
        feedback: response.responseJSON
      });
    });
  }

  render() {
    return (
      <Grid>
        <form onSubmit={this.saveIntroduction}>
          <Feedback {...this.state.feedback} />
          <h4>Enter an introduction to display on the home page:</h4>
          <FormGroup>
            <FormControl
                componentClass="textarea"
                value={this.state.introduction}
                placeholder="Add an introduction"
                onChange={this.handleIntroductionChange}
              />
          </FormGroup>
          <Button bsStyle="primary" block type="submit">
            <Glyphicon glyph="floppy-disk" /> Save Introduction
          </Button>
        </form>
      </Grid>
    );
  }
}
