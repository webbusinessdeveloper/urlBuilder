import {newRouter, parser} from "./../shared/services/APIRoutingService"
import {successResponse, errorResponse, failResponse} from "./../shared/services/APIResponseService"
import {MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR, INVALID_EMAIL_FORMAT_ERROR,
    INVALID_PASSWORD_FORMAT_ERROR, USER_ALREADY_EXISTS_ERROR, USER_REGISTRATION_SUCCESS} from "./../shared/constants/notifications"
import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from "./../shared/constants/passwords"
import validator from "validator"
import User from "./../shared/db/models/User"
import bcrypt from "bcrypt"
import EmailValidator from "./../shared/services/EmailValidatorService"

let router = newRouter()

router.post("/", parser.array(), (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if(!email) {
        return res.json(failResponse(MISSING_EMAIL_ERROR))
    }
    if(!password) {
        return res.json(failResponse(MISSING_PASSWORD_ERROR))
    }
    if(!validator.isEmail(email)) {
        return res.json(failResponse(INVALID_EMAIL_FORMAT_ERROR))
    }
    if(!validator.isLength(password, {min : MIN_PASSWORD_LENGTH, max : MAX_PASSWORD_LENGTH}) || !validator.isAlphanumeric(password)) {
        return res.json(failResponse(INVALID_PASSWORD_FORMAT_ERROR))
    }
    User.findOne({email: email})
        .then((user) => {
            if(user) {
                return res.json(failResponse(USER_ALREADY_EXISTS_ERROR))
            }
            let emailValidator = new EmailValidator()
            emailValidator.verifyAsync(email)
                .then((resp) => {
                    console.log(resp)
                })
                .catch((err) => {
                    console.log(err)
                })
           /* User.create({
                email: email,
                password : bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            })
            return res.json(successResponse(USER_REGISTRATION_SUCCESS))*/
        })
        .catch((err) => {
            return res.json(errorResponse(err))
        })
})

export default router
