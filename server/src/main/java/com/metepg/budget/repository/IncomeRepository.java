package com.metepg.budget.repository;

import com.metepg.budget.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Integer> {
    @Query("SELECT i FROM Income i WHERE i.username = :username ORDER BY i.createdAt DESC LIMIT 1")
    Optional<Income> findLatestByUsername(@Param("username") String username);
}
