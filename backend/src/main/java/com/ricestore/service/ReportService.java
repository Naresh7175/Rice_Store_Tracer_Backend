package com.ricestore.service;

import com.ricestore.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
public class ReportService {

    @Autowired
    private SaleRepository saleRepository;

    public Double getRevenue(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        LocalDateTime end = now;

        switch (period.toLowerCase()) {
            case "monthly":
                start = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);
                break;
            case "quarterly":
                // Simple quarter calculation
                int month = now.getMonthValue();
                int quarterStartMonth = month - (month - 1) % 3;
                start = now.withMonth(quarterStartMonth).with(TemporalAdjusters.firstDayOfMonth()).withHour(0)
                        .withMinute(0).withSecond(0);
                break;
            case "yearly":
                start = now.with(TemporalAdjusters.firstDayOfYear()).withHour(0).withMinute(0).withSecond(0);
                break;
            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }

        Double revenue = saleRepository.getRevenueBetween(start, end);
        return revenue != null ? revenue : 0.0;
    }
}
