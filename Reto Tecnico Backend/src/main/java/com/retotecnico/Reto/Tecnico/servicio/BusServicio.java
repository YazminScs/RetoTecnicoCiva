package com.retotecnico.Reto.Tecnico.servicio;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.retotecnico.Reto.Tecnico.modelo.Bus;
import com.retotecnico.Reto.Tecnico.repositorio.BusRepositorio;

@Service
public class BusServicio {

    @Autowired
    private BusRepositorio busRepositorio;

    public Bus saveBus(Bus bus) {
        return busRepositorio.save(bus);
    }

    public void deleteBus(Long idBus) {
        busRepositorio.deleteById(idBus);
    }

    
    public Page<Bus> findAllBuses(Pageable pageable) {
        return busRepositorio.findAll(pageable);
    }

    public Optional<Bus> findBusById(Long idBus) {
        return busRepositorio.findById(idBus);
    }

    public boolean existsByNumeroBus(String numeroBus) {
        return busRepositorio.existsByNumeroBus(numeroBus);
    }

    public boolean existsByPlaca(String placa) {
        return busRepositorio.existsByPlaca(placa);
    }
}
