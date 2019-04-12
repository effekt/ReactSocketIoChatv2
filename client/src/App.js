import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import axios from "axios";
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import './styles.css';

var socket = null;
class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    username: '',
    password: '',
    rooms: [],
    currentRoom: null,
    users: [],
    user: null,
    message: '',
    messages: [],
    lastAction: null
  };

  setUsername = (e) => {
    e.preventDefault();
    this.setState({responseToPost: ''});
    if (!this.state.username || !this.state.password)
      this.setState({post: 'Enter both username and password.'});
    else
      axios.post('/api/user/login', {'name': this.state.username, 'pass': this.state.password})
      .then((res) => {
        if (res.data) {
          this.setState({user: res.data, username: res.data.name, password: '', lastAction: 'login'});
          socket = socketIOClient(window.location.hostname);
          socket.on("join", (e) => {
            let newU = Array.from(new Set(this.state.users.concat([e])));
            this.state.messages.push({by: null, message: e + ' joined the room.', time: Date.now()})
            this.setState({users: newU, lastAction: 'join'});
          });
          socket.on("leave", (e) => {
            let u = this.state.users;
            u.splice(u.indexOf(e), 1);
            this.state.messages.push({by: null, message: e + ' left the room.', time: Date.now()})
            this.setState({users: u, lastAction: 'leave'});
          });
          socket.on("dc", (e) => {
            let u = this.state.users;
            u.splice(u.indexOf(e), 1);
            this.state.messages.push({by: null, message: e + ' disconnected.', time: Date.now()})
            this.setState({users: u, lastAction: 'dc'});
          });
          socket.on('room', (e) => {
            let newU = Array.from(new Set(e.users));
            this.setState({users: newU, messages: e.messages, lastAction: 'room'});
          });
          socket.on('message', (e) => {
            this.state.messages.push(e);
            this.setState({lastAction: 'message'});
          });
          this.changeRoom(this.state.rooms[0]);
        } else {
          this.setState({responseToPost: 'Invalid Password.'});
        }
      })
  }

  sendSocket = (evt, msg) => {
    if (socket)
      socket.emit(evt, msg);
  }

  

  componentDidMount() {
    this.callApi();
  }
  
  callApi = async () => {
    axios.get('/api/room/get')
    .then((res) => {
      if (res.status === 200)
        this.setState({rooms: res.data})
    });
  };

  changeRoom = (room) => {
    if (this.state.user) {
      this.sendSocket('roomChange', {room: room._id, user: this.state.username, oldRoom: this.state.currentRoom ? this.state.currentRoom._id : null});
      this.setState({currentRoom: room, lastAction: 'changeRoom'});
    }
  }

  componentDidUpdate() {
    //if (this.state.lastAction === 'room' || this.state.scrollState === 1)
    this.refs.messageScrollbar.scrollToBottom();
  }

  sendMessage = (e) => {
    e.preventDefault();
    axios.post('/api/message', {by: this.state.username, message: this.state.post, room: this.state.currentRoom})
    .then((res) => {
      if (res.data) {
        this.sendSocket('message', res.data);
        this.state.messages.push(res.data)
        this.setState({post: ''});
      }
    });
  }
  
  render() {
    return (
      <div className="flex">
        <div className="sidebar">
          <Scrollbars style={{height: "100vh", width: "100%"}}>
            
            <div className="title">
              Rooms
            </div>

            {
              this.state.rooms.map(room => {
                return <div className="item" key={room._id} onClick={() => this.changeRoom(room)}>{room.name}</div>
              })
            }
            
          </Scrollbars>
        </div>
        <div className="chat">
          <div className="title">
            { this.state.currentRoom ? this.state.currentRoom.name : 'Login to Begin (Enter Any Username To Create Account)' }
          </div>
          <div className="messages">
            <Scrollbars ref="messageScrollbar">
              {
                this.state.messages.map((message, i) => {
                  if (message.by)
                    return (<div className="clearfix" key={i}><small>{String(message.by) !== String(this.state.username) ?  message.by : ''}</small><br /><div className={String(message.by) === String(this.state.username) ? "message-me" : "message"}>{message.message}</div></div>)
                  else
                    return (<div className="clearfix" key={i}><div className="message-system">{message.message}</div></div>)
                })
              }
            </Scrollbars>
          </div>
          <div className="send">
          { 
            (() => {
              if (!socket)
                return (
                  <form onSubmit={this.setUsername}>
                    <Input
                      type="text"
                      value={this.state.username}
                      onChange={e => this.setState({ username: e.target.value })}
                      placeholder="Username"
                      fullWidth
                      className="input"
                    />
                    <Input
                      type="password"
                      value={this.state.password}
                      onChange={e => this.setState({ password: e.target.value })}
                      placeholder="Password"
                      fullWidth
                      className="input"
                    />
                    <Button variant="contained" type="submit" color="primary">Login</Button>
                  </form>
                )
              else
                return (
                  <form onSubmit={this.sendMessage}>
                    <Input
                      type="text"
                      value={this.state.post}
                      onChange={e => this.setState({ post: e.target.value })}
                      placeholder="Message"
                      id="msgText"
                      name="msgText"
                      fullWidth
                      className="input"
                    />
                    <Button variant="contained" type="submit" color="primary">Send</Button>
                  </form>
                )
            })()
          }
            
            { this.state.responseToPost ? <p>{this.state.responseToPost}</p> : '' }
          </div>
        </div>
        <div className="sidebar">
          <Scrollbars style={{height: "100vh", width: "100%"}}>
            
          <div className="title">
            Users
          </div>

          {
            this.state.users.map((user, i) => {
              if (user !== this.state.username)
                return <div className="item" key={i}>{user}</div>
              else
                return <div className="item active" key={i}>{user}</div>
            })
          }
            
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default App;
