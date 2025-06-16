import express from "express"
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getCategories,
} from "../controllers/book.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", getAllBooks)
router.get("/categories", getCategories)
router.get("/:id", getBookById)
router.post("/", authenticate, authorize("admin", "librarian"), addBook)
router.put("/:id", authenticate, authorize("admin", "librarian"), updateBook)
router.delete("/:id", authenticate, authorize("admin", "librarian"), deleteBook)

export default router
