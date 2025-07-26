import api from './api';
import { toast } from 'react-toastify';

const API_URL = '/questions';

// ✅ Get All Questions from DB
export const getAllQuestions = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch questions.');
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// ✅ Add New Question to DB
export const addQuestion = async (question) => {
  try {
    console.log('Adding question:', question);
    console.log('Token:', localStorage.getItem('token'));
    console.log('Role:', localStorage.getItem('role'));
    
    const response = await api.post(API_URL, question);
    toast.success('Question added successfully!');
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error);
    console.error('Error response:', error.response);
    
    if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to add questions.');
    } else if (error.response?.status === 401) {
      toast.error('Authentication failed. Please login again.');
    } else if (error.response?.status === 409) {
      // Handle conflict errors (duplicate ID or function name)
      const errorMessage = error.response.data?.error || error.response.data || 'Question with this ID or function name already exists.';
      toast.error(errorMessage);
    } else if (error.response?.status === 400) {
      const errorMessage = error.response.data?.error || error.response.data || 'Invalid question data.';
      toast.error(errorMessage);
    } else {
      toast.error('Failed to add question.');
    }
    throw error;
  }
};

// ✅ Delete Question by ID (optional)
export const deleteQuestion = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
    toast.success('Question deleted successfully!');
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export const searchQuestions = async (keyword) => {
  try {
    const response = await api.get(`${API_URL}/search?query=${encodeURIComponent(keyword)}`);
    return response.data;
  } catch (error) {
    toast.error('Failed to search questions.');
    console.error('Error searching questions:', error);
    throw error;
  }
};

export const updateQuestion = async (question) => {
  try {
    const response = await api.put(`${API_URL}/${question.id}`, question);
    return response.data;
  } catch (error) {
    toast.error('Failed to update question.');
    throw error;
  }
};

export const updateSolution = async (id, newSolution) => {
  try {
    const response = await api.put(`/questions/${id}/solution`, newSolution, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  } catch (error) {
    toast.error('Failed to update solution.');
    throw error;
  }
};
