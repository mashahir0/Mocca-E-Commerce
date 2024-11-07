import express from 'express'
const app  = express()
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import user_routes from './routes/userRoutes.js'
import cors from 'cors'
app.use(cors())
app.use(express.json())
connectDB()

const port = process.env.PORT

app.use('/user',user_routes)

app.listen(port,console.log(`${port}`))