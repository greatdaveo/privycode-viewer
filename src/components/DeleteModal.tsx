import NavBar from "./NavBar";

interface DeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ onCancel, onConfirm }: DeleteModalProps) {
  return (
    <>
      <NavBar />

      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md text-center">
          <p className="mb-4 text-lg font-semibold">
            Are you sure you want to delete this viewer link?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
            >
              No
            </button>
            
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
