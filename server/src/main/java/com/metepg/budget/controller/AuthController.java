package com.metepg.budget.controller;

import com.metepg.budget.model.User;
import com.metepg.budget.repository.UserRepositoryJPA;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepositoryJPA userRepository;

    public AuthController(UserRepositoryJPA userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Optional<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return Optional.empty();
        }
        return userRepository.findByUsername(userDetails.getUsername());
    }
}
