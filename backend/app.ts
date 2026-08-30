import express from "express";
import cors from "cors";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  updateAppointment,
} from "./src/appointmentController.js";

const app = express();

app.use(express.json());
app.use(cors());
app.post("/appointments", createAppointment);
app.get("/appointments", getAppointments);
app.patch("/appointments/:id", updateAppointmentStatus);
app.delete("/appointments/:id", deleteAppointment);
app.put("/appointments/:id", updateAppointment); 

export default app;