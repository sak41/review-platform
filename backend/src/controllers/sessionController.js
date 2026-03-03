import { chatClient, streamClient } from "../lib/stream.js"
import Session from "../models/Session.js"

export async function createSession(req, res) {

    try {
        const { problem, difficulty } = req.body
        const userId = req.user._id
        const clerkId = req.user.clerkId

        if (!problem || !difficulty) {
            return res.status(400).json({ message: "problem and difficulty are required" })
        }

        //geenerate a unique call id for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        //     create session in db
        const session = await Session.create({ problem, difficulty, host: userId, callId });
        // create a stream video call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: session._id.toString() },

            },
        });

        //chat messaging
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem}Session`,
            created_by_id: clerkId,
            members: [clerkId],
        })

        await channel.create()

        res.status(201).json({ session })
    } catch (error) {
        console.log("Error in createsession controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}


export async function getActiveSessions(_, res) {
    try {
        const sessions = await Session.find({ status: "active" })
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions })

    } catch (error) {
        console.log("Error in getActivesession controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }


}


export async function getMyRecentSessions(req, res) {
    try {
        //where user is either host or partcipant
        const userId = req.user._id;

        const sessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }],
        })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions })
    } catch (error) {

        console.log("Error in getmyrecentsession controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}


export async function getSessionById(req, res) {
    try {
        const { id } = req.params

        const session = await Session.findById(id)
            .populate("host", "name email profileImage clerkId")
            .populate("participant", "name email profileImage clerkId");

        if (!session) return res.status(404).json({ message: "Session not found" });

        res.status(200).json({ session });
    } catch (error) {
        console.log("Error in gestsessionbyid controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}



export async function joinSession(req, res) {

    try {
        const { id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.status !== "active") {
            return res.status(400).json({ message: "cannot join a completed session" });
        }

        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "host cannot be a participant of their own sesssion" });
        }

        if (session.participant) return res.status(409).json({ message: "Session is full" });//check if session is alreadt full

        session.participant = userId
        await session.save()

        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
        res.status(200).json({ session });
    } catch (error) {

        console.log("Error in join session controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}


export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: "Session not found" });

        //check user is host then only can end session
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "only the host can end the session" })
        }



        session.status = "completed"
        await session.save();

        //delete your video call
        const call = streamClient.video.call("default", session.callId)
        await call.delete({ hard: true })

        //delete stream chat channel

        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        //check if session already completed
        if (session.status === "completed") {
            return res.status(403).json({ message: "session is already comepleted" });
        }

        res.status(200).json({ session, message: "session ended successfully" });


    } catch (error) {
        console.log("Error in end session controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}