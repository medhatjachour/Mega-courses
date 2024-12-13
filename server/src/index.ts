import express from "express"
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import * as dynamoose from 'dynamoose';

// route imports 
 
// config
dotenv.config()
const isProduction = process.env.NODE_ENV === "production"

if (!isProduction){
    dynamoose.aws.ddb.local()
}
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

// routes
app.get("/",(req,res)=>{
    res.send("hello world")
})

const port = process.env.PORT || 3000
if(!isProduction){
    app.listen(port,()=>{
        console.log(`running on port ${port}`);
        
    })
}