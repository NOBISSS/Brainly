import { LINK_PATTERNS,LinkType } from "./linkTypes";




export function detectLinkType(url:string): LinkType{
    const lowerUrl=url.toLocaleLowerCase();
    const match=LINK_PATTERNS.find((pattern)=>
    pattern.patterns.some((p)=>lowerUrl.includes(p)))
    return match ? match.type : "unknown";
}