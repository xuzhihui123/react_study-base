import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'

class Count extends React.Component{
   ref = React.createRef()
   state = {
      list:[]
   }
   getSnapshotBeforeUpdate(prevProps,prevState){
     return this.ref.current.scrollHeight
   }
   componentDidUpdate(prevProps,prevState,snapshot){
    let diff = this.ref.current.scrollHeight - snapshot
    console.log('增加了'+diff + 'px');
   }
   countClick=()=>{
     let listLength = this.state.list.length
     this.state.list.push(listLength)
     this.setState({
       list:this.state.list
     })
   }
   render(){
     return <div>
        <button onClick={this.countClick}>+1</button>
        <ul ref={this.ref}>
           {
             this.state.list.map((item,index)=>{
               return <li key={index}>{index}</li>
             })
           }
        </ul>
     </div>
   }
}





ReactDOM.render(<Count />, document.getElementById('app'))
