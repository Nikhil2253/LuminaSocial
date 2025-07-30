import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {uploads} from "../middleware/multer.js";
import { getUserProfile, updateUserProfile, getUser, updateUser, viewUser, followUser, unfollowUser, getAll, deleteUser } from "../controllers/userController.controller.js";
import { uploadProfilePic, uploadCoverPhoto } from "../controllers/upload.controller.js";

const router = express.Router();

router.get("/profile",protect,getUserProfile);
router.put("/profile",protect,updateUserProfile);
router.get("/getUser/:id",getUser);
router.put("/update/:id",updateUser);
router.get("/viewuser/:username",viewUser);
router.put("/follow/:id",followUser);
router.put("/unfollow/:id",unfollowUser);
router.get("/getAll",getAll);
router.post("/delete",deleteUser);
router.post("/upload/profilepic", uploads.single("profilePic"), uploadProfilePic);
router.post("/upload/coverphoto", uploads.single("coverPhoto"), uploadCoverPhoto);

export default router;