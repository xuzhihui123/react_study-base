import React from './createElement';
import ReactDOM from './react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'



/**
 * 合成事件和批量更新
 * 1、在react中，事件的更新是异步的，是批量的，不是同步的
 * 调用state之后状态并没有立即更新，而是先缓存起来了
 * 等事件函数处理完成后，在进行批量更新，一次更新并重新缓存
 * 
 * 因为jsx事件处理函数是react控制的，只要归react控制就是批量，不归react管，若是放在宏任务、微任务，就是非批量
 */


class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  handlerClick = () => {
      this.setState({
        number: this.state.number + 1
      },function(){
        console.log('cb1',this.state.number);  // 'cb1' 1
      })
      console.log(this.state.number);   // 0
      this.setState({
        number: this.state.number + 1
      },()=>{
        console.log('cb2',this.state.number);  // 'cb2'  1
      })
      console.log(this.state.number);  // 0
  }
  render () {
    return (
      <div>
        <button onClick={this.handlerClick}>
          <span>修改状态</span>
        </button>
        <br />
        {this.state.number}
        <br />
        {'我是' + this.props.name}
      </div>
    )
  }
}





ReactDOM.render(<Counter name={'lancer'} />, document.getElementById('app'))
