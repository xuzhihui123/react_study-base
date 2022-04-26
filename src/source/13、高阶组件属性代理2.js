// import React from './source/createElement';
// import ReactDOM from './source/react-dom';
import React from 'react'
import ReactDOM  from 'react-dom'

 



function Hoc(OldComponent){
  return class NewComponent extends React.Component{
    state = {
      x:0,
      y:0
    }
    mouseMove=(e)=>{
      this.setState({
        x:e.clientX,
        y:e.clientY
      })
    }
    render(){
      return (
        <div>
           <span>{this.props.name}</span>
           <h1 onMouseMove={this.mouseMove}>测试指针坐标</h1>
            <OldComponent {...this.state}/>
        </div>
      )
    }
  }
}

function Hello(props){
  return (
    <p>
       x坐标：{props.x},y坐标:{props.y}
    </p>
  )
}

let NewHello = Hoc(Hello)



ReactDOM.render(<NewHello name={'133'}/>, document.getElementById('app'))



