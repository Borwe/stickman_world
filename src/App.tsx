import { useEffect, useRef, useState } from 'react'
import './App.css'
import Game from './Game'

export type GameTypes = "" | "Test" | "2P" | "Network"
export type ExitReasons = "UsernameBlank" | "Exited" | "ErrorUnkown" | "None"

function NoUsername(){
  return <h3>No Username Inputed</h3>
}

function UserExited(){
  return <h3>You exited Game successfully</h3>
}

function UnknownError(){
  return <h3>Unkown Error occured</h3>
}

function ExitedBecause(props: {reason: ExitReasons}){
  switch(props.reason){
    case  "UsernameBlank": return <NoUsername/>;
    case "Exited": return <UserExited/>;
    case "ErrorUnkown": return <UnknownError/>;
    default: return <span></span>
  }
}

function App() {

  let [startGameType, setStartGameType] = 
    useState<GameTypes>("")
  let [playerName, setPlayerName] = useState<string>()
  let nameInput = useRef<HTMLInputElement>(null)
  let [exitCause, setExitCause] = useState<ExitReasons>("None")

  const startTestGame = ()=>{
    if(nameInput.current!.value == undefined || nameInput.current!.value.length == 0){
      setExitCause("UsernameBlank")
      return
    }
    setPlayerName(nameInput.current!.value)
    setExitCause("None")
    setStartGameType("Test")
  }

  const start2PGame = ()=>{
    if(nameInput.current!.value == undefined || nameInput.current!.value.length == 0){
      setExitCause("UsernameBlank")
      return
    }
    setPlayerName(nameInput.current!.value)
    setExitCause("None")
    setStartGameType("2P")
  }

  const startNetworkGame = ()=>{
    if(nameInput.current!.value == undefined || nameInput.current!.value.length == 0){
      setExitCause("UsernameBlank")
      return
    }
    setPlayerName(nameInput.current!.value)
    setExitCause("None")
    setStartGameType("Network")
  }

  const exitGame = (reason: ExitReasons)=> {
    setStartGameType("")
    setExitCause(reason)
  }

  const backScreen = ()=>{
    setStartGameType("")
  }


  return (
    <>
    {startGameType!=""?
      <button onClick={backScreen}>Back</button>:<h1>PEW PEW</h1>
    }
    <h3>{playerName}</h3><br/>
    <ExitedBecause reason={exitCause}/>
    { startGameType==""? 
      <div>
        <input ref={nameInput} type='text' placeholder={playerName==undefined?"Enter user name":"Change your name"}/><br/>
        <button onClick={startTestGame}>TestGame</button><br/>
        <button onClick={start2PGame}>2 Player</button><br/>
        <button onClick={startNetworkGame}>Network</button><br/>
      </div>: 
      <div>
        <Game playerName={playerName} exitGame={exitGame} gameType={startGameType}/>
      </div>
    }
      
    </>
  )
}

export default App
