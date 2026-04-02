import { ObjectId } from "mongodb";
import { getDb } from "../_db.js";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid payment ID" });
  }

  const db = await getDb();
  const col = db.collection("payments");

  try {
    if (req.method === "DELETE") {
      await col.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ deleted: true });
    }

    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
