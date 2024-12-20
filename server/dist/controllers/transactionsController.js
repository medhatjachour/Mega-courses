"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = exports.createStripePaymentIntent = void 0;
// Import necessary modules and types
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
// Load environment variables from a .env file into process.env
dotenv_1.default.config();
// Ensure the Stripe secret key is available in the environment variables
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is required but wasn't found");
}
// Initialize the Stripe client with the secret key from environment variables
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Function to create a Stripe Payment Intent
const createStripePaymentIntent = (req, // Express request object
res // Express response object
) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the amount from the request body
    let { amount } = req.body;
    // Ensure the amount is at least 50 cents (500 for 5 USD) to comply with Stripe's minimum
    if (!amount || amount < 50) {
        amount = 50; // Default to 50 cents if amount is invalid
    }
    try {
        // Create a Payment Intent with Stripe
        const paymentIntent = yield stripe.paymentIntents.create({
            amount, // The amount to be charged (in the smallest currency unit, e.g., cents for USD)
            currency: "usd", // Currency for the payment
            automatic_payment_methods: {
                enabled: true, // Enable automatic payment methods
                allow_redirects: "never" // Disable redirects for simplicity
            }
        });
        // Send the client secret of the Payment Intent to the client
        res.json({ message: "", data: { clientSecret: paymentIntent.client_secret } });
    }
    catch (error) {
        // Handle any errors that occur during Payment Intent creation
        res.status(500);
        res.json({ message: "Error creating payment", error });
    }
});
exports.createStripePaymentIntent = createStripePaymentIntent;
// Function to create a Stripe Payment Intent
const createTransaction = (req, // Express request object
res // Express response object
) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId, transactionId, amount, paymentProvider } = req.body;
    try {
        // 1 get course info
        const course = yield courseModel_1.default.get(courseId);
        // create transaction record 
        const newTransaction = new transactionModel_1.default({
            dateTime: new Date().toISOString(),
            userId,
            courseId,
            transactionId,
            amount,
            paymentProvider
        });
        yield newTransaction.save();
        // create user course progress 
        const initialProgress = new userCourseProgressModel_1.default({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: course.sections.map((section) => ({
                sectionId: section.sectionId,
                chapters: section.chapters.map((chapter) => ({
                    chapterId: chapter.chapterID,
                    completed: false
                }))
            })),
            lastAccessedTimestamp: new Date().toISOString()
        });
        yield initialProgress.save();
        yield courseModel_1.default.update({ courseId }, {
            $ADD: {
                enrollments: [{ userId }],
            },
        });
        // // Send the client secret of the transaction Intent to the client
        res.json({ message: "Purchased Course successfully", data: {
                transaction: newTransaction,
                courseProgressL: initialProgress
            } });
    }
    catch (error) {
        // Handle any errors that occur during Payment Intent creation
        res.status(500);
        res.json({ message: "Error creating transaction", error });
    }
});
exports.createTransaction = createTransaction;
