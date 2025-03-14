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
@Table(name = "entrance")
public class Entrance
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entrance_id")
    private Integer id;
    @Embedded
    private Location location;
    @Column(name = "entrance_email", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String email;
    @Column(name = "entrance_password_hash", columnDefinition = "VARCHAR(255)", nullable = false)
    @JsonIgnore
    private String passwordHash;
    @ManyToOne
    @JoinColumn(name = "condominium_id", nullable = false)
    @JsonIgnore
    private Condominium condominium;
    @OneToMany(mappedBy = "entrance", fetch = FetchType.LAZY, cascade = {})
    private Set<Alert> alertSet;
}
