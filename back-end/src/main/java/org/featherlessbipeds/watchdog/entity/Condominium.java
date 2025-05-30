package org.featherlessbipeds.watchdog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
// NOTE: Remember that this guy also represents the trustee.
public class Condominium
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condominium_id")
    private Integer id;
    @Column(name = "condominium_trustee_name")
    private String trusteeName;
    @Embedded
    private Location location;
    @Column(name = "condominium_name", columnDefinition = "VARCHAR(100)", nullable = false)
    private String name;
    @Column(name = "condominium_email", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String email;
    @Column(name = "condominium_password_hash", columnDefinition = "VARCHAR(255)", nullable = false)
    @JsonIgnore
    private String passwordHash;
    @OneToMany(mappedBy = "condominium", fetch = FetchType.EAGER, cascade = {})
    private Set<Entrance> entranceSet;
}
