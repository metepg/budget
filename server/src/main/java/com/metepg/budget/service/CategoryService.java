package com.metepg.budget.service;

import com.metepg.budget.dto.UserResponseDTO;
import com.metepg.budget.model.Category;
import com.metepg.budget.repository.CategoryRepositoryJPA;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final UserService userService;
    private final CategoryRepositoryJPA categoryRepositoryJPA;

    public List<Category> saveCategories(List<Category> categories) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails userDetails)) {
            throw new IllegalStateException("User not authenticated");
        }

        Optional<UserResponseDTO> userOpt = userService.getCurrentUser(userDetails);
        UserResponseDTO currentUser = userOpt.orElseThrow(() -> new IllegalStateException("User not found"));
        categories.forEach(category -> category.setUsername(currentUser.username()));

        return categoryRepositoryJPA.saveAll(categories);
    }

    public List<Category> findAll() {
        return categoryRepositoryJPA.findAll();
    }

}
