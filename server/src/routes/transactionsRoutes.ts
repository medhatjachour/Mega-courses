import express from "express";
import { createStripePaymentIntent, createTransaction, listTransactions } from "../controllers/transactionsController";

const router = express.Router()

// payment 
router.get('/',listTransactions)
router.post('/',createTransaction)
router.post('/stripe/payment-intent',createStripePaymentIntent)


export default router