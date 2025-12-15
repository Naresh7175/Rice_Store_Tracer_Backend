package com.ricestore.repository;

import com.ricestore.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findBySaleDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(s.totalAmount - s.discount) FROM Sale s WHERE s.saleDate BETWEEN :start AND :end")
    Double getRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(si.quantity) FROM SaleItem si WHERE si.sale.saleDate BETWEEN :start AND :end AND si.unit IS NULL OR si.unit = 'BAG'")
    Double getBagsSoldBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Note: This logic assumes if unit is KG, it doesn't count towards "Bags"
    // metric directly unless converted.
    // The requirement says "how many bags were sold".
    // If we want to include converted KGs as partial bags, we can sum everything
    // converted.
    // However, usually "Bags sold" implies physical bags.
    // Let's stick to total raw quantity if unit is BAG or null (legacy).

    @Query("SELECT SUM(s.balance) FROM Sale s")
    Double getTotalPendingMoney();
}
