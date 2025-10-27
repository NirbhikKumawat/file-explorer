import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {Greet} from "../wailsjs/go/main/App";// function imported from backend

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e) => setName(e.target.value);
    const updateResultText = (result) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);// calls Greet method defined in backend
        // on resolving the promise the value in text box is updated
    }

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/> {/*Image displayed*/}
            <div id="result" className="result">{resultText}</div> {/*message telling to enter name*/}
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/> {/*input box to add a name for greetiing*/}
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

export default App
