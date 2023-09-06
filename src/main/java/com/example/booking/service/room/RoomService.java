package com.example.booking.service.room;

import com.example.booking.domain.Category;
import com.example.booking.domain.Room;
import com.example.booking.domain.RoomCategory;
import com.example.booking.repository.RoomCategoryRepository;
import com.example.booking.repository.RoomRepository;
import com.example.booking.service.room.request.RoomSaveRequest;
import com.example.booking.service.room.response.RoomEditResponse;
import com.example.booking.service.room.response.RoomListResponse;
import com.example.booking.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;

    private final RoomCategoryRepository roomCategoryRepository;

    public void create(RoomSaveRequest request) {
        var room = AppUtil.mapper.map(request, Room.class);
        room = roomRepository.save(room);
//        var roomCategories = new ArrayList<RoomCategory>();
//        for (var id: request.getIdCategories()) {
//            roomCategories.add(new RoomCategory(room, new Category(Long.valueOf(id))));
//        }
//        roomCategoryRepository.saveAll(roomCategories);
        Room finalRoom = room;
        roomCategoryRepository.saveAll(request
                .getIdCategories()
                .stream()
                .map(id -> new RoomCategory(finalRoom, new Category(Long.valueOf(id))))
                .collect(Collectors.toList()));
    }

    public Page<RoomListResponse> findAll(Pageable pageable, Long priceStart, Long priceEnd, String search) {
        return roomRepository.searchEverything(search, priceStart, priceEnd, pageable)
                .map(room -> RoomListResponse.builder()
                        .id(room.getId())
                        .price(room.getPrice())
                        .description(room.getDescription())
                        .name(room.getName())
                        .type(room.getType().getName())
                        .roomCategories(room.getRoomCategories()
                                .stream().map(roomCategory -> roomCategory
                                        .getCategory().getName())
                                .collect(Collectors.joining(", ")))
                        .build());
    }

    public RoomEditResponse findRoomToEditById(Long id) {
        return roomRepository.findById(id).map(room ->
                        RoomEditResponse.builder()
                                .id(room.getId())
                                .name(room.getName())
                                .price(room.getPrice())
                                .description(room.getDescription())
                                .typeId(room.getType().getId())
                                .roomCategoryIds(room.getRoomCategories()
                                        .stream().map(roomCategory -> roomCategory.getCategory().getId())
                                        .collect(Collectors.toList()))
                                .build())
                .orElseThrow(() -> new RuntimeException("Id not found"));
    }

    public Boolean updateRoom(Long id, RoomSaveRequest request) {
        Room roomDB = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Id not found!"));
        var roomToUpdate = AppUtil.mapper.map(request, Room.class);
        roomCategoryRepository.deleteRoomCategoriesByRoomId(roomDB.getId());


        roomDB.setName(roomToUpdate.getName());
        roomDB.setDescription(roomToUpdate.getDescription());
        roomDB.setPrice(roomToUpdate.getPrice());
        roomDB.setType(roomToUpdate.getType());

        var roomCategories = new ArrayList<RoomCategory>();
        for (var cId : request.getIdCategories()) {
            roomCategories.add(new RoomCategory(roomDB, new Category(Long.valueOf(cId))));
        }
        roomCategoryRepository.saveAll(roomCategories);
        roomRepository.save(roomDB);

        return true;
    }
}
