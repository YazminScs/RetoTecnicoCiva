package com.retotecnico.Reto.Tecnico.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "tbl_marca_bus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarcaBus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_marca_bus")
    private Long idMarcaBus;

    @NotBlank(message = "El nombre de la marca es obligatorio")
    @Column(nullable = false, unique = true, name = "nombre_marca_bus")
    private String nombreMarcaBus;
}
