import mongoose from "mongoose";
import express from 'express';
import {DB_NAME} from './constants.js'
import dotenv from "dotenv"

dotenv.config({
    path:'../env'
})

const app=express();

(async()=>{
    try {
        console.log(`${process.env.MONGO_URI}/${DB_NAME}`)
        const res=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        // for error handling
        // console.log('Mongoose connected:',res)
        app.on('error',(error)=>{
            console.log(`Error connecting to DB`)
            throw error
        })
        // 
        app.listen(process.env.PORT,()=>{
            console.log(`App running on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log(`MONGO DB Connection FAILED`,error)
        process.exit(1)
    }
})()