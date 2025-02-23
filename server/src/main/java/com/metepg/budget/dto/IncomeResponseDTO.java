package com.metepg.budget.dto;

import com.metepg.budget.model.Income;

import java.time.LocalDateTime;

public record IncomeResponseDTO(
        Integer id,
        String username,
        long amount,
        LocalDateTime recordedAt
) {
    public IncomeResponseDTO(Income income) {
        this(
                income.getId(),
                income.getUsername(),
                income.getAmount() / 100,
                income.getCreatedAt()
        );
    }
}
