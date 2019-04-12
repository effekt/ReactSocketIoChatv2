import React, { Component } from 'react';
import axios from "axios";
import './App.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Messages from './Messages';
import Rooms from './Rooms';
import Users from './Users';

class App extends Component {
  state = {
    loggedIn: false,
    username: null,
    password: null,
  }
  login = async (e) => {
    e.preventDefault();
    axios.post('/admin/login', {username: this.state.username, password: this.state.password})
    .then((res) => {
      this.setState({loggedIn: res.data.loggedIn})
    });
  }


  render() {
    return (
      <div className="App">
        { !this.state.loggedIn ?
          this.loginForm()
          :
          this.buildPage()
        }
      </div>
    );
  }

  loginForm = () => {
    return (
      <form onSubmit={this.login}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          onChange={e => this.setState({ username: e.target.value })}
          fullWidth
          className="input"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={e => this.setState({ password: e.target.value })}
          fullWidth
          className="input"
        />
        <Button variant="contained" type="submit" color="primary">Login</Button>
      </form>
    )
  }

  buildPage = () => {
    return (
      <div>
        Logged In!<br></br>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Rooms></Rooms>
          <Messages></Messages>
          <Users></Users>
        </div>
      </div>
    )
  }
}

export default App;
