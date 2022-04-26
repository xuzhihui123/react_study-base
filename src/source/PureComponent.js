import Component from "./Component";



// PureComponent 原理其实就是重写shouldComponentUpdate 
class PureComponent extends Component{
  shouldComponentUpdate(nextProps,nextState){
    return !shallowEqual(this.props,nextProps) || !shallowEqual(this.state,nextState)
  }
}


// 浅比较两个对象
function shallowEqual(obj1,obj2){
  if(obj1 === obj2){
    return true
  }
  if(typeof obj1 !== 'object' || obj1 === null || typeof obj2!=='object' || obj2===null){
    return false
  }
  let keys1 = Object.keys(obj1)
  let keys2 = Object.keys(obj2)
  if(keys1.length !== keys2.length){  // 对象的属性的长度不一样
    return false
  }
  for(let key of keys1){
    if(obj1[key] !== obj2[key] || !obj2.hasOwnProperty(key)){
      return false
    }
  }
  return true
}


export default PureComponent