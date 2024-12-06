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
//    @OneToMany(mappedBy = "")
//    @JoinColumn(name = "entrance_id")
//    private List<ItemAlerta> itemAlerta;
}

class ItemAlerta {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "item_alert_id")
    private Integer id;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "item_alert_date", nullable = false)
    private Date date;
    @Lob
    @Column(name = "item_alert_description", nullable = false)
    private byte[] description;
    @ManyToOne
    @JoinColumn(name = "entrance_id")
    private Entrance entrance;
}
