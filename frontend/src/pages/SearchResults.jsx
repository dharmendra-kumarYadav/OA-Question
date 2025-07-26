import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchQuestions, deleteQuestion } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-toastify';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const token = localStorage.getItem('token');

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      // Don't fetch if user is not authenticated
      if (!token) {
        setResults([]);
        setLoading(false);
        navigate('/login');
        return;
      }
      
      if (query) {
        try {
          const data = await searchQuestions(query);
          const sortedData = [...data].sort((a, b) => a.id - b.id);
          setResults(sortedData);
        } catch (error) {
          setResults([]);
        }
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, token, navigate]);

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion(questionToDelete.id);
        toast.success('Question deleted successfully!');
        setResults(results.filter(q => q.id !== questionToDelete.id));
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Results for: "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <div className="space-y-4">
          {results.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onDelete={() => handleDeleteClick(question)}
            />
          ))}
        </div>
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

export default SearchResults;
