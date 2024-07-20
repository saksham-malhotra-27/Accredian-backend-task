import z from "zod";
import prisma from "../db/config.js";
import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

const reqBody = z.object({
  refereeEmail: z.string().email("Invalid email address").max(100, "Referee email should not exceed 100 characters"),
});

router.post('/refer', async (req, res) => {
  try {
    const result = reqBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors, success: false });
    }
    
    const { refereeEmail } = result.data;
    const referrerEmail = req.user;
    if(refereeEmail === referrerEmail){
      return res.status(406).json({error:"cannot refer yourself", success:false});
    }

    const referrer = await prisma.user.findUnique({
      where: { email: referrerEmail },
      select: { referCode: true },
    });

    if (!referrer) {
      return res.status(404).json({ error: 'Referrer not found', success: false });
    }

    


    const referral = await prisma.referral.create({
      data: { referrerEmail, refercode:referrer.referCode, refereeEmail },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: refereeEmail,
      subject: 'Referral Invitation for accredian (testing)',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h1 style="color: #4A90E2;">You've Been Referred!</h1>
          <p>Hi there,</p>
          <p>We're excited to let you know that you've been referred to join <strong>accredian</strong>.</p>
          <p>Use the referral code below to sign up and enjoy the benefits:</p>
          <p style="font-size: 20px; font-weight: bold; background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd; text-align: center;">
            ${referrer.referCode}
          </p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The accredian Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send referral email', success: false });
      } else {
        console.log('Email sent:', info.response);
        return res.status(201).json({ referral, msg: "Referral created and email sent to referee", success: true });
      }
    });

  } catch (err) {
    if(err.code==='P2002'){
      return res.status(403).json({error:'Can send to a person only once', success:false})
    } else {
      
    return res.status(500).json({ error: 'Internal server error', success: false });
 } }
});

router.get('/getcode', async(req, res)=>{
  try {
    const email = req.user;
    const user = await prisma.user.findUnique({
      where:{
        email:email
      }
    });
    if(user){
      return res.status(200).json({refercode: user.referCode, msg:"refercode found", success:true })
    } else {
      return res.status(404).json({ error: 'User not found', success: false });
    }
    
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', success: false });
 
  }
})

export default router;
