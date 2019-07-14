import 'date-fns';
import React, {useEffect} from 'react';
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
import Grid from '@material-ui/core/Grid';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import Avatar from '@material-ui/core/Avatar';
import {
    SloopAvatar,
    BrigAvatar,
    GalleonAvatar,
    HighTearsAvatar,
    HighTreasureAvatar,
    KarenAvatar,
    LowTearsAvatar,
    LowTreasureAvatar,
    MedTearsAvatar,
    MedTreasureAvatar,
    MegAvatar,
    SkelleonAvatar,
    FortAvatar,
    ShipCloudAvatar,
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
  avatar: {
    backgroundColor: '#b4e3f6',
  },
  avatarMenu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function EnterLog(props) {
  const classes = useStyles();

  // Create suggestions for Island Selection
  // Done here to set a default to be passed in via value, label
  // TODO: Rename to islandSuggestions
  const suggestions = props.data.islands.map(suggestion => ({
    value: suggestion.id,
    label: suggestion.name
  }))

  // Create crew suggestions
  // Done here to support loading entries to edit
  let crewSuggestions = props.data.profiles.map(crewSuggestion => ({
    value: crewSuggestion.id,
    label: crewSuggestion.gamertag
  }))

  // Remove the current user from the list of crewmembers to select
  // TODO: Do this by ID (gamertag object here doesn't have id now)
  crewSuggestions = crewSuggestions.filter(item => item.label !== props.data.userProfile.gamertag)


  const [selectedDate, setSelectedDate] = React.useState(null); //TODO: Putting this in values breaks the selector
  const [logEntryToEditID, setlogEntryToEditID] = React.useState(null);

  const [values, setValues] = React.useState({
    enemyShip: 'U',
    treasure: 'U',
    tears: 'U',
    island: suggestions[0],
    crew: null,
    myShip: 'U',
    loss: false,
  });

  useEffect(() => {
    if(props.data.openForm === true && props.data.logEntryToEdit === null) {
      // Set to current date/time if we're not editing a log
      setSelectedDate(new Date())
      setlogEntryToEditID(null)
    } else if (props.data.openForm === true && props.data.logEntryToEdit !== null) {
      // Load data from old entry into log
      let logValues = {};
      logValues.enemyShip = props.data.logEntryToEdit.enemyShip;
      logValues.treasure = props.data.logEntryToEdit.treasure;
      logValues.tears = props.data.logEntryToEdit.tears;
      logValues.island = suggestions.filter(island => island.label === props.data.logEntryToEdit.island);
      logValues.crew = crewSuggestions.filter(profile => props.data.logEntryToEdit.crew.includes(profile.label));
      logValues.myShip = props.data.logEntryToEdit.myShip;
      logValues.loss = props.data.logEntryToEdit.loss;
      setValues(logValues);
      setSelectedDate(props.data.logEntryToEdit.encounterTime)
      setlogEntryToEditID(props.data.logEntryToEdit.id)
    }
  }, [props.data.openForm, props.data.logEntryToEdit]) // To avoid extra calls, DO NOT put `suggestions` here 

  function handleSubmit() {
    if(logEntryToEditID === null) {
      let config = {
        headers: {
            'Authorization': 'Token  ' + props.data.beToken
        }
      }
      // Add dateTime back in (removed to fix bug with selector)
      let newValues = values;
      newValues.dateTime = selectedDate;
      let body = newValues;
      axios.post(BE_SERVER + "/create_log/", body, config) 
              .then((response) => {
                  props.handleNewLogEntered();
              })
              .catch((error) => {
                  console.log(error);
              })
    } else {
      let config = {
        headers: {
            'Authorization': 'Token  ' + props.data.beToken
        }
      }
      // Add dateTime back in (removed to fix bug with selector)
      let newValues = values;
      newValues.dateTime = selectedDate;
      let body = newValues;
      axios.put(BE_SERVER + "/api/my_entries/" + logEntryToEditID + "/", body, config) 
              .then((response) => {
                  props.handleNewLogEntered();
              })
              .catch((error) => {
                  console.log(error);
              })
    }
    handleClose()
    
  }

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  const handleCheckboxChange = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

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

  function handleClose() {
    if(logEntryToEditID !== null){ //Reset if we opened in edit
      setValues({
        enemyShip: 'U',
        treasure: 'U',
        tears: 'U',
        island: suggestions[0],
        crew: null,
        myShip: 'U',
      })
      setSelectedDate(null)
    }
    props.handleCloseLogForm();
  }

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  let getCrew = props.data.userProfile.verified ? (
    <GetCrewSelection data={props.data} crew={values.crew} crewSuggestions={crewSuggestions} handleCrewSelect={handleCrewSelect}/>
  ):
  (
    <Typography>You must verify your Gamertag to enter your crew.</Typography>
  )
  let editModeTitle = props.data.logEntryToEdit !== null ? (
    <Typography>Edit Entry</Typography>
  ):
  (
    <Typography>New Entry</Typography>
  )
  return (
    <div>
      <Button variant="contained" color="primary" onClick={props.handleOpenLogForm}>
        Enter New Log
      </Button>
      <Dialog open={props.data.openForm} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {editModeTitle}
        </DialogTitle>
        <DialogContent>
          {/* <Grid>
            <KeyboardDatePicker
              margin="normal"
              id="mui-pickers-date"
              label="Date picker"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin={"normal"}
              id="mui-pickers-time"
              label="Time picker"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid> */}
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="enemy-ship">Enemy</InputLabel>
              <Select
                value={values.enemyShip}
                onChange={handleChange}
                inputProps={{
                  name: 'enemyShip',
                  id: 'enemy-ship',
                }}
              >
                <MenuItem value={'U'} className={classes.avatarMenu}>
                  <Avatar className={classes.avatar}>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'S'} className={classes.avatarMenu}>
                  <Avatar>
                    <SloopAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'B'} className={classes.avatarMenu}>
                  <Avatar>
                    <BrigAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'G'} className={classes.avatarMenu}>
                  <Avatar>
                    <GalleonAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'K'} className={classes.avatarMenu}>
                  <Avatar>
                    <KarenAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'M'} className={classes.avatarMenu}>
                  <Avatar>
                    <MegAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'SK'} className={classes.avatarMenu}>
                  <Avatar>
                    <SkelleonAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'F'} className={classes.avatarMenu}>
                  <Avatar>
                    <FortAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'SC'} className={classes.avatarMenu}>
                  <Avatar>
                    <ShipCloudAvatar />
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
                <MenuItem value={'U'} className={classes.avatarMenu}>
                  <Avatar className={classes.avatar}>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'N'} className={classes.avatarMenu}>
                  <Avatar className={classes.avatar}>
                    -
                  </Avatar>
                </MenuItem>
                <MenuItem value={'L'} className={classes.avatarMenu}>
                  <Avatar>
                    <LowTreasureAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'H'} className={classes.avatarMenu}>
                  <Avatar>
                    <HighTreasureAvatar />
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
                <MenuItem value={'U'} className={classes.avatarMenu}>
                  <Avatar className={classes.avatar}>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'N'} className={classes.avatarMenu}>
                  <Avatar className={classes.avatar}>
                    - 
                  </Avatar>
                </MenuItem>
                <MenuItem value={'L'} className={classes.avatarMenu}>
                  <Avatar>
                    <LowTearsAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'H'} className={classes.avatarMenu}>
                  <Avatar>
                    <HighTearsAvatar />
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
                <MenuItem value={'U'} className={classes.avatarMenu}>
                  <Avatar className={classes.avatar}>
                    ?
                  </Avatar>
                </MenuItem>
                <MenuItem value={'S'} className={classes.avatarMenu}>
                  <Avatar>
                    <SloopAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'B'} className={classes.avatarMenu}>
                  <Avatar>
                    <BrigAvatar />
                  </Avatar>
                </MenuItem>
                <MenuItem value={'G'} className={classes.avatarMenu}>
                  <Avatar>
                    <GalleonAvatar />
                  </Avatar>
                </MenuItem>
              </Select>
            </FormControl>
          </form>
          {getCrew}
          <GetIslandSelection data={props.data} island={values.island} suggestions={suggestions} handleIslandSelect={handleIslandSelect}/>
          <FormControlLabel
            control={
              <Checkbox checked={values.loss} onChange={handleCheckboxChange('loss')} value="loss" />
            }
            label="Loss"
          />
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