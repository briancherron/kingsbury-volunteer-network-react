import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap';

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.requireLogin();
  }

  render() {
    if(this.props.visible) {
      return(
        <div>
          <Grid>
            <h4>Welcome to the Kingsbury Community Volunteer Network.</h4>
            <Row>
              <Col xs={12} sm={6} lg={3}>
                <Panel>
                  <h3><Glyphicon glyph="file" /> New Task</h3>
                  <p>Have a task that needs tackled? Add it here.</p>
                  <p><Link to={"/new-task"}><Button bsStyle="primary">Add a Task</Button></Link></p>
                </Panel>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <Panel>
                  <h3><Glyphicon glyph="tasks" /> My Tasks</h3>
                  <p>Already working on a task? View it here.</p>
                  <p><Link to={"/my-tasks"}><Button bsStyle="primary">View My Tasks</Button></Link></p>
                </Panel>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <Panel>
                  <h3><Glyphicon glyph="search" /> Find Tasks</h3>
                  <p>Ready to help with a task? Find one here.</p>
                  <p><Link to={"/find-tasks"}><Button bsStyle="primary">Find Tasks</Button></Link></p>
                </Panel>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <Panel>
                  <h3><Glyphicon glyph="envelope" /> Invite Volunteers</h3>
                  <p>Know someone willing to lend a hand? Invite them to join here.</p>
                  <p><Link to={"/send-invitation"}><Button bsStyle="primary">Invite a Volunteer</Button></Link></p>
                </Panel>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return null;
    }
  }
}
