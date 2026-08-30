import type { Request, Response } from "express";
import { pool } from "./db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientName, appointmentAt } = req.body;

    if (!patientName || patientName.trim() === "") {
      return res.status(400).json({ error: "ชื่อผู้ป่วยห้ามว่าง" });
    }

    const appointmentDate = new Date(appointmentAt);
    if (isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
      return res
        .status(400)
        .json({ error: "ไม่สามารถนัดหมายย้อนหลังได้" });
    }

    const startTime = new Date(appointmentDate.getTime() - 30 * 60 * 1000);
    const endTime = new Date(appointmentDate.getTime() + 30 * 60 * 1000);

    const [existing] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM appointments 
       WHERE status != 'cancelled' 
       AND appointmentAt > ? AND appointmentAt < ?`,
      [startTime, endTime],
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "เวลาในการนัดหมายซ้ำกับช่วงเวลาที่มีอยู่แล้ว" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO appointments (patientName, appointmentAt, status) VALUES (?, ?, 'pending')`,
      [patientName, appointmentDate],
    );

    return res.status(201).json({
      id: result.insertId,
      patientName,
      appointmentAt: appointmentDate,
      status: "pending",
      createdAt: new Date(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM appointments";
    const params: any[] = [];

    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY appointmentAt ASC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("DB Error Details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE appointments SET status = ? WHERE id = ?`,
      [status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ message: "Status updated successfully", id, status });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM appointments WHERE id = ?", [id]);
    res.json({ message: "ลบรายการนัดหมายสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถลบข้อมูลได้" });
  }
};
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { patientName, appointmentAt } = req.body;

    if (!patientName || !appointmentAt) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const formattedDate = new Date(appointmentAt).toISOString().slice(0, 19).replace('T', ' ');

    await pool.query(
      "UPDATE appointments SET patientName = ?, appointmentAt = ? WHERE id = ?",
      [patientName, formattedDate, Number(id)]
    );

    res.json({ message: "แก้ไขข้อมูลนัดหมายสำเร็จ" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "ไม่สามารถแก้ไขข้อมูลได้" });
  }
};