import { useEffect, useState,useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useAppDispatch, useAppSelector} from "../redux/hooks";
import { setLinksForWorkspace, type Link } from "../redux/slices/linkSlice";

interface useContentReturn{
    contents:Link[];
    loading:boolean;
    error:string | null;
    refetch:()=>void;//manual refresh
}

export function useContent(workspaceId:string|null):useContentReturn {
    const [contents, setContents] = useState<Link[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch=useAppDispatch();

    //Select From Redux (normalized State)
    const cachedLinks=useAppSelector((state)=>workspaceId?state.links.byWorkspace[workspaceId]:null);
    const fetchLinks=useCallback(async(forceNetwork=false)=>{
        if(!workspaceId){
            setContents([]);
            setLoading(false);
            return;
        }


        if(!forceNetwork && cachedLinks ){
            setContents(cachedLinks);
            setLoading(false);
            return;
        }

        try{
            setLoading(true);
            setError(null);

            const response = await axios.get(BACKEND_URL + `api/links/${workspaceId}`, {
                    withCredentials:true
            });

            const links:Link[]=response.data.data || response.data;

            setContents(links);
            dispatch(setLinksForWorkspace({workspaceId,links}))
        }catch(error:any){
            const message=error.response?.data?.message || error.message || "Failed to Fetch Links";
            setError(message);
            console.error("useContent Error:",error);
        }finally{
            setLoading(false);
        }
    },[workspaceId,dispatch,cachedLinks]);

    
    const refetch=useCallback(()=>{
        //console.log("CALLING REFRESH AGAIN AND AGAIN");
        fetchLinks(true);
    },[fetchLinks])

    useEffect(()=>{
        //console.log("CALLING USEEFFECT AGAIN AND AGAIN");
        fetchLinks();
    },[fetchLinks]);

    return { contents, loading, error ,refetch};
}