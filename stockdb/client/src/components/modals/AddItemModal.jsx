import AddItemForm from '../forms/AddItemForm';

export default function AddItemModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {/* Reuse your existing AddItemForm, but close modal when a new item is added */}
        <AddItemForm
          onAdd={async (data) => {
            await onAdd(data);
            onClose();
          }}
        />
      </div>
    </div>
  );
}