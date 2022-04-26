import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'


/**
 * 
 * @returns 
 * useEffect 其实代替componentDidMount 生命周期
 * useEffect 是在浏览器绘制之后执行的 
 * 如何实现每秒加1？
 * 1、useEffect 第二个参数为空数组 ，副作用为空 ，副作用是依赖项，为空useEffect只能执行一次
 * 2、useEffect返回一个函数，清空定时器
 * 
 */

function Father(){
  const [count,setNumber] = React.useState(()=>({number:0}))
  React.useEffect(()=>{
    console.log('开启');
   let time =  setInterval(() => {
      setNumber(count=>({number:count.number+1}))
    }, 1000);
    return ()=>{
      console.log('关闭');
      clearInterval(time)
    }
  })
  const [age,setAge] = React.useState(()=>({count:999}))
  return (
    <div>
       {count.number},{age.count}
    </div>
  )
}





ReactDOM.render(<Father />, document.getElementById('app'))



