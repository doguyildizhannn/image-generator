import './App.css';
import Alert from './components/Alert';
import GenerateImage from './components/GenerateImage';
import Navbar from './components/Navbar';
import { useState } from 'react';

const App = () => {

  const [apiKey, setApiKey] = useState("");

  const getApiKey = (apiKey) => {
      setApiKey(apiKey);
  }

  const [alert, setAlert] = useState({isSet: false, message: null});

  const showAlert = (isSet, message) => {
    setAlert({isSet: isSet, message: message});

    setTimeout(() => {
      setAlert({isSet: false, message: null});
    }, 8000)
    
  }

  return (
    <div>
      <Navbar getApiKey={getApiKey}/>
      <Alert alert={alert}/>
      <GenerateImage apiKey={apiKey} showAlert={showAlert}/>
    </div>
  );
}

export default App;
