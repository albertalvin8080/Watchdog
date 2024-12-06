package org.featherlessbipeds.watchdog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "entrance")
public class Entrance
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "entrance_id")
    private Integer id;
    @Embedded
    private Location location;
    @ManyToOne
    @JoinColumn(name = "condominium_id")
    private Condominium condominium;
//    @OneToMany(mappedBy = "entrance", fetch = FetchType.LAZY, cascade = {})
//    private Set<Alert> alertSet;
    @OneToMany(mappedBy = "entrance", fetch = FetchType.EAGER, cascade = {})
    private Set<Doorman> doormanSet;
}
