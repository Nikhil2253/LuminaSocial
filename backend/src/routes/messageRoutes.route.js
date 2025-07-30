import express from "express";
import { getAllChats, getAllMessangers, getMessages, getMessanger, sendMessage,  } from "../controllers/messageController.controller.js";

const router=express.Router();

router.get("/messanger/:id",getMessanger);
router.get('/allmessangers',getAllMessangers);
router.post("/send-message",sendMessage);
router.get("/:user1Id/:user2Id",getMessages);
router.get("/allChats/now/:username",getAllChats);

export default router;