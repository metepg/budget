package com.metepg.budget.controller;

import com.metepg.budget.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @GetMapping(value = "/{budgetType}", produces = MediaType.APPLICATION_JSON_VALUE)
    public BigDecimal getCurrentBudget(@PathVariable String budgetType) {
        return budgetService.getCurrentBudget(budgetType);
    }

}
