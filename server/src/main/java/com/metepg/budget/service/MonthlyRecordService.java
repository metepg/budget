package com.metepg.budget.service;

import com.metepg.budget.dto.MonthlyRecordResponseDTO;
import com.metepg.budget.model.MonthlyRecord;
import com.metepg.budget.model.User;
import com.metepg.budget.repository.MonthlyRecordRepository;
import com.metepg.budget.util.SecurityUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonthlyRecordService {

    private final MonthlyRecordRepository monthlyRecordRepository;
    private final BudgetService budgetService;

    public List<MonthlyRecordResponseDTO> saveIncomes(List<MonthlyRecord> moneyEntries) {
        moneyEntries.forEach(record -> record.setAmount(record.getAmount() * 100));

        List<MonthlyRecord> savedRecords = monthlyRecordRepository.saveAll(moneyEntries);

        // Delegate budget updates to the BudgetService
        savedRecords.forEach(budgetService::updateBudgetAfterTransaction);

        return savedRecords.stream()
                .map(MonthlyRecordResponseDTO::new)
                .collect(Collectors.toList());
    }

    public MonthlyRecordResponseDTO getBill(Integer id) {
        MonthlyRecord bill = monthlyRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bill not found with id: " + id));
        return new MonthlyRecordResponseDTO(bill);
    }

    public List<MonthlyRecordResponseDTO> findAllByUsername() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        List<MonthlyRecord> monthlyRecords = monthlyRecordRepository.findAllByUsername(user.getUsername());
        return monthlyRecords.stream()
                .map(MonthlyRecordResponseDTO::new)
                .collect(Collectors.toList());
    }

    public void deleteById(Integer id) {
        this.monthlyRecordRepository.deleteById(id);
    }

    public List<MonthlyRecordResponseDTO> findAllByUsernameAndRecurringTrue() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        return this.monthlyRecordRepository.findAllByUsernameAndRecurringTrue(user.getUsername())
                .stream()
                .map(MonthlyRecordResponseDTO::new)
                .collect(Collectors.toList());
    }

}
