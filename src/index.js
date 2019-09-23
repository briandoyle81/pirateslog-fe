import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// oauth login 
// import TwitterLogin from 'react-twitter-auth';
// import FacebookLogin from 'react-facebook-login';

// Material-UI Components
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles'

import { createMuiTheme } from '@material-ui/core/styles';

// Custom Components
import NavBar from './components/NavBar.js'
import RemoteData from './components/MaterialTableLog'
import EnterLog from './components/EnterLogForm'
import GetGamertag from './components/GetGamerTag';

import thunderbird from './components/theme';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// Axios and Django
const axios = require('axios');
const DEBUG_TOKEN = process.env.REACT_APP_DEBUG_TOKEN;
const BE_SERVER = process.env.REACT_APP_BE_SERVER;

// const theme = createMuiTheme({
//     palette: {
//         primary1Color: "#e64a19",
//         canvasColor: "#fffde7",
//         textColor: "#4e342e",
//         secondaryTextColor: "#795548",
//         accent1Color: "#ffea00",
//         accent3Color: "#a1887f",
//         accent2Color: "#8d6e63",
//         primary3Color: "#d7ccc8",
//         primary2Color: "#00bcd4"
//     }
// })

class App extends Component {

    constructor(props) {
        super(props);
        // TODO: Confirm this is the right way to do ES6+
        this.handleLoginStateChange = this.handleLoginStateChange.bind(this);

        this.state = { 
            isAuthenticated: false, 
            userProfile: null,
            beToken: null,
            islands: null,
            profiles: null,
            verified: false, // TODO: This is in profiles
            logEntryToEdit: null, // Used to pass log to edit from RemoteTable to EnterLogForm
            openForm: false, // TODO: This feels like bad separation of concerns
            userEditTime: false,
        };

        this.getIslands(); // Get and cache the list of islands
        this.getProfiles(); //TODO: This will be a problem with more users
        this.checkForLoginToken();

        setInterval(() =>  {
            this.getProfiles()
        }, 1500000); // Keep heroku awake during use

        setInterval(() => {
            // Persistent Login: TODO: More research on this
            this.checkForLoginToken()
        }, 3000000)
    }

    getProfiles = () => {
        axios.get(BE_SERVER + '/api/profiles/') 
            .then((response) => {
                let newState = this.state;
                newState.profiles = response.data;
                this.setState(newState);
            })
            .catch((error) => {
                console.log(error);
        })
    }

    getIslands = () => {
        axios.get(BE_SERVER + '/api/islands/') 
            .then((response) => {
                let newState = this.state;
                newState.islands = response.data;
                this.setState(newState);
            })
            .catch((error) => {
                console.log(error);
        })
    }

    checkForLoginToken = () => {
        let local_token_string = localStorage.google_token
        if(local_token_string != null){
            let local_token = JSON.parse(local_token_string);
            // TODO: Other auth
            this.handleLoginStateChange(local_token, "google");
        }
    }

    handleOpenLogForm = () => {
        let newState = this.state;
        newState.openForm = true;
        newState.userEditTime = false;
        this.setState(newState);
    }

    handleCloseLogForm = () => {
        let newState = this.state;
        newState.openForm = false;
        newState.logEntryToEdit = null;
        this.setState(newState);
    }

    handleEditLog = (entry) => {
        // This changes the prop passed into EnterLogForm and triggers edit mode
        let newState = this.state;
        newState.logEntryToEdit = entry;
        newState.openForm = true;
        this.setState(newState);
    }

    // TODO: Rename to handleLogEntered
    handleNewLogEntered = () => {
        this.forceUpdate(); //TODO: Find better solution to force table to redraw
    }
                                //TODO: rename loginState to google token
    handleLoginStateChange = (token, provider) => {
        // If we're authed in the fe from google, get auth token from Django
        if(token != null) {
            let beServerAuthURL = BE_SERVER + "/social/" + provider + "-oauth2/"; // TODO:  Make dynamic
           
            axios.post(beServerAuthURL, token) 
                .then((response) => {
                    let newState = this.state;
                    
                    newState.isAuthenticated = true; 
                    newState.user = "TODO"; 
                    newState.token = token; // TODO: This is now token object. Rename or refactor
                    newState.beToken = response.data.token;  // The Django Token
                    newState.userProfile = JSON.parse(response.data.profile);
                    newState.verified = newState.userProfile.verified;
                    this.setState(newState);
                })
                .catch((error) => {
                    console.log(error);
            })
        } else {
            let newState = this.state;
                    
            newState.isAuthenticated = false; 
            newState.user = "null"; 
            newState.token = null; // TODO: This is now token object. Rename or refactor
            newState.beToken = null;
            newState.userProfile = null;
            this.setState(newState);
        }
    }

    handleGamertagChange = (newName) => {
        let config = {
            headers: {
                'Authorization': 'Token  ' + this.state.beToken
            }
        }
        let body = {
            name: newName
        }
        axios.post(BE_SERVER + "/update_gamertag/", body, config) 
            .then((response) => {
                // TODO: Response should be whole profile
                let newState = this.state;
                newState.userProfile.gamertag = response.data;
                this.setState(newState);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    handleGamertagVerify = (code) => {
        let config = {
            headers: {
                'Authorization': 'Token  ' + this.state.beToken
            }
        }
        let body = {
            code: code
        }
        axios.post(BE_SERVER + "/verify_gamertag/", body, config) 
                .then((response) => {
                    // TODO: Response should be whole profile
                    let newState = this.state;
                    let bool = false;
                    if (response.data === 'true') {
                        bool = true;
                    }
                    newState.userProfile.verified = bool;
                    newState.verified = bool;
                    this.setState(newState);
                })
                .catch((error) => {
                    console.log(error);
                })
    }

    render () {
        let verifyTag = this.state.verified ?
        (
            <div></div>
        ):
        (
            <GetGamertag data={this.state} handleGamertagChange={this.handleGamertagChange} handleGamertagVerify={this.handleGamertagVerify}/>
        )

        let enterLogButton = <Typography>Please enter your Gamertag!</Typography>
        if (this.state.userProfile != null){
        if (this.state.userProfile.gamertag !== ""){
            enterLogButton = <EnterLog 
                data={this.state} 
                handleOpenLogForm={this.handleOpenLogForm}
                handleCloseLogForm={this.handleCloseLogForm}
                handleResetEditLog={this.handleResetEditLog} 
                handleNewLogEntered={this.handleNewLogEntered}
                />
            }
        }

        let addLog = this.state.isAuthenticated ? 
        (
            <div>
                { enterLogButton }
                { verifyTag }
            </div>
        ):
        (
            <Typography>Login to save a log entry!</Typography>
        );
        
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className="app">
                    <ThemeProvider theme={thunderbird}>
                        <NavBar data={this.state} handleLoginStateChange={this.handleLoginStateChange}/>
                        <Container maxWidth="lg">
                            <Divider />
                            <RemoteData beToken={this.state.beToken} userProfile={this.state.userProfile} handleEditLog={this.handleEditLog}/>
                            { addLog }
                        </Container>
                    </ThemeProvider>
                </div>
            </MuiPickersUtilsProvider>
        )
}

  
}

  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  