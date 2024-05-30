import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.js";

export default class userUtils {
    static checkUserStatus (status) {
        if ( status == 0 ) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Your account is not active")
        }
        if ( status == 2 ) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Your account is banned")
        }
    }
}