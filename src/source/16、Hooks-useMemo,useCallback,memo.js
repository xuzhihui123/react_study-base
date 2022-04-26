import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'


// 这边memo包了一层 相当于class 组件的 PureComponent
let MemoChild = React.memo(Child)


function Father () {
  let [father1, setFather1] = React.useState(()=>20)
  let [father2,setFather2] = React.useState({name:123})
  function changeValue(e){
    setFather1(e.target.value)
  }
  function changeBtnValue(){
    setFather2({name:father2.name+1})
  }
  
  // 缓存数据 第一个参数需要传一个函数，第二个参数为依赖项，依赖项发生变化 data更新
  const data = React.useMemo(()=>(father2),[father2])
  // 缓存函数 第一个参数需要传一个函数，第二个参数为依赖项，依赖项发生变化 handlerClick更新
  const handlerClick = React.useCallback(changeBtnValue,[father2])
  
  console.log('father render');
  return (
    <div>
        <input type="text" value={father1} onChange={changeValue}/>
        <br/>
        <button onClick={handlerClick}>+</button>
        <MemoChild obj={data}/>
    </div>
  )
}


function Child(props){
  console.log('child render');
  return <p>
     child:{props.obj.name}
  </p>
}





ReactDOM.render(<Father />, document.getElementById('app'))



