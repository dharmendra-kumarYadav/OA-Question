import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuestions, deleteQuestion } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-toastify';

function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchAllQuestions();
    } else {
      setLoading(false);
      // Redirect to login if not authenticated
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [token, navigate]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
          setQuestions([]);
          setLoading(false);
          navigate('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const fetchAllQuestions = async () => {
    try {
      const data = await getAllQuestions();
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setQuestions(sortedData);
    } catch (error) {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion(questionToDelete.id);
        setQuestions(questions.filter(q => q.id !== questionToDelete.id));
      } catch (error) {
        toast.error('Failed to delete question.');
      }
    }
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  // Don't render anything if redirecting to login
  if (!token) {
    return null;
  }

  return (
    <div className="p-3 bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">All Questions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        questions.map(q => (
          <QuestionCard
            key={q.id}
            question={q}
            onDelete={() => handleDeleteClick(q)}
          />
        ))
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message={`Are you sure you want to delete the question "${questionToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

export default Home;
