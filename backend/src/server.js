// import express from "express";
// import path from "path"
// import{ENV} from "./lib/env.js"

// const app = express();

// const __dirname = path.resolve();


// app.get("/books", (req,res) =>{
//     res.status(200).json({msg: "api is runnning and book endpoint"});
// });


// app.get("/health", (req,res) =>{
//     res.status(200).json({msg: "api is runnning and success"});
// });
// // make our app ready for deployement
// if(ENV.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));


// app.get("/{*any}", (req,res) =>{
//     res.sendFile(path.join(__dirname,"../frontend", "dist","index.html"));
// });
// }

// app.listen(ENV.PORT, ()=> console.log("Server is running on port:", ENV.PORT));


import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express"
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoute.js"
import executeRoute from "./routes/executeRoute.js"
const app = express();
const __dirname = path.resolve();

//middleware
app.use(express.json());
//CREDENTIALS TRUE MEANS SERVER ALLOW THE BROWSERS TO INCLUDE COOKIES ON REQ 
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware());// this  adds auth field to req object:req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/execute", executeRoute);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is running and success" });
});

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/", (req, res) => {
    if (req.path.startsWith("/api")) return;
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


const PORT = process.env.PORT || ENV.PORT || 5000;


const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || ENV.PORT || 5000;

    app.listen(PORT, () => {
      console.log("Server is running on port:", PORT);
    });
  } catch (error) {
    console.error("error starting the server", error);
  }
};

startServer();