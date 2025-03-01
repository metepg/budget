package com.metepg.budget.service;

import com.metepg.budget.dto.MonthlyRecordResponseDTO;
import com.metepg.budget.model.MonthlyRecord;
import com.metepg.budget.repository.MonthlyRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MonthlyRecordService {

    private final MonthlyRecordRepository monthlyRecordRepository;

    public MonthlyRecordService(MonthlyRecordRepository monthlyRecordRepository) {
        this.monthlyRecordRepository = monthlyRecordRepository;
    }

    @Transactional
    public List<MonthlyRecordResponseDTO> saveIncomes(List<MonthlyRecord> moneyEntries) {
        // Convert amounts to cents before saving
        moneyEntries.forEach(monthlyRecord -> monthlyRecord.setAmount(monthlyRecord.getAmount() * 100));

        // Save all incomes
        List<MonthlyRecord> savedMoneyEntries = monthlyRecordRepository.saveAll(moneyEntries);

        // Convert saved incomes to DTOs and return
        return savedMoneyEntries.stream()
                .map(MonthlyRecordResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<MonthlyRecordResponseDTO> findAllByUsername(String username) {
        List<MonthlyRecord> monthlyRecords = monthlyRecordRepository.findAllByUsername(username);
        return monthlyRecords.stream()
                .map(MonthlyRecordResponseDTO::new)
                .collect(Collectors.toList());
    }

}
