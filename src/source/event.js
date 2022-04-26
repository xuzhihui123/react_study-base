import {updateQueue} from './Component'



/**
 * 给真实dom添加事件处理函数
 * 为什么要这么做合成事件？为什么要做事件委托和事件代理
 * 1、做兼容处理，不同浏览器事件event是不一样
 * 2、可以在你写的事件处理函数之前之后做一些事情
 * @param {*} dom  事件dom
 * @param {*} eventType 监听类型
 * @param {*} listener  监听函数
 */
export function addEvent(dom,eventType,listener){
    let store = dom.store || (dom.store = {})
    store[eventType] = listener
    if(!document[eventType]){
      document[eventType] = dispatchEvent
    }
}

let syntheticEvent = {}  // 单例对象，保存每个事件的event 需要清空
function dispatchEvent(event){
  let {target,type} = event // target=事件源  type:click
  let eventType = `on${type}`
  updateQueue.isBatchingUpdate = true // 设置批量更新
  createSyntheticEvent(event) 
  while(target){  // 事件冒泡 防止当前点击的target是父亲的儿子 ，导致找不到store 无法执行listener
      let {store} = target
      let listener = store && store[eventType]
      listener && listener.call(target,syntheticEvent)
      target = target.parentNode
  }
  clearSyntheticEvent()
  updateQueue.isBatchingUpdate = false
  updateQueue.batchUpdater()
}

function createSyntheticEvent(event){
  for(let key in event){
    syntheticEvent[key] =  event[key]
  }
}

function clearSyntheticEvent(){
  for(let key in syntheticEvent){
    delete syntheticEvent[key]
  }
}