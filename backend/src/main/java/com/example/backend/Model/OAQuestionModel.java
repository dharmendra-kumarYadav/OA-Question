package com.example.backend.Model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "questions")
public class OAQuestionModel {
    @Id
    @NotBlank(message = "Id is required")
    @Indexed(unique = true)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "FunctionName is required")
    @Indexed(unique = true)
    private String functionName;

    private String description;

    @NotBlank(message = "Solution is required")
    private String solution;

}

