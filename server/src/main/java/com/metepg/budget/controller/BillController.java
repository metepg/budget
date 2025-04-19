package com.metepg.budget.controller;

import com.metepg.budget.dto.BillResponseDTO;
import com.metepg.budget.model.Bill;
import com.metepg.budget.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger log = LoggerFactory.getLogger(BillController.class);

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> findAllByUsername() {
        log.info("Find all bills by username.");
        return billService.findAllByUsername();
    }

    @GetMapping("/{id}")
    public BillResponseDTO findBillById(@PathVariable Integer id) {
        return billService.findBillById(id);
    }

    @GetMapping(params = "year")
    public List<BillResponseDTO> findAllExpensesByYear(@RequestParam Integer year) {
        return billService.findAllExpensesByYear(year);
    }

    @GetMapping(value = "/recurring", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> findAllByUsernameAndRecurringTrue() {
        return billService.findAllByUsernameAndRecurringTrue();
    }

    @GetMapping(value = "/not-recurring", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BillResponseDTO> findAllByUsernameAndRecurringFalse(@RequestParam(value = "month", required = false) Integer month) {
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
