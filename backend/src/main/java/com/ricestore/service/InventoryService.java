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
            if (product.getPrice() > 0) {
                p.setPrice(product.getPrice());
            }
            if (product.getImage() != null && !product.getImage().isEmpty()) {
                p.setImage(product.getImage());
            }
            return productRepository.save(p);
        } else {
            return productRepository.save(product);
        }
    }

    // Removed uploadImage methods as we are now storing Base64 images directly in
    // DB

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}
