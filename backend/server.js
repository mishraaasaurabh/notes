import express from "express"
import mongoose, { mongo } from "mongoose"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import User from "./models/db.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import Notes from "./models/Notes.js";
import cors from "cors"
// import dotenv;

configDotenv();
const app = express();
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,   // allow cookies
}));

app.use(cookieParser())

const PORT = 8000
const SECRET_KEY="Rain is Fo343"

const mongodburl = process.env.MONGODB_URL;
// console.log(mongodburl)
mongoose.connect(`${mongodburl}`)
.then(()=>console.log("Connected to mongodb"))
.catch(()=>console.log("Couldn't connect to mongodb"))


const authMiddleware = (req,res,next)=>{
    const token = req.cookies.first_cokkie
    if(!token){
        return res.status(401).json({msg:"No token, please login first"})
    }

    
    try {
        const user = jwt.verify(token,SECRET_KEY)
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Invalid or expired token")
    }
}

app.delete("/notes/:id", authMiddleware, async(req,res)=>{
    try {
        
        let noteId = req.params.id
        let userId = req.user.id;
        const DeleteNode = await Notes.findOneAndDelete({
            author: userId,
            _id:noteId
        })
        
        if(!DeleteNode){
            return res.status(404).json({msg: "Note not found"});
            
        }
        res.json({msg:"Node deleted succesfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: "Server Deleted"})
    }
})

app.get("/profile", authMiddleware, async(req,res)=>{
    const id = req.user.id;
    const user = await User.findById({_id:id}).select("-password -_id")

    if(!user){
        return res.status(404).json({msg: "Couldn't find the user"})
    }
    return res.status(200).json({msg: user});

})

app.get("/notes", authMiddleware,  async (req,res)=>{
    const notes = await Notes.find({author: req.user.id})
    return res.status(200).json({msg:notes});
})

app.post("/add-note",authMiddleware, async (req,res)=>{
    // console.log("this is add-not")
    // console.log("This is decoded token", req.user);
    try {
        
        const {title,content} = req.body;
                if (!title || !content) {
            return res.status(400).json({ msg: "Title and content are required" });
        }
        const newNote =  new Notes({
            author: req.user.id,
            title,
            content
        })
        await newNote.save();
        return res.status(200).json({msg: newNote})
        
    } catch (error) {
        console.error("error in add-note route",error);
        return res.status(500).json({msg: "Provide essential fields"})
    }


})

app.post("/logout", async(req,res)=>{
    res.clearCookie("first_cokkie")
    return res.status(200).json({msg:"Logged out successfully"})
})

app.post("/signup",async (req,res)=>{
    try {
        const {email,password,name: fullName} = req.body;
        // console.log(email,password,fullName)
        if(!email || !password || !fullName){
            res.status(400).json({msg: "Enter  valid credetentials"})
            return;
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(500).json({msg: "Email Already Exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        if(!hashedPassword){
            console.error("Couldn't hash password")
            return
        }

        const newUser = new User({
            email: email,
            password: hashedPassword,
            fullName: fullName
        })
        await newUser.save();
        // console.log(`${fullName} inserted successfully`)
        return res.status(201).json({msg: newUser})

        
    } catch (error) {
        console.error("Error is in signup route:",error)
    }

})

app.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({msg: "Enter valid email or password"})
    }
    const user = await User.findOne({email})
    if(!user){
        res.status(500).json({msg: "Email not found"})
        return;
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
         res.status(400).json({msg: "Invalid Password"});
         return
    }
    // console.log(user)

    const plainobj = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profile_img: user.profile_img,
        bio: user.bio
    }
    const token = jwt.sign(plainobj,SECRET_KEY);

    // console.log("JWT_TOKEN",token);

    res.cookie("first_cokkie",token,{
        maxAge: 24*60*60*1000,
    })
    
    
    // console.log(`${user.fullName} logged successfully`)
    return res.status(200).json({msg: plainobj})
})



app.get("/",(req,res)=>{ 
    res.status(200).json({msg:"Hello World"})
})

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}:`,)
})

