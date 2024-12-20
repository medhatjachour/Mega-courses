import express from "express";
import { createStripePaymentIntent, createTransaction } from "../controllers/transactionsController";

const router = express.Router()

// payment 
router.post('/',createTransaction)
router.post('/stripe/payment-intent',createStripePaymentIntent)


export default router