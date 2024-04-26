const express = require('express')
const router = express.Router();
const moment = require('moment-timezone');
require('moment-timezone/data/packed/latest.json');
const mongoose = require('mongoose');
const TimeSlot = require('../model/timeSlot');
const Shift = require('../model/shift');
router.get('/',function(req,res){
    res.render('index',{partial: 'home', type:'employee' });
});

router.get('/availability',function(req,res){
    res.render('index',{partial: 'availability' , type:'employee'});
})

router.post('/book-slot',async function(req,res){
    try{
    const startTime = moment.tz(`${req.body['book-date']} ${req.body['book-start']}`, 'YYYY-MM-DD HH:mm',req.body['book-zone']).utc();
    const endTime = moment.tz(`${req.body['book-date']} ${req.body['book-end']}`, 'YYYY-MM-DD HH:mm',req.body['book-zone']).utc();
    const timezone = req.body['book-zone'];
    let timeSlots = await TimeSlot.find({ userId:new mongoose.Types.ObjectId(req.user._id)});
    timeSlots = timeSlots.filter(timeSlot => {
        let sl = startTime;
        let sh = endTime;
        let pl = moment.utc(timeSlot.startTime);
        let ph = moment.utc(timeSlot.endTime);
        return ((sl < ph) && (sh > pl));
    });

    if(timeSlots.length != 0){
        return res.status(400).json({message: 'Intersecting time Slot'});
    }
    console.log(startTime);
    console.log(endTime);
    const timeSlot = new TimeSlot({
        'userId': req.user._id,
        'startTime': startTime.format(),
        'endTime': endTime.format(),
        'timezone' : timezone
    });
    await timeSlot.save();
    res.status(200).json({message :'Slot pushed to server'});
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

router.get('/fetch-user-slots',async function(req,res){
    try{
        let timeslots = await TimeSlot.find({ userId:new mongoose.Types.ObjectId(req.user._id)});
    return res.status(200).json({
            timeslots
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

router.get('/shifts',function(req,res){
    res.render('index',{partial: 'shift' , type:'employee'});
})


router.get('/fetch-shift',async function(req,res){
    try{
        let shifts = await Shift.find({userId: req.user._id});

        return res.status(200).json({shifts});
    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }
})
module.exports = router;