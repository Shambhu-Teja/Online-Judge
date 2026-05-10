import { Request, Response } from "express";
import  User  from "../../models/User";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};