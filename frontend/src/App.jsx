import {useState,useEffect} from 'react';
import './App.css';
import {GetHomeDir,ListDirectory} from '../wailsjs/go/main/App.js'

function App() {
    const [currentPath,setCurrentPath] = useState("Loading...");
    const [error,setError] = useState("");
    const [files,setFiles] = useState([]);
    useEffect(() => {
        GetHomeDir().then(path => {
            setCurrentPath(path);
            ListDirectory(path)
                .then(fileList=>{
                setFiles(fileList);
            })
                .catch(err =>{
                    console.error("Error listing directory:", err);
                    setError(err);
                });

        });

    }, []);

    return (
        <div id="App">
            <h1>File Explorer</h1>
            <p>Current Path: {currentPath}</p>
            {error && <div className="error">Error: {error}</div>}

            <ul className="file-list">
                {files.map(file =>(
                    <li key={file.name}>
                        {file.isDirectory ? '📁':'📄'} {file.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
