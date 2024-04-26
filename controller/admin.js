
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const moment = require('moment-timezone');
const TimeSlot = require('../model/timeSlot');
const Shift = require('../model/shift');
router.get('/',(req, res) => {
    res.render('index',{partial: 'home', type:'admin' });
});
router.get('/availability',function(req,res){
    res.render('index',{partial: 'availability' , type:'admin'});
})

router.get('/get-list', async function(req, res){
    try{
        let users = await User.find({ isAdmin: false});
        users = users.map(user => {
            let newUser = {};
            newUser.value = user._id;
            newUser.label = user.name;
            return newUser;
        });
        return res.status(200).json({
            employees: users
        })
    }catch(err){
        res.status(500).json({
            message: 'internal server error'
        })
    }
});

router.post('/get-schedule', async function(req, res){
    try{
        let timeslots = await TimeSlot.find({ userId:new mongoose.Types.ObjectId(req.body.employeeId)});
        return res.status(200).json({
            timeslots
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'internal server error'
        })
    }
})

router.post('/fetch-intersected-employee', async function(req, res){
    try{
        const startTime = moment.tz(`${req.body['book-date']} ${req.body['book-start']}`, 'YYYY-MM-DD HH:mm',req.body['book-zone']).utc();
        const endTime = moment.tz(`${req.body['book-date']} ${req.body['book-end']}`, 'YYYY-MM-DD HH:mm',req.body['book-zone']).utc();
        const timezone = req.body['book-zone'];
        let timeslots = await TimeSlot.find({});
        timeslots = timeslots.filter(timeSlot =>{
            let sl = startTime;
            let sh = endTime;
            let pl = moment.utc(timeSlot.startTime);
            let ph = moment.utc(timeSlot.endTime);
            return ((sl < ph) && (sh > pl));
        })
        for(let timeSlot of timeslots){
            await timeSlot.populate('userId');
        } 
        timeslots.forEach(timeslot =>{
            delete timeslot.userId.password;
            delete timeslot.userId.emailID;
            delete timeslot.userId.isAdmin;
            console.log(timeslot);
        });
        res.status(200).json({
            timeslots : timeslots
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'internal server error'
        })
    }
});

router.post('/make-shift',async function(req, res){
    try{
        let timeSlot = await TimeSlot.findById(new mongoose.Types.ObjectId(req.body.slotId));
        await timeSlot.populate('userId');
        let shift = new Shift({
            userId : req.body.userId,
            startTime : timeSlot.startTime,
            endTime : timeSlot.endTime,
            timezone : timeSlot.timezone,
            name: timeSlot.userId.name
        });
        await shift.save();
        await TimeSlot.findByIdAndDelete(new mongoose.Types.ObjectId(req.body.slotId));
        res.status(200).json({
            messafe: 'Shift Saved Successfully'
        });
    }catch(err){
        res.status(500).json({
            message: 'internal server error'
        })
    }
})

router.get('/shifts',function(req,res){
    res.render('index',{partial: 'shift' , type:'admin'});
})


module.exports = router;