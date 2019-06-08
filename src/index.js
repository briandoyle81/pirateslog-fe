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

// Custom Components
import NavBar from './components/NavBar.js'
import RemoteData from './components/MaterialTableLog'
import EnterLog from './components/EnterLogForm'
import GetGamertag from './components/GetGamerTag';

// Axios and Django
const axios = require('axios');
const DEBUG_TOKEN = process.env.REACT_APP_DEBUG_TOKEN;
const BE_SERVER = process.env.REACT_APP_BE_SERVER;

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
        };

        this.getIslands(); // Get and cache the list of islands
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
                                //TODO: rename loginState to google token
    handleLoginStateChange = (token) => {
        // If we're authed in the fe from google, get auth token from Django
        if(token != null) {
            let beServerAuthURL = BE_SERVER + "/social/google-oauth2/"; // TODO:  Make dynamic
           
            axios.post(beServerAuthURL, token) 
                .then((response) => {
                    let newState = this.state;
                    
                    newState.isAuthenticated = true; 
                    newState.user = "TODO"; 
                    newState.token = token; // TODO: This is now token object. Rename or refactor
                    newState.beToken = response.data.token;
                    this.setState(newState);

                    // Use the django beToken to get the user profile
                    // TODO: Should be able to return both from first call
                    console.log("be response to auth: ", response)
                    let config = {
                        headers: {
                            'Authorization': 'Token  ' + response.data.token
                        }
                    }
                    axios.get(BE_SERVER + "/api/my_profile/", config)
                    .then((response => {
                        console.log("My Profile: ", response);
                        let newState = this.state;
                        newState.userProfile = response.data[0];
                        this.setState(newState);
                        console.log("state after getting profile: ", this.state)
                    }))
                    .catch((error) => {
                        console.log("Error getting profile", error);
                    })
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
        console.log(config);
        axios.post(BE_SERVER + "/update_gamertag/", body, config) 
                .then((response) => {
                    console.log(response);
                    // TODO: Response should be whole profile
                    let newState = this.state;
                    newState.userProfile.gamertag = response.data;
                    this.setState(newState);
                })
                .catch((error) => {
                    console.log(error);
                })
    }

    render () {
        let addLog = this.state.isAuthenticated ? 
        (
            <div>
                <EnterLog data={this.state}/>
                <div>Debug Controls</div>
                <GetGamertag data={this.state} handleGamertagChange={this.handleGamertagChange}/>
            </div>
        ):
        (
            <Typography variant="h6">Login to Submit!</Typography>
        );

        return (
            <div className="app">
                <NavBar data={this.state} handleLoginStateChange={this.handleLoginStateChange} />
                <Container maxWidth="lg">
                    <Divider />
                    <RemoteData beToken={this.state.beToken}/>
                    { addLog }
                </Container>
            </div>
        )
}

  
}

  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  