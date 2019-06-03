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

    constructor(props) {
        super(props);
        // TODO: Confirm this is the right way to do ES6+
        this.setLoginState = this.setLoginState.bind(this);

        this.state = { isAuthenticated: false, user: null, token: ''};
        console.log(this.state)
    }
    
    setLoginState = (loginState) => {
        console.log("login state being set");
        console.log(loginState);
        this.state = this.setState(loginState);
        console.log("this.state");
        console.log(this.state);
    }

    addLog = this.isAuthenticated ? 
    (
        <FormDialog />
    ):
    (
        <div>Log in to Submit!</div>
    );

    render () {
        return (
            <div className="app">
                <NavBar data={this.state} setLoginState= { this.setLoginState } />
                <Container maxWidth="lg">
                    <Divider />
                    <RemoteData />
                    { this.addLog}
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
  