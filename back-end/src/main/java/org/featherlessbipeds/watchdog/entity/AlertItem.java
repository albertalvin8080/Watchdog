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
@Table(name = "alert_item")
public class AlertItem
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "alert_item_id")
    private Integer id;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "alert_item_date", nullable = false)
    private Date date;
    @Lob
    @Column(name = "alert_item_description", nullable = false)
    private byte[] description;
    @ManyToOne
    @JoinColumn(name = "alert_id")
    private Alert alert;
}
