import { useEffect, useRef, useState } from "react"
import { ExitReasons, GameTypes } from "./App"

type WindowSize = {
  width: number,
  height: number
}

const CANVAS_HEIGHT  = 400
const CANVAS_WIDTH = 500

class Spot {
  x: number = 250
  y: number = 200
  radius: number = 10

  constructor(){}


  draw(ctx: CanvasRenderingContext2D){
    ctx.beginPath()
    ctx.fillStyle = "red"
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI )
    ctx.fill()
    ctx.closePath()
  }

  move(){
    const direction =  Math.floor(Math.random() * 4)
    switch(direction){
      case 0: this.moveDown();break;
      case 1: this.moveUp(); break;
      case 2: this.moveLeft(); break;
      case 3: this.moveRight(); break;
      default: window.alert("THIS SHOULDN't HAPPEN")
    }
  }

  moveRight(){
    if(this.x+5+this.radius<0){
      this.x-=5
    }else{
      this.x+=5
    }
  }

  moveLeft(){
    if(this.x-5-this.radius<0){
      this.x+=5
    }else{
      this.x-=5
    }
  }

  moveUp(){
    if(this.y-5-this.radius<0){
      this.y+=5
    }else{
      this.y-=5
    }
  }

  moveDown(){
    if(this.y+5+this.radius>CANVAS_HEIGHT){
      this.y-=5
    }else{
      this.y+=5
    }
  }
}

type Direction = "D" | "U" | "R" | "L"

class Player{
  name: string
  height = 120
  width = 40
  x: number = 0
  y: number = 0
  jump: boolean = false
  direction: Direction = "R"

  constructor(name: string){
    this.name = name
  }

  drawHead(ctx: CanvasRenderingContext2D){
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.arc(this.x +20 , this.y + 20, 20, 0, 2 * Math.PI )
    ctx.stroke()
    ctx.closePath()
  }

  drawThorax(ctx: CanvasRenderingContext2D) {
    //back
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.moveTo(this.x+20, this.y + 40)
    ctx.lineTo(this.x+20, this.y + 70)
    ctx.stroke()
    ctx.closePath()

    //left arm
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.moveTo(this.x+20, this.y + 50)
    ctx.lineTo(this.x, this.y + 60)
    ctx.stroke()
    ctx.closePath()

    //right arm
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.moveTo(this.x+20, this.y + 50)
    ctx.lineTo(this.x+40, this.y + 60)
    ctx.stroke()
    ctx.closePath()
  }

  drawBottom(ctx: CanvasRenderingContext2D) {
    //left leg
    ctx.beginPath()
    ctx.moveTo(this.x+20, this.y + 70)
    ctx.lineTo(this.x, this.y + 120)
    ctx.stroke()
    ctx.closePath()

    //right leg
    ctx.beginPath()
    ctx.moveTo(this.x+20, this.y + 70)
    ctx.lineTo(this.x+40, this.y + 120)
    ctx.stroke()
    ctx.closePath()
  }

  draw(ctx: CanvasRenderingContext2D){
    ctx.lineWidth = 2
    this.drawHead(ctx)
    this.drawThorax(ctx)
    this.drawBottom(ctx)
  }

  setDirectionDown(){
    this.direction = "D"
  }

  setDirectionUp(){
    this.direction = "U"
  }

  setDirectionLeft(){
    this.direction = "L"
  }

  setDirectionRight(){
    this.direction = "R"
  }

  move(){
    switch(this.direction){
      case "D": 
        if(this.y+10 <= CANVAS_HEIGHT-this.height){
          this.y+=10;
        }
        break;
      case "U": 
        if(this.y - 10 >= 0){
          this.y-=10;
        }
        break;
      case "L": 
        if(this.x-10 >= 0){
          this.x-=10
        }
        break;
      case "R":
        if(this.x+10 <= CANVAS_WIDTH-this.width){
          this.x+=10
        }
        break;
    }
  }

}

class GameState{
  me?: Player
  other?: Player
  type?: GameTypes
  spot =  new Spot()

  createMe(my_name: string){
    this.me = new  Player(my_name)
  }

  createOther(my_name: string){
    this.other = new  Player(my_name)
  }

  // TODO make this mutliplayer
  async waitForConnection(){
    this.other =  new Player("Coolio")
  }

  setup(type: GameTypes, me: string){
    this.createMe(me)
    if(type == "Test" ){
      this.createOther("Test")
    }
    this.type = type
  }

  drawBackground(canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D){
      ctx.clearRect(0,0,canvas.width, canvas.height)
      ctx.fillStyle = "white"
      ctx.fillRect(0,0,canvas.width, canvas.height);
  }


  handleMoveDirectionInput(event: KeyboardEvent){
    switch(event.key){
      case "ArrowLeft":
        GAMESTATE.me?.setDirectionLeft(); break;
      case "ArrowRight":
          GAMESTATE.me?.setDirectionRight();break;
      case "ArrowUp":
          GAMESTATE.me?.setDirectionUp();break;
      case "ArrowDown":
          GAMESTATE.me?.setDirectionDown();break;
    }
  }

  handleSpaceBarInput(event: KeyboardEvent){
    if(event.key == " "){
      GAMESTATE.me?.move()
    }
  }

  async gamePaintLogic(canvas: HTMLCanvasElement){
    const ctx = canvas.getContext("2d")
    if(ctx){
      while( ctx && canvas){
        this.drawBackground(canvas, ctx)
        this.spot.draw(ctx)
        this.me?.draw(ctx)
        this.spot.move()
        await new Promise(resolve => setTimeout(resolve, 15.5))
      }
    }else{
      window.alert("Your browser doesn't support 2d graphics")
    }
  }
}

export const GAMESTATE = new GameState()


function Game(props: {gameType: GameTypes,
  playerName: string | undefined,
  exitGame: (reason: ExitReasons)=>void }) {

  if(props.playerName == undefined || props.playerName.length == 0){
    props.exitGame("UsernameBlank")
    return <div></div>
  }

  GAMESTATE.setup(props.gameType, props.playerName!!)
  let [windowState, setWindowState] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  let canvasRef = useRef<HTMLCanvasElement>(null)

  const handleResize = ()=>{
      let windowSize: WindowSize  = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      setWindowState(windowSize)
  }

  useEffect(()=>{
    window.addEventListener("resize", handleResize)
    window.addEventListener("keydown", GAMESTATE.handleMoveDirectionInput)
    window.addEventListener("keyup", GAMESTATE.handleSpaceBarInput)
    return ()=>{
      window.removeEventListener("resize", handleResize)
    window.removeEventListener("keyup", GAMESTATE.handleSpaceBarInput)
      window.removeEventListener("keydown", GAMESTATE.handleMoveDirectionInput)
    }
  },[]);

  useEffect(()=>{
    const canvas = canvasRef.current
    if(canvas){
      GAMESTATE.gamePaintLogic(canvas)
    }
  },[canvasRef, windowState])

  console.log("Changed size:",windowState)

  return (
    <canvas ref={canvasRef} width={500} height={400}></canvas>
  )
}

export default Game
