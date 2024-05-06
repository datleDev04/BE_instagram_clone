import { StatusCodes } from "http-status-codes"
import { validateBeforeCreateOrUpdate } from "../utils/validators.js"
import Joi from "joi"

class genderValidation {
    static createNewGener = async (req, res, next) => {

        const correctCondition = Joi.object({
            name: Joi.string().required().trim()
        })

        try {
            await validateBeforeCreateOrUpdate(correctCondition, req.body)
            next()
        } catch (error) {
            next(
                new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
            )
        }
    }
}

export default genderValidation