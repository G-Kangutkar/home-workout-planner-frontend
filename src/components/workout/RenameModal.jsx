
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Input }  from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
  
export default function RenameModal({ open, currentName, onClose, onSave }) {
  const [name, setName]     = useState(currentName);
  const [saving, setSaving] = useState(false);

  // Handle save button click
  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave(name.trim()); // parent handles the API call
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-sm">

        <DialogHeader>
          <DialogTitle className="text-white font-black">Rename Plan</DialogTitle>
        </DialogHeader>

        {/* Text input — pressing Enter also saves */}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="My Workout Plan"
          className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-lime-400"
          autoFocus
        />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}