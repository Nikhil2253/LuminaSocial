import express from "express";
import {uploads} from "../middleware/multer.js";
import { createPost ,isPostLiked,likePost,unlikePost,bookMark,unbookMark,isbookMark, postComment, getPost, getBookMarks, getFeed, deletePost, editPost, getByTag} from "../controllers/postController.controller.js";

const router=express.Router();

router.post("/create-post",uploads.single("media"),createPost);
router.post("/like",likePost);
router.post("/unlike",unlikePost);
router.get("/isLiked",isPostLiked);
router.post("/bookmark",bookMark);
router.post("/unbookmark",unbookMark);
router.get("/isbookmark",isbookMark);
router.post("/comment",postComment);
router.get("/feed",getFeed);
router.get("/:id",getPost);
router.get("/bookmark/:id",getBookMarks);
router.get("/getbytag/:tag",getByTag);
router.post("/delete",deletePost);
router.post("/edit",editPost);

export default router;