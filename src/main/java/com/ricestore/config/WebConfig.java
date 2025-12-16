package com.ricestore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the local uploads directory
        // "file:uploads/" means the uploads folder in the project root (where jar runs)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
