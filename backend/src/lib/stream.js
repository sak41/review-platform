import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"
import {StreamClient} from "@stream-io/node-sdk";


const apiKey= ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_SECRET_KEY

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing")

}


export const streamClient = new StreamClient(apiKey,apiSecret); //used for video calls
export const chatClient = StreamChat.getInstance(apiKey,apiSecret);//this is for chat messaging



export const upsertStreamUser= async(userData) => {
    try{
        await chatClient.upsertUser(userData);
        console.log("sttream user upserted sucessfully", userData);
    }
    catch(error){
        console.error("error upserting stream user", error);
    }
}

export const deleteStreamUser= async(userId) => {
    try{
        await chatClient.deleteUser(userId)
        console.log("stream user deleted successfully",userId);
    }
    catch(error){
        console.error("error deleting stream user", error);
    }
}

// add another method to generate token