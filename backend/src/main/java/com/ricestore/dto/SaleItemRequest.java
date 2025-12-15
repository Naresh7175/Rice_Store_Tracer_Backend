package com.ricestore.dto;

import lombok.Data;

@Data
public class SaleItemRequest {
    private Long productId;
    private double quantity;
    private String unit;
}
