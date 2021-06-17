const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Activity = require('../models/Activity')

router.get(
    '/',
    (req, res) => {
        res.render('login', {
            layout: 'login'
        })
    })

router.get(
    '/dashboard',
    ensureAuth,
    async (req, res) => {
        try{
            const activities = await Activity.find( { user: req.user.id } ).lean()
            res.render('dashboard', {
                name: req.user.firstName,
                activities
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }

    })


module.exports = router