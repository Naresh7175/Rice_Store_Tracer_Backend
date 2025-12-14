package com.ricestore;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbSetup {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "postgres";

        try (Connection conn = DriverManager.getConnection(url, user, password);
                Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE ricestore");
            System.out.println("Database 'ricestore' created successfully.");

        } catch (Exception e) {
            if (e.getMessage().contains("already exists")) {
                System.out.println("Database 'ricestore' already exists.");
            } else {
                e.printStackTrace();
            }
        }
    }
}
