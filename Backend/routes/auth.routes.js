import express from "express"
import { register, login, getProfile } from "../controllers/auth.controller.js"
import { authenticate, canRegisterUsers } from "../middlewares/auth.middleware.js"
import { validateRegistration, validateLogin } from "../middlewares/validation.middleware.js"

const router = express.Router()

// Public routes
router.post("/login", validateLogin, login)

// Protected routes
router.post("/register", authenticate, canRegisterUsers, validateRegistration, register)
router.get("/profile", authenticate, getProfile)

export default router
