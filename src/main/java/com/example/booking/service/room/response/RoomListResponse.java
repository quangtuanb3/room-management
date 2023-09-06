package com.example.booking.service.room.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RoomListResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private String type;
    private String roomCategories;
}