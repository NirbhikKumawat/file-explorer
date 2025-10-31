import {useState,useEffect} from 'react';
import './App.css';
import {GetHomeDir,
    ListDirectory,
    JoinPath,
    GetParentDirectory,
    OpenFile,
    CreateFolder,
    CreateFile,
    RenameEntry,
    MoveEntry
} from '../wailsjs/go/main/App.js'

function formatBytes(bytes,decimals =2){
    if(bytes ===0) return '0 Bytes';
    const k =1024;
    const dm = decimals < 0?0:decimals;
    const sizes = ['Bytes','KB','MB','GB','TB'];
    const i =Math.floor(Math.log(bytes)/Math.log(k));
    return parseFloat((bytes/Math.pow(k,i)).toFixed(dm))+ ' '+sizes[i];
}

function formatDate(dateString){
    const date = new Date(dateString);
    return date.toLocaleString();
}
function App() {
    const [currentPath,setCurrentPath] = useState("Loading...");
    const [error,setError] = useState("");
    const [files,setFiles] = useState([]);
    const [showHidden,setShowHidden]=useState(false);
    const [cutItem,setCutItem] = useState(null);
    const loadDirectory =(path,hidden)=>{
        ListDirectory(path,hidden)
            .then(fileList=>{
                setFiles(fileList);
                setCurrentPath(path);
                setError("");
            })
    }
    useEffect(() => {
        GetHomeDir().then(path => {
            loadDirectory(path,showHidden)
            })
        },[showHidden]);

    const handleEntryClick = (file)=>{
        JoinPath(currentPath,file.name)
            .then(newPath =>{
                if(file.isDirectory){
                    loadDirectory(newPath,showHidden);
                }else{
                    console.log("Opening file:",newPath);
                    OpenFile(newPath)
                }
            })
    }

    const goBack = ()=>{
        GetParentDirectory(currentPath)
            .then(parentPath=>{
                loadDirectory(parentPath);
            });
    }
    const handleRename = (event,file) =>{
        event.stopPropagation();
        const newName = prompt("Enter new name:",file.name);
        if (newName && newName!==file.name){
            RenameEntry(currentPath,file.name,newName)
                .then(()=>{
                    setError("");
                    loadDirectory(currentPath,showHidden);
                })
                .catch(err=>{
                    setError(err);
                });
            }
        }

    const handleShowHiddenChange = (e) => {
        setShowHidden(e.target.checked);
    }

    const handleNewFolder = () =>{
        const folderName = prompt("Enter new folder name:");
        if(folderName){
            CreateFolder(currentPath,folderName)
                .then(()=>{
                    setError("");
                    loadDirectory(currentPath,showHidden);
                })
                .catch(err=>{
                    setError(err);
                });
        }
    }
    const handleNewFile = () =>{
        const fileName = prompt("Enter the name of the file:");
        if(fileName){
            CreateFile(currentPath,fileName)
                .then(()=>{
                    setError("");
                    loadDirectory(currentPath,showHidden);
                })
                .catch(err=>{
                    setError(err);
                });
        }
    }
    const handleCut = (event,file)=>{
        event.stopPropagation();
        JoinPath(currentPath,file.name)
            .then(fullPath=>{
                setCutItem({fullPath: fullPath,
                    name: file.name
                });
                setError(`Cut: ${file.name}. Navigate to a new folder and click Paste`)
            })
            .catch(
                err=> setError(err));
    }
    const handlePaste = () =>{
        if(!cutItem){
            return;
        }
        GetParentDirectory(cutItem.fullPath)
            .then(parentDir=>{
                if(parentDir===currentPath){
                    setCutItem(null);
                    setError("Useless Operation,cutting and pasting the file at same location");
                    return;
                }
                MoveEntry(cutItem.fullPath,currentPath,cutItem.name)
                    .then(()=>{
                        setCutItem(null);
                        setError("");
                        loadDirectory(currentPath,showHidden);
                    })
                    .catch(err=>{
                        setError(err);
                        setCutItem(null);
                    })
            })
    }

    return (
        <div id="App">
            <h1>File Explorer</h1>
            <div className="nav-bar">
                <button onClick={goBack}>Back</button>
                <input type="text" value={currentPath} readOnly/>
                <button onClick={handleNewFolder}>New Folder</button>
                <button onClick={handleNewFile}>New File</button>
                <button disabled={!cutItem} onClick={handlePaste}>
                    Paste
                </button>
            </div>

            <div className="controls">
                <label>
                    <input type="checkbox" checked={showHidden} onChange={handleShowHiddenChange}/>
                    Show Hidden Files
                </label>
            </div>
            {error && <div className="error">Error: {error}</div>}

            <ul className="file-list">
                {files.map(file =>(
                    <li key={file.name}>
                        <div className="file-item-main" onClick={()=>handleEntryClick(file)}>
                        <span className="icon">
                            {file.isDirectory ? '📁':'📄'}
                        </span>
                        <span className="file-name">{file.name}</span>
                        {!file.isDirectory &&(
                            <>
                                <span className="file-size">{formatBytes(file.size)}</span>
                            <span className="file-modtime">{formatDate(file.modTime)}</span>
                            </>
                        )}
                        </div>
                        <button className="rename-btn" onClick={(e)=> handleRename(e,file)}>
                            Rename
                        </button>
                        <button className="cut-btn" onClick={(e)=>handleCut(e,file)}>
                            Cut
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
