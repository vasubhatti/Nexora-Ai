import {body} from "express-validator";

export const registerRules = [
    body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({max:30})
    .withMessage("Name should be under 30 characters."),

    body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail().withMessage("Please enter proper email address")
    .normalizeEmail(),

    body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({min:6})
    .withMessage("Password should be at least 6 characters long.")
]

export const loginRules = [
    body("email")
    .notEmpty()
    .withMessage("Email is required."),
    body("password")
    .notEmpty()
    .withMessage("Password is required.")
]