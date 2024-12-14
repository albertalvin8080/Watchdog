package org.featherlessbipeds.watchdog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "alert")
public class Alert
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "alert_id")
    private Integer id;
    @Enumerated(EnumType.STRING)
    @Column(name = "alert_danger_level", columnDefinition = "VARCHAR(20)", nullable = false)
    private DangerLevel dangerLevel;
    @OneToMany(mappedBy = "alert", fetch = FetchType.EAGER)
    private List<AlertItem> alertItemList;
    @ManyToOne
    @JoinColumn(name = "entrance_id")
    private Entrance entrance;
}
