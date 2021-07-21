import React, {Component} from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home'

import './App.css';


class App extends Component {
  render(){
    return (
      <>
      <Navbar />
      <Home />
      </>
    );
  }
}

export default App;
