const { convertResumeToMarkdown } = require("../scripts/jsonToMarkdown");
const fs = require('node:fs');
const path = require('node:path');

describe("JSON to Markdown Conversion", () => {
  const testResume = {
    basics: {
      name: "John Doe",
      label: "Software Engineer",
      email: "john@example.com",
      phone: "+1234567890",
      url: "https://johndoe.com",
      summary: "Experienced software engineer with expertise in web development.",
      location: {
        city: "San Francisco",
        countryCode: "US",
        region: "California"
      },
      profiles: [
        {
          network: "GitHub",
          username: "johndoe",
          url: "https://github.com/johndoe"
        }
      ]
    },
    work: [
      {
        name: "Tech Corp",
        position: "Senior Engineer",
        startDate: "2020-01-01",
        endDate: "2023-12-31",
        summary: "Led development of web applications.",
        skills: ["JavaScript", "React", "Node.js"]
      }
    ],
    education: [
      {
        institution: "University",
        area: "Computer Science",
        studyType: "Bachelor",
        startDate: "2015-09-01",
        endDate: "2019-06-01"
      }
    ],
    skills: [
      {
        name: "Programming Languages",
        keywords: ["JavaScript", "Python", "Go"]
      }
    ],
    languages: [
      {
        language: "English",
        fluency: "Native"
      }
    ]
  };

  test("Should convert resume JSON to markdown format", () => {
    const markdown = convertResumeToMarkdown(testResume);

    expect(markdown).toBeDefined();
    expect(markdown).toContain("# John Doe");
    expect(markdown).toContain("Software Engineer");
    expect(markdown).toContain("## Contact");
    expect(markdown).toContain("john@example.com");
    expect(markdown).toContain("## Summary");
    expect(markdown).toContain("Experienced software engineer");
    expect(markdown).toContain("## Work Experience");
    expect(markdown).toContain("Tech Corp");
    expect(markdown).toContain("Senior Engineer");
    expect(markdown).toContain("## Education");
    expect(markdown).toContain("University");
    expect(markdown).toContain("## Skills");
    expect(markdown).toContain("Programming Languages");
  });

  test("Should handle resume with minimal data", () => {
    const minimalResume = {
      basics: {
        name: "Jane Doe"
      }
    };

    const markdown = convertResumeToMarkdown(minimalResume);
    expect(markdown).toBeDefined();
    expect(markdown).toContain("# Jane Doe");
  });

  test("Should format dates properly", () => {
    const markdown = convertResumeToMarkdown(testResume);
    expect(markdown).toContain("2020-01-01");
    expect(markdown).toContain("2023-12-31");
  });

  test("Should include social profiles", () => {
    const markdown = convertResumeToMarkdown(testResume);
    expect(markdown).toContain("GitHub");
    expect(markdown).toContain("https://github.com/johndoe");
  });
});
