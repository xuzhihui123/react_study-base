import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'

/**
 *  useReducer 可以计算状态 用起来麻烦
 *  useState 用起来简单 其实就是useReducer的语法糖
 */

const ADD = 'ADD'
const MINUS = 'MINUS'


function reducer (state, action) {
  switch (action.type) {
    case ADD:
      return { count: state.count + 1 };
    case MINUS:
      return { count: state.count - 1 }
    default:
      return state
  }
}

function Father () {
  // 第一个参数传函数，第二传state值。
  let [state, dispatch] = React.useReducer(reducer, {count:0})
  return (
    <div>
       <h1>{state.count}</h1>
       <button onClick={()=>{dispatch({type:ADD})}}>+1</button>
       <button onClick={()=>{dispatch({type:MINUS})}}>-1</button>
    </div>
  )
}




ReactDOM.render(<Father />, document.getElementById('app'))



