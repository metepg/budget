package com.metepg.budget.dto;

public record UserResponseDTO(
        String username,
        IncomeResponseDTO income,
        boolean enabled
) {}
