package com.metepg.budget.controller;

import com.metepg.budget.model.Category;
import com.metepg.budget.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Category> findAll() {
        return categoryService.findAll();
    }

    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Category> saveCategories(@Valid @RequestBody List<Category> categories) {
        return categoryService.saveCategories(categories);
    }

}
