// Import necessary modules and types
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Request, Response } from "express";
import Course from '../models/courseModel';
import Transaction from '../models/transactionModel';
import UserCourseProgress from '../models/userCourseProgressModel';

// Load environment variables from a .env file into process.env
dotenv.config();

// Ensure the Stripe secret key is available in the environment variables
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is required but wasn't found");
}

// Initialize the Stripe client with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a Stripe Payment Intent
export const createStripePaymentIntent = async (
    req: Request, // Express request object
    res: Response // Express response object
): Promise<void> => {
    // Extract the amount from the request body
    let { amount } = req.body;

    // Ensure the amount is at least 50 cents (500 for 5 USD) to comply with Stripe's minimum
    if (!amount || amount < 50) {
        amount = 50; // Default to 50 cents if amount is invalid
    }
    
    try {
        // Create a Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // The amount to be charged (in the smallest currency unit, e.g., cents for USD)
            currency: "usd", // Currency for the payment
            automatic_payment_methods: {
                enabled: true, // Enable automatic payment methods
                allow_redirects: "never" // Disable redirects for simplicity
            }
        });

        // Send the client secret of the Payment Intent to the client
        res.json({ message: "", data: { clientSecret: paymentIntent.client_secret } });
    } catch (error) {
        // Handle any errors that occur during Payment Intent creation
        res.status(500);
        res.json({ message: "Error creating payment", error });
    }
};


// Function to create a Stripe Payment Intent
export const createTransaction = async (
    req: Request, // Express request object
    res: Response // Express response object
): Promise<void> => {
    const {userId,courseId,transactionId, amount , paymentProvider} = req.body
    
    try {
        // 1 get course info
        const course = await Course.get(courseId)   
        // create transaction record 
        const newTransaction = new Transaction({
        dateTime : new Date().toISOString(),
        userId,
        courseId,
        transactionId, 
        amount,
        paymentProvider
        })     
        await newTransaction.save()
        // create user course progress 
        const initialProgress = new UserCourseProgress({
            userId,
            courseId,
            enrollmentDate:new Date().toISOString(),
            overallProgress:0,
            sections:course.sections.map((section:any)=>({
                sectionId:section.sectionId,
                chapters:section.chapters.map((chapter:any)=>({
                    chapterId:chapter.chapterID,
                    completed:false
                }))
            })),
            lastAccessedTimestamp:new Date().toISOString()
        })
        await initialProgress.save();
        await Course.update(
            {courseId},{
                $ADD:{
                    enrollments:[{userId}],
                },
            }
        )
        // // Send the client secret of the transaction Intent to the client
        res.json({ message: "Purchased Course successfully", data: {
            transaction : newTransaction,
            courseProgressL:initialProgress
         } });
    } catch (error) {
        // Handle any errors that occur during Payment Intent creation
        res.status(500);
        res.json({ message: "Error creating transaction", error });
    }
};
