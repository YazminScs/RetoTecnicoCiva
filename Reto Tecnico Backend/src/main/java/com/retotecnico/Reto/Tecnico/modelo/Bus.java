package com.retotecnico.Reto.Tecnico.modelo;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tbl_bus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bus")
    private Long idBus;

    @NotBlank(message = "El número del bus es obligatorio")
    @Column(name = "numero_bus", nullable = false, unique = true)
    private String numeroBus;

    @NotBlank(message = "La placa es obligatoria")
    @Column(nullable = false, unique = true)
    private String placa;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;
    private String caracteristicas;

    @NotNull(message = "La marca del bus es obligatoria")
    @ManyToOne
    @JoinColumn(name = "id_marca_bus", nullable = false)
    private MarcaBus marcaBus;

    @Column(nullable = false)
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    public Bus(String numeroBus, String placa, String caracteristicas, MarcaBus marcaBus, Boolean activo) {
        this.numeroBus = numeroBus;
        this.placa = placa;
        this.caracteristicas = caracteristicas;
        this.marcaBus = marcaBus;
        this.activo = activo != null ? activo : true;
    }
}
