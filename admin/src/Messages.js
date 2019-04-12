import React, { Component } from 'react';
import axios from "axios";
import './App.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

class Messages extends Component {
  state = {
    messages: [],
  }

  componentDidMount() {
      this.getMessages();
  }

  getMessages = async () => {
    if (!this.state.messages.length) {
      axios.get('/api/message')
      .then((res) => {
        this.setState({messages: res.data})
      });
    }
  };

  deleteMessage = (i) => {
    axios.get(`/api/message/del/${this.state.messages[i]._id}`)
    .then(res => {
      this.state.messages.splice(i, 1)
      this.setState({messages: this.state.messages})
    })
  }

  getMessagesForce = () => {
    axios.get('/api/message')
    .then((res) => {
      this.setState({messages: res.data})
    });
  }

  render() {
    return (
      <div style={{width: "33%", display: "inline-block", verticalAlign: "top"}}>
        <Button variant="contained" onClick={e => this.getMessagesForce()} color="primary" fullWidth>Refresh</Button>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Room</TableCell>
                    <TableCell>Sender</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            { 
                this.state.messages.map((message, i) =>
                  <TableRow key={message._id}>
                      <TableCell>{message.room.name}</TableCell>
                      <TableCell>{message.by}</TableCell>
                      <TableCell>{message.message}</TableCell>
                      <TableCell><Button onClick={e => this.deleteMessage(i)}><DeleteForeverOutlinedIcon></DeleteForeverOutlinedIcon></Button></TableCell>
                  </TableRow>
                )
            }
            </TableBody>
        </Table>
      </div>
    );
  }

}

export default Messages;
