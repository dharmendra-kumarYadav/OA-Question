package com.example.backend.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Data
@Document(collection = "signup")
public class SignupModel {

    @Id
    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String emailId;

    @NotBlank(message = "Full name is required")
    @Size(min = 3, message = "Full name must be at least 3 characters long")
    private String fullName;

    @NotBlank(message = "Mobile Number is required")
    @Pattern(regexp = "^[0-9]+$", message = "Mobile number must contain digits only")
    @Size(min = 10, max = 10, message = "Mobile number must be exactly 10 characters long")
    private String mobileNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Confirm Password is required")
    @Size(min = 8, message = "Confirm Password must be at least 8 characters")
    private String confirmPassword;

    @NotNull(message = "DOB is required")
    @PastOrPresent(message = "DOB cannot be in the future")
    private LocalDate dob;

    private String role ;
}
