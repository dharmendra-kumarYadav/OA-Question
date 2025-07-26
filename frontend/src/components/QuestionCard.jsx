import { useState, useRef } from 'react';
import { updateSolution } from '../services/questionService';
import { toast } from 'react-toastify';

function QuestionCard({ question, onDelete }) {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isEditing, setIsEditing] = useState(false);
  const [solutionText, setSolutionText] = useState(question.solution);
  const [loading, setLoading] = useState(false);
  const dragging = useRef(false);
  const role = localStorage.getItem('role');

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    dragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await updateSolution(question.id, solutionText);
      setSolutionText(updated.solution);
      toast.success('Solution updated!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update solution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 mb-4 bg-gray-200 shadow hover:shadow-md transition duration-200 relative">
      {/* Edit and Delete Buttons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        {((role === 'ADMIN' || role === 'HEAD_ADMIN')) && (
          isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
          )
        )}
        {(role === 'ADMIN' || role === 'HEAD_ADMIN') && (
          <button
            onClick={() => onDelete(question.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        )}
      </div>
      {/* Resizable Layout */}
      <div className="flex gap-2 min-w-0 mt-8">
        <div
          className="p-2 min-w-0"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="text-xl font-bold text-black mb-2 break-words">
            {question.id}. {question.title}
          </h2>
          {question.description && (
            <p className="text-gray-600 mb-2 break-words">{question.description}</p>
          )}
        </div>
        <div
          className="cursor-col-resize w-1 bg-gray-400 hover:bg-gray-600"
          onMouseDown={handleMouseDown}
        ></div>
        <div
          className="bg-gray-100 rounded p-2 overflow-auto min-w-0"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <p className="text-sm font-medium text-gray-800 mb-1">Solution:</p>
          {isEditing ? (
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              className="w-full h-40 p-2 border rounded bg-white"
            ></textarea>
          ) : (
            <pre className="text-sm whitespace-pre-wrap break-words max-h-96 overflow-auto">
              <code>{solutionText}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
