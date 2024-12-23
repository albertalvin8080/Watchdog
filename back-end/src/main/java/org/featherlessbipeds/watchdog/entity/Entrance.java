package org.featherlessbipeds.watchdog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.featherlessbipeds.watchdog.entity.notused.Doorman;

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
    @ManyToOne
    @JoinColumn(name = "condominium_id", nullable = false)
    private Condominium condominium;
    @OneToMany(mappedBy = "entrance", fetch = FetchType.LAZY, cascade = {})
    private Set<Alert> alertSet;
}
