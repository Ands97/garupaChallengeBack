"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.validateToken = exports.login = exports.create = void 0;
const User_1 = require("../models/User");
const uuidv4_1 = require("uuidv4");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create user
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.email && req.body.password && req.body.name) {
        const { name, email, password } = req.body;
        const id = (0, uuidv4_1.uuid)();
        const hasUser = yield User_1.User.findOne({ where: { email } });
        if (!hasUser) {
            const newUser = yield User_1.User.create({
                id,
                name,
                email,
                password: yield bcrypt_1.default.hash(password, 10),
            });
            const token = jsonwebtoken_1.default.sign({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            }, process.env.JWT_SECRET_KEY);
            res.status(201).json(token);
            return;
        }
        else {
            res.json("User already exists");
        }
    }
    else {
        res.json("Email or password not sent");
    }
});
exports.create = create;
//login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.User.findOne({ where: { email } });
    if (user) {
        if (yield bcrypt_1.default.compare(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                name: user.name,
                email: user.email,
            }, process.env.JWT_SECRET_KEY, { expiresIn: "48h" });
            res.json({ status: true, token, user });
            return;
        }
        else {
            res.json({ message: "Incorrect password", status: false });
        }
    }
    else {
        res.json({ message: "User not found", status: false });
    }
});
exports.login = login;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        res.json({ user: data });
    }
    catch (error) {
        res.json(error);
    }
});
exports.validateToken = validateToken;
//private routes ------
// get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield User_1.User.findAll();
        res.json(userList);
    }
    catch (error) {
        res.json(error);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.User.findByPk(id);
        if (user) {
            res.json(user);
        }
        else {
            res.json({ message: "User not found" });
        }
    }
    catch (error) {
        res.json(error);
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = yield User_1.User.findByPk(id);
    if (user) {
        if (name && email && password) {
            yield User_1.User.update({
                name,
                email,
                password: yield bcrypt_1.default.hash(password, 10),
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
        else if (name && email) {
            yield User_1.User.update({
                name,
                email,
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
        else if (name) {
            yield User_1.User.update({
                name,
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
        else if (name && password) {
            yield User_1.User.update({
                name,
                password: yield bcrypt_1.default.hash(password, 10),
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
        else if (email && password) {
            yield User_1.User.update({
                email,
                password: yield bcrypt_1.default.hash(password, 10),
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
        else if (email) {
            yield User_1.User.update({
                email,
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
        else if (password) {
            yield User_1.User.update({
                password: yield bcrypt_1.default.hash(password, 10),
            }, {
                where: { id },
            });
            res.json({ sucess: true });
        }
    }
    else {
        res.json({ message: "User not found" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        yield User_1.User.destroy({ where: { id } });
        res.json({});
    }
    catch (error) {
        res.json(error);
    }
});
exports.deleteUser = deleteUser;
