package com.metepg.budget.service;

import com.metepg.budget.dto.IncomeResponseDTO;
import com.metepg.budget.model.Income;
import com.metepg.budget.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    @Transactional
    public IncomeResponseDTO saveIncome(Income income) {
        // Save as cents
        income.setAmount(income.getAmount() * 100);
        Income savedIncome = incomeRepository.save(income);

        return new IncomeResponseDTO(savedIncome);
    }
}
