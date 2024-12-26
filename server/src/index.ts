import express from "express"
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import * as dynamoose from 'dynamoose';
import seed from './seed/seedDynamodb'
import serverless from 'serverless-http'
import courseRoutes from './routes/courseRoutes'
import userClerkRoutes from './routes/userClerkRoutes'
import transactionsRoutes from './routes/transactionsRoutes'
import userCourseProgressRoutes from './routes/userCourseProgress'
import {clerkMiddleware, createClerkClient, requireAuth} from '@clerk/express'
// route imports 
// config
dotenv.config()
const isProduction = process.env.NODE_ENV === "production"

if (!isProduction){
    dynamoose.aws.ddb.local()
}

export const clerkClient = createClerkClient({
    secretKey :process.env.CLERK_SECRET_KEY
}) 

const app = express () 
// This middleware parses incoming requests with JSON payloads. It's a built-in middleware in Express and is based on body-parser
app.use(express.json())
// Helmet helps secure your Express apps by setting various HTTP headers. This line includes several security middleware functions provided by Helmet.
app.use(helmet())
// This line configures the Cross-Origin Resource Policy (CORP) to allow cross-origin requests. It's a part of Helmet to handle security around resource sharing.
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
// Morgan is a middleware for logging HTTP requests and responses. The "common" format provides a standard predefined logging format.
app.use(morgan("common"))
// This middleware parses incoming requests with JSON payloads, specifically using the body-parser library, even though express.json() does this by default now
app.use(bodyParser.json())
// This middleware parses incoming requests with URL-encoded payloads (form data). The extended: false option ensures that the query string library is used
app.use(bodyParser.urlencoded({extended:false}))
// This middleware enables Cross-Origin Resource Sharing (CORS) for your application, allowing it to handle requests from different origins.
app.use(cors())
// 
app.use(clerkMiddleware())



// routes
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use("/courses",courseRoutes)
app.use("/users/clerk",requireAuth(),userClerkRoutes)
app.use("/transactions/",requireAuth(),transactionsRoutes)
app.use("/users/course-progress",requireAuth(),userCourseProgressRoutes)


// server
const port = process.env.PORT ?? 3000
if(!isProduction){
    app.listen(port,()=>{
        console.log(`running on port ${port}`);
        
    })
}

// aws production
const serverlessApp = serverless(app)
export const handler = async(event:any,context:any)=>{
    if(event.action === "seed"){
        await seed()
        return {
            statusCode :200,
            body:JSON.stringify({message:"data seeded successfully "})
        }
    }else{
        return serverlessApp(event, context)
    }
} 