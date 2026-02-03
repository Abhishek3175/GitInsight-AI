package com.gitinsight.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class SavedCandidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    
    private String name;
    private String avatarUrl;
    private String bio;
    
    @Column(length = 2000)
    private String topProjectSummary;
    
    private LocalDateTime savedAt = LocalDateTime.now();
    
    public SavedCandidate(String username, String name, String avatarUrl, String bio, String topProjectSummary) {
        this.username = username;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.topProjectSummary = topProjectSummary;
    }
}