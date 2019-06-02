import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Material-UI Components
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import NavBar from './components/NavBar.js'
import RemoteData from './components/MaterialTableLog'
import SimpleModal from './components/OpenLog'
import FormDialog from './components/EnterLogForm'

  class LandingPage extends React.Component {
    render() {
      return (// I think the this.props.onclick will bubble up that this was clicked?
        <div className="landing-page">
          <p>Start the Game!</p>
          <button onClick={() => this.props.onClick(true)}> 
            Click to Start
          </button>
        </div>
      )
    }
  }

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        gameStart: true,
      }
    }

    startGame(value) {
      this.setState({
        gameStart: value,
      })
    }

    render() {
  
      if(!this.state.gameStart){
        return (//onclick bubbles up automagically.  
          <div className="landing-page">
            <LandingPage 
            onClick={(value) => this.startGame(value)}
            />
          </div>
        )
      } else {
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
  }

  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  