const fs = require('fs');
const path = require('path');

/**
 * Formats a date string for display
 */
function formatDate(dateString) {
  if (!dateString) return 'Present';
  return dateString;
}

/**
 * Converts a resume JSON object to markdown format optimized for AI parsing
 */
function convertResumeToMarkdown(resume) {
  const sections = [];

  // Header with name and label
  if (resume.basics) {
    const { name, label } = resume.basics;
    if (name) {
      sections.push(`# ${name}`);
      if (label) {
        sections.push(`\n*${label}*\n`);
      }
    }

    // Contact Information
    const contactParts = [];
    if (resume.basics.email) contactParts.push(`**Email:** ${resume.basics.email}`);
    if (resume.basics.phone) contactParts.push(`**Phone:** ${resume.basics.phone}`);
    if (resume.basics.url) contactParts.push(`**Website:** ${resume.basics.url}`);

    if (resume.basics.location) {
      const loc = resume.basics.location;
      const locationParts = [loc.city, loc.region, loc.countryCode].filter(Boolean);
      if (locationParts.length > 0) {
        contactParts.push(`**Location:** ${locationParts.join(', ')}`);
      }
    }

    if (contactParts.length > 0) {
      sections.push('## Contact\n');
      sections.push(contactParts.join('  \n'));
      sections.push('\n');
    }

    // Social Profiles
    if (resume.basics.profiles && resume.basics.profiles.length > 0) {
      sections.push('## Profiles\n');
      resume.basics.profiles.forEach(profile => {
        sections.push(`- **${profile.network}:** ${profile.url || profile.username}`);
      });
      sections.push('\n');
    }

    // Summary
    if (resume.basics.summary) {
      sections.push('## Summary\n');
      sections.push(resume.basics.summary);
      sections.push('\n');
    }
  }

  // Work Experience
  if (resume.work && resume.work.length > 0) {
    sections.push('## Work Experience\n');
    resume.work.forEach(job => {
      sections.push(`### ${job.position || 'Position'} at ${job.name || 'Company'}`);
      sections.push(`*${formatDate(job.startDate)} - ${formatDate(job.endDate)}*\n`);

      if (job.location || job.location_type) {
        const locInfo = [job.location_type, job.location].filter(Boolean).join(', ');
        if (locInfo) sections.push(`**Location:** ${locInfo}\n`);
      }

      if (job.url) {
        sections.push(`**URL:** ${job.url}\n`);
      }

      if (job.summary) {
        sections.push(job.summary + '\n');
      }

      if (job.highlights && job.highlights.length > 0) {
        sections.push('**Highlights:**');
        job.highlights.forEach(highlight => {
          sections.push(`- ${highlight}`);
        });
        sections.push('');
      }

      if (job.skills && job.skills.length > 0) {
        sections.push(`**Technologies:** ${job.skills.join(', ')}\n`);
      }
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    sections.push('## Projects\n');
    resume.projects.forEach(project => {
      sections.push(`### ${project.name}`);
      if (project.isActive !== undefined) {
        sections.push(`*Status: ${project.isActive ? 'Active' : 'Inactive'}*\n`);
      } else {
        sections.push('');
      }

      if (project.description) {
        sections.push(project.description + '\n');
      }

      if (project.highlights && project.highlights.length > 0) {
        sections.push('**Highlights:**');
        project.highlights.forEach(highlight => {
          sections.push(`- ${highlight}`);
        });
        sections.push('');
      }

      if (project.url) {
        sections.push(`**URL:** ${project.url}\n`);
      }

      if (project.keywords && project.keywords.length > 0) {
        sections.push(`**Keywords:** ${project.keywords.join(', ')}\n`);
      }
    });
  }

  // Volunteer
  if (resume.volunteer && resume.volunteer.length > 0) {
    sections.push('## Volunteer Work\n');
    resume.volunteer.forEach(vol => {
      sections.push(`### ${vol.position || 'Position'} at ${vol.organization || 'Organization'}`);
      sections.push(`*${formatDate(vol.startDate)} - ${formatDate(vol.endDate)}*\n`);

      if (vol.url) {
        sections.push(`**URL:** ${vol.url}\n`);
      }

      if (vol.summary) {
        sections.push(vol.summary + '\n');
      }

      if (vol.highlights && vol.highlights.length > 0) {
        sections.push('**Highlights:**');
        vol.highlights.forEach(highlight => {
          sections.push(`- ${highlight}`);
        });
        sections.push('');
      }

      if (vol.keywords && vol.keywords.length > 0) {
        sections.push(`**Keywords:** ${vol.keywords.join(', ')}\n`);
      }
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    sections.push('## Education\n');
    resume.education.forEach(edu => {
      sections.push(`### ${edu.studyType || 'Degree'} in ${edu.area || 'Field'}`);
      sections.push(`**${edu.institution}**  `);
      sections.push(`*${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}*\n`);

      if (edu.score) {
        sections.push(`**Score:** ${edu.score}\n`);
      }

      if (edu.url) {
        sections.push(`**URL:** ${edu.url}\n`);
      }

      if (edu.summary) {
        sections.push(edu.summary + '\n');
      }

      if (edu.courses && edu.courses.length > 0) {
        sections.push('**Relevant Coursework:**');
        edu.courses.forEach(course => {
          sections.push(`- ${course}`);
        });
        sections.push('');
      }
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    sections.push('## Skills\n');
    resume.skills.forEach(skillGroup => {
      sections.push(`### ${skillGroup.name || 'Skills'}`);
      if (skillGroup.level) {
        sections.push(`*Level: ${skillGroup.level}*\n`);
      }
      if (skillGroup.keywords && skillGroup.keywords.length > 0) {
        sections.push(skillGroup.keywords.join(', ') + '\n');
      }
    });
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    sections.push('## Languages\n');
    resume.languages.forEach(lang => {
      sections.push(`- **${lang.language}:** ${lang.fluency || 'Not specified'}`);
    });
    sections.push('\n');
  }

  // Interests
  if (resume.interests && resume.interests.length > 0) {
    sections.push('## Interests\n');
    resume.interests.forEach(interest => {
      sections.push(`### ${interest.name}`);
      if (interest.summary) {
        sections.push(interest.summary + '\n');
      }
      if (interest.keywords && interest.keywords.length > 0) {
        sections.push(interest.keywords.join(', ') + '\n');
      }
    });
  }

  // Awards
  if (resume.awards && resume.awards.length > 0) {
    sections.push('## Awards\n');
    resume.awards.forEach(award => {
      sections.push(`### ${award.title}`);
      sections.push(`**${award.awarder}** - ${formatDate(award.date)}\n`);
      if (award.summary) {
        sections.push(award.summary + '\n');
      }
    });
  }

  // Certificates
  if (resume.certificates && resume.certificates.length > 0) {
    sections.push('## Certificates\n');
    resume.certificates.forEach(cert => {
      sections.push(`### ${cert.name}`);
      sections.push(`**Issued by:** ${cert.issuer}  `);
      sections.push(`**Date:** ${formatDate(cert.date)}\n`);

      if (cert.url) {
        sections.push(`**URL:** ${cert.url}\n`);
      }
    });
  }

  // Publications
  if (resume.publications && resume.publications.length > 0) {
    sections.push('## Publications\n');
    resume.publications.forEach(pub => {
      sections.push(`### ${pub.name}`);
      sections.push(`**Publisher:** ${pub.publisher} (${formatDate(pub.releaseDate)})\n`);

      if (pub.url) {
        sections.push(`**URL:** ${pub.url}\n`);
      }

      if (pub.summary) {
        sections.push(pub.summary + '\n');
      }
    });
  }

  // References
  if (resume.references && resume.references.length > 0) {
    sections.push('## References\n');
    resume.references.forEach(ref => {
      sections.push(`### ${ref.name}`);
      if (ref.reference) {
        sections.push(`"${ref.reference}"\n`);
      }
    });
  }

  return sections.join('\n');
}

/**
 * Main function to convert resume.json to resume.md
 */
function main() {
  const resumePath = path.join(__dirname, '..', 'resume.json');
  const outputPath = path.join(__dirname, '..', 'build', 'resume.md');

  // Read the resume.json file
  const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));

  // Convert to markdown
  const markdown = convertResumeToMarkdown(resumeData);

  // Ensure build directory exists
  const buildDir = path.dirname(outputPath);
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Write the markdown file
  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log(`✓ Successfully converted resume.json to ${outputPath}`);
}

// Run main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { convertResumeToMarkdown };
