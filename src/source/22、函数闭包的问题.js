// import React from './source/createElement';
// import ReactDOM from './source/react-dom';
import React from 'react'
import ReactDOM from 'react-dom'



// 因为target始终指向一个对象地址，所以当setCount改变count后 ，React.useEffect里面打印的是setCount最新的值。
// function Father(props){
//   const [count,setCount] = React.useState({name:123})
//   let target = React.useRef()
//   React.useEffect(()=>{
//     target.current = count
//     setTimeout(() => {
//       console.log(target.current);
//     },3000);
//   })
//   return <div>
//       <h1>Father</h1>
//       <button onClick={()=>{setCount({good:123})}}>+1</button>
//   </div>
// }


// 闭包的问题 setCount之后，两次打印的值是不一样的，因为产生了闭包
function Father(props){
  const [count,setCount] = React.useState({name:123})
  React.useEffect(()=>{
    setTimeout(() => {
      console.log(count);
    },3000);
  })
  return <div>
      <h1>Father</h1>
      <button onClick={()=>{setCount({good:123})}}>+1</button>
  </div>
}





ReactDOM.render(<Father/>, document.getElementById('app'))



