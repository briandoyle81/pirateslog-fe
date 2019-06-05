import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { GoogleLogin } from 'react-google-login';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function NavBar(props) {
    const classes = useStyles();
    const [isAuthenticated, setIsAuthenticated] = useState(props.data.isAuthenticated);
    const [user, setUser] = useState(props.data.setUser);
    const [token, setToken] = useState(props.data.setToken);

    const logout = () => {
      console.log("Logging Out");
      props.handleLoginStateChange( { 
        isAuthenticated: false, 
        user: null, 
        token: null} );

      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }

    const onFailure = (error) => {
      console.log("Error");
      console.log(error);
      alert("Google Auth Failure");
    }

    const googleResponse = (response) => {
      console.log(response);
      // TODO: This seems repititious.  
      props.handleLoginStateChange( { 
        isAuthenticated: true, 
        user: response.profileObj.email, 
        token: response.tokenObj} );

      setIsAuthenticated(true);
      setUser(response.profileObj);
      setToken(response.tokenObj);

      console.log(JSON.stringify(response.tokenObj));
    }
    
    let loginButton = isAuthenticated ? 
      (
        <Button onClick={ logout } color="inherit">Logout</Button>
      ):
      (
        <GoogleLogin
          clientId={ GOOGLE_CLIENT_ID }
          buttonText="Login"
          onSuccess={googleResponse}
          onFailure={onFailure}
        />
      );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Pirate's Log
            </Typography>
            { loginButton }
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  export default NavBar;