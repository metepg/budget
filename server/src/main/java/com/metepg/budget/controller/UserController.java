package com.metepg.budget.controller;

import com.metepg.budget.dto.UserResponseDTO;
import com.metepg.budget.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/current")
    public boolean getCurrentUser() {
        return true;
    }

    @GetMapping("/me")
    public Optional<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getCurrentUser(userDetails);
    }

}
