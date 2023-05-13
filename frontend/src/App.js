

import React, { useState } from 'react';

// function App() {
//   return (
//     <div>
//       <LinkContainer />

//     </div>
//   );
// }

function App() {
  return (
    <div className="container">
      <LinkContainer />
    </div>
  );
}


// class LinkContainer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       links: [],
//     };
//     this.addLink = this.addLink.bind(this);
//     this.removeLink = this.removeLink.bind(this);
//   }

//   addLink(link) {
//     this.setState((state) => ({
//       links: [...state.links, link],
//     }));
//   }

//   removeLink(link) {
//     const index = this.state.links.indexOf(link);
//     const newLinks = this.state.links.filter((_, i) => i !== index);
//     this.setState({
//       links: newLinks,
//     });
//   }

//   render() {
//     return (
//       <div>
//         <Form addLink={this.addLink} />
//         <Table links={this.state.links} removeLink={this.removeLink} />
//       </div>
//     );
//   }
// }

class LinkContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
    };
    this.addLink = this.addLink.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.getLinks = this.getLinks.bind(this);
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
    try {
      const response = await fetch('/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(link),
      });
      if (response.ok) {
        this.getLinks();  // Refresh the list of links
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async removeLink(linkToRemove) {
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
  }

  render() {
    return (
      <div>
        <Form addLink={this.addLink} />
        <Table links={this.state.links} removeLink={this.removeLink} />
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
        <input type="submit" value="Add Link" />
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


