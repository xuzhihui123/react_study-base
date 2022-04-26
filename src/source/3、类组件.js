import React from './createElement';
import ReactDOM from './react-dom';


/**
 * 类组件
 * 可以在构造函数里，并且只能在构造函数中给this.state赋值
 * 属性对象props是父组件给的，不能改变。只读属性。
 */

class Counter extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      number:0
    }
  }
  handlerClick=()=>{
    this.setState({
      number:this.state.number+1
    })
  }
  render(){
    return (
      <div>
        <button onClick={this.handlerClick}>修改状态</button>
        <br/>
         {this.state.number}
         <br/>
         {'我是'+this.props.name}
      </div>
    )
  }
}





ReactDOM.render(<Counter name={'lancer'}/>,document.getElementById('app'))
