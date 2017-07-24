import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap';

export default class Home extends Component {

  render() {
    return(
      <div>
        <Grid>
          <h4>Welcome to the Kingsbury Country Day School Volunteer Network. To get started, please select from one of the options below.</h4>
          <Row>
            <Col xs={12} md={4}>
              <Panel>
                <h3><Glyphicon glyph="file" /> New Task</h3>
                <p>Have a task that needs tackled? Add it here.</p>
                <p><Link to={"/new-task"}><Button bsStyle="primary">Add a Task</Button></Link></p>
              </Panel>
            </Col>
            <Col xs={12} md={4}>
              <Panel>
                <h3><Glyphicon glyph="tasks" /> My Tasks</h3>
                <p>Already working on a task? View it here.</p>
                <p><Link to={"/my-tasks"}><Button bsStyle="primary">View My Tasks</Button></Link></p>
              </Panel>
            </Col>
            <Col xs={12} md={4}>
              <Panel>
                <h3><Glyphicon glyph="search" /> Find Tasks</h3>
                <p>Ready to help with a task? Find one here.</p>
                <p><Link to={"/find-tasks"}><Button bsStyle="primary">Find Tasks</Button></Link></p>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
