package com.example.backend.Security;

import com.example.backend.Model.SignupModel;
import com.example.backend.Repository.SignupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SignupRepository signupRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        SignupModel user = signupRepository.findByEmailId(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        return User.builder()
                .username(user.getEmailId())
                .password(user.getPassword())   // hashed password
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())))  // ✅ Proper authority
                .build();
    }
}
