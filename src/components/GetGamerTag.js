import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function GetGamertag(props) {
  const [open, setOpen] = useState(false);
  const [enteredTag, setEnteredTag] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [registeredTag, setRegisteredTag] = useState("");
  const [verified, setVerified] = useState(true); // Start as true to avoid render
                                                  // Won't be needed when profile is returned with login
  useEffect(() => {
    console.log("effect in getGamerTag")
    if(props.data.userProfile != null) {
      setRegisteredTag(props.data.userProfile.gamertag)
      setVerified(props.data.userProfile.verified)
    }
  }, [props.data])

  function handleClickOpen() {
    setOpen(true);
    setRegisteredTag(props.data.userProfile != null ? props.data.userProfile.gamertag : "")
    setVerified(props.data.userProfile.verified != null ? props.data.userProfile.verified : false)
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUpdate() {
    // TODO: Validation
    if(enteredTag !== "") {
      props.handleGamertagChange(enteredTag);
    }
    if(enteredCode !== "") {
      props.handleGamertagVerify(enteredCode);
      handleClose();
    }
  }

  const handleInput = event => {
    setEnteredTag(event.target.value);
  };

  const handleCodeInput = event => {
    setEnteredCode(event.target.value);
  };

  let tagUnknown = registeredTag === '' ? (
    <TextField
            autoFocus
            margin="dense"
            id="gamertag"
            label="Gamertag"
            type="text"
            fullWidth
            onChange={handleInput}
          />
  ):
  (
    <div></div>
  )

  let tagKnownButNotverified = (registeredTag !== '' && !verified) ? (
    <div>
    {"Your currently claimed tag is " + registeredTag + ".  Please enter the verification code from your Xbox Live Messages.  It may take a few minutes for the message to arrive."}
      <TextField
            autoFocus
            margin="dense"
            id="validationCode"
            label="Validation Code"
            type="text"
            fullWidth
            onChange={handleCodeInput}
          />
    </div>
  ):
  (
    <div></div>
  )

  let verifiedTag = verified ? (
    <div>Your Gamertag has been verified.  No further action needed.</div>
  ):
  (
    <div></div>
  )

  let buttons = verified ? (
    <Button onClick={handleClose} color="primary">
      Ok
    </Button>
  ):
  (
    <div>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleUpdate} color="primary">
        Update
      </Button>
    </div>
  )

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Verify Gamertag
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">What is your Gamertag?</DialogTitle>
        <DialogContent>
          {tagUnknown}
          {tagKnownButNotverified}
          {verifiedTag}
        </DialogContent>
        <DialogActions>
          {buttons}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GetGamertag;