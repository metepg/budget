package com.metepg.budget.repository;

import com.metepg.budget.model.MonthlyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MonthlyRecordRepository extends JpaRepository<MonthlyRecord, Integer> {
    @Query("SELECT i FROM MonthlyRecord i WHERE i.username = :username ORDER BY i.modifiedAt DESC LIMIT 1")
    Optional<MonthlyRecord> findLatestByUsername(@Param("username") String username);

    List<MonthlyRecord> findAllByUsername(String username);
}
