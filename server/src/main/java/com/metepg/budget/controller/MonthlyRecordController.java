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
    public List<MonthlyRecordResponseDTO> getAllEntries() {
        return monthlyRecordService.findAllByUsername();
    }

    @GetMapping("/{id}")
    public MonthlyRecordResponseDTO getBill(@PathVariable Integer id) {
        return monthlyRecordService.getBill(id);
    }

    @GetMapping(value = "/recurring", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<MonthlyRecordResponseDTO> getAllRecurringEntries() {
        return monthlyRecordService.findAllByUsernameAndRecurringTrue();
    }

    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<MonthlyRecordResponseDTO> saveIncomes(@Valid @RequestBody List<MonthlyRecord> monthlyRecord) {
        return monthlyRecordService.saveIncomes(monthlyRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        this.monthlyRecordService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
