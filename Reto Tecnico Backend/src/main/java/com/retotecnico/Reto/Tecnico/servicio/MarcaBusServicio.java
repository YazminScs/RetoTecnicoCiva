package com.retotecnico.Reto.Tecnico.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.retotecnico.Reto.Tecnico.modelo.MarcaBus;
import com.retotecnico.Reto.Tecnico.repositorio.MarcaBusRepositorio;

@Service
public class MarcaBusServicio {

    @Autowired
    private MarcaBusRepositorio marcaBusRepositorio;

    public MarcaBus saveMarca(MarcaBus marca) {
        return marcaBusRepositorio.save(marca);
    }

    public List<MarcaBus> findAllMarcas() {
        return marcaBusRepositorio.findAll();
    }

    public Optional<MarcaBus> findMarcaById(Long id) {
        return marcaBusRepositorio.findById(id);
    }

    public void deleteMarca(Long id) {
        marcaBusRepositorio.deleteById(id);
    }
}
