const {User} = require('../models/User')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {compareSync} = require('bcrypt')
const axios = require("axios")
const uuid = require("uuid")
const path = require("path");

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password, role, firstName, middleName, lastName, birthDate, profession, organization, groupId} = req.body

            if (!firstName || !middleName || !lastName || !birthDate || !(profession || organization))
                return next(ApiError.badRequest("Не были переданы необходимые данные!"))

            if (role === "STUDENT" && !groupId)
                return next(ApiError.badRequest("Не были переданы необходимые данные!"))

            if (!email || !password) return next(ApiError.badRequest("Некорректный email или пароль!"))

            const candidate = await User.findOne({where: {email}})

            if (candidate) return next(ApiError.badRequest("Пользователь с таким email уже существует!"))

            const hashPassword = await bcrypt.hash(password, 5)

            let user

            switch (role) {
                case "STUDENT":
                    user = await User.create({
                        email,
                        password: hashPassword,
                        role,
                        firstName,
                        middleName,
                        lastName,
                        birthDate,
                        profession,
                        organization
                    })
                    break
                case "TEACHER":
                    user = await User.create({
                        email,
                        password: hashPassword,
                        role,
                        firstName,
                        middleName,
                        lastName,
                        birthDate,
                        profession,
                        organization
                    })
                    break
                case "WORKER":
                    user = await User.create({
                        email,
                        password: hashPassword,
                        role,
                        firstName,
                        middleName,
                        lastName,
                        birthDate,
                        organization
                    })
                    break
                default:
                    break
            }

            if (!user) return next(ApiError.internal("Что-то пошло не так!"))

            if (role === "STUDENT") {
                //https://${process.env.REMOTE_SCHEDULE_HOST}:${process.env.REMOTE_SCHEDULE_PORT}/api/student/`
                // При деплое поменять http на https
                await axios.post(
                    `https://${process.env.REMOTE_SCHEDULE_HOST}/api/student/`,
                    {
                        id: user.id,
                        fullName: `${firstName} ${middleName} ${lastName}`,
                        groupId
                    }
                )
            }

            const token = generateJwt(user.id, user.email, user.role)

            if (!token) return next(ApiError.internal("Непредвиденная ошибка с токеном!"))

            return res.json({token})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body

            if (!email || !password) return next(ApiError.badRequest("Некорректный email или пароль!"))

            const user = await User.findOne({where: {email}})

            if (!user) return next(ApiError.badRequest("Пользователя не существует"))

            let comparePassword = bcrypt.compareSync(password, user.password)

            if (!comparePassword) return next(ApiError.badRequest("Указан неверный пароль"))

            const token = generateJwt(user.id, user.email, user.role)

            if (!token) return next(ApiError.internal("Непредвиденная ошибка с токеном!"))

            return res.json({token})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async check(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role)

            if (!token) return next(ApiError.internal("Непредвиденная ошибка с токеном!"))

            return res.json({token})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async addImage(req, res, next) {
        try {
            const {id} = req.body

            if (!id) return next(ApiError.badRequest("Не был передан id"))

            const {img} = req.files

            if (!img) return next(ApiError.badRequest("Картинка не была передана!"))

            let fileName = uuid.v4() + ".jpg"

            await img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const user = await User.update({img})

            if (!user) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json({message: "OK"})
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getUserByEmail(req, res, next) {
        try {
            const {email} = req.query

            if (!email) return next(ApiError.badRequest("Не был передан email!"))

            const user = await User.findOne({where: {email}})

            if (!user) return next(ApiError.notFound("Такого пользователя не существует"))

            return res.json(user)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll()

            if (!users) return next(ApiError.notFound("Пользователи не найдены!"))

            return res.json(users)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new UserController()