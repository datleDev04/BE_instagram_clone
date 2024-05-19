import Joi from "joi";
import { PHONE_NUMBER_RULE, PHONE_NUMBER_RULE_MESSAGE, validateBeforeCreateOrUpdate } from "../utils/validators.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";

class userValidation {
    static updateInfoUser = async (req, res ,next) => {
        const correctCondition = Joi.object({
            user_name: Joi.string().min(3).max(20).trim(),
            bio: Joi.string().trim(),
            website: Joi.string().trim(),
            password: Joi.string().min(6).trim(),
            confirm_password: Joi.string().min(6).valid(Joi.ref("password")).trim(),
            gender: Joi.number(),
            phone: Joi.string()
              .pattern(PHONE_NUMBER_RULE)
              .message(PHONE_NUMBER_RULE_MESSAGE),
        });

        try {
            await validateBeforeCreateOrUpdate(correctCondition, req.body);
            next();
          } catch (error) {
            next( new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message) );
          }
    }
}

export default userValidation;