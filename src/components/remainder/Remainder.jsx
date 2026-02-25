import { useState } from "react";
import axios from "axios";
import { requestNotificationPermission } from "@/notification";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Bell, BellOff, Clock } from "lucide-react";

export default function SetReminderModal({ open, onClose }) {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetReminder = async () => {
    if (!time) {
      setMessage({ text: "Please select a time ⏰", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "Requesting notification permission...", type: "info" });

      const token = await requestNotificationPermission();

      if (!token) {
        setMessage({ text: "Notification permission denied ❌", type: "error" });
        return;
      }

      const jwt = localStorage.getItem("token");

      // Save FCM token to profile
      await axios.post(
        "https://home-workout-planner.onrender.com/api/save-token",
        { token },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      setMessage({ text: "Scheduling daily reminder...", type: "info" });

      // Set the daily reminder with just the time (HH:MM)
      // Convert local time input "HH:MM" to UTC "HH:MM"
      const [hours, minutes] = time.split(":");
      const localDate = new Date();
      localDate.setHours(Number(hours), Number(minutes), 0, 0);

      const utcHours = String(localDate.getUTCHours()).padStart(2, "0");
      const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, "0");
      const utcTime = `${utcHours}:${utcMinutes}`;  // send this to backend

      // ... rest of your code, use utcTime instead of time
      await axios.post(
        "https://home-workout-planner.onrender.com/api/set-reminder",
        { remindTime: utcTime },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      setMessage({ text: "Daily workout reminder set! 💪", type: "success" });
      setTimeout(onClose, 1500);

    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.error || "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const messageColors = {
    error: "text-red-400",
    success: "text-lime-400",
    info: "text-zinc-400",
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-sm p-0 gap-0"
        aria-describedby={undefined}>

        {/* Header */}
        <DialogHeader className="p-5 border-b border-zinc-800">
          <DialogTitle className="text-white font-black flex items-center gap-2">
            <Bell className="w-4 h-4 text-lime-400" />
            Daily Workout Reminder
          </DialogTitle>
          <p className="text-xs text-zinc-500 mt-0.5">
            You'll get a notification every day at this time
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">

          {/* Time picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Reminder Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3
                         text-zinc-100 focus:outline-none focus:border-lime-400
                         transition-colors scheme:dark"
            />
          </div>

          {/* Status message */}
          {message.text && (
            <p className={`text-xs text-center ${messageColors[message.type]}`}>
              {message.text}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetReminder}
            disabled={loading || !time}
            className="flex-1 bg-lime-400 hover:bg-lime-300 text-zinc-900 font-black disabled:opacity-50"
          >
            {loading ? "Saving..." : "Set Reminder →"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}