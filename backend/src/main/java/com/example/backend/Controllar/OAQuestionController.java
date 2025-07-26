package com.example.backend.Controllar;

import com.example.backend.Model.OAQuestionModel;
import com.example.backend.Repository.OAQuestionRepository;
import com.example.backend.Service.OAQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/questions")
public class OAQuestionController {

    @Autowired
    private OAQuestionService service;

    @Autowired
    private OAQuestionRepository repository;

    // Remove checkAdminAccess and verifyUserExists methods and their usages

    // ✅ Add Question (Admin / Head Admin only)
    @PostMapping
    public OAQuestionModel addQuestion(@RequestBody OAQuestionModel question) {
        // Debug authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("Add Question - User: {}, Authorities: {}", 
                auth.getName(), auth.getAuthorities());
        
        if (question.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID must be provided.");
        }
        if (question.getTitle() == null || question.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title must be provided.");
        }
        if (question.getFunctionName() == null || question.getFunctionName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Function name must be provided.");
        }
        if (question.getSolution() == null || question.getSolution().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solution must be provided.");
        }
        if (repository.existsById(question.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Question with ID " + question.getId() + " already exists.");
        }
        if (repository.existsByFunctionName(question.getFunctionName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Function name '" + question.getFunctionName() + "' already exists.");
        }
        
        log.info("Question added successfully by user: {}", auth.getName());
        return repository.save(question);
    }

    // ✅ View All Questions (Any user, even not logged in)
    @GetMapping
    public List<OAQuestionModel> getAllQuestions() {
        return service.getAllQuestions();
    }

    // ✅ View Specific Question (Any logged-in user)
    @GetMapping("/{id}")
    public ResponseEntity<OAQuestionModel> getQuestionById(@PathVariable long id) {
        return service.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Search Questions (Any logged-in user)
    @GetMapping("/search")
    public List<OAQuestionModel> search(@RequestParam String query) {
        return service.searchQuestions(query);
    }

    // ✅ Delete Question (Admin / Head Admin only)
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question with ID " + id + " does not exist.");
        }
        service.deleteQuestion(id);
    }

    // ✅ Update Solution (Admin / Head Admin only)
    @PutMapping("/{id}/solution")
    public OAQuestionModel updateSolution(@PathVariable long id, @RequestBody String newSolution) {
        return service.updateSolution(id, newSolution);
    }
}
