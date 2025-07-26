package com.example.backend.Controllar;

import com.example.backend.Model.LoginModel;
import com.example.backend.Model.SignupModel;
import com.example.backend.Repository.SignupRepository;
import com.example.backend.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "*")
public class LoginControllar {

    @Autowired
    private SignupRepository signupRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginModel loginRequest) {

        SignupModel user = signupRepository.findById(loginRequest.getEmailId()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with this email does not exist.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password.");
        }

        // ✅ Generate JWT token after successful login
        String token = jwtUtil.generateToken(user.getEmailId());

        // ✅ Optionally, include role and token in response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        
        // Use minutes for short durations, hours for longer durations
        long expirationHours = jwtUtil.getExpirationHours();
        if (expirationHours > 0) {
            response.put("expiresInHours", expirationHours);
        } else {
            response.put("expiresInMinutes", jwtUtil.getExpirationMinutes());
        }
        response.put("message", "Login successful.");

        return ResponseEntity.ok(response);
    }
}
