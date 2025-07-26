import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // ✅ Import toast
import { addQuestion } from '../services/questionService';

function AddQuestion() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(Number(id))) {
      toast.error('ID must be a numeric value.');  // ✅ Show toast instead of alert
      return;
    }

    try {
      await addQuestion({
        id: Number(id),
        title,
        functionName,
        description,
        solution,
      });

//       toast.success('Question added successfully!');  // ✅ Show success toast
      navigate('/');  // ✅ Redirect to home
    } catch (error) {
      toast.error('Failed to add question.');
      console.error('Failed to add question:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Question</h2>

        <input
          type="number"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="text"
          placeholder="Function Name"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
          rows={4}
        ></textarea>

        <textarea
          placeholder="Solution (Write code here...)"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          required
          className="w-full p-2 mb-4 border font-mono bg-gray-50 rounded resize-y"
          rows={10}
        ></textarea>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Add Question
        </button>
      </form>
    </div>
  );
}

export default AddQuestion;
