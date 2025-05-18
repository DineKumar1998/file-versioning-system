import { User } from "../models/User";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user._id.toString());
    return { token, user: { email: user.email, name: user.name } };
  }

  async logout() {
    return { message: "Logout successful" };
  }
}
