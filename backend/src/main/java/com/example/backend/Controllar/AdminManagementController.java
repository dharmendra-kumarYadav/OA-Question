package com.example.backend.Controllar;

import com.example.backend.Model.SignupModel;
import com.example.backend.Repository.SignupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminManagementController {

    @Autowired
    private SignupRepository signupRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    /**
     * Only HEAD_ADMIN can add a new admin.
     */
    @PostMapping("/add-admin")
    public ResponseEntity<String> addAdmin(@RequestBody SignupModel admin) {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Not authenticated");
        }
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (!"ROLE_HEAD_ADMIN".equals(role)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Only HEAD_ADMIN can add admins.");
        }
        if (signupRepository.existsById(admin.getEmailId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Admin with email " + admin.getEmailId() + " already exists.");
        }
        if (admin.getPassword() == null || admin.getPassword().length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters.");
        }
        // Hash password
        String hashedPassword = passwordEncoder.encode(admin.getPassword());
        admin.setPassword(hashedPassword);
        admin.setConfirmPassword(hashedPassword);
        admin.setRole("ADMIN");  // Automatically assign ADMIN role
        signupRepository.save(admin);
        return ResponseEntity.ok("Admin added successfully.");
    }
}
