// import React from './source/createElement';
// import ReactDOM from './source/react-dom';
import React from 'react'
import ReactDOM from 'react-dom'


/**
 * 自定义hooks
 * 自定义hooks是函数，以use开头
 * 函数里面有其他hooks
 */

// 模拟分页获取数据
function usePageRequest(url){
  console.log('打印了几次');
  const limit = 10 // 限制条数5条
  const [data,setData] = React.useState([])
  const [offset,setOffset] = React.useState(1)
  function loadMore(){
    setData(null)
    fetch(`${url}?offset=${offset}&limit=${limit}`).then(r=>r.json())
    .then(r=>{
      setData([...data,...r])
      setOffset(offset+r.length)
    })
  }
  React.useEffect(loadMore,[])
  return [data,loadMore]
}


// MemoChild在loadMore之后 每次都会更新是因为生成了新的vdom，因为Father组件里面 先返回 return '加载中。。。。'，后续生成了新的vdom
let MemoChild = React.memo(Child)


function Father(){
  const [list,loadMore] = usePageRequest(`http://localhost:8089/api/getList`)
  const [state,changeState] = React.useState({name:123})
  const data = React.useMemo(()=>state,[state])
  if(list === null){
    return '加载中。。。。'
  }
  return (<div>
     {list.map(item=>{
       return <div key={item.id}>
          {item.id}:{item.name}
       </div>
     })}
     <button onClick={loadMore}>+</button>
     <br/>
     <MemoChild data={data}/>
  </div>)
}

// 每个组件都有自己的hooks 
function Child(props){
  console.log(props.data);
  // const [list,loadMore] = usePageRequest(`http://localhost:8089/api/getList`)
  // if(list === null){
  //   return '加载中。。。。'
  // }
  // return (<div>
  //    {list.map(item=>{
  //      return <div key={item.id}>
  //         {item.id}:{item.name}
  //      </div>
  //    })}
  //    <button onClick={loadMore}>+</button>
  //    <br/>
  // </div>)
  return (
    <div>
       123
    </div>
  )
}




ReactDOM.render(<Father/>, document.getElementById('app'))



