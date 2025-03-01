package com.metepg.budget.controller;

import com.metepg.budget.dto.MonthlyRecordResponseDTO;
import com.metepg.budget.model.MonthlyRecord;
import com.metepg.budget.service.MonthlyRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class MonthlyRecordController {

    private final MonthlyRecordService monthlyRecordService;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<MonthlyRecordResponseDTO> getAllEntries(@RequestParam String username) {
        return monthlyRecordService.findAllByUsername(username);
    }

    @PostMapping
    public ResponseEntity<List<MonthlyRecordResponseDTO>> saveIncomes(@Valid @RequestBody List<MonthlyRecord> monthlyRecord) {
        List<MonthlyRecordResponseDTO> savedIncome = monthlyRecordService.saveIncomes(monthlyRecord);
        return ResponseEntity.ok(savedIncome);
    }
}
