const {Post} = require('../models/Post')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const {promiseCallback} = require("express-fileupload/lib/utilities")
const {Type} = require("../models/Type")

class PostController {
    async create(req, res, next) {
        try {
            const {title, text, userId, typeId} = req.body

            const {img} = req.files

            if (!userId || !typeId) return next(ApiError.badRequest("Не был переда userId и/или typeId!"))

            if (!title || !text || !img) return next(ApiError.badRequest("Не были переданы необходимые параметры!"))

            let fileName = uuid.v4() + ".jpg"

            await img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const post = await Post.create({title, img: fileName, text, userId, typeId})

            if (!post) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json(post)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params

            if (!id) return next(ApiError.badRequest("Не был передан Id!"))

            const post = await Post.findOne({
                where: {id},
                include: [{
                    model: Type,
                    required: true
                }]
            })

            if (!post) return next(ApiError.notFound("Нет поста с таким Id!"))

            return res.json(post)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getLatestPosts(req, res, next) {
        try {
            const {limit} = req.query

            const posts = await Post.findAll({limit, order: [['createdAt', 'DESC']]})

            if (!posts) return next(ApiError.notFound("Ничего не найдено!"))

            return res.json(posts)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let {typeId, limit, page} = req.query

            page = page || 1
            limit = limit || 9

            let offset = page * limit - limit
            let posts

            if (!typeId) {
                posts = await Post.findAndCountAll({limit, offset,
                    include: [{
                        model: Type,
                        required: true
                    }]
                })
            } else {
                posts = await Post.findAndCountAll({where:{typeId}, limit, offset,
                    include: [{
                        model: Type,
                        required: true
                    }]
                })
            }

            if (!posts) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json(posts)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {id, title, text, typeId} = req.body

            if (!id) return next(ApiError.badRequest("Не был передан Id!"))

            let fileName

            if (req.files) {
                const {img} = req.files

                fileName = uuid.v4() + ".jpg"

                await img.mv(path.resolve(__dirname, '..', 'static', fileName))
            }

            if (!title && !text && !fileName && !typeId) return next(ApiError.badRequest("Нечего обновлять"))

            const post = await Post.update({title, img: fileName, text, typeId}, {where: {id}})

            if (!post) return next(ApiError.internal("Что-то пошло не так!"))

            return res.json(post)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PostController()