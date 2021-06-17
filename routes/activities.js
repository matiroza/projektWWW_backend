const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Activity = require('../models/Activity')

//Show add page
//GET /activities/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('activities/add')
})

//POST /activities
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Activity.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//Show all activits
//GET /activities
router.get('/', ensureAuth, async (req, res) => {
    try {
        const activiti = await Activity.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('activities/index', {
            activiti,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//Show single activity
//GET /activitiess/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let activiti = await Activity.findById(req.params.id).populate('user').lean()

        if (!activiti) {
            return res.render('error/404')
        }

        if (activiti.user._id != req.user.id && activiti.status == 'private') {
            res.render('error/404')
        } else {
            res.render('activities/show', {
                activiti,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

//Show edit page
//GET /activities/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const activiti = await Activity.findOne({
            _id: req.params.id,
        }).lean()

        if (!activiti) {
            return res.render('error/404')
        }

        if (activiti.user != req.user.id) {
            res.redirect('/activities')
        } else {
            res.render('activities/edit', {
                activiti,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//Update activity
//PUT /activities/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let activiti = await Activity.findById(req.params.id).lean()

        if (!sactiviti) {
            return res.render('error/404')
        }

        if (activiti.user != req.user.id) {
            res.redirect('/activities')
        } else {
            activiti = await Activity.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//Delete activity
//DELETE /activities/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let activiti = await Activity.findById(req.params.id).lean()

        if (!activiti) {
            return res.render('error/404')
        }

        if (activiti.user != req.user.id) {
            res.redirect('/activities')
        } else {
            await Activity.remove({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//User activity
//GET /activitiess/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const activiti = await Activity.find({
            user: req.params.userId,
            status: 'public',
        })
            .populate('user')
            .lean()

        res.render('activities/index', {
            activiti,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router