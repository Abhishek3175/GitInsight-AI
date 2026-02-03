
package com.gitinsight.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class GithubService {

    private final RestClient restClient;

    public GithubService(RestClient.Builder builder, 
                         @Value("${github.api.base-url}") String baseUrl,
                         @Value("${github.api.token}") String token) {
        this.restClient = builder.baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .defaultHeader("Accept", "application/vnd.github.v3+json")
                .build();
    }

    public Map<String, Object> fetchUserProfile(String username) {
        return restClient.get()
                .uri("/users/{username}", username)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public List<Map<String, Object>> fetchPublicRepos(String username) {
        return restClient.get()
                .uri("/users/{username}/repos?sort=updated&per_page=20", username)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public String fetchReadme(String fullName) {
        try {
            return restClient.get()
                    .uri("/repos/{fullName}/readme", fullName)
                    .header("Accept", "application/vnd.github.v3.raw")
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            return null; // README doesn't exist
        }
    }
}
