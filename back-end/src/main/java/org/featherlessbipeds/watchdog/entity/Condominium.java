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
    @Column(name = "condom_trustee_name")
    private String trusteeName;
    @Embedded
    private Location location;
    @Column(name = "condominium_name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String name;
    @Column(name = "condominium_email", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String email;
    @Column(name = "condominium_password_hash", columnDefinition = "VARCHAR(255)", nullable = false)
    private String passwordHash;
    @OneToMany(mappedBy = "condominium", fetch = FetchType.EAGER, cascade = {})
    private Set<Entrance> entranceSet;
    @OneToMany(mappedBy = "condominium", fetch = FetchType.EAGER, cascade = {})
    private Set<Trustee> trusteeSet;
}
