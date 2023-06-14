import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import Alert from './components/Alert';
import GenerateImage from './components/GenerateImage';
import Navbar from './components/Navbar';
import { useState } from 'react';
import ImageVariation from "./components/ImageVariation";
import MaskImage from "./components/MaskImage";

const App = () => {

  const [apiKey, setApiKey] = useState("");

  const getApiKey = (apiKey) => {
    setApiKey(apiKey);
  }

  const [alert, setAlert] = useState({ isSet: false, message: null });

  const showAlert = (isSet, message) => {
    setAlert({ isSet: isSet, message: message });

    setTimeout(() => {
      setAlert({ isSet: false, message: null });
    }, 8000)

  }

  return (
    <div>
      <Router>
        <Navbar getApiKey={getApiKey} />
        <Alert alert={alert} />
        <Routes>
          <Route>
            <Route path="/" element={<GenerateImage apiKey={apiKey} showAlert={showAlert} />} />
            <Route path="/generateimage" element={<GenerateImage apiKey={apiKey} showAlert={showAlert} />} />
            <Route path="/imagevariation" element={<ImageVariation apiKey={apiKey} showAlert={showAlert} />} />
            <Route path="/maskimage" element={<MaskImage apiKey={apiKey} showAlert={showAlert} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
