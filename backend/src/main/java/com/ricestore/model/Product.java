package com.ricestore.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private double quantity; // Number of bags (can be decimal for kg logic)
    private double price; // Price per bag
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String image;
}
