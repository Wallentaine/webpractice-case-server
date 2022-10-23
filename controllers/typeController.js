const {Type} = require('../models/Type')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res, next) {
        try {
            const {title} = req.body

            if (!title) return next(ApiError.badRequest("Не был передан title!"))

            const exist = await Type.findOne({where: {title}})

            if (exist) return next(ApiError.badRequest("Этот тип уже существует!"))

            const type = await Type.create({title})

            if (!type) next(ApiError.internal("Что-то пошло не так!"))

            return res.json(type)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll()

            if (!types) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json(types)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new TypeController()