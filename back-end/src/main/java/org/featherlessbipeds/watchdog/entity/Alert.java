package org.featherlessbipeds.watchdog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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
    @Column(name = "alert_type", columnDefinition = "VARCHAR(20)", nullable = false)
    private AlertType alertType;
    @Column(name = "alert_description", columnDefinition = "VARCHAR(255)", nullable = false)
    private String description;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "alert_date", nullable = false)
    private Date date;
    @ManyToOne
    @JoinColumn(name = "entrance_id")
    private Entrance entrance;
}
