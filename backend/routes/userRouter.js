// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");
const { uploadPhoto } = require('../cloudinary/cloud');
const multer = require('multer');


var uploader = multer({
    storage : multer.diskStorage({}),
    limits : {fileSize: 500000}
})
const signupBody = zod.object({
    username: zod.string(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    console.log('reached here');

    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    username: zod.string(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
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



router.put("/update", authMiddleware, async (req, res) => {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
        return res.status(400).json({
            message: "First name and last name are required"
        });
    }

    try {
        const updateResult = await User.updateOne(
            { _id: req.userId },
            {
                $set: {
                    firstName: firstName.trim(),
                    lastName: lastName.trim()
                }
            }
        );

        if (updateResult.nModified === 0) {
            return res.status(404).json({
                message: "No user found or no changes were made"
            });
        }

        res.status(200).json({
            message: "Updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the information",
            error: error.message
        });
    }
});



router.post("/bulk", async (req, res) => {
    const filter = req.body.filter || "";

    const users = await User.find({
        $or: [{
            username: {
                "$regex": filter
            }
        }, {
            firstName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
            profilePic : user.profilePic || '',
        }))
    })
})

router.post("/updateProfilePic" , authMiddleware , uploader.single("file") , async (req ,res) => {
    try {
        const filePath = req.file.path; 
        const photoUrl = await uploadPhoto(filePath);
        if(photoUrl != null){
            await User.updateOne(
                {
                    _id : req.userId,
                },
                {
                    profilePic : photoUrl,
                }
            )
            res.status(200).json({
                msg: "Photo uploaded",
                url: photoUrl
            });

        }
      
    } catch (error) {
        res.status(500).json({
            message: "Error uploading photo",
            error: error.message
        });
    }
})

router.get("/get-user-details" , authMiddleware , async (req , res) => {
    const user = await User.findOne({
        _id: req.userId,
    })
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    };
    res.json({
        username: user.username,
        firstName : user.firstName,
        lastName : user.lastName,
        profilePic : user.profilePic == null ? '' : user.profilePic,       
    });
})

module.exports = router;