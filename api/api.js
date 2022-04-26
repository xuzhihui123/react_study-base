const express = require('express')

let app = express()



app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*')
  next()
})


app.get('/api/getList',(req,res)=>{
   let limit = parseInt(req.query.limit)
   let offset = parseInt(req.query.offset)
   console.log(limit,offset);
   let result = []
   for(let i=offset;i<offset+limit;i++){
     result.push({id:i,name:'name'+i})
   }
   res.json(result)
})


app.listen(8089)
