package com.metepg.budget.dto;

public record UserResponseDTO(
        String username,
        MonthlyRecordResponseDTO income,
        boolean enabled
) {}
