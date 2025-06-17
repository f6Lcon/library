import express from "express"
import { register, login, getProfile } from "../controllers/auth.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { validateRegistration, validateLogin } from "../middlewares/validation.middleware.js"

const router = express.Router()

router.post("/register", validateRegistration, register)
router.post("/login", validateLogin, login)
router.get("/profile", authenticate, getProfile)

export default router
