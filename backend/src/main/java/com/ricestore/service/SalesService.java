package com.ricestore.service;

import com.ricestore.dto.SaleItemRequest;
import com.ricestore.dto.SaleRequest;
import com.ricestore.model.*;
import com.ricestore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SalesService {

    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public Sale createSale(SaleRequest request) {
        Sale sale = new Sale();
        sale.setSaleDate(LocalDateTime.now());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        sale.setCustomer(customer);

        List<SaleItem> saleItems = new ArrayList<>();
        double totalAmount = 0;

        for (SaleItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient inventory for product: " + product.getName());
            }

            double quantityToDeduct = itemRequest.getQuantity();
            double priceForThisItem = product.getPrice(); // Default to Bag price

            if ("KG".equalsIgnoreCase(itemRequest.getUnit())) {
                // 1 Bag = 26 KG
                // Deduct in terms of bags
                quantityToDeduct = itemRequest.getQuantity() / 26.0;

                // Price per KG = Price per Bag / 26
                priceForThisItem = product.getPrice() / 26.0;
            }

            // Check inventory again with converted quantity if needed, or just rely on the
            // deduct logic
            if (product.getQuantity() < quantityToDeduct) {
                throw new RuntimeException("Insufficient inventory for product: " + product.getName());
            }

            // Deduct inventory
            product.setQuantity(product.getQuantity() - quantityToDeduct);
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity()); // Store the requested quantity (e.g., 5 KG)
            saleItem.setUnit(itemRequest.getUnit());
            // Store the effective price for the unit sold. If sold in KG, store price per
            // KG.
            saleItem.setPriceAtSale(priceForThisItem);
            saleItem.setSale(sale);

            saleItems.add(saleItem);
            // Total amount logic: quantity * price_per_unit
            totalAmount += (priceForThisItem * itemRequest.getQuantity());
        }

        sale.setItems(saleItems);
        sale.setTotalAmount(totalAmount);
        sale.setDiscount(request.getDiscount());

        double finalAmount = totalAmount - request.getDiscount();
        sale.setPaidAmount(request.getPaidAmount());
        sale.setBalance(finalAmount - request.getPaidAmount());

        // Update customer debt
        if (sale.getBalance() > 0) {
            customer.setTotalDebt(customer.getTotalDebt() + sale.getBalance());
            customerRepository.save(customer);
        }

        return saleRepository.save(sale);
    }
}
