import z from "zod"
import prisma from "../db/config.js";
import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const router = Router();
const saltRounds = 10;

const reqLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8)
  })
  
router.post('/login', async (req, res)=>{
    try{
      const result = reqLogin.safeParse(req.body)
      if(result.success){
        //console.log(result.data)
          const user = await prisma.user.findUnique({
            where:{
              email: result.data.email,
            },
            select:{
              email:true, password: true,
            }
          })
          
          if(user ){
            
          const validPass = await bcrypt.compare(result.data.password, user.password)
          if(validPass)
          { const token = jwt.sign( user.email,process.env.SECRET)
            return res.status(200).json({msg:"logged in", token, success:true})
           } 
          else {
            return res.status(401).json({error:"Invalid password", success:false})
          }
          }
          else {
            const referCode = await generateUniqueReferCode();
            const hashedPassword = await bcrypt.hash(result.data.password, saltRounds);

            const newUser = await prisma.user.create({
              data:{
                email: result.data.email,
                password: hashedPassword,
                referCode: referCode
              }
            })
            const token = jwt.sign(newUser.email, process.env.SECRET);
            return res.status(201).json({msg:"logged in", token, success:true})
          }
      } else {
        return res.status(400).json({ error: result.error.errors ,  success:false});
      }
    }
    catch(err){
      console.error('Error:', err);
      return res.status(500).json({ error: 'Internal server error',  success:false });
    }
  })
  
  

  
  function generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  async function generateUniqueReferCode() {
    let isUnique = false;
    let referCode;
    
    while (!isUnique) {
      referCode = generateRandomString();
      const existingUser = await prisma.user.findUnique({
        where: { referCode }
      });
      if (!existingUser) {
        isUnique = true;
      }
    }
    return referCode;
  }
  
export default router