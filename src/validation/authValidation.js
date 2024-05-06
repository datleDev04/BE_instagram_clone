import Joi from "joi";
import ApiError from "../utils/ApiError.js";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PHONE_NUMBER_RULE,
  PHONE_NUMBER_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from "../utils/validators.js";
import { StatusCodes } from "http-status-codes";

class authValidation {
  static registerValidation = async (req, res, next) => {
    const correctCondition = Joi.object({
      user_name: Joi.string().min(3).max(20).trim(),
      email: Joi.string().email().trim(),
      password: Joi.string().min(6).trim(),
      confirm_password: Joi.string().min(6).valid(Joi.ref("password")).trim(),
      gender: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      phone: Joi.string()
        .required()
        .pattern(PHONE_NUMBER_RULE)
        .message(PHONE_NUMBER_RULE_MESSAGE),
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
      );
    }
  };

  static loginValidation = async (req, res, next) => {
    const correctCondition = Joi.object({
      email: Joi.string().email().trim(),
      password: Joi.string().min(6).trim(),
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
      );
    }
  }
}

export default authValidation;
