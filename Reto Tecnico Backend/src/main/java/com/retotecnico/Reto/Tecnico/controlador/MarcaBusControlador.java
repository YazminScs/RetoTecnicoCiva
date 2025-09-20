package com.retotecnico.Reto.Tecnico.controlador;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.retotecnico.Reto.Tecnico.modelo.MarcaBus;
import com.retotecnico.Reto.Tecnico.servicio.MarcaBusServicio;

@RestController
@RequestMapping("/marca")
@CrossOrigin(origins = "*")
public class MarcaBusControlador {

    @Autowired
    private MarcaBusServicio marcaBusService;

    @PostMapping
    public ResponseEntity<MarcaBus> createMarca(@RequestBody MarcaBus marca) {
        MarcaBus nuevaMarca = marcaBusService.saveMarca(marca);
        return ResponseEntity.ok(nuevaMarca);
    }

    @GetMapping
    public ResponseEntity<List<MarcaBus>> getAllMarcas() {
        return ResponseEntity.ok(marcaBusService.findAllMarcas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarcaBus> getMarcaById(@PathVariable Long id) {
        Optional<MarcaBus> marca = marcaBusService.findMarcaById(id);
        return marca.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarcaBus> updateMarca(@PathVariable Long id, @RequestBody MarcaBus marca) {
        Optional<MarcaBus> existente = marcaBusService.findMarcaById(id);
        if (existente.isPresent()) {
            marca.setIdMarcaBus(id);
            return ResponseEntity.ok(marcaBusService.saveMarca(marca));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarca(@PathVariable Long id) {
        if (marcaBusService.findMarcaById(id).isPresent()) {
            marcaBusService.deleteMarca(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
