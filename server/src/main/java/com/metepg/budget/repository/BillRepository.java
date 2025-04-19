package com.metepg.budget.repository;

import com.metepg.budget.enums.BillEnum;
import com.metepg.budget.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("SELECT bill FROM Bill bill WHERE bill.username = :username ORDER BY bill.modifiedAt DESC LIMIT 1")
    Optional<Bill> findLatestByUsername(@Param("username") String username);

    List<Bill> findAllByUsername(String username);

    @Query("""
                SELECT bill FROM Bill bill
                WHERE bill.username = :username
                AND bill.recurring = true
            """)
    List<Bill> findAllByUsernameAndRecurringTrue(@Param("username") String username);

    @Query("""
                SELECT bill FROM Bill bill
                WHERE bill.username = :username
                AND bill.recurring = false
                AND EXTRACT(MONTH FROM bill.date) = :month
                ORDER BY bill.date DESC
            """)
    List<Bill> findAllByUsernameAndRecurringFalseAndMonth(
            @Param("username") String username,
            @Param("month") int month
    );

    @Query("""
                SELECT bill FROM Bill bill
                WHERE bill.username = :username
                AND bill.recurring = false
                ORDER BY bill.date DESC
            """)
    List<Bill> findAllByUsernameAndRecurringFalse(String username);

    List<Bill> findAllByUsernameAndDateBetween(String username, LocalDate startDate, LocalDate endDate);

    @Query("SELECT bill FROM Bill bill WHERE YEAR(bill.date) = :year AND bill.type = :type")
    List<Bill> findAllExpensesByYear(@Param("year") int year, @Param("type") BillEnum type);
}
