package com.example.backend.Controllar;

import com.example.backend.Model.SignupModel;
import com.example.backend.Repository.SignupRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/signup")
public class SignupControllar {

    @Autowired
    private SignupRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;   // ✅ Inject PasswordEncoder

    // ✅ Register New User (Role Automatically as USER)
    @PostMapping
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupModel user) {

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Password and Confirm Password do not match.");
        }

        if (repository.existsById(user.getEmailId())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Error: User with email " + user.getEmailId() + " already exists.");
        }

        // 🔒 Hash passwords before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setConfirmPassword(hashedPassword);  // Optional or remove field after signup

        user.setRole("USER");
        repository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Signup successful for " + user.getEmailId());
    }

    // ✅ View All Registered Users (Only ADMIN and HEAD_ADMIN)
    @GetMapping
    public ResponseEntity<List<SignupModel>> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities().isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_HEAD_ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<SignupModel> users = repository.findAll();
        return ResponseEntity.ok(users);
    }

    // ✅ View Specific User
    @GetMapping("/{emailId}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String emailId) {
        Optional<SignupModel> user = repository.findById(emailId);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Error: User with email " + emailId + " not found.");
        }
    }

    // ✅ Delete Specific User (Optional Restriction)
    @DeleteMapping("/{emailId}")
    public ResponseEntity<?> deleteUser(@PathVariable String emailId) {
        if (!repository.existsById(emailId)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Error: User with email " + emailId + " not found.");
        }

        repository.deleteById(emailId);

        return ResponseEntity.ok("User with email " + emailId + " has been deleted.");
    }
    // Remove the whoami endpoint
    //Temperary
    // @GetMapping("/whoami")
    // public String whoAmI() {
    //     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    //     if (auth != null && auth.isAuthenticated()) {
    //         return "You are logged in as: " + auth.getName() + ", Role: " + auth.getAuthorities();
    //     } else {
    //         return "No user is logged in.";
    //     }
    // }

    // Debug endpoint to check user roles
    @GetMapping("/debug/roles")
    public ResponseEntity<?> debugRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String email = auth.getName();
            SignupModel user = repository.findById(email).orElse(null);
            
            return ResponseEntity.ok(Map.of(
                "email", email,
                "springAuthorities", auth.getAuthorities().toString(),
                "databaseRole", user != null ? user.getRole() : "NOT_FOUND",
                "springRole", user != null ? "ROLE_" + user.getRole() : "NOT_FOUND"
            ));
        } else {
            return ResponseEntity.ok(Map.of("message", "No user is logged in."));
        }
    }
}
