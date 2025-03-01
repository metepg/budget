package com.metepg.budget.model;

import com.metepg.budget.enums.MonthlyRecordEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Table(name = "monthly_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(min = 1, message = "Username cannot be empty")
    private String username;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MonthlyRecordEnum type;

    @NotNull
    @Size(min = 1, message = "Description cannot be empty")
    private String description;

    @NotNull
    @Min(value = 1, message = "Amount must be greater than 0")
    private Long amount;

    @NotNull
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime modifiedAt = LocalDateTime.now();
}
