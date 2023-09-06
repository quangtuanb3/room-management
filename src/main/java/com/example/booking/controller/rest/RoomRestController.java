package com.example.booking.controller.rest;

import com.example.booking.service.room.RoomService;
import com.example.booking.service.room.request.RoomSaveRequest;
import com.example.booking.service.room.response.RoomEditResponse;
import com.example.booking.service.room.response.RoomListResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("api/rooms")
@AllArgsConstructor
public class RoomRestController {

    private final RoomService roomService;

    @PostMapping
    public void create(@RequestBody RoomSaveRequest request) {
        roomService.create(request);
    }

    @GetMapping
    public ResponseEntity<Page<RoomListResponse>> list(@PageableDefault(size = 5) Pageable pageable,
                                                       @RequestParam(defaultValue = "") String search,
                                                       @RequestParam(defaultValue = "0") Long priceStart,
                                                       @RequestParam(defaultValue = "0") Long priceEnd) {
        return new ResponseEntity<>(roomService.findAll(pageable, priceStart, priceEnd, search), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<RoomEditResponse> getFilmById(@PathVariable Long id) {
        RoomEditResponse room = roomService.findRoomToEditById(id);
        if (room != null) {
            return ResponseEntity.ok(room);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boolean> getFilmById(@PathVariable Long id,@RequestBody RoomSaveRequest request ) {
    Boolean isUpdated = roomService.updateRoom(id, request);
        if (isUpdated) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
