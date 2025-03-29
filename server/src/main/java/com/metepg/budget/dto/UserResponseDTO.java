package com.metepg.budget.dto;

public record UserResponseDTO(
        String username,
        BillResponseDTO income,
        boolean enabled
) {}
