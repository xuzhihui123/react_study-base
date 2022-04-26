import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'


/**
 *  React.forwardRef 其实就是个高阶函数 ，派发ref到子组件
 *  useImperativeHandle 其实就是起到了一个保护作用，它把第一个传入的ref对象指向第二个回调函数的返回值
 */

function Child(props,ref){
  let inputRef = React.useRef()
  // useImperativeHandle 这个hooks 其实就是把ref的指向了 useImperativeHandle第二个参数回调后的返回的对象
  React.useImperativeHandle(ref,()=>{
    return {
      focus(){
        inputRef.current.focus()
      }
    }
  })
  return (
    <input ref={inputRef}/>
  )
}


// 只使用forwardRef的话会导致父亲可以随意操作儿子dom 比如下面的remove，这是不合理的，所以一般需要和useImperativeHandle这个hooks来使用
const ForwardChild = React.forwardRef(Child)

function Father(){
  const inputRef = React.useRef()
  function focus(){
    inputRef.current.focus() 
    // inputRef.current.remove()  
  }
  return (
    <div>
       <ForwardChild ref={inputRef}/>
       <button onClick={focus}>+</button>
    </div>
  )
}



ReactDOM.render(<Father />, document.getElementById('app'))



