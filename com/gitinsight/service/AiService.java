
package com.gitinsight.service;

import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.Media;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;

import java.util.Base64;
import java.util.List;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    /**
     * Summarizes text using Spring AI ChatClient.
     */
    public String summarizeProject(String readmeContent) {
        if (readmeContent == null || readmeContent.isBlank()) {
            return "No detailed project description available.";
        }

        String systemPrompt = "Summarize this technical project README into exactly 2 concise sentences for a recruiter.";
        String truncatedReadme = readmeContent.substring(0, Math.min(readmeContent.length(), 5000));
        
        var response = chatClient.call(new Prompt(systemPrompt + "\n\nREADME Content:\n" + truncatedReadme));
        return response.getResult().getOutput().getContent();
    }

    /**
     * Edits/Analyzes an image using Spring AI Multi-modal support.
     * Note: Spring AI supports sending Media objects in UserMessages.
     */
    public String processImageEdit(String base64Image, String prompt, String mimeType) {
        try {
            // Clean base64 string
            String imageData = base64Image.contains(",") ? base64Image.split(",")[1] : base64Image;
            byte[] imageBytes = Base64.getDecoder().decode(imageData);
            
            var media = new Media(MimeTypeUtils.parseMimeType(mimeType), new ByteArrayResource(imageBytes));
            var userMessage = new UserMessage(prompt, List.of(media));
            
            var response = chatClient.call(new Prompt(userMessage));
            return response.getResult().getOutput().getContent();
        } catch (Exception e) {
            return "Error processing image via Spring AI: " + e.getMessage();
        }
    }
}
