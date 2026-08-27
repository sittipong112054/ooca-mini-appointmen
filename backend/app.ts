import express from "express";
import cors from "cors"; // เพิ่ม import สำหรับ CORS
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  updateAppointment,
} from "./src/appointmentController.js";

const app = express();

app.use(express.json());
app.use(cors()); // เพิ่ม CORS middleware เพื่อให้ frontend สามารถเรียก API ได้  
app.post("/appointments", createAppointment);
app.get("/appointments", getAppointments);
app.patch("/appointments/:id", updateAppointmentStatus);
app.delete("/appointments/:id", deleteAppointment); // เพิ่ม route สำหรับ
app.put("/appointments/:id", updateAppointment); // เพิ่ม route สำหรับแก้ไขข้อมูลผู้ป่วย/วันนัดหมาย

export default app;