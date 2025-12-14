package com.ricestore.service;

import com.ricestore.model.Product;
import com.ricestore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(Product product) {
        Optional<Product> existingProduct = productRepository.findByNameAndBrand(product.getName(), product.getBrand());
        if (existingProduct.isPresent()) {
            Product p = existingProduct.get();
            p.setQuantity(p.getQuantity() + product.getQuantity());
            // Update price if needed, or keep old? Usually new stock might have new price.
            // For now, let's update price to the new one if provided, or keep old if 0.
            if (product.getPrice() > 0) {
                p.setPrice(product.getPrice());
            }
            return productRepository.save(p);
        } else {
            return productRepository.save(product);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}
