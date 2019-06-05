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
            user: null, 
            token: null, // TODO: This is now token object. Rename or refactor
            beToken: null,
        };
    }
                                //TODO: rename loginState to google token
    handleLoginStateChange = (token) => {
        console.log("handling login state change");
       
        // If we're authed in the fe from google, get auth token from Django
        if(token != null) {
            let beServerAuthURL = BE_SERVER + "/social/google-oauth2/"; // TODO:  Make dynamic
           
            axios.post(beServerAuthURL, token) 
                .then((response) => {
                    console.log("BE response: ", response);
                    let newState = { 
                        isAuthenticated: true, 
                        user: "TODO", 
                        token: token, // TODO: This is now token object. Rename or refactor
                        beToken: response.data.token,
                    };
                    this.setState(newState);
                })
                .catch((error) => {
                    console.log(error);
                } )
        } else {
            let newState = { 
                isAuthenticated: false, 
                user: null, 
                token: null, // TODO: This is now token object. Rename or refactor
                beToken: null,
            };
            this.setState(newState);
        }
    }

    render () {
        let addLog = !!this.state.isAuthenticated ? 
        (
            <div>
                <RemoteData data={this.state} />
                <EnterLog />
            </div>
        ):
        (
            <Typography variant="h6">Login to Submit!</Typography>
        );

        return (
            <div className="app">
                <NavBar data={this.state} handleLoginStateChange={ this.handleLoginStateChange } />
                <Container maxWidth="lg">
                    <Divider />
                    
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
  