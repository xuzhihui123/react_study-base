import React from './createElement';
import ReactDOM from './react-dom';




/**
 * 函数式组件
 * 1、自定义组件的名称必须是首字母大写 原生组件小写开头，自定义大写字母
 * 2、组件必须使用前定义
 * 3、组件需要返回并且只能返回一个根元素
 */

function Welcome(props){
  return <div>
      <span>{props.name}</span>
      {props.children}
  </div>
}


// let a = <Welcome/>
// console.log(a);   // 此时的vnode的type就是个函数



ReactDOM.render(<Welcome name={'hello lancer'}>
    <h3>good</h3>
</Welcome>,document.getElementById('app'))
