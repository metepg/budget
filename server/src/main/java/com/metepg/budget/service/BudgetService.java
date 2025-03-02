package com.metepg.budget.service;

import com.metepg.budget.enums.MonthlyRecordEnum;
import com.metepg.budget.model.MonthlyRecord;
import com.metepg.budget.model.User;
import com.metepg.budget.model.MonthlyBudget;
import com.metepg.budget.repository.MonthlyBudgetRepository;
import com.metepg.budget.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final MonthlyBudgetRepository monthlyBudgetRepository;

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
        BigDecimal monthlyAvailableBudget = calculateMonthlyAvailableBudget(budget);
        return monthlyAvailableBudget.divide(BigDecimal.valueOf(totalDaysInMonth), 2, RoundingMode.HALF_UP);
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

    public void updateBudgetAfterTransaction(MonthlyRecord record) {
        LocalDate monthStart = record.getModifiedAt().toLocalDate().withDayOfMonth(1);

        MonthlyBudget budget = monthlyBudgetRepository
                .findByUsernameAndMonth(record.getUsername(), monthStart)
                .orElseGet(() -> {
                    MonthlyBudget newBudget = new MonthlyBudget();
                    newBudget.setUsername(record.getUsername());
                    newBudget.setMonth(monthStart);
                    newBudget.setTotalIncome(0L);
                    newBudget.setTotalExpense(0L);
                    newBudget.setCumulativeSavings(getPreviousCumulativeSavings(record.getUsername(), monthStart));
                    return monthlyBudgetRepository.save(newBudget);
                });

        if (MonthlyRecordEnum.INCOME.equals(record.getType())) {
            budget.setTotalIncome(budget.getTotalIncome() + record.getAmount());
        } else if (MonthlyRecordEnum.EXPENSE.equals(record.getType())) {
            budget.setTotalExpense(budget.getTotalExpense() + record.getAmount());
        }

        budget.setCumulativeSavings(
                budget.getCumulativeSavings() + budget.getTotalIncome() - budget.getTotalExpense()
        );

        monthlyBudgetRepository.save(budget);
    }

    private long getPreviousCumulativeSavings(String username, LocalDate currentMonth) {
        return monthlyBudgetRepository.findLatestBudgetBefore(username, currentMonth)
                .map(MonthlyBudget::getCumulativeSavings)
                .orElse(0L);
    }
}