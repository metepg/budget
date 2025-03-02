package com.metepg.budget.dto;

import com.metepg.budget.enums.MonthlyRecordEnum;
import com.metepg.budget.model.Category;
import com.metepg.budget.model.MonthlyRecord;

import java.time.LocalDateTime;

public record MonthlyRecordResponseDTO(
        Integer id,
        String username,
        String description,
        long amount,
        LocalDateTime recordedAt,
        MonthlyRecordEnum type,
        boolean recurring,
        Category category
) {
    public MonthlyRecordResponseDTO(MonthlyRecord monthlyRecord) {
        this(
                monthlyRecord.getId(),
                monthlyRecord.getUsername(),
                monthlyRecord.getDescription(),
                monthlyRecord.getAmount() / 100,
                monthlyRecord.getModifiedAt(),
                monthlyRecord.getType(),
                monthlyRecord.getRecurring(),
                monthlyRecord.getCategory()
        );
    }
}
