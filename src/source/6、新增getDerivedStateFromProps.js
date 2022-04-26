import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'




class Counter extends React.Component {
  static defaultProps = {
    name: 'static lancer'
  }
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
    console.log('Count 1 start');
  }
  handlerClick = () => {
    this.setState({ number: this.state.number + 1 }, () => {
      console.log('callback execute');
    })
  }
  componentWillMount () {
    console.log('Count 2 start');
  }
  componentDidMount () {
    console.log('Count 4 start');
  }
  shouldComponentUpdate (nextProps, nextState) {
    console.log('shoud', this.state, nextState);
    return true
  }
  componentWillUpdate () {
    console.log('willUpdate', this.state);

    console.log('Count 5 start');

  }
  componentDidUpdate () {
    console.log('didUpdate', this.state);

    console.log('Count 6 start');
  }
  render () {
    console.log('Count 3 start');
    return (
      <div>
        <p>{Counter.defaultProps.name}</p>
        <p>{this.state.number}</p>
        {<ChildCount count={this.state.number} />}
        <button onClick={this.handlerClick}>+1</button>
      </div>
    )
  }
}


class ChildCount extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }
  // UNSAFE_componentWillUpdate(){  // 如果这边写了 getDerivedStateFromProps，UNSAFE_componentWillUpdate,
  // UNSAFE_componentWillMount生命周期无效，报错，避免使用
  //   console.log('child will update');
  // }
  static getDerivedStateFromProps (nextProps, prevState) {
    console.log(nextProps,prevState);
    console.log('child stateFromProps');
    const { count } = nextProps
    if (count === 0) {
      return { number: 10 }
    } else if (count % 2 === 0) {
      return { number: count * 2 }
    }
    return null // 不改变当前state状态
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log(nextProps,nextState);
    return true
  }
  childClick=()=>{
    this.setState({
      number:this.state.number+1
    })
  }
  render () {
    return (
      <div>
        child
        {this.state.number}
        <h3 onClick={this.childClick}>child click</h3>
      </div>
      
    )
  }
}





ReactDOM.render(<Counter />, document.getElementById('app'))
