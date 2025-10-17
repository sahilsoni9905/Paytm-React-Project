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
    storage: multer.diskStorage({}),
    limits: { fileSize: 500000 }
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
            profilePic: user.profilePic || '',
        }))
    })
})

router.post("/updateProfilePic", authMiddleware, uploader.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const photoUrl = await uploadPhoto(filePath);
        if (photoUrl != null) {
            await User.updateOne(
                {
                    _id: req.userId,
                },
                {
                    profilePic: photoUrl,
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

router.get("/get-user-details", authMiddleware, async (req, res) => {
    const user = await User.findOne({
        _id: req.userId,
    })
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    };
    res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic == null ? '' : user.profilePic,
    });
})

// New endpoint: Get user expenses (money sent) with date filtering
router.get("/get-expenses", authMiddleware, async (req, res) => {
    try {
        const { date_from, date_to, time_period } = req.query;

        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let dateFilter = {};
        const now = new Date();

        // Parse date filters based on query parameters
        if (date_from && date_to) {
            // Custom date range
            dateFilter = {
                createdAt: {
                    $gte: new Date(date_from),
                    $lte: new Date(date_to + "T23:59:59.999Z")
                }
            };
        } else if (time_period) {
            // Predefined time periods
            switch (time_period) {
                case 'today':
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    dateFilter = { createdAt: { $gte: today } };
                    break;
                case 'yesterday':
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0);
                    const yesterdayEnd = new Date(yesterday);
                    yesterdayEnd.setHours(23, 59, 59, 999);
                    dateFilter = {
                        createdAt: {
                            $gte: yesterday,
                            $lte: yesterdayEnd
                        }
                    };
                    break;
                case 'this week':
                    const startOfWeek = new Date();
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    dateFilter = { createdAt: { $gte: startOfWeek } };
                    break;
                case 'last week':
                    const lastWeekStart = new Date();
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    lastWeekStart.setHours(0, 0, 0, 0);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
                    lastWeekEnd.setHours(23, 59, 59, 999);
                    dateFilter = {
                        createdAt: {
                            $gte: lastWeekStart,
                            $lte: lastWeekEnd
                        }
                    };
                    break;
                case 'this month':
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    dateFilter = { createdAt: { $gte: startOfMonth } };
                    break;
                case 'last month':
                    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = {
                        createdAt: {
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd
                        }
                    };
                    break;
                case 'last 7 days':
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    dateFilter = { createdAt: { $gte: sevenDaysAgo } };
                    break;
                case 'last 30 days':
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
                    break;
            }
        }

        // Filter transactions for expenses (money sent = true)
        const expenseTransactions = user.transactions.filter(transaction => {
            const matchesDate = dateFilter.createdAt ?
                transaction.createdAt >= dateFilter.createdAt.$gte &&
                (!dateFilter.createdAt.$lte || transaction.createdAt <= dateFilter.createdAt.$lte) : true;

            return transaction.MoneySent === true && matchesDate;
        });

        // Calculate total expenses
        const totalExpenses = expenseTransactions.reduce((sum, transaction) => {
            return sum + transaction.transactionAmount;
        }, 0);

        // Get expense breakdown by recipient
        const expenseBreakdown = {};
        expenseTransactions.forEach(transaction => {
            const recipient = transaction.transferWithPersonName;
            if (!expenseBreakdown[recipient]) {
                expenseBreakdown[recipient] = {
                    total: 0,
                    count: 0,
                    transactions: []
                };
            }
            expenseBreakdown[recipient].total += transaction.transactionAmount;
            expenseBreakdown[recipient].count += 1;
            expenseBreakdown[recipient].transactions.push({
                amount: transaction.transactionAmount,
                date: transaction.createdAt,
                message: transaction.msgAttached || ""
            });
        });

        res.json({
            period: time_period || `${date_from} to ${date_to}`,
            totalExpenses: totalExpenses,
            transactionCount: expenseTransactions.length,
            expenseBreakdown: expenseBreakdown,
            recentTransactions: expenseTransactions.slice(-10).map(transaction => ({
                recipient: transaction.transferWithPersonName,
                amount: transaction.transactionAmount,
                date: transaction.createdAt,
                message: transaction.msgAttached || "",
                profilePic: transaction.transferWithPersonProfilePic || ""
            }))
        });

    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({
            message: "Error fetching expense data",
            error: error.message
        });
    }
});

// New endpoint: Get user income (money received) with date filtering
router.get("/get-income", authMiddleware, async (req, res) => {
    try {
        const { date_from, date_to, time_period } = req.query;

        const user = await User.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let dateFilter = {};
        const now = new Date();

        // Parse date filters (same logic as expenses)
        if (date_from && date_to) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(date_from),
                    $lte: new Date(date_to + "T23:59:59.999Z")
                }
            };
        } else if (time_period) {
            // Same time period logic as above
            switch (time_period) {
                case 'today':
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    dateFilter = { createdAt: { $gte: today } };
                    break;
                case 'this month':
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    dateFilter = { createdAt: { $gte: startOfMonth } };
                    break;
                case 'last month':
                    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = {
                        createdAt: {
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd
                        }
                    };
                    break;
                case 'last 7 days':
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    dateFilter = { createdAt: { $gte: sevenDaysAgo } };
                    break;
                case 'last 30 days':
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
                    break;
            }
        }

        // Filter transactions for income (money sent = false)
        const incomeTransactions = user.transactions.filter(transaction => {
            const matchesDate = dateFilter.createdAt ?
                transaction.createdAt >= dateFilter.createdAt.$gte &&
                (!dateFilter.createdAt.$lte || transaction.createdAt <= dateFilter.createdAt.$lte) : true;

            return transaction.MoneySent === false && matchesDate;
        });

        // Calculate total income
        const totalIncome = incomeTransactions.reduce((sum, transaction) => {
            return sum + transaction.transactionAmount;
        }, 0);

        // Get income breakdown by sender
        const incomeBreakdown = {};
        incomeTransactions.forEach(transaction => {
            const sender = transaction.transferWithPersonName;
            if (!incomeBreakdown[sender]) {
                incomeBreakdown[sender] = {
                    total: 0,
                    count: 0,
                    transactions: []
                };
            }
            incomeBreakdown[sender].total += transaction.transactionAmount;
            incomeBreakdown[sender].count += 1;
            incomeBreakdown[sender].transactions.push({
                amount: transaction.transactionAmount,
                date: transaction.createdAt,
                message: transaction.msgAttached || ""
            });
        });

        res.json({
            period: time_period || `${date_from} to ${date_to}`,
            totalIncome: totalIncome,
            transactionCount: incomeTransactions.length,
            incomeBreakdown: incomeBreakdown,
            recentTransactions: incomeTransactions.slice(-10).map(transaction => ({
                sender: transaction.transferWithPersonName,
                amount: transaction.transactionAmount,
                date: transaction.createdAt,
                message: transaction.msgAttached || "",
                profilePic: transaction.transferWithPersonProfilePic || ""
            }))
        });

    } catch (error) {
        console.error("Error fetching income:", error);
        res.status(500).json({
            message: "Error fetching income data",
            error: error.message
        });
    }
});

module.exports = router;