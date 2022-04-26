
import Component from './Component'
import PureComponent from './PureComponent'
import { useState,useMemo,useCallback,useReducer,useEffect,useLayoutEffect,useRef } from './react-dom'
import {wrapToVdom} from './util'

function createElement(type,config,children){
  let ref
  let key
  if(config){
    delete config.__source
    delete config.__self
    ref = config.ref
    delete config.ref
    key = config.key
    delete config.key
  }
  
  let props = {...config}

  if(arguments.length > 3){
    children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
  }else{
    children = wrapToVdom(children)
  }
  props.children = children

  return {
    type,
    ref,
    key,
    props
  }
}


function createRef(){
  return {
    current:null
  }
}

function createContext(initialValue){
  let context = {
    Provider,
    Consumer
  }
  function Provider(props){
    if(!context._currentValue){
      context._currentValue = initialValue || {}
    }
   Object.assign(context._currentValue,props.value) // context._currentValue 饮用地址相同
    return props.children
  }

  function Consumer(props){
    return props.children(context._currentValue)
  }
  return context
}


function cloneElement(oldVdom,newProps,...newChildren){
  let props = {...oldVdom.props,...newProps}
  if(!props.children){
    props.children = newChildren.map(wrapToVdom)
  }else{
    if(!Array.isArray(props.children)){
       props.children =[props.children,...newChildren].map(wrapToVdom)
    }else{
       props.children = [...props.children,...newChildren].map(wrapToVdom)
    }
  }

  return {
    ...oldVdom,
    props
  }
}

function memo(Component){
  return class extends PureComponent{
    render(){
      return <Component {...this.props}/>
    }
  }
}

function useContext(context){
  return context._currentValue
}

function forwardRef(Com){
  return class extends Component{
    render(){
      return Com(this.props,this.ref)
    }
  }
}

function useImperativeHandle(ref,factory){
  ref.current = factory()
}


const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  createContext,
  cloneElement,
  useState,
  useReducer,
  memo,
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle
}

export default React