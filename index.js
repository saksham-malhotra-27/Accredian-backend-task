import express from "express";
import z from "zod";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import 'dotenv/config'; // Make sure this is at the top of your entry file
import cors from 'cors'
import signInRouter from './routers/signRouter.js'
import referRouter from './routers/referRouter.js'
import isSignedIn from "./middlewares/isSignedIn.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: process.env.ORIGIN, 
  methods: ['*'],
  credentials: true,
}))

app.use('/api/v1/', signInRouter);
app.use('/api/v1/', isSignedIn, referRouter);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
