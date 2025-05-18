// Create user controller
import { Request, Response } from "express";
import { User } from "@models/User";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const filterUserController = async (req: Request, res: Response) => {
  try {
    const { search } = req.params;
    const loggedInUserId = req.userId;

    const users = await User.find({
      name: { $regex: search, $options: "i" },
      _id: { $ne: loggedInUserId },
    }).select({ name: 1, email: 1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};
