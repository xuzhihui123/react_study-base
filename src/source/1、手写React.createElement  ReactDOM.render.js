import React from '.。/source/createElement.js';
import ReactDOM from '.。/source/react-dom';



// jsx编译成createElement是在webpack中执行的
let element = <h1 className={'aaa'} style={{color:'red'}}>hello world</h1>
// React.createElement("h1", null, "hello world");


console.log(element);
console.log(JSON.stringify(element,null,2));

//不可变 也不可增加属性
// element.type = "div"


ReactDOM.render(element,document.getElementById('app'))
