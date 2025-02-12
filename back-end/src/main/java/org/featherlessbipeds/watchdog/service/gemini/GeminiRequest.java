package org.featherlessbipeds.watchdog.service.gemini;

public class GeminiRequest {
    private final Contents[] contents;

    public GeminiRequest(String prompt) {
        this.contents = new Contents[]{new Contents(new Part[]{new Part(prompt)})};
    }

    public Contents[] getContents() {
        return contents;
    }

    private static class Contents {
        private final Part[] parts;

        public Contents(Part[] parts) {
            this.parts = parts;
        }

        public Part[] getParts() {
            return parts;
        }
    }

    private static class Part {
        private final String text;

        public Part(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }
    }
}
