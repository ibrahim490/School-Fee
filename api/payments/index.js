import { getDb } from "../_db.js";

export default async function handler(req, res) {
  const db = await getDb();
  const col = db.collection("payments");

  try {
    if (req.method === "GET") {
      const { month, year } = req.query;
      const filter = {};
      if (month !== undefined) filter.month = Number(month);
      if (year !== undefined) filter.year = Number(year);
      const payments = await col.find(filter).sort({ date: -1 }).toArray();
      return res.status(200).json(payments);
    }

    if (req.method === "POST") {
      const { studentId, month, year, amount, date, note, expectedAmount } = req.body;
      if (!studentId || amount == null || month == null || year == null) {
        return res.status(400).json({ error: "studentId, month, year, and amount are required" });
      }
      const doc = {
        studentId,
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
        date: date || new Date().toISOString().split("T")[0],
        note: (note || "").trim(),
        expectedAmount: Number(expectedAmount || 0),
        createdAt: new Date()
      };
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
