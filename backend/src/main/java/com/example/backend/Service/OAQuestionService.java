package com.example.backend.Service;

import com.example.backend.Model.OAQuestionModel;
import com.example.backend.Repository.OAQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OAQuestionService {

    @Autowired
    private OAQuestionRepository repository;

    public OAQuestionModel addQuestion(OAQuestionModel question) {
        return repository.save(question);  // Save as-is (ID provided manually)
    }

    public List<OAQuestionModel> getAllQuestions() {
        return repository.findAll();
    }

    public Optional<OAQuestionModel> getQuestionById(long id) {
        return repository.findById(id);
    }

    public List<OAQuestionModel> searchQuestions(String query) {
        return repository.findByTitleContainingIgnoreCaseOrFunctionNameContainingIgnoreCase(query, query);
    }

    public void deleteQuestion(long id) {
        repository.deleteById(id);
    }
    public OAQuestionModel updateSolution(long id, String newSolution) {
        OAQuestionModel question = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + id));

        question.setSolution(newSolution);
        return repository.save(question);
    }

}
