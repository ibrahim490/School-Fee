import { ObjectId } from "mongodb";
import { getDb } from "../_db.js";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  const db = await getDb();
  const students = db.collection("students");
  const payments = db.collection("payments");
  const oid = new ObjectId(id);

  try {
    if (req.method === "PUT") {
      const { name, class: cls, feeAmount } = req.body;
      const update = {};
      if (name) update.name = name.trim();
      if (cls !== undefined) update.class = cls.trim();
      if (feeAmount != null) update.feeAmount = Number(feeAmount);
      update.updatedAt = new Date();

      const result = await students.findOneAndUpdate({ _id: oid }, { $set: update }, { returnDocument: "after" });
      if (!result) return res.status(404).json({ error: "Student not found" });
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      await students.deleteOne({ _id: oid });
      await payments.deleteMany({ studentId: id });
      return res.status(200).json({ deleted: true });
    }

    res.setHeader("Allow", "PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
