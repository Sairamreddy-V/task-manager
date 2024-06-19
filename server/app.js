const express=require('express')
app=express()
app.use(express.json())
const cors=require('cors')
app.use(cors())


const {open}=require('sqlite')
const sqlite3=require('sqlite3')
const path=require('path')
const pathOfFile=path.join(__dirname,'/database/database.db')

let db

const initializingDbandServerConnection= async()=>{
    try{
        db=await open(
            {
                filename:pathOfFile,
                driver:sqlite3.Database,
            }
        )
        app.listen(5000,()=>{
            console.log(`server running at port 5000...`)
        })
    }catch(error){
        console.log(`dbError:${error.message}`)
    }
}

initializingDbandServerConnection()


// getting all the task in the table
app.get("/",async (request,response)=>{
    try{
        const query=`
        SELECT * FROM task_table
        `
        const result=await db.all(query)
        response.status(200).send({result})
    }catch(e){
        response.status(500)
        console.log(`error at /:${e.message}`)
    }
})


// adding a task to the table
app.post("/add-task",async (request,response)=>{
    try{
        const {task}=request.body
        const query=`
        INSERT into task_table(task,is_completed)
        VALUES('${task}','${false}')
        `
        const result=await db.run(query)
        response.status(200).send(`Task Added Successfully`)
    }catch(e){
        response.status(500)
        console.log(`error at /add-task:${e.message}`)
    }
})


app.put("/update-task",async (request,response)=>{
    try{
        const {id,isCompleted}=request.body
        console.log(id)
        console.log(isCompleted)
        const query=`
        UPDATE task_table
        SET is_completed=${isCompleted}
        WHERE 
            id=${id}
        `
        await db.run(query)
    }catch(e){
        response.status(500)
        console.log(`error at /update-task:${e.message}`)
    }
})


app.post("/delete-task",async (request,response)=>{
    try{
        const {id}=request.body
        const query=`
        DELETE 
            FROM task_table 
        WHERE 
            id=${id}
        `
        const result=await db.run(query)
        response.status(200).send(`Task Deleted Successfully`)
    }catch(e){
        response.status(500)
        console.log(`error at /delete-task:${e.message}`)
    }
})