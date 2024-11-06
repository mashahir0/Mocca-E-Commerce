import express from 'express'
const app  = express()
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'

connectDB()

const port = process.env.PORT
app.get('/',(req,res)=>{
    res.send("hello")
})
app.listen(port,console.log(`${port}`))