package com.retotecnico.Reto.Tecnico.controlador;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retotecnico.Reto.Tecnico.modelo.Bus;
import com.retotecnico.Reto.Tecnico.servicio.BusServicio;

@RestController
@RequestMapping("/bus")
@CrossOrigin(origins = "*")
public class BusControlador {
    
    @Autowired
    private BusServicio busService;

    @GetMapping
    public ResponseEntity<Page<Bus>> getAllBuses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Bus> buses = busService.findAllBuses(pageable);

        return ResponseEntity.ok(buses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {

        Optional<Bus> bus = busService.findBusById(id);

        if (bus.isPresent()) {
            return ResponseEntity.ok(bus.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        Bus nuevoBus = busService.saveBus(bus);
        return ResponseEntity.ok(nuevoBus);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        Optional<Bus> existente = busService.findBusById(id);
        if (existente.isPresent()) {
            bus.setIdBus(id);
            return ResponseEntity.ok(busService.saveBus(bus));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        if (busService.findBusById(id).isPresent()) {
            busService.deleteBus(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}