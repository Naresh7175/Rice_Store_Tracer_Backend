package com.ricestore.controller;

import com.ricestore.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/revenue")
    public Double getRevenue(@RequestParam String period) {
        return reportService.getRevenue(period);
    }
}
