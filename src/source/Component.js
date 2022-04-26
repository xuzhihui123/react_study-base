import { compareTwoVDOM } from './react-dom'

export let updateQueue = {
  isBatchingUpdate: false, // 当前是否处理批量更新，默认值是false
  updaters: new Set(),
  batchUpdater () {
    [...this.updaters].map(updater => updater.updateClassComponent())
    this.updaters.clear()
    this.isBatchingUpdate = false
  }
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance  // 类组件实例
    this.pendingStatus = []  // 等待生效的状态，可能是一个对象，也可能是一个函数
    this.cbs = [] // 回调
    this.nextProps = {}
  }
  addState (partialState, callback) {
    this.pendingStatus.push(partialState)
    typeof callback === 'function' && this.cbs.push(callback) // 状态更新后的回调
    this.emitUpdate()
  }
  emitUpdate (nextProps) {
    this.nextProps = nextProps
    if (updateQueue.isBatchingUpdate) {  // 如果当前是批量更新，先缓存updater
      updateQueue.updaters.add(this)
    } else {
      this.updateClassComponent() // 非批量直接更新
    }
  }
  updateClassComponent () {
    let { classInstance, pendingStatus, cbs, nextProps } = this
    if (nextProps || pendingStatus.length > 0) { // 如果有等待更新的状态对象的话
      /*
      classInstance.state = this.getState() // 计算新状态
      classInstance.forceUpdate()  // 更新vDOM
      cbs.forEach(cb=>cb.call(classInstance)) // 执行回调
      cbs.length = 0 // 清空回调
      */
      shouldUpdate(classInstance, nextProps, this.getState())
      cbs.forEach(cb => cb.call(classInstance)) // 执行回调
      cbs.length = 0 // 清空回调
    }
  }
  getState () {
    let { classInstance, pendingStatus } = this
    let { state } = classInstance
    pendingStatus.forEach((nextState) => {
      if (typeof nextState === 'function') {
        nextState = nextState.call(classInstance, state)
      }
      state = { ...state, ...nextState }
    })
    pendingStatus.length = 0 // 清空数组
    return state
  }
}



class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this) // 创建实例都会创建一个updater实例，也就是更新器
  }
  setState (partialState, callback) {
    this.updater.addState(partialState, callback)
  }
  render () {
    throw new Error('此方法是抽象方法，需要子类实现')
  }
  forceUpdate(){
    if (this.ownVdom.type.getDerivedStateFromProps) {
      // 传入下一个props 和 还未更新的state
      let partialState = this.ownVdom.type.getDerivedStateFromProps(this.props, this.state)
      if (partialState) {
        this.state = { ...this.state, ...partialState }
      }
    }
    this.updateComponent()
  }
  updateComponent () {

    let newRenderVDOM = this.render()
    
    // getSnapshotBeforeUpdate 生命周期
    let extraArgs = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate()

    // 深度比较两个vdom
    compareTwoVDOM(this.dom.parentNode, this.oldRenderVDOM, newRenderVDOM)
    this.oldRenderVDOM = newRenderVDOM

    // updateClassComponent(this,newRenderVDOM)
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props,this.state,extraArgs)  // 生命周期componentDidUpdate
    }
  }
}


// function updateClassComponent(classInstance,newVdom){
//   let oldDOM = classInstance.dom
//   let newDOM  = createDOM(newVdom)
//   oldDOM.parentNode.replaceChild(newDOM,oldDOM)
//   classInstance.dom = newDOM
// }


// 判断组件是否需要更新
function shouldUpdate (classInstance, nextProps, nextState) {
  // 若果实例上有shouldComponentUpdate 方法，并且返回false,表示不更新
  let willUpdate = true
  // getDerivedStateFromProps 生命周期
  if (classInstance.ownVdom.type.getDerivedStateFromProps) {
    // 传入下一个props 和 还未更新的state
    let partialState = classInstance.ownVdom.type.getDerivedStateFromProps(nextProps, nextState)
    if (partialState) {
      nextState = { ...nextState, ...partialState }
    }
  }
  if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate() // 生命周期componentWillUpdate
  }
  if (nextProps) {
    classInstance.props = nextProps
  }

  classInstance.state = nextState  // 更新最新状态

  willUpdate && classInstance.updateComponent() // willUpdate 为true更新
}


export default Component
