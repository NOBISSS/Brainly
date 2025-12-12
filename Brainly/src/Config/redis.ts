import {Redis} from "ioredis";

const redis=new Redis({
    host:"localhost",
    port:6379,
    maxRetriesPerRequest:null,
    lazyConnect:true
});

export default redis