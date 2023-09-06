package com.example.booking.service.room.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@Data
@Builder
@AllArgsConstructor
public class RoomEditResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private Long typeId;
    private List<Long> roomCategoryIds;
}