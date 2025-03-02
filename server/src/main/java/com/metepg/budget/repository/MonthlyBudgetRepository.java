package com.metepg.budget.repository;

import com.metepg.budget.model.MonthlyBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, Integer> {

    @Query("""
                SELECT mb
                FROM MonthlyBudget mb
                WHERE mb.username = :username
                AND mb.month = :month
            """)
    Optional<MonthlyBudget> findByUsernameAndMonth(@Param("username") String username, @Param("month") LocalDate month);

    @Query("""
                SELECT mb
                FROM MonthlyBudget mb
                WHERE mb.username = :username
                AND mb.month <= CURRENT_DATE
                ORDER BY mb.month DESC
                LIMIT 1
            """)
    Optional<MonthlyBudget> getCurrentMonthlyBudget(@Param("username") String username);

    @Query("""
                SELECT mb FROM MonthlyBudget mb
                WHERE mb.username = :username AND mb.month < :currentMonth
                ORDER BY mb.month DESC
                LIMIT 1
            """)
    Optional<MonthlyBudget> findLatestBudgetBefore(@Param("username") String username, @Param("currentMonth") LocalDate currentMonth);

}
