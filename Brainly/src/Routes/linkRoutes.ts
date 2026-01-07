import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { createLink, getLinks,deleteLink } from "../controllers/linkController";
import ogs from "open-graph-scraper";
const router=express.Router();

router.get("/preview",async(req,res)=>{
    const {url}=req.query;
    if(!url) return res.status(400).json({message:"URL Required"});

    try{
        const {result}=await ogs({
            url:String(url),
            timeout:3000,
            onlyGetOpenGraphInfo:true,
        });
        
        return res.json({
            title:result.ogTitle || "",
            thumbnail:result.ogImage?.[0]?.url || null,
        });

    }catch(error){
        return res.json({
            title:"",
            thumbnail:null
        })
    }
});
router.post("/create",protect,createLink);
router.get("/:workspaceId",protect,getLinks);
router.delete("/:id",protect,deleteLink)
//router.post("/move",protect,moveLinkToWorkspace);
export default router;