package org.featherlessbipeds.visiwatch.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Trustee
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "trustee_id")
    private Integer id;
    @Column(name = "trustee_first_name", columnDefinition = "VARCHAR(40)", nullable = false)
    private String firstName;
    @Column(name = "trustee_last_name", columnDefinition = "VARCHAR(40)", nullable = false)
    private String lastName;
    @ManyToOne
    @JoinColumn(name = "condominium_id")
    private Condominium condominium;
}
