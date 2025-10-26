import {useState,useEffect} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {GetHomeDir} from '../wailsjs/go/main/App.js'

function App() {
    const [homeDir,setHomeDir] = useState("Loading...");
    useEffect(() => {
        GetHomeDir().then(result => {
            setHomeDir(result)
        })
    }, []);

    return (
        <div id="App">
            <h1>File Explorer</h1>
            <p>Starting Directory: {homeDir}</p>
        </div>
    )
}

export default App
