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

class Users extends Component {
  state = {
    users: [],
  }

  componentDidMount() {
      this.getUsers();
  }

  getUsers = async () => {
    if (!this.state.users.length) {
      axios.get('/api/user')
      .then((res) => {
        this.setState({users: res.data})
      });
    }
  };

  getUsersForce = () => {
    axios.get('/api/user')
    .then((res) => {
        this.setState({users: res.data})
    });
  }

  deleteUser = (i) => {
      axios.get(`/api/user/del/${this.state.users[i]._id}`)
      .then(res => {
        this.state.users.splice(i, 1)
        this.setState({users: this.state.users})
      })
  }

  render() {
    return (
        <div style={{width: "33%", display: "inline-block", verticalAlign: "top"}}>
            <Button variant="contained" onClick={e => this.getUsersForce()} color="primary" fullWidth>Refresh</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { 
                    this.state.users.map((user, i) =>
                    <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell><Button onClick={e => this.deleteUser(i)}><DeleteForeverOutlinedIcon></DeleteForeverOutlinedIcon></Button></TableCell>
                    </TableRow>
                    )
                }
                </TableBody>
            </Table>
        </div>
    );
  }

}

export default Users;
