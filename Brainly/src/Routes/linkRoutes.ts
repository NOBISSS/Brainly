import express from "express";
import { protect } from "../Middlewares/authMiddleware";
import { createLink, getLinks,deleteLink } from "../Controllers/linkController";

const router=express.Router();

router.post("/create",protect,createLink);
router.get("/:workspaceId",protect,getLinks);
router.delete("/:id",protect,deleteLink)
//router.post("/move",protect,moveLinkToWorkspace);
export default router;