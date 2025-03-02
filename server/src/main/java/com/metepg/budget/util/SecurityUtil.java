package com.metepg.budget.util;

import com.metepg.budget.model.User;
import com.metepg.budget.repository.UserRepositoryJPA;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private static UserRepositoryJPA userRepository;

    public SecurityUtil(UserRepositoryJPA userRepository) {
        SecurityUtil.userRepository = userRepository;
    }

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found in the database"));
    }

}