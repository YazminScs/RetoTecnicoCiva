package com.retotecnico.Reto.Tecnico.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.retotecnico.Reto.Tecnico.modelo.MarcaBus;

@Repository
public interface MarcaBusRepositorio extends JpaRepository<MarcaBus, Long> {
    MarcaBusRepositorio findByNombreMarcaBus(String nombreMarcaBus);
}
