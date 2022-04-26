import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom'


function Father () {

  let [father1, setFather1] = React.useState(()=>20)

  return (
    <div>
      <p>
        Father1:{father1}
      </p>
      <button onClick={() => { setFather1(father1 + 1) }}>
        father1+1
      </button>
    </div>
  )
}






ReactDOM.render(<Father />, document.getElementById('app'))



