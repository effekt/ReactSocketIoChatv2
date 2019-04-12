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

class Rooms extends Component {
  state = {
    rooms: [],
    roomName: "",
  }

  componentDidMount() {
      this.getRooms();
  }

  getRooms = async () => {
    if (!this.state.rooms.length) {
      axios.get('/api/room/get')
      .then((res) => {
        this.setState({rooms: res.data})
      });
    }
  };

  getRoomsForce = () => {
    axios.get('/api/room/get')
    .then((res) => {
      this.setState({rooms: res.data})
    });
  }

  deleteRoom = (i) => {
    axios.get(`/api/room/del/${this.state.rooms[i]._id}`)
    .then(res => {
        this.state.rooms.splice(i, 1)
        this.setState({rooms: this.state.rooms})
    })
  }

  addRoom = (e) => {
      e.preventDefault();
      axios.post('/api/room', {name: this.state.roomName})
      .then(res => {
          this.state.rooms.push(res.data);
          this.setState({rooms: this.state.rooms})
      })
  }

  render() {
    return (
        <div style={{width: "33%", display: "inline-block", verticalAlign: "top"}}>
            <Button variant="contained" onClick={e => this.getRoomsForce()} color="primary" fullWidth>Refresh</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Room</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { 
                    this.state.rooms.map((room, i) =>
                    <TableRow key={room._id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell><Button onClick={e => this.deleteRoom(i)}><DeleteForeverOutlinedIcon></DeleteForeverOutlinedIcon></Button></TableCell>
                    </TableRow>
                    )
                }
                </TableBody>
            </Table>
            <form onSubmit={this.addRoom}>
                <Input
                    type="text"
                    value={this.state.roomName}
                    onChange={e => this.setState({ roomName: e.target.value })}
                    placeholder="New Room"
                    id="roomName"
                    name="roomName"
                    fullWidth
                    className="input"
                />
                <Button variant="contained" type="submit" color="primary">Add</Button>
            </form>
        </div>
    );
  }

}

export default Rooms;
