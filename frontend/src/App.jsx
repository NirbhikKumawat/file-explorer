import {useState,useEffect} from 'react';
import './App.css';
import {GetHomeDir,
    ListDirectory,
    JoinPath,
    GetParentDirectory
} from '../wailsjs/go/main/App.js'

function App() {
    const [currentPath,setCurrentPath] = useState("Loading...");
    const [error,setError] = useState("");
    const [files,setFiles] = useState([]);
    const loadDirectory =(path)=>{
        ListDirectory(path)
            .then(fileList=>{
                setFiles(fileList);
                setCurrentPath(path);
                setError("");
            })
    }
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
    const handleEntryClick = (file)=>{
        if(!file.isDirectory){
            console.log("File opening will be added in next update",file.name);
            return;
        }
        JoinPath(currentPath,file.name)
            .then(newPath =>{
                loadDirectory(newPath)
            })
    }

    const goBack = ()=>{
        GetParentDirectory(currentPath)
            .then(parentPath=>{
                loadDirectory(parentPath);
            });
    }

    return (
        <div id="App">
            <h1>File Explorer</h1>
            <div className="nav-bar">
                <button onClick={goBack}>Back</button>
                <input type="text" value={currentPath} readOnly/>
            </div>

            {error && <div className="error">Error: {error}</div>}

            <ul className="file-list">
                {files.map(file =>(
                    <li key={file.name} onClick={()=>handleEntryClick(file)}>
                        <span className="icon">
                            {file.isDirectory ? '📁':'📄'}
                        </span>
                        {file.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
