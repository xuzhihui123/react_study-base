import { REACT_TEXT } from "./constanct"
import { addEvent } from "./event"

let hookStates = []  // 保存每个调用useState生成的状态
let hookIndex = 0  // 保存索引
let scheduleUpdate // useState更新状态调度虚拟dom对比更新



function render (vdom, container) {
  mount(vdom,container)
  scheduleUpdate = ()=>{  
    hookIndex = 0
    compareTwoVDOM(container,vdom,vdom)
  }
}

function mount(vdom,container){
  let newDOM = createDOM(vdom)
  container.appendChild(newDOM)
}


export function createDOM (vdom) {
  if (vdom === null) {
    return document.createTextNode('')
  }
  let { type, props, ref } = vdom
  let dom
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content)
  } else if (typeof type === 'function') {
    //  说明是个类组件
    if (type.isReactComponent) {
      return mountClassComponent(vdom)
    }
    // 函数式组件
    return mountFunctionComponent(vdom)
  } else {
    dom = document.createElement(type)
  }
  type !== REACT_TEXT && updateProps(dom, {}, props)
  if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom)
    // 如果只有一个儿子
  } else if (typeof props.children === 'object' && props.children.type) {
    mount(props.children, dom)
  }
  vdom.dom = dom
  if (ref) {
    ref.current = dom  // 赋值ref.current为真实dom
  }
  return dom
}


/**
 * 
 * @param {*} vdom  类型为自定义类组件的虚拟dom
 */
function mountClassComponent (vdom) {
  // 解构类的定义和类的属性对象
  let { type, props,ref } = vdom
  // 创建类的实例
  let classInstance = new type(props)
  // 将实例上的ref 指向传来的ref属性
  ref && (classInstance.ref = ref)
  classInstance.ownVdom = vdom
  // 让这个类组件的vdom指向实例自己
  vdom.classInstance = classInstance
  // 生命周期componentWillMount
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount()
  }
  // 生命周期getDerivedStateFromProps
  if (type.getDerivedStateFromProps) {
    let partialState = type.getDerivedStateFromProps(props, classInstance.state)
    if (partialState) {
      classInstance.state = { ...classInstance.state, ...partialState }
    }
  }
  // 赋值context 判断当前类是否有contextType静态属性
  if (type.contextType) {
    classInstance.context = type.contextType._currentValue
  }
  // 调用类的实例render方法返回要渲染的虚拟dom
  let renderDom = classInstance.render()
  // 存起来老的vdom
  classInstance.oldRenderVDOM = renderDom
  // 根据虚拟dom对象创建真实dom对象
  let dom = createDOM(renderDom)
  // 这边绑定componentDidMount到dom上 
  if (classInstance.componentDidMount) {
    classInstance.componentDidMount()
  }
  // 为了以后类组件的更新，把真实dom挂载到了类的实例上
  classInstance.dom = dom
  return dom
}


/**
 * 
 * @param {*} vdom  类型为自定义函数组件的虚拟dom
 */
function mountFunctionComponent (vdom) {
  let { type: FunctionComponent, props } = vdom
  let renderVdom = FunctionComponent(props)
  vdom.oldRenderVDOM = renderVdom
  return createDOM(renderVdom)
}


/**
 * 
 * @param {*} childrenVdom  儿子虚拟dom数组
 * @param {*} parentDom  父亲dom
 */
function reconcileChildren (childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    mount(childrenVdom[i], parentDom)
  }
}

/**
 * 
 * @param {*} dom  真实dom
 * @param {*} newProps  新属性
 */
function updateProps (dom, oldProps, newProps) {
  for (const key in newProps) {
    if (key === 'children') continue;
    if (key === 'style') {
      let styleObj = newProps[key]
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if (key.startsWith('on')) {
      // 给真实dom加属性 onclick。。。
      // dom[key.toLocaleLowerCase()] = newProps[key]
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
    } else {
      dom[key] = newProps[key]
    }
  }
}


/**
 * 
 * @param {*} parentDOM  当前组件挂载父真实dom
 * @param {*} oldVdom  当前组件老虚拟dom
 * @param {*} newVdom  当前组件新虚拟dom
 */
export function compareTwoVDOM (parentDOM, oldVdom, newVdom, nextDOM) {
  // 老的虚拟dom和新的虚拟dom都是null
  if (!oldVdom && !newVdom) {
    // 如果老的虚拟dom有,新的没有就是删除
  } else if (oldVdom && !newVdom) {
    let currentDOM = findDOM(oldVdom)
    if (currentDOM) parentDOM.removeChild(currentDOM)
    // componentWillUnmount钩子
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount()
    }
    // 老的没有，新的有
  } else if (!oldVdom && newVdom) {
    // 创建新的
    let newDOM = createDOM(newVdom)
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM)
    } else {
      parentDOM.appendChild(newDOM)
    }
    // 在这里执行componentDidMount
    if (newVdom.classInstance && newVdom.classInstance.componentDidMount) {
      newVdom.classInstance.componentDidMount()
    }
  } else if (oldVdom && newVdom && (oldVdom.type !== newVdom.type)) {
    let oldDOM = findDOM(oldVdom) // 老的真实dom
    let newDOM = createDOM(newVdom)  // 新的真实dom
    oldDOM.parentNode.replaceChild(newDOM, oldDOM)
    // 在这里执行componentDidMount
    if (newVdom.classInstance && newVdom.classInstance.componentDidMount) {
      newVdom.classInstance.componentDidMount()
    }
    // componentWillUnmount钩子
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount()
    }
    // 如果老的有，新的也有，并且类型也一样，就可以复用老节点，进行深度的dom-diff
    //更新自己的属性，另一方面比较自己的儿子
  } else {
    updateElement(oldVdom, newVdom)
  }
}

/**
 * 
 * @param {*} oldVdom  老vdom
 * @param {*} newVdom  新vdom
 */
function updateElement (oldVdom, newVdom) {
  if (oldVdom.type === REACT_TEXT) {
    let currentDOM = newVdom.dom = oldVdom.dom  // 复用老文本节点
    currentDOM.textContent = newVdom.props.content  // 更改内容
    // 如果都是原生属性
  } else if (typeof oldVdom.type === 'string') {
    let currentDOM = newVdom.dom = oldVdom.dom
    // 先更新属性
    updateProps(currentDOM, oldVdom.props, newVdom.props)
    // 比较儿子
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
    // 如果都是组件
  } else if (typeof oldVdom.type === 'function') {
    // 如果是类组件
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom)
      // 函数式组件
    } else {
      updateFunctionComponent(oldVdom, newVdom)
    }
  }

}

function updateFunctionComponent (oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode  // 拿到父节点
  let { type, props } = newVdom
  let oldRenderVDOM = oldVdom.oldRenderVDOM
  let newRenderVdom = type(props)
  newVdom.oldRenderVDOM = newRenderVdom
  compareTwoVDOM(parentDOM, oldRenderVDOM, newRenderVdom)
}

function updateClassComponent (oldVdom, newVdom) {
  let classInstance = newVdom.classInstance = oldVdom.classInstance  // 类组件的实例需要复用
  // newVdom.oldRenderVDOM = oldVdom.oldRenderVDOM // 上一次类组件渲染出来的虚拟dom
  if (classInstance.componentWillReceiveProps) {  // 生命周期componentWillReceiveProps
    classInstance.componentWillReceiveProps()
  }
  // 触发组件的更新
  classInstance.updater.emitUpdate(newVdom.props)
}



function updateChildren (parentDOM, oldVChildren, newVChildren) {
  // children可能是数组也可能是对象，也可能是字符串,也可能是数字，也可能是null 同一转化数组
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  let maxLength = Math.max(oldVChildren.length, newVChildren.length)
  for (let i = 0; i < maxLength; i++) {
    let nextDOM = oldVChildren.find((item, index) => index > 1 && item) // 查找到下一个dom
    compareTwoVDOM(parentDOM, oldVChildren[i], newVChildren[i], nextDOM && findDOM(nextDOM))
  }
}

// 查找虚拟dom对应的真实dom
function findDOM (vdom) {
  let { type } = vdom
  let dom;
  if (typeof type === 'function') {
    // 类组件
    if (type.isReactComponent) {
      dom = findDOM(vdom.classInstance.oldRenderVDOM)
      // 函数组件
    } else {
      dom = findDOM(vdom.oldRenderVDOM)
    }
  } else {
    dom = vdom.dom
  }
  return dom
}


const ReactDOM = {
  render
}


/**
 * 
 * @param {*} initialState 可以为值也可以为函数
 * @returns 
 */
export function useState(initialState){
  // hookStates[hookIndex] = hookStates[hookIndex] || (typeof initialState === 'function' ? initialState() : initialState)
  
  // let currentIndex = hookIndex

  // function setState(newState){
  //   if(typeof newState === 'function'){
  //     newState = newState(hookStates[currentIndex])
  //   }
  //   hookStates[currentIndex] = newState
  //   scheduleUpdate()
  // }

  // return [
  //   hookStates[hookIndex++],
  //   setState
  // ]
  return useReducer(null,initialState)  // 其实useState就是useReducer的语法糖，
}


export function useReducer(reducer,initialState){
  // reducer为null的话其实就是useState的hook，useState的initialState可以为函数或者对象
  hookStates[hookIndex] = hookStates[hookIndex] || (!reducer ? ((typeof initialState === 'function' ? initialState() : initialState)) : initialState)
  
  let currentIndex = hookIndex

  function dispatch(action){
    // useState的 action可以为函数 
    if(typeof action === 'function' && !reducer){
      action = action(hookStates[currentIndex])
    }
    hookStates[currentIndex] = !reducer? action : reducer(hookStates[currentIndex],action)
    scheduleUpdate()
  }

  return [
    hookStates[hookIndex++],
    dispatch
  ]
}


export function useMemo(factory,deps){
  if(hookStates[hookIndex]){
     let [lastMemo,lastDeps] = hookStates[hookIndex]
     // 判断依赖是否都一样
     let same  = deps.every((item,index)=>item === lastDeps[index]) 
     if(same){
       hookIndex++
       return lastMemo
     }else{
      let newMemo = factory()
      hookStates[hookIndex++] = [newMemo,deps]
      return newMemo
     }
  }else{
    let newMemo = factory()
    hookStates[hookIndex++] = [newMemo,deps]
    return newMemo
  }
}


export function useCallback(callback,deps){
  if(hookStates[hookIndex]){
     let [lastCallback,lastDeps] = hookStates[hookIndex]
     // 判断依赖是否都一样
     let same  = deps.every((item,index)=>item === lastDeps[index]) 
     if(same){
       hookIndex++
       return lastCallback
     }else{
      hookStates[hookIndex++] = [callback,deps]
      return callback
     }
  }else{
    hookStates[hookIndex++] = [callback,deps]
    return callback
  }
}

export function useEffect(callback,deps){
   if(hookStates[hookIndex]){
     let [destroyFuntion,lastDeps] = hookStates[hookIndex]  
      let allSame = deps &&  lastDeps.every((item,i)=>item=== deps[i])
      if(allSame){
        hookIndex++
      }else{
        let currentIndex = hookIndex
        hookIndex++
        destroyFuntion && destroyFuntion()
        setTimeout(()=>{
          let destroyFuntion = callback()
          hookStates[currentIndex] = [destroyFuntion,deps]
       })
    //   Promise.resolve().then(()=>{
    //     let destroyFuntion = callback()
    //     hookStates[currentIndex] = [destroyFuntion,deps]
    //  })
      }
   }else{
    let currentIndex = hookIndex
    hookIndex++
    // useEffect 回调的执行是异步的
  //   Promise.resolve().then(()=>{
  //     let destroyFuntion = callback()
  //     hookStates[currentIndex] = [destroyFuntion,deps]
  //  })
     setTimeout(()=>{
        let destroyFuntion = callback()
        hookStates[currentIndex] = [destroyFuntion,deps]
     })
   }
}



export function useLayoutEffect(callback,deps){
  if(hookStates[hookIndex]){
    let [destroyFuntion,lastDeps] = hookStates[hookIndex]  
     let allSame = deps &&  lastDeps.every((item,i)=>item=== deps[i])
     if(allSame){
       hookIndex++
     }else{
       let currentIndex = hookIndex
       hookIndex++
       destroyFuntion && destroyFuntion()
       queueMicrotask(()=>{
         let destroyFuntion = callback()
         hookStates[currentIndex] = [destroyFuntion,deps]
      })
     }
  }else{
   let currentIndex = hookIndex
   hookIndex++
      queueMicrotask(()=>{
       let destroyFuntion = callback()
       hookStates[currentIndex] = [destroyFuntion,deps]
    })
  }
}


export function useRef(initialState){
  hookStates[hookIndex] = hookStates[hookIndex] || {current:initialState}
  return hookStates[hookIndex++]
}


export default ReactDOM