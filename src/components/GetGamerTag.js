import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function GetGamertag(props) {
  console.log(props.data)
  const [open, setOpen] = useState(false);
  const [enteredTag, setEnteredTag] = useState("");
  const [registeredTag, setRegisteredTag] = useState("");
  
  function handleClickOpen() {
    setOpen(true);
    setRegisteredTag(props.data.userProfile != null ? props.data.userProfile.gamertag : "")
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUpdate() {
    props.handleGamertagChange(enteredTag);
    handleClose();
  }

  const handleInput = event => {
    setEnteredTag(event.target.value);
  };

  let tagEntered = (registeredTag === '') ? (
    <div></div>
  ):
  (
    <div>
      {"Your currently claimed tag is " + registeredTag + ".  Please enter the validation code from your Xbox Live Messages."}
    </div>
  )

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Change Gamertag
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">What is your Gamertag?</DialogTitle>
        <DialogContent>
          {tagEntered}
          <TextField
            autoFocus
            margin="dense"
            id="gamertag"
            label="Gamertag"
            type="text"
            fullWidth
            onChange={handleInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GetGamertag;