import { Request, Response } from "express";
import { User } from "../models/User";
import { uuid } from "uuidv4";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

// Create user
export const create = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password && req.body.name) {
        const { name, email, password } = req.body;
        const id = uuid();

        const hasUser = await User.findOne({ where: { email } });

        if (!hasUser) {
            const newUser = await User.create({
                id,
                name,
                email,
                password: await bcrypt.hash(password, 10),
            });

            const token = JWT.sign(
                {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
                process.env.JWT_SECRET_KEY as string
            );
            res.status(201).json(token);
            return;
        } else {
            res.json("User already exists");
        }
    } else {
        res.json("Email or password not sent");
    }
};

//login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            const token = JWT.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "48h" }
            );
            res.json({ status: true, token, user });
            return;
        } else {
            res.json({ message: "Incorrect password", status: false });
        }
    } else {
        res.json({ message: "User not found", status: false });
    }
};

export const validateToken = async (req: Request, res: Response) => {
    const token = req.body.token;

    try {
        const data = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
        res.json({ user: data });
    } catch (error) {
        res.json(error);
    }
};

//private routes ------

// get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const userList = await User.findAll();
        res.json(userList);
    } catch (error) {
        res.json(error);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (user) {
            res.json(user);
        } else {
            res.json({ message: "User not found" });
        }
    } catch (error) {
        res.json(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);

    if (user) {
        if (name && email && password) {
            await User.update(
                {
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        } else if (name && email) {
            await User.update(
                {
                    name,
                    email,
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        } else if (name) {
            await User.update(
                {
                    name,
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        } else if (name && password) {
            await User.update(
                {
                    name,
                    password: await bcrypt.hash(password, 10),
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        } else if (email && password) {
            await User.update(
                {
                    email,
                    password: await bcrypt.hash(password, 10),
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        } else if (email) {
            await User.update(
                {
                    email,
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        } else if (password) {
            await User.update(
                {
                    password: await bcrypt.hash(password, 10),
                },
                {
                    where: { id },
                }
            );
            res.json({ sucess: true });
        }
    } else {
        res.json({ message: "User not found" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    let { id } = req.params;

    try {
        await User.destroy({ where: { id } });
        res.json({});
    } catch (error) {
        res.json(error);
    }
};
