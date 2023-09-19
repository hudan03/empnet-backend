const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Get specific users
// @route GET /users/:id
// @access Private
const getUsersbyID = asyncHandler(async (req, res) => {

    const user = await User.findById({ _id: req.params.id }).select('-password').lean()

    if (!user) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(user)
})

// @desc Create new user
// @route POST /users
// @access Private
const createUser = asyncHandler(async (req, res) => {
    const { email, name, password, type, roles } = req.body
    
    // Confirm data
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Email has already existed'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { email, name, "password": hashedPwd, type, roles }

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message:`New user ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {

    const { id, email, name, password, type, roles } = req.body

    const user = await User.findById(id).exec()

    if(!user) return res.status(404).json({msg: "User not found!!!"})

    let hashPassword

    if(password === "" || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await bcrypt.hash(password, 10)
    }

    try {
        user.set({
            name: name,
            email: email,
            password: hashPassword,
            type: type,
            roles: roles
        });
        user.save()

        res.status(200).json({msg: "Account is updated successfully"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    
    if (!id) {
        return res.status(400).json({ message: 'User ID required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `User ${result.email} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    getUsersbyID,
    createUser,
    updateUser,
    deleteUser
}