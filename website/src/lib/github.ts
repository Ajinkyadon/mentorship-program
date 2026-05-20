const GITHUB_RAW_BASE =
  process.env.GITHUB_RAW_BASE ||
  "https://raw.githubusercontent.com/Ajinkyadon/mentorship-program/main";

const GITHUB_API_BASE = "https://api.github.com/repos/Ajinkyadon/mentorship-program";

export async function fetchMarkdown(path: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/${path}`, {
      next: { revalidate: 3600 },
      headers: process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {},
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

export async function fetchGitHubTree(path = ""): Promise<string[]> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/contents/${path}`, {
      next: { revalidate: 3600 },
      headers: process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {},
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter((f: { type: string; name: string }) => f.type === "file" && f.name.endsWith(".md"))
      .map((f: { name: string }) => f.name);
  } catch {
    return [];
  }
}

// Program-to-folder mapping
export const PROGRAM_PATHS: Record<string, string> = {
  "freshers-roadmap": "fresher",
  "backend-engineering": "experience-2-4-years",
  "nodejs-mastery": "experience/learning-roadmap",
  "system-design": "experience-2-4-years",
  "interview-preparation": "fresher",
  "aws-cloud": "experience-2-4-years",
  "fullstack-roadmap": "fresher",
  "career-switch": "fresher",
};
