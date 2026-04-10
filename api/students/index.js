import { getDb } from "../_db.js";

export default async function handler(req, res) {
  const db = await getDb();
  const col = db.collection("students");

  try {
    if (req.method === "GET") {
      const students = await col.find({}).sort({ name: 1 }).toArray();
      return res.status(200).json(students);
    }

    if (req.method === "POST") {
      const { name, class: cls, feeAmount } = req.body;
      if (!name || feeAmount == null) {
        return res.status(400).json({ error: "name and feeAmount are required" });
      }
      const doc = { name: name.trim(), class: (cls || "").trim(), feeAmount: Number(feeAmount), createdAt: new Date() };
      const result = await col.insertOne(doc);
      return res.status(201).json({ ...doc, _id: result.insertedId });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
