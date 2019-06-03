import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// oauth login 
// import TwitterLogin from 'react-twitter-auth';
// import FacebookLogin from 'react-facebook-login';

// Material-UI Components
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import NavBar from './components/NavBar.js'
import RemoteData from './components/MaterialTableLog'
import SimpleModal from './components/OpenLog'
import FormDialog from './components/EnterLogForm'

class App extends Component {

    constructor() {
        super();
        this.state = { isAuthenticated: false, user: null, token: ''};
    }

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };

    onFailure = (error) => {
        console.log("Error");
        console.log(error);
        alert(error);
    };

    googleResponse = (response) => {
        console.log(response);

        this.setState(
            {
                isAuthenticated: true, 
                user: response.profileObj.email, 
                token: response.accessToken,
            });
    };

    render () {
        return (
            <div className="app">
                <NavBar />
                <Container maxWidth="lg">
                    <Divider />
                    <RemoteData />
                    <SimpleModal />
                    <FormDialog />
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
  