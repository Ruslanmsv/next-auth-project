import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";

import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.status(400).json({ message: "Invalid request method!" });
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const { oldPassword, newPassword } = req.body;
  const userEmail = session.user.email;

  const client = await connectToDatabase();

  const db = client.db();

  const user = await db.collection("users").findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found!" });
    client.close();
    return;
  }

  const currentPassword = user.password;
  const isValid = await verifyPassword(oldPassword, currentPassword);

  if (!isValid) {
    res.status(403).json({ message: "Invalid password!" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await db
    .collection("users")
    .updateOne({ email: userEmail }, { $set: { password: hashedPassword } });

  client.close();
  res.status(200).json({ message: "Password updated!" });
}
