package com.metepg.budget.controller;

import com.metepg.budget.dto.BillResponseDTO;
import com.metepg.budget.model.Bill;
import com.metepg.budget.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> getAllEntries() {
        return billService.findAllByUsername();
    }

    @GetMapping("/{id}")
    public BillResponseDTO getBill(@PathVariable Integer id) {
        return billService.getBill(id);
    }

    @GetMapping(value = "/recurring", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> getAllRecurringEntries() {
        return billService.findAllByUsernameAndRecurringTrue();
    }

    @GetMapping(value = "/not-recurring", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> getAllNotRecurringEntries(@RequestParam(value = "month", required = false) Integer month) {
        return billService.findAllByUsernameAndRecurringFalse(month);
    }

    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> saveIncomes(@Valid @RequestBody List<Bill> bill) {
        return billService.saveIncomes(bill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        this.billService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
