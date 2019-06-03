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
        this.handleLoginStateChange = this.handleLoginStateChange.bind(this);

        this.state = { isAuthenticated: false, user: null, token: ''};
        console.log(this.state)
    }
    
    handleLoginStateChange = (loginState) => {
        this.setState(loginState);
    }

    render () {
        let addLog = !!this.state.isAuthenticated ? 
        (
            <FormDialog />
        ):
        (
            <div>Log in to Submit!</div>
        );

        return (
            <div className="app">
                <NavBar data={this.state} handleLoginStateChange={ this.handleLoginStateChange } />
                <Container maxWidth="lg">
                    <Divider />
                    <RemoteData />
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
  