export type LinkType =
  | "youtube"
  | "twitter"
  | "canva"
  | "doc"
  | "unknown";

interface LinkPattern {
  type: LinkType;
  patterns: string[];
}

// Centralized pattern configuration
export const LINK_PATTERNS: LinkPattern[] = [
  {
    type: "youtube",
    patterns: ["youtube.com", "youtu.be"],
  },
  {
    type: "twitter",
    patterns: ["twitter.com", "x.com"],
  },
  {
    type: "canva",
    patterns: ["canva.com/design"],
  },
  {
    type: "doc",
    patterns: [
      "docs.google.com",
      ".pdf",
      ".docx",
      ".doc",
      ".pptx",
      ".xlsx",
    ],
  },
]