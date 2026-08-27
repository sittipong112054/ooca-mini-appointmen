"use client";

import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  patientName: string;
  appointmentAt: string;
  status?: string;
}

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // State สำหรับฟอร์มสร้างใหม่
  const [patientName, setPatientName] = useState("");
  const [appointmentAt, setAppointmentAt] = useState("");

  // State สำหรับ Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State สำหรับ Modal แก้ไขข้อมูล
  const [editingItem, setEditingItem] = useState<Appointment | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  const fetchAppointments = () => {
    fetch("https://my-appointment-api.onrender.com/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !appointmentAt) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    try {
      const res = await fetch("https://my-appointment-api.onrender.com/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName, appointmentAt }),
      });

      if (res.ok) {
        setPatientName("");
        setAppointmentAt("");
        fetchAppointments();
      } else {
        const errData = await res.json();
        alert(errData.error || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`https://my-appointment-api.onrender.com/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบรายการนัดหมายนี้ใช่หรือไม่?")) return;

    try {
      const res = await fetch(`https://my-appointment-api.onrender.com/appointments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleOpenEdit = (item: Appointment) => {
    setEditingItem(item);
    setEditName(item.patientName);
    const formattedDate = new Date(item.appointmentAt).toISOString().slice(0, 16);
    setEditDate(formattedDate);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`https://my-appointment-api.onrender.com/appointments/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName: editName, appointmentAt: editDate }),
      });

      if (res.ok) {
        setEditingItem(null);
        fetchAppointments();
      } else {
        alert("ไม่สามารถบันทึกการแก้ไขได้");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // คณะคำนวณสถิติ
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => !a.status || a.status === "pending").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  // Filter Logic
  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch = item.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (item.status || "pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              ระบบจัดการใบนัดหมาย
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Medical Appointment Management Dashboard
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">นัดหมายทั้งหมด</span>
            <div className="text-2xl font-bold text-white mt-1">{totalCount} รายการ</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/60 border border-yellow-900/30 backdrop-blur-sm">
            <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">รอดำเนินการ</span>
            <div className="text-2xl font-bold text-yellow-300 mt-1">{pendingCount} รายการ</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/60 border border-emerald-900/30 backdrop-blur-sm">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">เสร็จสิ้นแล้ว</span>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{completedCount} รายการ</div>
          </div>
        </div>

        {/* Form Create */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-xl space-y-5">
          <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <span>📝</span> เพิ่มรายการนัดหมายใหม่
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">ชื่อ-นามสกุล ผู้ป่วย</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 rounded-lg bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="เช่น นายสมชาย ใจดี"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">วัน-เวลานัดหมาย</label>
              <input
                type="datetime-local"
                className="w-full px-3.5 py-2.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-blue-500 transition text-sm [color-scheme:dark] cursor-pointer"
                value={appointmentAt}
                onChange={(e) => setAppointmentAt(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-lg transition shadow-lg shadow-blue-500/10 active:scale-[0.99]"
          >
            + บันทึกการนัดหมาย
          </button>
        </form>

        {/* Filter Section */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1">
            <input
              type="text"
              placeholder="🔍 ค้นหาตามชื่อผู้ป่วย..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-48 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500 transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">🟡 รอดำเนินการ</option>
            <option value="completed">🟢 เสร็จสิ้น</option>
            <option value="cancelled">🔴 ยกเลิก</option>
          </select>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-semibold text-gray-200">รายการนัดหมาย</h2>
            <span className="text-xs text-gray-400 bg-gray-900 px-2.5 py-1 rounded-full border border-gray-800">
              พบ {filteredAppointments.length} รายการ
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl text-gray-500">
              ไม่พบรายการนัดหมายที่ตรงเงื่อนไข
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gray-900/70 border border-gray-800/80 hover:border-gray-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-100 text-base">{item.patientName}</h3>
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                          item.status === "completed"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                            : item.status === "cancelled"
                            ? "bg-rose-950/60 text-rose-400 border-rose-800/50"
                            : "bg-amber-950/60 text-amber-400 border-amber-800/50"
                        }`}
                      >
                        {item.status === "completed"
                          ? "✓ เสร็จสิ้น"
                          : item.status === "cancelled"
                          ? "✕ ยกเลิก"
                          : "◷ รอดำเนินการ"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span>📅</span> {new Date(item.appointmentAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {/* ปุ่มแก้ไข */}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 hover:shadow-md cursor-pointer active:scale-95 rounded-lg transition-all"
                        >
                          ✏️ แก้ไข
                        </button>

                        {/* แสดงปุ่ม "เสร็จสิ้น" เฉพาะเมื่อสถานะยังไม่เสร็จสิ้น */}
                        {item.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, "completed")}
                            className="px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-800/60 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/40 cursor-pointer active:scale-95 rounded-lg transition-all"
                          >
                            ✓ เสร็จสิ้น
                          </button>
                        )}

                        {/* แสดงปุ่ม "ยกเลิก" เฉพาะเมื่อสถานะยังไม่ยกเลิก */}
                        {item.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, "cancelled")}
                            className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-white bg-amber-950/50 hover:bg-amber-600 border border-amber-800/60 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-900/40 cursor-pointer active:scale-95 rounded-lg transition-all"
                          >
                            ✕ ยกเลิก
                          </button>
                        )}

                        {/* ปุ่มลบ */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-white bg-rose-950/50 hover:bg-rose-600 border border-rose-800/60 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-900/40 cursor-pointer active:scale-95 rounded-lg transition-all"
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-100">✏️ แก้ไขข้อมูลการนัดหมาย</h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ชื่อ-นามสกุล ผู้ป่วย</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">วัน-เวลานัดหมาย</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-200 text-white text-sm focus:outline-none focus:border-blue-500"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 rounded-lg transition"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-md shadow-blue-500/20"
                  >
                    บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}