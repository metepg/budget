package com.metepg.budget.model;

import com.metepg.budget.enums.BillEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private LocalDate date = LocalDate.now();

    @NotNull
    @Size(min = 1, message = "Username cannot be empty")
    private String username;

    @NotNull
    @Enumerated(EnumType.STRING)
    private BillEnum type;

    @NotNull
    @Size(min = 1, message = "Description cannot be empty")
    private String description;

    @NotNull
    @Min(value = 1, message = "Amount must be greater than 0")
    private Integer amount;

    @NotNull
    @Column(nullable = false)
    private Boolean recurring = false;

    @NotNull
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime modifiedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

}
