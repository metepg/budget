package com.metepg.budget.controller;

import com.metepg.budget.dto.IncomeResponseDTO;
import com.metepg.budget.model.Income;
import com.metepg.budget.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeResponseDTO> saveIncome(@Valid @RequestBody Income income) {
        IncomeResponseDTO savedIncome = incomeService.saveIncome(income);
        return ResponseEntity.ok(savedIncome);
    }
}
