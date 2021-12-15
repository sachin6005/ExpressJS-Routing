const express = require('express')
const fs = require('fs')

const app = express()
app.use(express.json())

app.use((req,res,next) => {
  console.log('This is middleware')
  next()
})


app.use((req,res,next) => {
    req.requireTime = new Date().toISOString()
    next()
  })
const student = JSON.parse(fs.readFileSync('/home/sachin/Documents/CGCS phase2/NodeJS/ExpressJS/ExpressJS-Routing/data.json'))


const getStudent = (req, res) => {
    console.log(req.requireTime)
    res.status(200).json({
        status : 'success',
        result: student.length,
        requestAt: req.requireTime,
        data: {
                 student
              }
    })
}

const createStudent = (req,res) => {
    const newId = student[student.length -1].id + 1
    const newstudent = Object.assign({id: newId},req.body)
    student.push(newstudent)
    fs.writeFile('/home/sachin/Documents/CGCS phase2/NodeJS/ExpressJS/ExpressJS-Routing/data.json', JSON.stringify(student), err => {
        res.status(200).json({
            status : 'success',
            data: {
                student: newstudent
            }
        })
    })
    res.send('Done')
}

 const getPerson = (req, res) => {
    console.log(req.params)

    const id = req.params.id * 1
    if(id > student.length){
        return res.status(404).json({
            status : 'failed',
            message: 'invalid ID'
        })
    }

    const person = student.find(i => i.id === id)

    res.status(200).json({
        status : 'success',
        
         data: {
                 person
               }
    })
}


const updatePerson =(req, res) => {
    
    if(req.params.id > student.length){
        return res.status(404).json({
            status : 'failed',
            message: 'invalid ID'
        })
    }
    const id = req.params.id * 1
    const person = student.find(i => i.id === id)
    person.Name = req.body.Name
    person.Job = req.body.Job

    // const newperson = Object.assign({id: id},req.body)
    // student.push(newperson)
    fs.writeFile('/home/sachin/Documents/CGCS phase2/NodeJS/ExpressJS/ExpressJS-Routing/data.json',JSON.stringify(person),err => {
        res.status(200).json({
            status : 'success',
            
             data: {
                     student: person
                   }
        })
    })
  
}


const deletePerson = (req, res) => {
    
    if(req.params.id > student.length){
        return res.status(404).json({
            status : 'failed',
            message: 'invalid ID'
        })
    }
    
    res.status(204).json({
        status : 'success',
        data: null
    })
}

// app.get('/api/v1/student', getStudent)
// app.post('/api/v1/student', createStudent)
// app.get('/api/v1/student/:id', getPerson)
// app.patch('/api/v1/student/:id', updatePerson)
// app.delete('/api/v1/student/:id', deletePerson)

app.route('/api/v1/student')
.get(getStudent)
.post(createStudent)

app.route('/api/v1/student/:id')
.get(getPerson)
.patch(updatePerson)
.delete(deletePerson)


const port = 5000
app.listen(port, ()=>{
    console.log(`app started at port ${port}`)
})