import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'

let messageFun = str => OldComponent=>{
  return class NewHello extends React.Component{
    show=()=>{
      let message = document.createElement('div')
      message.id = 'message'
      message.style = "position:absolute;top:50%;left:50%;color:red;border:1px solid red"
      message.innerHTML = `<p>${str}</p>`
      document.body.appendChild(message)
    }
    hide=()=>{
      document.getElementById('message').remove()
    }
     render(){
       let extraProps = {show:this.show,hide:this.hide}
       return  <OldComponent {...this.props} {...extraProps}/> 
     }
  }
}



@messageFun('hello lancer')
class Hello extends React.Component{
  render(){
    return   (<div>
      <p>{this.props.good}</p>
    <button onClick={this.props.show}>显示</button>
    <button onClick={this.props.hide}>
       隐藏
    </button>
 </div>)
  }
}




ReactDOM.render(<Hello good={'你好lancer'}/>, document.getElementById('app'))
