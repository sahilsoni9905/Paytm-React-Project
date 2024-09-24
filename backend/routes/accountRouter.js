
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account, User } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.post("/getReceiver", authMiddleware, async (req, res) => {
    try {
        const receiver = await User.findOne({ _id: req.body.to })
            .select("-password -transactions");

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        res.status(200).json(receiver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


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
    console.log("reacheduhjiiiiiiiiiiiiiiiiiiiiiiii")
    const user = await User.findOne({
        _id : req.userId
    })
    const userTo = await User.findOne({
        _id : req.body.to,
    })
    let userSubmittedPassword = req.body.password;
    if(user.password != userSubmittedPassword){
        res.status(401).json({
            msg : "wrong password",
        })
    }
console.log('avdcajsdvfshakdvbfskd');

    session.startTransaction();
    const { amount, to } = req.body;

  
    const account = await Account.findOne({ userId: req.userId }).session(session);
console.log(account)
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
        msgAttached: req.body.msgAttached || '' ,
        transferWithPersonProfilePic : userTo.profilePic || '',
        transferWithPersonId : to,
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
        transferWithPersonProfilePic : user.profilePic || '',
        transferWithPersonId : req.userId,
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

router.get("/transaction-history", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const transactionHistory = user.transactions.map((transaction) => {
            return {
                profilePic : transaction.transferWithPersonProfilePic || '', 
                date: transaction.createdAt, 
                type: transaction.MoneySent, 
                amount: transaction.transactionAmount,  
                withPerson: transaction.transferWithPersonName,  
                message: transaction.msgAttached || '', 
            };
        });
        console.log(transactionHistory)

      
        res.status(200).json({
            transactions: transactionHistory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});

const getDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
};

const getStartOfWeek = (currentDate) => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();  // 0 for Sunday, 1 for Monday, etc.
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);  // Go back to the last Sunday
    startOfWeek.setHours(0, 0, 0, 0);  // Set time to midnight
    return startOfWeek;
};

router.get("/transaction-weekly-data", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const currentDate = new Date();

        const startOfWeek = getStartOfWeek(currentDate);

        const transactionsInCurrentWeek = user.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            return transactionDate >= startOfWeek && transactionDate <= currentDate;
        });

        const weeklyData = {
            Sun: { received: 0, sent: 0 },
            Mon: { received: 0, sent: 0 },
            Tue: { received: 0, sent: 0 },
            Wed: { received: 0, sent: 0 },
            Thu: { received: 0, sent: 0 },
            Fri: { received: 0, sent: 0 },
            Sat: { received: 0, sent: 0 },
        };

        transactionsInCurrentWeek.forEach(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            const dayName = getDayName(transactionDate);  // Get the day name

            if (transaction.MoneySent == true) {
                weeklyData[dayName].sent += transaction.transactionAmount;
            } else {
                weeklyData[dayName].received += transaction.transactionAmount;
            }
        });

        res.status(200).json(weeklyData);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});


const getStartOfMonth = (currentDate) => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
};


const getStartOfDay = (currentDate) => {
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);  
    return startOfDay;
};

router.get("/dashboard-transaction-info", authMiddleware, async (req, res) => {
    try {
      
        const user = await User.findOne({
            _id: req.userId
        });

     
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const currentDate = new Date();

   
        const startOfMonth = getStartOfMonth(currentDate);

      
        const startOfDay = getStartOfDay(currentDate);

        let monthReceived = 0, monthSent = 0;
        let todayReceived = 0, todaySent = 0;
        if(user.transactions == null ||  user.transactions.length < 1){
            return res.json({
                msg : "no transaction done",
            })
        }
        const lastTransaction = user.transactions[user.transactions.length - 1];

        user.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.createdAt);

            if (transactionDate >= startOfMonth && transactionDate <= currentDate) {
                if (transaction.MoneySent ==true) {
                    monthSent += transaction.transactionAmount;
                } else {
                    monthReceived += transaction.transactionAmount;
                }
            }

            if (transactionDate >= startOfDay && transactionDate <= currentDate) {
                if (transaction.MoneySent ==true) {
                    todaySent += transaction.transactionAmount;
                } else {
                    todayReceived += transaction.transactionAmount;
                }
            }
        });
        let  sent = false;
        let received = false
        let money_sent = 0;
        let send_to = '';
        let time_sent = 0;
        let time_received = 0;
        let money_received = 0;
        let received_by = '';
        for(let i = user.transactions.length - 1; i >= 0 ; i--){
            if(user.transactions[i].MoneySent == 1 && sent == false){
                money_sent = user.transactions[i].transactionAmount;
                send_to = user.transactions[i].transferWithPersonName;
                time_sent = user.transactions[i].createdAt;
                sent = true;

            } 
            if(user.transactions[i].MoneySent == 0 && received == false){
                money_received = user.transactions[i].transactionAmount;
                received_by = user.transactions[i].transferWithPersonName;
                time_received = user.transactions[i].createdAt;
                received = true;

            }  
            if(sent == true && received == true){
                break;
            }
        }

        const response = {
            currentMonth: {
                totalSent: monthSent,
                totalReceived: monthReceived
            },
            lastTransaction: lastTransaction
                ? {
                    money_sent : money_sent,
                    send_to : send_to,
                    time_sent : time_sent,
                     time_received : time_received,
                     money_received : money_received,
                     received_by  : received_by,
                }
                : null, 
            today: {
                totalSent: todaySent,
                totalReceived: todayReceived
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});

router.post("/person-transaction-history", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        const userTo = await User.findOne({ _id: req.body.personId });

        if (!user || !userTo) {
            return res.status(404).json({ message: 'User or person not found' });
        }

        const transactionHistory = user.transactions
            .filter(transaction => transaction.transferWithPersonId === req.body.personId)
            .map((transaction) => ({
                profilePic: transaction.transferWithPersonProfilePic || '', 
                date: transaction.createdAt, 
                type: transaction.MoneySent,  
                amount: transaction.transactionAmount,    
                message: transaction.msgAttached || '', 
            }));
            console.log(transactionHistory.length)
            console.log(transactionHistory)
        if (transactionHistory.length === 0) {
            return res.status(200).json({ message: 'No transactions found with this person' });
        }

        return res.status(200).json(transactionHistory);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});





module.exports = router;