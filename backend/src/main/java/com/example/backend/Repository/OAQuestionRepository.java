package com.example.backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.Model.OAQuestionModel;
import java.util.List;

public interface OAQuestionRepository extends MongoRepository<OAQuestionModel, Long> {

    List<OAQuestionModel> findByTitleContainingIgnoreCaseOrFunctionNameContainingIgnoreCase(String title, String functionName);

    boolean existsByFunctionName(String functionName);
}
