const express =require("express");
const zod=require("zod");
const {User}=require("../db");
const { JWT_SECRET } = require("../config");
const { Account } = require("../db");
const jwt = require("jsonwebtoken");


const router = express.Router();

const userSchema=zod.object({
    username:zod.string().min(3).max(30),
    password:zod.string().min(6),
    firstName:zod.string().max(50),
    lastName:zod.string().max(50)
})
router.post("/signup",async(req,res)=>{
    // const {username,password,firstName,lastName} =req.body;
    console.log(req.body);
    const {success} =userSchema.safeParse(req.body);
    if(!success){
        return res.status(401).json({
            message:"invalid inputs"
        })
    }

    const user=await User.findOne({
        username:req.body.username
    })

    if(user){
        return res.status(401).json({
            message:"User already exists"
        })
    }
    const newUser=await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    })

    const userId=newUser._id;

    
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token=jwt.sign({
        userId
    },JWT_SECRET);

    res.status(200).json({
        message:"user signed up successfully",
        token:token
    })
})

//signin route

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

//update the user

const  { authMiddleware } = require("./middleware");


// other auth routes

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

//to get all user when searching to pay

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;