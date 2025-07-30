import express from "express";
import { fetchAllTags } from "../controllers/tagController.controller.js";

const router = express.Router();

router.get("/", fetchAllTags);

export default router;