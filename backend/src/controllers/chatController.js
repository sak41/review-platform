import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res){
    try{
        const token = chatClient.createToken(req.user.clerkId);

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image
        })
    } catch(error){
        console.log("Error in getstreamtoken contoller", error.message);
        res.status(500).json({  message: "Internal Server Error"});

    }
}

//in stream we use clerk id so that should match for the retreival