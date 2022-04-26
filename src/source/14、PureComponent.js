import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'

/**
 * PureComponent 实现类组件的一些性能优化 , PureComponent只会比较浅的 像下面这样引用类型未改变，导致出现未更新的效果。
 */

class Father extends React.Component {
  state = {
    age1: {
      number:1
    },
    age2: {
      number:2
    }
  }
  btn1=()=>{
    let age1 = this.state.age1
    age1.number = age1.number +1
    this.setState({
      age1
    })
  }
  btn2=()=>{
    let age2 = this.state.age2
    age2.number = age2.number +1
    this.setState({
      age2
    })
  }
  render () {
    return (
      <div>
        <Child1 age1={this.state.age1} />
        <Child2 age2={this.state.age2} />
        <button onClick={this.btn1}>child1++</button>
        <button onClick={this.btn2}>child2++</button>
      </div>
    )
  }
}

class Child1 extends React.PureComponent {
  render () {
    console.log('child1 render');
    return (
      <div>
        <h1>Child1</h1>
        {
          this.props.age1.number
        }
      </div>
    )
  }
}


class Child2 extends React.PureComponent {
  render () {
    console.log('child2 render');
    return (
      <div>
        <h1>Child2</h1>
        {
          this.props.age2.number
        }
      </div>
    )
  }
}





ReactDOM.render(<Father />, document.getElementById('app'))



