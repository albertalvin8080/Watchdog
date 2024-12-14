package org.featherlessbipeds.watchdog.entity.notused;

import jakarta.persistence.*;
import lombok.*;
import org.featherlessbipeds.watchdog.entity.Entrance;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "doorman")
public class Doorman
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "doorman_id")
    private Integer id;
    @Column(name = "doorman_firstname", columnDefinition = "VARCHAR(40)", nullable = false)
    private String firstName;
    @Column(name = "doorman_lastname", columnDefinition = "VARCHAR(40)", nullable = false)
    private String lastName;
    @Enumerated(EnumType.STRING)
    @Column(name = "doorman_shift", columnDefinition = "VARCHAR(10)", nullable = false)
    private Shift shift;
    @ManyToOne
    @JoinColumn(name = "entrance_id")
    private Entrance entrance;
}

