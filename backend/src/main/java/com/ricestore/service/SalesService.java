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

            // Deduct inventory
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity());
            saleItem.setPriceAtSale(product.getPrice());
            saleItem.setSale(sale);

            saleItems.add(saleItem);
            totalAmount += (product.getPrice() * itemRequest.getQuantity());
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
