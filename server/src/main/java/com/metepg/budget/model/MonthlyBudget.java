package com.metepg.budget.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;
@Entity
@Data
@Table(name = "monthly_budgets")
public class MonthlyBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String username;

    @Column(name = "month", nullable = false)
    private LocalDate month;

    @Column(name = "total_income", nullable = false)
    private Long totalIncome = 0L;

    @Column(name = "total_expense", nullable = false)
    private Long totalExpense = 0L;

    @Column(name = "cumulative_savings", nullable = false)
    private Long cumulativeSavings = 0L;

    @Column(name = "remaining_budget", nullable = false)
    private Long remainingBudget = 0L;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username", insertable = false, updatable = false)
    private User user;
}
