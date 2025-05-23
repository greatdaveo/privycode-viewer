import { useState } from "react";

interface EditModalProps {
  onClose: () => void;
  onSave: (expiresIn: number, maxViews: number) => void;
  currentExpiresAt: string; // ISO string
  currentMaxViews: number;
}

export default function EditModal({
  onClose,
  onSave,
  currentExpiresAt,
  currentMaxViews,
}: EditModalProps) {
  // Convert expiresAt to number of days from today
  const initialDays = Math.max(
    Math.ceil(
      (new Date(currentExpiresAt).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    ),
    1
  );

  const [expiresIn, setExpiresIn] = useState<number>(initialDays);
  const [maxViews, setMaxViews] = useState<number>(currentMaxViews);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Viewer Link</h2>

        <input
          type="number"
          value={expiresIn}
          onChange={(e) => setExpiresIn(Number(e.target.value))}
          className="w-full mb-3 p-2 border rounded dark:bg-gray-800"
          placeholder="Expires in days"
        />

        <input
          type="number"
          value={maxViews}
          onChange={(e) => setMaxViews(Number(e.target.value))}
          className="w-full mb-4 p-2 border rounded dark:bg-gray-800"
          placeholder="Max views"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
          >
            Cancel
          </button>
          
          <button
            onClick={() => onSave(expiresIn, maxViews)}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
