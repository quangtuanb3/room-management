package com.example.booking.repository;

import com.example.booking.domain.Room;
import com.example.booking.domain.RoomCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface RoomCategoryRepository extends JpaRepository<RoomCategory, Long> {
    @Transactional
    void deleteRoomCategoriesByRoomId(Long id);
}
