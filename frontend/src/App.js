

import React, { useState } from 'react';

function App() {
  return (
    <div className="container">
      <LinkContainer />
    </div>
  );
}

class LinkContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      securityQuestionAnswered: false,
    };
    this.addLink = this.addLink.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.checkSecurityQuestion = this.checkSecurityQuestion.bind(this);
  }

  componentDidMount() {
    this.getLinks();
  }

  async getLinks() {
    try {
      const response = await fetch('/links');
      const links = await response.json();
      this.setState({ links });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async addLink(link) {
    if (this.state.securityQuestionAnswered) {
      try {
        const response = await fetch('/links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(link),
        });
        if (response.ok) {
          this.getLinks();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please answer the security question before adding a link.');
    }
  }

  async removeLink(linkToRemove) {
    if (this.state.securityQuestionAnswered) {
      try {
        const response = await fetch(`/links/${linkToRemove.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.setState((state) => ({
            links: state.links.filter((link) => link.id !== linkToRemove.id),
          }));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please answer the security question before removing a link.');
    }
  }

  checkSecurityQuestion(answer) {
    // Add your custom security question validation logic here
    // For example, you can compare the answer to a predefined value
    const correctAnswer = 'OpenAI';
    const isAnswerCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    this.setState({ securityQuestionAnswered: isAnswerCorrect });
  }

  render() {
    return (
      <div>
        {!this.state.securityQuestionAnswered && (
          <SecurityQuestion checkSecurityQuestion={this.checkSecurityQuestion} />
        )}
        <Form
          addLink={this.addLink}
          securityQuestionAnswered={this.state.securityQuestionAnswered}
        />
        <Table
          links={this.state.links}
          removeLink={this.removeLink}
          securityQuestionAnswered={this.state.securityQuestionAnswered}
        />
      </div>
    );
  }
}

class SecurityQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const answer = event.target.value;
    this.setState({ answer, error: null });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { answer } = this.state;
    if (answer.trim() === '') {
      this.setState({ error: 'Please provide an answer.' });
    } else {
      this.props.checkSecurityQuestion(answer);
      this.setState({ answer: '', error: null });
    }
  }

  render() {
    const { answer, error } = this.state;
    return (
      <div>
        <h3>Security Question:</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Answer the security question: What is the capital of France?
            <input
              type="text"
              value={answer}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Submit</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      url: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const link = {
      name: this.state.name,
      url: this.state.url,
    };
    this.props.addLink(link);
    this.setState({
      name: '',
      url: '',
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
        <label>
          URL:
          <input
            type="text"
            name="url"
            value={this.state.url}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Add Link" disabled={!this.props.securityQuestionAnswered} />
      </form>
    );
  }
}

function Table(props) {
  const links = props.links;
  const rows = links.map((link) => (
    <TableBody key={link.url} link={link} removeLink={props.removeLink} />
  ));
  return (
    <table>
      <TableHeader />
      <tbody>{rows}</tbody>
    </table>
  );
}

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>URL</th>
        <th>Action</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const link = props.link;
  const removeLink = props.removeLink;
  return (
    <tr>
      <td>
        <a href={link.url} target="_blank" rel="noreferrer">
          {link.name}
        </a>
      </td>
      <td>{link.url}</td>
      <td>
        <button onClick={() => removeLink(link)}>Remove</button>
      </td>
    </tr>
  );
}

export default App;






