import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { createLink, getLinks,deleteLink } from "../controllers/linkController";

const router=express.Router();

router.post("/create",protect,createLink);
router.get("/:workspaceId",protect,getLinks);
router.delete("/:id",protect,deleteLink)
//router.post("/move",protect,moveLinkToWorkspace);
export default router;