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
public class Condominium
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "condominium_id")
    private Integer id;
    @Embedded
    private Location location;
    @OneToMany(mappedBy = "condominium", fetch = FetchType.EAGER, cascade = {})
    private Set<Entrance> entranceSet;
    @OneToMany(mappedBy = "condominium", fetch = FetchType.EAGER, cascade = {})
    private Set<Trustee> trusteeSet;
}
