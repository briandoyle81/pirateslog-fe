import 'date-fns';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';
import {
    SloopAvatar,
    BrigAvatar,
    GalleonAvatar,
  } from './ImageAvatars'
import ImageIcon from '@material-ui/icons/Image';

import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'

import GetIslandSelection from './GetIslandSelection'
import GetCrewSelection from './GetCrewSelection'

const axios = require('axios');

const BE_SERVER = process.env.REACT_APP_BE_SERVER;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function EnterLog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const [selectedDate, setSelectedDate] = React.useState(new Date());
  
  const [values, setValues] = React.useState({
    enemyShip: 'U',
    treasure: 'U',
    tears: 'U',
    island: {},
    crew: {},
    myShip: 'U',
    dateTime: new Date()
  });

  function handleSubmit() {
    console.log("props in submit: ", props)
    let config = {
      headers: {
          'Authorization': 'Token  ' + props.data.beToken
      }
    }
    let body = values;
    console.log(config);
    axios.post(BE_SERVER + "/create_log/", body, config) 
            .then((response) => {
                console.log("added new log")
                props.handleNewLogEntered();
            })
            .catch((error) => {
                console.log(error);
            })
    handleClose();
  }

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
    console.log(values);
  }

  function handleIslandSelect(island) {
    let newValues = values;
    newValues.island = island;
    setValues(newValues);
  }

  function handleCrewSelect(crew) {
    let newValues = values;
    newValues.crew = crew;
    setValues(newValues);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleDateChange(date) {
    let newValues = values;
    newValues.dateTime = date;
    setValues(newValues);
  }

  let getCrew = props.data.userProfile.verified ? (
    <GetCrewSelection data={props.data} handleCrewSelect={handleCrewSelect}/>
  ):
  (
    <Typography>You must verify your Gamertag to enter your crew.</Typography>
  )
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add New Log
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          { props.data.userProfile != null ? props.data.userProfile.gamertag + "'s Log" : "Pirate's Log"}
        </DialogTitle>
        <DialogContent>
          <KeyboardDatePicker
            margin="normal"
            id="mui-pickers-date"
            label="Date picker"
            value={values.dateTime}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="mui-pickers-time"
            label="Time picker"
            value={values.dateTime}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="enemy-ship">Enemy Ship</InputLabel>
              <Select
                value={values.enemyShip}
                onChange={handleChange}
                inputProps={{
                  name: 'enemyShip',
                  id: 'enemy-ship',
                }}
              >
                <MenuItem value={'U'}>
                  <Avatar>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'S'}>
                  <Avatar>
                    <SloopAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'B'}>
                  <Avatar>
                    <BrigAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'G'}>
                  <Avatar>
                    <GalleonAvatar />
                  </Avatar>
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="treasure">Treasure</InputLabel>
              <Select
                value={values.treasure}
                onChange={handleChange}
                inputProps={{
                  name: 'treasure',
                  id: 'treasure',
                }}
              >
                <MenuItem value={'U'}>
                  <Avatar>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'N'}>
                  <Avatar>
                    N 
                  </Avatar>
                </MenuItem>
                <MenuItem value={'L'}>
                  <Avatar>
                    L
                  </Avatar>
                </MenuItem>
                <MenuItem value={'H'}>
                  <Avatar>
                    H
                  </Avatar>
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="tears">Tears</InputLabel>
              <Select
                value={values.tears}
                onChange={handleChange}
                inputProps={{
                  name: 'tears',
                  id: 'tears',
                }}
              >
                <MenuItem value={'U'}>
                  <Avatar>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'N'}>
                  <Avatar>
                    N 
                  </Avatar>
                </MenuItem>
                <MenuItem value={'L'}>
                  <Avatar>
                    L
                  </Avatar>
                </MenuItem>
                <MenuItem value={'H'}>
                  <Avatar>
                    H
                  </Avatar>
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="enemy-ship">My Ship</InputLabel>
              <Select
                value={values.myShip}
                onChange={handleChange}
                inputProps={{
                  name: 'myShip',
                  id: 'my-ship',
                }}
              >
                <MenuItem value={'U'}>
                  <Avatar>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'S'}>
                  <Avatar>
                    <SloopAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'B'}>
                  <Avatar>
                    <BrigAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'G'}>
                  <Avatar>
                    <GalleonAvatar />
                  </Avatar>
                </MenuItem>
              </Select>
            </FormControl>
          </form>
          {getCrew}
          <GetIslandSelection data={props.data} handleIslandSelect={handleIslandSelect}/>
          {/* <TextField
            margin="dense"
            id="name"
            label="Notes"
            fullWidth
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EnterLog;