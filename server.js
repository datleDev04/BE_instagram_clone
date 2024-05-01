import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import 'dotenv/config'
const app = express()

const PORT = 3000

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


const server = app.listen(PORT , () => {
    console.log(`Instagram start with ${PORT}`)
})

process.on('SIGINT', () => {
    server.close( () => console.log(`Exit server express`) )
})