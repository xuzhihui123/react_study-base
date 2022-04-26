import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'


function Father(){
  const div = React.useRef()
  const style = {
    width:'100px',
    height:'100px',
    backgroundColor:'red'
  }

  //useEffect底层是宏任务执行，是在浏览器绘制之后执行的，下面要达到动画需要使用useEffect


  // 这边使用useLayoutEffect 并不能实现dom的动画 因为useLayoutEffect是在绘制之前执行的，底层是queueMicrotask微任务是在浏览器绘制之前执行的
  React.useLayoutEffect(()=>{
    div.current.style.transform="translate(500px)"
    div.current.style.transition = "all 1s"
  })

  return (
    <div ref={div} style={style}>
       good
    </div>
  )
}




ReactDOM.render(<Father />, document.getElementById('app'))



