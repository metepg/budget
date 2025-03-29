package com.metepg.budget.dto;

import com.metepg.budget.enums.BillEnum;
import com.metepg.budget.model.Category;
import com.metepg.budget.model.Bill;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BillResponseDTO(
        Integer id,
        LocalDate date,
        String username,
        String description,
        long amount,
        LocalDateTime recordedAt,
        BillEnum type,
        boolean recurring,
        Category category
) {
    public BillResponseDTO(Bill bill) {
        this(
                bill.getId(),
                bill.getDate(),
                bill.getUsername(),
                bill.getDescription(),
                bill.getAmount() / 100,
                bill.getModifiedAt(),
                bill.getType(),
                bill.getRecurring(),
                bill.getCategory()
        );
    }
}
