package com.ricestore.dto;

import lombok.Data;
import java.util.List;

@Data
public class SaleRequest {
    private Long customerId;
    private List<SaleItemRequest> items;
    private double discount;
    private double paidAmount;
}
