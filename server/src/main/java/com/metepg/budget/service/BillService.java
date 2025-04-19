package com.metepg.budget.service;

import com.metepg.budget.dto.BillResponseDTO;
import com.metepg.budget.enums.BillEnum;
import com.metepg.budget.model.Bill;
import com.metepg.budget.model.User;
import com.metepg.budget.repository.BillRepository;
import com.metepg.budget.util.SecurityUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final BudgetService budgetService;

    public List<BillResponseDTO> saveIncomes(List<Bill> moneyEntries) {
        moneyEntries.forEach(record -> record.setAmount(record.getAmount() * 100));

        List<Bill> savedRecords = billRepository.saveAll(moneyEntries);

        // Delegate budget updates to the BudgetService
        savedRecords.forEach(budgetService::updateBudgetAfterTransaction);

        return savedRecords.stream()
                .map(BillResponseDTO::new)
                .collect(Collectors.toList());
    }

    public BillResponseDTO findBillById(Integer id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bill not found with id: " + id));
        return new BillResponseDTO(bill);
    }

    public List<BillResponseDTO> findAllByUsername() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        List<Bill> bills = billRepository.findAllByUsername(user.getUsername());
        return bills.stream()
                .map(BillResponseDTO::new)
                .collect(Collectors.toList());
    }

    public void deleteById(Integer id) {
        this.billRepository.deleteById(id);
    }

    public List<BillResponseDTO> findAllByUsernameAndRecurringTrue() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        return this.billRepository.findAllByUsernameAndRecurringTrue(user.getUsername())
                .stream()
                .map(BillResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<BillResponseDTO> findAllByUsernameAndRecurringFalse(Integer month) {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return List.of();
        }

        List<Bill> bills;
        if (month == 99) {
            bills = this.billRepository.findAllByUsernameAndRecurringFalse(user.getUsername());
        } else {
            bills = this.billRepository.findAllByUsernameAndRecurringFalseAndMonth(user.getUsername(), month);
        }

        return bills.stream()
                .map(BillResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<BillResponseDTO> findAllExpensesByYear(Integer year) {
        return this.billRepository.findAllExpensesByYear(year, BillEnum.EXPENSE)
                .stream()
                .map(BillResponseDTO::new)
                .collect(Collectors.toList());}

}
