package com.ricestore.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Sale sale;

    @ManyToOne
    private Product product;

    private double quantity;
    private double priceAtSale;

    // "BAG" or "KG"
    private String unit;
}
