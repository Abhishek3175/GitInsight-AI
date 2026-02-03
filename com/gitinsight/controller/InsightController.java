package com.gitinsight.controller;

import com.gitinsight.dto.RepoInsight;
import com.gitinsight.model.SavedCandidate;
import com.gitinsight.repository.CandidateRepository;
import com.gitinsight.service.AiService;
import com.gitinsight.service.GithubService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insight")
@CrossOrigin(origins = "*")
public class InsightController {

    private final GithubService githubService;
    private final AiService aiService;
    private final CandidateRepository candidateRepository;

    public InsightController(GithubService githubService, AiService aiService, CandidateRepository candidateRepository) {
        this.githubService = githubService;
        this.aiService = aiService;
        this.candidateRepository = candidateRepository;
    }

    @GetMapping("/profile/{username}")
    public Map<String, Object> getUserProfile(@PathVariable String username) {
        return githubService.fetchUserProfile(username);
    }

    @GetMapping("/repos/{username}")
    public List<Map<String, Object>> getUserRepos(@PathVariable String username) {
        return githubService.fetchPublicRepos(username);
    }

    @GetMapping("/{username}/{repoName}")
    public RepoInsight getSingleInsight(@PathVariable String username, @PathVariable String repoName) {
        String fullName = username + "/" + repoName;
        String readme = githubService.fetchReadme(fullName);
        String summary = aiService.summarizeProject(readme);
        return new RepoInsight(repoName, summary);
    }

    @PostMapping("/candidates")
    public SavedCandidate saveCandidate(@RequestBody Map<String, String> candidateData) {
        SavedCandidate candidate = new SavedCandidate(
            candidateData.get("username"),
            candidateData.get("name"),
            candidateData.get("avatarUrl"),
            candidateData.get("bio"),
            candidateData.get("summary")
        );
        return candidateRepository.save(candidate);
    }

    @GetMapping("/candidates")
    public List<SavedCandidate> getSavedCandidates() {
        return candidateRepository.findAll();
    }

    @DeleteMapping("/candidates/{id}")
    public void deleteCandidate(@PathVariable Long id) {
        candidateRepository.deleteById(id);
    }

    @PostMapping("/edit-image")
    public Map<String, String> editImage(@RequestBody Map<String, String> request) {
        String base64Image = request.get("image");
        String prompt = request.get("prompt");
        String mimeType = request.get("mimeType");
        String result = aiService.processImageEdit(base64Image, prompt, mimeType);
        return Map.of("result", result);
    }
}