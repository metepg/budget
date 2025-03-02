package com.metepg.budget.service;

import com.metepg.budget.enums.MonthlyRecordEnum;
import com.metepg.budget.model.MonthlyBudget;
import com.metepg.budget.model.MonthlyRecord;
import com.metepg.budget.model.User;
import com.metepg.budget.repository.MonthlyBudgetRepository;
import com.metepg.budget.repository.MonthlyRecordRepository;
import com.metepg.budget.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final MonthlyBudgetRepository monthlyBudgetRepository;
    private final MonthlyRecordRepository monthlyRecordRepository;

    public BigDecimal getCurrentBudget(String budgetType) {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return BigDecimal.ZERO;
        }

        MonthlyBudget budget = getCurrentMonthlyBudget(user.getUsername());
        if (budget == null) {
            return BigDecimal.ZERO;
        }

        return switch (budgetType) {
            case "day" -> getDailyBudget(budget);
            case "week" -> {
                int daysInCurrentWeek = getDaysInCurrentWeek();
                yield getDailyBudget(budget).multiply(BigDecimal.valueOf(daysInCurrentWeek)).setScale(2, RoundingMode.HALF_UP);
            }
            case "month" -> calculateMonthlyAvailableBudget(budget);
            default -> BigDecimal.ZERO;
        };
    }


    public BigDecimal getDailyBudget(MonthlyBudget budget) {
        YearMonth currentMonth = YearMonth.now();
        int totalDaysInMonth = currentMonth.lengthOfMonth();

        // Monthly available budget
        BigDecimal monthlyAvailableBudget = calculateMonthlyAvailableBudget(budget);

        // Convert remaining budget from cents to euros
        BigDecimal remainingBudget = BigDecimal.valueOf(budget.getRemainingBudget())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        // Calculate daily budget with rollover from previous days
        return monthlyAvailableBudget.add(remainingBudget)
                .divide(BigDecimal.valueOf(totalDaysInMonth), 2, RoundingMode.HALF_UP);
    }

    private int getDaysInCurrentWeek() {
        LocalDate today = LocalDate.now();
        int totalDaysInMonth = YearMonth.now().lengthOfMonth();

        int weekStartDay = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).getDayOfMonth();
        int weekEndDay = Math.min(weekStartDay + 6, totalDaysInMonth);

        return weekEndDay - weekStartDay + 1;
    }

    private MonthlyBudget getCurrentMonthlyBudget(String username) {
        return monthlyBudgetRepository
                .getCurrentMonthlyBudget(username)
                .orElse(null);
    }

    private BigDecimal calculateMonthlyAvailableBudget(MonthlyBudget budget) {
        BigDecimal totalIncome = budget.getTotalIncome() != null
                ? BigDecimal.valueOf(budget.getTotalIncome()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal totalExpense = budget.getTotalExpense() != null
                ? BigDecimal.valueOf(budget.getTotalExpense()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return totalIncome.subtract(totalExpense);
    }

    @Transactional
    public void updateBudgetAfterTransaction(MonthlyRecord record) {
        YearMonth ym = YearMonth.from(record.getModifiedAt());
        LocalDate monthStart = ym.atDay(1);
        LocalDate monthEnd = ym.atEndOfMonth();

        // Get records based on the 'date' field, not modifiedAt.
        List<MonthlyRecord> records = monthlyRecordRepository
                .findAllByUsernameAndDateBetween(record.getUsername(), monthStart, monthEnd);

        long totalIncome = records.stream()
                .filter(r -> MonthlyRecordEnum.INCOME.equals(r.getType()))
                .mapToLong(MonthlyRecord::getAmount)
                .sum();

        long totalExpense = records.stream()
                .filter(r -> MonthlyRecordEnum.EXPENSE.equals(r.getType()))
                .mapToLong(MonthlyRecord::getAmount)
                .sum();

        MonthlyBudget budget = monthlyBudgetRepository
                .findByUsernameAndMonth(record.getUsername(), monthStart)
                .orElseGet(() -> {
                    MonthlyBudget newBudget = new MonthlyBudget();
                    newBudget.setUsername(record.getUsername());
                    newBudget.setMonth(monthStart);
                    newBudget.setRemainingBudget(0L);
                    // Initialize cumulativeSavings if needed.
                    return newBudget;
                });

        budget.setTotalIncome(totalIncome);
        budget.setTotalExpense(totalExpense);
        budget.setCumulativeSavings(totalIncome - totalExpense);

        monthlyBudgetRepository.save(budget);
    }

}