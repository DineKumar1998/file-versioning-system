import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await authService.login(email, password);
    res.status(200).json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logoutController = async (_req: Request, res: Response) => {
  const data = await authService.logout();
  res.status(200).json(data);
};
