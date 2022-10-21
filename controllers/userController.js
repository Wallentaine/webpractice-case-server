const {User} = require('../models/User')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {compareSync} = require('bcrypt')

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
            const {email, password, role, firstName, middleName, lastName, birthDate, profession, organization} = req.body

            if (!firstName || !middleName || !lastName || !birthDate || !(profession || organization))
                return next(ApiError.badRequest("Не были переданы необходимые данные!"))

            if (!email || !password) return next(ApiError.badRequest("Некорректный email или пароль!"))

            const candidate = await User.findOne({where: {email}})

            if (candidate) return next(ApiError.badRequest("Пользователь с таким email уже существует!"))

            const hashPassword = await bcrypt.hash(password, 5)

            let user

            switch (role) {
                case "STUDENT" || "TEACHER":
                    user = await User.create({
                        email,
                        password: hashPassword,
                        role,
                        firstName,
                        middleName,
                        lastName,
                        birthDate,
                        profession
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
}

module.exports = new UserController()