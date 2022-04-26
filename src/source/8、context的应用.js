import React from './createElement';
import ReactDOM from './react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'


let PersonContext = React.createContext()
function getColor(color){
  return {border: `1px solid ${color}`,padding:'10px'}
}


class Person extends React.Component{
  state = {
    color:'red'
  }
  setColor=(color)=>{
    this.setState({
      color
    })
  }
  render(){
    let value = {color:this.state.color,setColor:this.setColor}
    return (
       <PersonContext.Provider value={value}>
          <div style={getColor(this.state.color)}>
            Person
            <Head/>
            <Body/>
          </div>
       </PersonContext.Provider>
    )
  }
}


class Head extends React.Component{
  static contextType = PersonContext
  render(){
    return (
      <div style={getColor(this.context.color)}>
         Head
      </div>
    )
  }
}

class Body extends React.Component{
  static contextType = PersonContext
  render(){
    return (
      <div style={getColor(this.context.color)}>
         Body
         <Tummy/>
         <button onClick={()=>{this.context.setColor('green')}}>
            变绿
         </button>
         <button onClick={()=>{this.context.setColor('red')}}>
            变红
         </button>
      </div>
    )
  }
}


function Tummy(props){
  return (
    <PersonContext.Consumer>
        {
          contextValue=>{
            return  (<div style={getColor(contextValue.color)}>
            tummy
         </div>)
          }
        }
    </PersonContext.Consumer>
  )
}




ReactDOM.render(<Person />, document.getElementById('app'))
