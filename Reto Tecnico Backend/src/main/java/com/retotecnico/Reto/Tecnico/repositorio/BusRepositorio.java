package com.retotecnico.Reto.Tecnico.repositorio;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.retotecnico.Reto.Tecnico.modelo.Bus;

@Repository
public interface BusRepositorio extends JpaRepository<Bus, Long> {
    boolean existsByNumeroBus(String numeroBus);

    boolean existsByPlaca(String placa);
}
