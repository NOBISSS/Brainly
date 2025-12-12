import express from "express";
import { 
    createWorkspace,
    getWorkspaceById,
    getWorkspaces,
    addCollaborator,
    removeCollaborator,
    deleteWorkspace
 } from "../Controllers/workspaceController";

import { protect } from "../Middlewares/authMiddleware";

const router=express.Router();

router.post("/",protect,createWorkspace);
router.delete("/:id",protect,deleteWorkspace);
router.get("/",protect,getWorkspaces);
router.get("/:id",protect,getWorkspaceById);
router.post("/:id/collaborators",protect,addCollaborator);
router.delete("/:id/collaborators/:userId",protect,removeCollaborator);

export default router;

