const {RectorMessage} = require('../models/RectorMessage')
const ApiError = require('../error/ApiError')
const {Post} = require("../models/Post");
const {Type} = require("../models/Type");

class RectorMessageController {
    async create(req, res, next) {
        try {
            const {theme, text, userId} = req.body

            if (!userId) return next(ApiError.badRequest("Не был передан userId"))

            if (!theme || !text) return next(ApiError.badRequest("Не были переданы необходимые параметры!"))

            const rectorMessage = await RectorMessage.create({theme, text, userId})

            if (!rectorMessage) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json(rectorMessage)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {

            const rectorMessage = await RectorMessage.findAndCountAll()

            if (!rectorMessage) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json(rectorMessage)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new RectorMessageController()