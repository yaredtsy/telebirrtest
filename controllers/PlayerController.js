const PlayerModel = require("../models/player")

module.exports = {
    RegisterUser: async(req, res, next) => {
        try {
            const {
                userId,
            } = req.body;

            player = await PlayerModel.exists({ userId })
            if (player) {
                return res.json({
                    success: false,
                    error: 'ID_ALREADY_EXISTS'
                })
            } else {
                player = PlayerModel({
                    userId: userId
                })
                await player.save()

                return res.json({
                    success: true,

                })
            }
        } catch (error) {
            return res.json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR'
            })
        }
    },
    IsUnique: async(req, res, next) => {
        try {
            const {
                userId,
            } = req.body;

            player = await PlayerModel.exists({ userId })
            if (player) {
                return res.json({
                    success: false,
                    error: 'ID_ALREADY_EXISTS'
                })
            } else {

                return res.json({
                    success: true,

                })
            }
        } catch (error) {
            return res.json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR'
            })
        }
    },
}