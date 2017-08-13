import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class Feedback extends Component {

  render() {
    let successAlert = null;
    if (this.props.successMessages && this.props.successMessages.length) {
      const successMessages = this.props.successMessages.map((message, index) => <li key={index}>{message}</li>);
      successAlert = <Alert bsStyle="success">
        <ul className="list-unstyled">
          {successMessages}
        </ul>
      </Alert>;
    }

    let infoAlert = null;
    if (this.props.infoMessages && this.props.infoMessages.length) {
      const infoMessages = this.props.infoMessages.map((message, index) => <li key={index}>{message}</li>);
      successAlert = <Alert bsStyle="info">
        <ul className="list-unstyled">
          {infoMessages}
        </ul>
      </Alert>;
    }

    let warningAlert = null;
    if (this.props.warningMessages && this.props.warningMessages.length) {
      const warningMessages = this.props.warningMessages.map((message, index) => <li key={index}>{message}</li>);
      successAlert = <Alert bsStyle="warning">
        <ul className="list-unstyled">
          {warningMessages}
        </ul>
      </Alert>;
    }

    let dangerAlert = null;
    if (this.props.dangerMessages && this.props.dangerMessages.length) {
      const dangerMessages = this.props.dangerMessages.map((message, index) => <li key={index}>{message}</li>);
      successAlert = <Alert bsStyle="danger">
        <ul className="list-unstyled">
          {dangerMessages}
        </ul>
      </Alert>;
    }

    return (
      <div>
        {dangerAlert}
        {warningAlert}
        {infoAlert}
        {successAlert}
      </div>
    );
  }
}
