const { userModel } = require("../model/register")

const resgisterService = (payload) => new Promise((resolve, reject) => {
    userModel.create(payload)
    .then(resolve)
    .catch(reject)
})

const loginService = (payload) => new Promise((resolve, reject) => {
    userModel.findOne({email: {$eq: payload}})
    .then(resolve)
    .catch(reject)
})

const getUsersListService = () => new Promise((resolve, reject) => {
    userModel.find()
    .then(resolve)
    .catch(reject)
})

const updateUser = (id, payload) => new Promise((resolve, reject) => {
    userModel.findByIdAndUpdate({_id: id}, payload, {
    new : true,
    runValidators: true,
    })
    .then(resolve)
    .catch(reject)
})

const deleteUser = (id) => new Promise((resolve, reject) => {
    userModel.findByIdAndDelete({_id: id})
    .then(resolve)
    .catch(reject)
})
module.exports = {resgisterService, loginService, getUsersListService, updateUser, deleteUser}