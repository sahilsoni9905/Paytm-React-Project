
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account, User } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.post("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });
    const user = await User.findOne({
        _id : req.userId
    })
    let userSubmittedPassword = req.body.password;
    if(user != null && user.password == userSubmittedPassword){
        res.json({
            balance: account.balance
        })
    }
    else

    res.json({
        msg: "bhaag yha s",
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

  
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

 
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    const transaction = {
        oldBalance: account.balance,
        newBalance: account.balance - amount,
        transferWithPersonName: toAccount.userId, 
        transactionAmount: amount,
        MoneySent: 1, 
        msgAttached: req.body.msgAttached || '' 
    };
    await User.updateOne(
        { _id: req.userId },
        { $push: { transactions: transaction } }
    ).session(session);


    const receiverTransaction = {
        oldBalance: toAccount.balance,
        newBalance: toAccount.balance + amount,
        transferWithPersonName: account.userId, 
        transactionAmount: amount,
        MoneySent: 0,
        msgAttached: req.body.msgAttached || '' ,
    };

    await User.updateOne(
        { _id: to },
        { $push: { transactions: receiverTransaction } }
    ).session(session);
    
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;