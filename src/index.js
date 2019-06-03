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

//   class App extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         gameStart: true,
//       }
//     }

//     startGame(value) {
//       this.setState({
//         gameStart: value,
//       })
//     }

//     render() {
  
//       if(!this.state.gameStart){
//         return (//onclick bubbles up automagically.  
//           <div className="landing-page">
//             <LandingPage 
//             onClick={(value) => this.startGame(value)}
//             />
//           </div>
//         )
//       } else {
//         return (
//           <div className="app">
//             <NavBar />
//             <Container maxWidth="lg">
//              <Divider />
//               <RemoteData />
//               <SimpleModal />
//               <FormDialog />
//             </Container>
//           </div>
//         )
//       }
//     }
//   }

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

        // const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        // const options = {
        //     method: 'POST',
        //     body: tokenBlob,
        //     mode: 'cors',
        //     cache: 'default'
        // };
        // fetch('http://localhost:4000/api/v1/auth/google', options).then(r => {
        //     const token = r.headers.get('x-auth-token');
        //     console.log(token);
        //     r.json().then(user => {
        //         console.log("token", token)
        //         if (token) {
        //             this.setState({isAuthenticated: true, user, token})
        //         }
        //     });
        // })
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

    // render() { // Per internet !! is just an obscure way to do a conversion to bool.
    // let content = !!this.state.isAuthenticated ?
    //         (
    //             <div>
    //                 <p>Authenticated</p>
    //                 <div>
    //                     {this.state.user}
    //                 </div>
    //                 <div>
    //                     <button onClick={this.logout} className="button">
    //                         Log out
    //                     </button>
    //                 </div>
    //             </div>
    //         ) :
    //         (
    //             <div>
    //                 <GoogleLogin
    //                     clientId={ GOOGLE_CLIENT_ID }
    //                     buttonText="Login"
    //                     onSuccess={this.googleResponse}
    //                     onFailure={this.onFailure}
    //                 />
    //             </div>
    //         );

    //     return (
    //         <div className="App">
    //             {content}
    //         </div>
    //     );
    // }
}

  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  