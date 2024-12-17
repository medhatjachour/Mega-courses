import express from "express";
import { updateUser } from "../controllers/userClerkController";

const router = express.Router()

// courses 
router.put('/:userId',updateUser)


export default router