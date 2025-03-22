package org.featherlessbipeds.watchdog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "admin")
public class Admin
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer id;
    @Column(name = "admin_username", columnDefinition = "VARCHAR(100)", nullable = false)
    private String username;
    @Column(name = "admin_email", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String email;
    @Column(name = "admin_password", columnDefinition = "VARCHAR(255)", nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "admin_role", columnDefinition = "VARCHAR(20)", nullable = false)
    private AdminRole admRole;
}
