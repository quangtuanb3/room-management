package com.example.booking.repository;

import com.example.booking.domain.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query(value = "SELECT r FROM Room r " +
            "LEFT JOIN r.roomCategories c ON r.id = c.room.id " +
            "LEFT JOIN r.type t ON r.type.id = t.id " +
            " where r.name like :search or " +
            "r.description like :search or " +
            "c.category.name like :search or " +
            " (r.price >= :priceStart AND r.price <= :priceEnd) or " +
            "r.type.name like :search GROUP BY r")
    Page<Room> searchEverything(String search, Long priceStart, Long priceEnd, Pageable pageable);
}
