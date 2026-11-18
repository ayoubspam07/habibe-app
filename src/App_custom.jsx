import { useState, useEffect, Fragment } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import resumeDataFr from './assets/resumeData_fr.json';
import resumeDataEn from './assets/resumeData.json';
import resumeDataCanadaFr from './assets/resumeData_canada_fr.json';
import resumeDataCanadaEn from './assets/resumeData_canada.json';
import CanadianCV from './CanadianCV.jsx';
import ApplicationTracker from './ApplicationTracker.jsx';

library.add(fas, fab);

function getResumeMeta(locale, page) {
  const isFr = locale === 'fr';
  const isCanada = page === 'canada';
  const pageLabel = isCanada ? (isFr ? 'CV canadien' : 'Canadian CV') : isFr ? 'CV' : 'Resume';
  const title = `Ayoub Boudra Data Engineer ${pageLabel}`;
  const description = isFr
    ? `CV d'Ayoub Boudra, Data Engineer spécialisé en pipelines cloud, analytics, BI et cas d'usage IA/ML.${isCanada ? ' Format canadien.' : ''}`
    : `Resume of Ayoub Boudra, a Data Engineer specialized in cloud data pipelines, analytics, BI and AI/ML use cases.${isCanada ? ' Canadian format.' : ''}`;
  const keywords = [
    'Ayoub Boudra',
    'Data Engineer',
    'Cloud',
    'Big Data',
    'Python',
    'SQL',
    'BI',
    isFr ? 'CV' : 'Resume',
    isCanada ? 'Canada' : '',
  ]
    .filter(Boolean)
    .join(', ');

  return { title, description, keywords };
}

function isValidResumeData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const { basics } = data;
  if (!basics || typeof basics !== 'object') return false;
  if (typeof basics.firstName !== 'string' || typeof basics.lastName !== 'string') return false;
  const arrayFields = ['skillGroups', 'experience', 'education'];
  if (data.links !== undefined && !Array.isArray(data.links)) return false;
  if (data.languages !== undefined && !Array.isArray(data.languages)) return false;
  if (data.softSkills !== undefined && !Array.isArray(data.softSkills)) return false;
  return arrayFields.every((field) => Array.isArray(data[field]));
}

function getPromptResume(resume) {
  const {
    links: _links,
    basics: { email: _email, phone: _phone, location: _location, ...editableBasics },
    ...editableResume
  } = resume;

  return { ...editableResume, basics: editableBasics };
}

function SectionTitle({ children }) {
  return <h2 className="section-title">{children}</h2>;
}

function formatExperienceDuration(totalMonths, locale) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (locale === 'fr') {
    const yearLabel = years > 1 ? 'ans' : 'an';
    const monthLabel = 'mois';
    return [years ? `${years} ${yearLabel}` : '', months ? `${months} ${monthLabel}` : ''].filter(Boolean).join(' ');
  }

  return [
    years ? `${years} ${years === 1 ? 'year' : 'years'}` : '',
    months ? `${months} ${months === 1 ? 'month' : 'months'}` : '',
  ].filter(Boolean).join(' ');
}

function ExperienceTotals({ locale, className = '' }) {
  return null;
}

function ExperienceTypeBadges({ value, className = 'experience_type_badge' }) {
  if (!value) return null;

  return value.split('·').map((type) => {
    const label = type.trim();
    return <span className={className} key={label}>{label}</span>;
  });
}

function getLinkIcon(link) {
  return [link.prefix ?? (link.icon === 'user' ? 'fas' : 'fab'), link.icon];
}

function getContactItems(resumeData) {
  return [
    {
      icon: 'envelope',
      value: resumeData.basics.email,
      href: `mailto:${resumeData.basics.email}`,
    },
    {
      icon: 'phone',
      value: resumeData.basics.phone,
      href: `tel:${resumeData.basics.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: 'map-marker-alt',
      value: resumeData.basics.location,
    },
  ];
}

function sanitizeResumeTitle(value, fallback = '') {
  let title = typeof value === 'string' ? value.trim() : fallback;

  title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const brokenLinkStart = title.indexOf('](');
  const brokenLinkEnd = title.lastIndexOf(')');
  if (brokenLinkStart > 0 && brokenLinkEnd > brokenLinkStart) {
    title = `${title.slice(0, brokenLinkStart)} ${title.slice(brokenLinkEnd + 1)}`;
  }

  return title.replace(/\s+/g, ' ').trim() || fallback;
}

function normalizeResumeData(baseResume, resume) {
  if (!resume || typeof resume !== 'object' || Array.isArray(resume)) return baseResume;

  return {
    ...baseResume,
    ...resume,
    labels: { ...(baseResume.labels ?? {}), ...(resume.labels ?? {}) },
    basics: {
      ...(baseResume.basics ?? {}),
      ...(resume.basics ?? {}),
      tagline: baseResume.basics?.tagline ?? '',
      title: sanitizeResumeTitle(resume.basics?.title, baseResume.basics?.title ?? ''),
      email: resume.basics?.email ?? baseResume.basics?.email ?? '',
      phone: resume.basics?.phone ?? baseResume.basics?.phone ?? '',
      location: resume.basics?.location ?? baseResume.basics?.location ?? '',
    },
    links: baseResume.links ?? [],
    languages: Array.isArray(resume.languages) ? resume.languages : (baseResume.languages ?? []),
    skillGroups: Array.isArray(resume.skillGroups) ? resume.skillGroups : (baseResume.skillGroups ?? []),
    softSkills: Array.isArray(resume.softSkills) ? resume.softSkills : (baseResume.softSkills ?? []),
    highlights: Array.isArray(resume.highlights) ? resume.highlights : (baseResume.highlights ?? []),
    experience: Array.isArray(resume.experience) ? resume.experience : (baseResume.experience ?? []),
    education: Array.isArray(resume.education) ? resume.education : (baseResume.education ?? []),
    certifications: Array.isArray(resume.certifications) ? resume.certifications : (baseResume.certifications ?? []),
  };
}

// Builds a ready-to-use prompt asking an AI to tailor the resume JSON to a job.
const DEFAULT_PROMPT_INSTRUCTIONS = `You are a world-class resume writer, career coach, and ATS (Applicant Tracking System) optimization expert specializing in Human Resources (HR) recruitment and hiring.

Your mission: take my resume (JSON below) and the job offer (pasted at the VERY BOTTOM of this message, after the marker line) and produce the strongest possible tailored version of my resume for that exact HR position.

Hard constraints (never break these):
- Never invent employers, job titles, degrees, dates, certifications, or achievements I do not already have.
- Never fabricate metrics, responsibilities, recruitment volumes, employee numbers, or results that are not already present in my resume.
- Do not infer HR expertise, recruitment experience, or HR responsibilities simply because they appear in the job offer.
- Do not present transferable administrative, communication, coordination, management, or organizational experience as direct HR experience unless my resume supports it.
- Do not change industries, seniority, responsibilities, achievements, or proficiency levels beyond truthful tailoring of existing evidence.

## STEP 0 — Detect the offer language
- Before anything else, detect the natural language in which the job offer is written (French, English, etc.).
- This is the "offer language".
- The offer language — NOT the language of my resume — governs every word you write.
- If the offer mixes languages, choose the dominant language used for the responsibilities and requirements.

## STEP 1 — Analyze the job offer
- Read the full job description pasted at the very bottom, after the line "=== JOB DESCRIPTION BELOW ===".
- Identify:
  - Exact job title and seniority level.
  - HR specialization (Talent Acquisition, Recruitment, HR Administration, HR Business Partner, Talent Management, Training, Payroll, Compensation & Benefits, HR Operations, etc.).
  - Mandatory skills and qualifications.
  - Nice-to-have skills.
  - Main responsibilities.
  - HR software, ATS platforms, HRIS tools, and other requested technologies.
  - Industry and organizational context.
  - Offer language.

## STEP 2 — Tailor the resume

### Title & summary
- Adapt basics.title to the exact HR position when supported by my actual experience.
- Never upgrade my seniority or assign me an HR specialization that my experience does not support.
- Rewrite basics.summary in 1–2 concise, impactful sentences reflecting the most relevant experience and qualifications for the target position.
- Use natural HR terminology, such as recruitment, talent acquisition, candidate experience, onboarding, employee administration, HR operations, talent management, workforce planning, payroll, training, or employee relations, only when supported by my resume.
- Keep basics.tagline exactly as it appears in the input. Never rewrite, translate, or remove it.

### Resume structure and authorized edits
- Preserve every original top-level and nested key, key name, object, and data type.
- Never add, delete, rename, or restructure a resume field or object.
- The only existing resume values you may edit are:
  - basics.title
  - basics.summary
  - skillGroups[*].items[*]
  - experience[*].bullets[*]
  - experience[*].contracts[*].bullets[*] (only for experiences that have a contracts array).
- Do not change group titles, soft skills, role titles, employers, locations, contract types, dates, education, certifications, highlights, tagline, or any other value.
- The sole permitted structural addition is exactly one top-level "application" object using the schema specified below.

### Skills
- Build a focused skills section for the specific HR offer.
- Put mandatory skills first, followed by relevant transferable skills.
- Use short, canonical skill names.
- Never duplicate skills, including aliases, spelling variations, or case variants.
- Use the offer's exact terminology when my resume supports the skill under different wording.
- Include HR tools, ATS platforms, HRIS software, payroll systems, recruitment platforms, and office tools only when supported by my resume.
- Do not add tools or software simply because they appear in the job description.
- Distinguish direct HR skills from transferable administrative, organizational, communication, and coordination skills.
- If I have few matching HR skills, prioritize my genuine skills and transferable experience rather than artificially filling the section with unsupported HR keywords.

### Soft skills
- Preserve the existing softSkills field and its contents unchanged.
- Do not add personality traits or behavioral competencies that are not already supported by my resume.

### Professional experience
- Adapt the structure, content, and emphasis of my professional experience to the specific HR position.
- Rewrite, reorder, merge, or remove bullets to highlight relevant responsibilities, skills, and achievements.
- Prioritize evidence related to the target HR specialization.
- Identify and incorporate relevant experience I genuinely have but may have omitted from my current CV, using information available in my resume and previous descriptions I have provided.
- Where direct HR experience is absent, identify transferable responsibilities such as:
  - Administrative coordination.
  - Document management and record keeping.
  - Communication with internal and external stakeholders.
  - Scheduling and coordination.
  - Reporting and data management.
  - Confidential information handling, only when explicitly supported.
  - Process improvement.
  - Project coordination.
  - Team collaboration.
- Do not turn these transferable responsibilities into recruitment, payroll, employee relations, onboarding, or HR administration experience unless the evidence explicitly supports it.
- Use clear action verbs and concise, professional language.
- Explain what I did, how I did it, and why it mattered whenever the available information supports those details.
- Preserve all existing quantified results exactly.
- Never invent recruitment volumes, hiring targets, candidate pipelines, employee headcounts, payroll figures, retention rates, or business results.
- Keep employer names, actual job titles, employment dates, and protected resume fields unchanged.
- Do not promote me to a more senior position or imply responsibilities I did not have.
- Avoid repetitive bullets and keyword stuffing.
- Ensure the final resume remains credible and defensible during an HR interview.

### Formatting
- Preserve education dates and periods.
- Do not remove education, certifications, or other existing sections unless explicitly authorized.
- If an experience contains a "contracts" array, tailor each contract's bullets separately.
- Keep every contract's contractType and period unchanged.
- Never move bullets between contracts or merge, add, or remove contracts.

## STEP 3 — Extract the job information

Extract the following information from the job offer:

- title: Exact job title.
- company: Company name or "" if unavailable.
- url: Job offer URL or "".
- location: Job location or "".
- contractType: CDI, CDD, internship, apprenticeship, temporary, freelance, etc.
- summary: 2–3 sentences describing the position.
- missions: Short bullet strings describing the main responsibilities.
- requirements: Short bullet strings describing the qualifications.
- jobDescription: Cleaned copy of the complete job description.

## STEP 4 — Assess my chances honestly

- Classify every stated qualification as either mandatory or desirable based on the wording and context of the offer.
- Do not treat desirable qualifications as mandatory.
- Calculate matchScore as an evidence-based integer from 0 to 100 using this fixed rubric:
  - Mandatory requirements coverage: 50 points.
  - Relevant responsibilities and demonstrated achievements: 25 points.
  - HR specialization and industry fit: 15 points.
  - Desirable qualifications: 10 points.
- Award points only for evidence in my resume.
- Never count the same evidence twice across categories.
- qualified: true only if I meet the explicit hard-gate requirements and most other mandatory requirements.
- Nice-to-have gaps alone must not make me unqualified.
- Prefix every item in application.requirements with either:
  - "Must-have:"
  - "Nice-to-have:"
- Write assessment in 2–3 sentences, identifying:
  - My strongest relevant qualifications.
  - My transferable skills.
  - The most important mandatory gaps.
- missingProfile: Write one concise paragraph identifying the missing HR skills, tools, experience, qualifications, or professional signals required for the role but not demonstrated in my resume.
- Distinguish between a lack of evidence and confirmed lack of experience. Never assume that I have no experience simply because something is absent from the CV.
- The matchScore measures resume evidence fit, NOT the probability of getting an interview.

## OUTPUT FORMAT (STRICT)

- Return ONLY one valid JSON object, directly parseable with JSON.parse().
- Preserve all original resume keys, nested keys, data types, object counts, and every value outside the explicitly authorized paths.
- Add exactly ONE top-level key named "application" with this schema:

{
  "title": "",
  "company": "",
  "url": "",
  "location": "",
  "contractType": "",
  "summary": "",
  "missions": [],
  "requirements": [],
  "jobDescription": "",
  "missingProfile": "",
  "qualified": false,
  "matchScore": 0,
  "assessment": ""
}

- Do not add any other fields.
- Do not include Markdown, code fences, comments, or explanations outside the JSON object.
- Ensure the JSON is valid and directly parseable.
- Base all conclusions exclusively on evidence in my resume and the stated job requirements.

=== JOB DESCRIPTION BELOW ===
[PASTE THE HR JOB OFFER HERE]
`;

function getExperienceSeedKey(experience, index) {
  return `${experience.company || ''}::${experience.role || ''}::${index}`;
}

function loadExperienceSeeds(experiences) {
  const saved = localStorage.getItem('resumePromptExperienceSeeds_v1');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      return {};
    }
  }

  const legacySeeds = (localStorage.getItem('resumePromptSeeds_v1') || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!legacySeeds.length) return {};

  let selectedExperiences = experiences.map((_, index) => index);
  try {
    const savedSelection = JSON.parse(localStorage.getItem('resumePromptSeedExperiences_v1') || 'null');
    if (Array.isArray(savedSelection)) {
      selectedExperiences = savedSelection.filter(
        (index) => Number.isInteger(index) && index >= 0 && index < experiences.length,
      );
    }
  } catch {
    selectedExperiences = experiences.map((_, index) => index);
  }

  return Object.fromEntries(
    selectedExperiences.map((index) => [getExperienceSeedKey(experiences[index], index), legacySeeds.join('\n')]),
  );
}

function buildResumePrompt(resumeJson, jobOffer = '', instructions = '', experienceSeeds = {}) {
  let resume = (resumeJson || '').trim() || '{ /* your resume JSON */ }';
  const promptInstructions = instructions.trim() || DEFAULT_PROMPT_INSTRUCTIONS;
  const seededExperiences = [];

  if (Object.values(experienceSeeds).some((value) => typeof value === 'string' && value.trim()) && resumeJson.trim()) {
    const resumeData = JSON.parse(resume);
    if (Array.isArray(resumeData.experience)) {
      resumeData.experience.forEach((experience, index) => {
        const lines = String(experienceSeeds[getExperienceSeedKey(experience, index)] || '')
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        if (!lines.length) return;

        seededExperiences.push({
          label: [experience.role, experience.company].filter(Boolean).join(' · ')
            || `Experience ${index + 1}`,
          lines,
        });
        if (!Array.isArray(experience.bullets)) return;
        const existingBullets = new Set(experience.bullets);
        lines.forEach((line) => {
          if (!existingBullets.has(line)) {
            experience.bullets.push(line);
            existingBullets.add(line);
          }
        });
      });
    }
    resume = JSON.stringify(resumeData, null, 2);
  }

  return `${promptInstructions}

## FACTUAL ACCURACY (mandatory)
- This mandatory section overrides any conflicting instruction above.
- Never invent HR experience, recruitment activities, employee management responsibilities, employers, job titles, achievements, metrics, qualifications, certifications, or proficiency levels.
- Do not infer HR expertise or responsibilities simply because they appear in the job offer.
- Distinguish clearly between direct HR experience and transferable experience from other professional fields.
- Administrative coordination, project management, communication, reporting, data management, documentation, scheduling, and stakeholder coordination may be highlighted when supported by the resume, but must never be presented as direct HR experience without evidence.
- Preserve all original resume keys, nested keys, data types, and object counts.
- The only editable existing paths are:
  - basics.title
  - basics.summary
  - skillGroups[*].items[*]
  - experience[*].bullets[*]
  - experience[*].contracts[*].bullets[*]
- Within these authorized arrays, entries may be added, removed, reordered, or rewritten for tailoring.
- Never add, delete, rename, or restructure any resume field or object.
- Keep all other values unchanged, except for the explicitly authorized language adaptation described below.
- The only permitted structural addition is one top-level application object with the exact schema specified above.
- Do not invent or change employers, actual experience titles, achievements, metrics, qualifications, contract types, or dates and periods.
- Preserve education periods from the input.
- Preserve the exact languages array, including names, levels, and order.
- Never upgrade my seniority or present transferable skills as proven HR expertise.

## HR ROLE IDENTIFICATION AND SPECIALIZATION (mandatory)
- Identify the exact HR specialization targeted by the job offer before tailoring the resume.
- Possible specializations include:
  - Talent Acquisition / Recruitment.
  - Recruitment Coordination.
  - Human Resources Assistant.
  - HR Administration.
  - HR Business Partner.
  - Talent Management.
  - Learning & Development / Training.
  - Payroll Administration.
  - Compensation & Benefits.
  - HR Operations.
  - Employee Experience.
  - People Operations.
  - Workforce Planning.
  - Employer Branding.
  - HR Analytics.
  - Employee Relations.
- Do not treat all HR positions as interchangeable.
- Tailor the resume to the actual specialization and responsibilities described in the offer.
- Prioritize the most important requirements of the specific position rather than adding generic HR keywords.
- If the role requires direct recruitment, payroll, employment law, employee relations, or HRIS experience, verify that my resume provides evidence before including these competencies.
- If the position is a generalist HR role, prioritize the HR responsibilities explicitly mentioned in the offer and supported by my experience.

## HR SKILLS AND TOOL ALIGNMENT (mandatory)
- Identify the HR tools, software, methodologies, and technical skills requested by the offer.
- Examples include:
  - ATS: Workday, Greenhouse, Lever, SmartRecruiters, Taleo.
  - HRIS: SAP SuccessFactors, Workday, Lucca, ADP.
  - Recruitment platforms: LinkedIn Recruiter, Indeed, Welcome to the Jungle.
  - Payroll tools: Silae, Sage, ADP.
  - Office tools: Excel, Word, PowerPoint, Outlook.
  - Reporting and analytics tools: Power BI, Tableau, Excel.
- These are examples, not assumed user skills.
- Include a tool only when my resume or the additional information explicitly supports its use.
- Do not claim experience with an ATS, HRIS, payroll platform, recruitment platform, or HR software simply because it is requested.
- If I have used a comparable tool, highlight the transferable technical capability without falsely claiming experience with the requested software.
- Prioritize HR-specific competencies when demonstrated, followed by relevant administrative, organizational, analytical, and communication skills.
- Never add generic HR skills to artificially increase the ATS match score.

## PROFESSIONAL EXPERIENCE ALIGNMENT (mandatory)
- Adapt existing experience bullets to the target HR role while preserving the underlying facts.
- Identify relevant responsibilities that may be transferable to HR, such as:
  - Administrative and operational coordination.
  - Internal and external stakeholder communication.
  - Document preparation and management.
  - Reporting and data analysis.
  - Scheduling and planning.
  - Process monitoring and improvement.
  - Confidential information handling, only when explicitly supported.
  - Team collaboration.
  - Project coordination.
  - Organization and follow-up of activities.
- Incorporate these responsibilities only when they are genuinely supported by my experience.
- For recruitment roles, emphasize candidate communication, interview coordination, sourcing, screening, and recruitment administration only if demonstrated.
- For HR administration roles, emphasize employee records, administrative documentation, contract follow-up, and personnel administration only if demonstrated.
- For payroll roles, emphasize payroll processing, payroll controls, social declarations, and compensation administration only if demonstrated.
- For HR Business Partner roles, emphasize employee relations, management support, workforce planning, and HR strategy only if demonstrated.
- For Talent Management roles, emphasize performance management, career development, training coordination, and talent assessment only if demonstrated.
- For HR Analytics roles, emphasize reporting, dashboards, data analysis, data quality, and HR indicators when supported by my actual experience.
- Never convert general project coordination into recruitment coordination or employee management without evidence.
- Do not claim experience managing candidates, employees, recruitment processes, payroll, or HR budgets unless explicitly supported.
- Use clear action verbs and concise, professional wording.
- Avoid repeating the same skills and responsibilities in every experience.
- Prioritize recruiter readability, credibility, and factual relevance over keyword stuffing.
- Ensure that every bullet remains defensible during an interview.

## JOB MATCH SCORING (mandatory)
- Classify offer requirements as "Must-have" or "Nice-to-have" based on explicit wording and context.
- Translate these labels into the offer language.
- Do not promote desirable requirements into mandatory requirements.
- Score evidence from 0 to 100 with this fixed weighting:
  - Mandatory requirements coverage: 50 points.
  - Relevant responsibilities and demonstrated achievements: 25 points.
  - HR specialization and professional experience fit: 15 points.
  - Desirable requirements: 10 points.
- Award points only for evidence actually present in the resume or explicitly supplied project and experience details.
- Do not count the same evidence twice across categories.
- Set application.qualified to true only if explicit hard gates are met and most other mandatory requirements are evidenced.
- If the offer has no explicit hard gates, require evidence for most mandatory requirements.
- Nice-to-have gaps alone must not make the candidate unqualified.
- Keep application.assessment to 2–3 sentences explaining:
  - The strongest relevant evidence.
  - The transferable skills.
  - The most important mandatory gaps.
- Treat matchScore as evidence-based resume fit, never as an interview probability.
- A candidate with transferable skills but no demonstrated direct HR experience must not receive an artificially high score for an HR specialist role.

## OFFER LANGUAGE (mandatory — highest priority)
- Write the ENTIRE output in the offer language detected in STEP 0, whatever that language is.
- Never default to English or keep the source-resume language out of habit.
- Translate every human-readable field into the offer language:
  - basics.title
  - basics.summary
  - skill-group titles, if explicitly authorized by the application.
  - Skill items that are common words.
  - Soft skills, if explicitly authorized by the application.
  - Experience and education titles, descriptions, and bullets, subject to the factual accuracy rules.
  - All generated application fields.
- Keep unchanged:
  - Proper names.
  - Company names.
  - Product and software names.
  - Established technology and tool names.
  - The languages array, exactly as provided.
- Use natural, idiomatic, professional terminology appropriate to the target country's HR market.
- Use standard HR job titles in the offer language rather than awkward literal translations.
- Do not mix languages unnecessarily.

## My current resume (JSON)
${resume}

## Seeds
- The user-provided project and experience details below have been added to the corresponding experience bullets in the resume JSON.
- Treat them as factual information supplied by the user.
- Use them to enrich only the corresponding experience.
- Do not invent additional responsibilities, achievements, or HR expertise.

${seededExperiences.map(({ label, lines }) => `### ${label}\n${lines.map((line) => `- ${line}`).join('\n')}`).join('\n\n') || '(No experience-specific project details provided.)'}

## Fixed fields omitted from the JSON
- Contact information (basics.email, basics.phone, basics.location) and links are managed by the application.
- Do not add these fields to the output.
- The application restores their fixed values automatically.
- Languages are included in the JSON above.
- Keep the languages array exactly as provided (same names, levels, and order).
- Do not translate, remove, add, or reorder languages.
- Preserve the exact structure of the JSON provided above.

=== JOB DESCRIPTION BELOW ===
(Everything after this line is the job description.)
${jobOffer.trim() || '(Paste the full HR job offer here.)'}
`;
}

async function createApplication(payload) {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('create failed');
  return res.json();
}

function ActionBar({ locale, onLocaleChange, onDownload }) {
  return (
    <div className="resume_actions" aria-label="Resume actions">
      <div className="locale_switch" role="group" aria-label="Language switcher">
        <button
          type="button"
          className={`action_button ${locale === 'fr' ? 'is-active' : ''}`}
          onClick={() => onLocaleChange('fr')}
        >
          FR
        </button>
        <button
          type="button"
          className={`action_button ${locale === 'en' ? 'is-active' : ''}`}
          onClick={() => onLocaleChange('en')}
        >
          EN
        </button>
      </div>
      <button type="button" className="action_button action_button_primary" onClick={onDownload}>
        <FontAwesomeIcon icon={["fas", "download"]} />
        <span>{locale === 'fr' ? 'Télécharger PDF' : 'Download PDF'}</span>
      </button>
    </div>
  );
}

function Home({ resumeData, showImage = true }) {
  return (
    <section className="home" id="home">
      <div className="home_container section bd-grid">
        <div className="home_data bd-grid">
          {showImage && (
            <img src="/pictures/profile_2.jpg" className="home_img" alt="Ayoub Boudra portrait" />
          )}
          <h1 className="home_title">
            {resumeData.basics.firstName} <b>{resumeData.basics.lastName}</b>
          </h1>
          <h3 className="home_profession">{resumeData.basics.title}</h3>
        </div>
      </div>
    </section>
  );
}

function Contact({ resumeData }) {
  const contactItems = getContactItems(resumeData);

  return (
    <div className="contact_bar" aria-label="Contact details">
      {contactItems.map((item) =>
        item.href ? (
          <a
            className="home_link"
            href={item.href}
            key={item.value}
            target={item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? undefined : '_blank'}
            rel={item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
          >
            <FontAwesomeIcon icon={["fas", item.icon]} className="home_icon" />
            <span>{item.value}</span>
          </a>
        ) : (
          <span className="home_link" key={item.value}>
            <FontAwesomeIcon icon={["fas", item.icon]} className="home_icon" />
            <span>{item.value}</span>
          </span>
        )
      )}

      {resumeData.links.map((link) => (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className="social_link" key={link.label}>
          <FontAwesomeIcon icon={getLinkIcon(link)} className="social_icon" />
          <span>{link.value}</span>
        </a>
      ))}
    </div>
  );
}

function Skills({ resumeData }) {
  const skillGroups = resumeData.skillGroups ?? [];

  return (
    <section className="skills section" id="skills">
      <SectionTitle>{resumeData.labels?.skills ?? 'Core Skills'}</SectionTitle>
      <div className="skills_groups compact_list">
        {skillGroups.map((group) => (
          <div key={group.title} className="skill_group">
            <h3 className="skill_group_title">{group.title}</h3>
            <div className="skill_chips">
              {group.items.map((item) => (
                <span className="skill_chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SoftSkillsSection({ resumeData }) {
  const softSkills = resumeData.softSkills ?? [];

  if (!softSkills.length) return null;

  return (
    <section className="soft_skills section" id="soft-skills">
      <SectionTitle>{resumeData.labels?.softSkills ?? 'Soft Skills'}</SectionTitle>
      <div className="skill_chips soft_skills_chips">
        {softSkills.map((item) => (
          <span className="skill_chip" key={item}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({ resumeData, locale }) {
  return (
    <section className="experience section" id="experience">
      <div className="experience_section_header">
        <SectionTitle>{resumeData.labels?.experience ?? 'Experience'}</SectionTitle>
        <ExperienceTotals locale={locale} />
      </div>
      <div className="experience_container bd-grid">
        {resumeData.experience.map((job, index) => {
          const hasNext = index < resumeData.experience.length - 1;

          if (!job.contracts) {
            return (
              <div className="experience_content" key={`${job.company}-${job.role}`}>
                <div className="experience_time">
                  <span className="experience_rounder"></span>
                  {hasNext && <span className="experience_line"></span>}
                </div>

                <div className="experience_data bd-grid">
                  <div className="experience_header">
                    <h3 className="experience_title">{job.role}</h3>
                    {job.period && <span className="experience_year experience_period">{job.period}</span>}
                  </div>
                  <span className="experience_employer">{job.company}</span>
                  {(job.location || job.contractType) && (
                    <div className="experience_meta">
                      {job.location && <span className="experience_meta_item experience_location">{job.location}</span>}
                      {job.contractType && <ExperienceTypeBadges value={job.contractType} />}
                    </div>
                  )}
                  <ul className="experience_description experience_list">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          }

          return (
            <div className="experience_content experience_content--stacked" key={`${job.company}-${job.role}`}>
              <div className="experience_time">
                <span className="experience_track"></span>
                <span className="experience_rounder"></span>
              </div>

              <div className="experience_data bd-grid">
                <div className="experience_header">
                  <h3 className="experience_title">{job.role}</h3>
                </div>
                <span className="experience_employer">{job.company}</span>
                {job.location && (
                  <div className="experience_meta">
                    <span className="experience_meta_item experience_location">{job.location}</span>
                  </div>
                )}
              </div>

              {job.contracts.map((contract, contractIndex) => {
                const isLastContract = contractIndex === job.contracts.length - 1;
                return (
                  <Fragment key={`${contract.contractType}-${contract.period}`}>
                    <div className="experience_time experience_contract_time">
                      <span className={`experience_track${isLastContract && hasNext ? ' experience_track--bridge' : ''}`}></span>
                      <span className="experience_rounder experience_rounder--contract"></span>
                    </div>
                    <div className={`experience_contract${contractIndex > 0 ? ' experience_contract--next' : ''}`}>
                      <div className="experience_contract_head">
                        <ExperienceTypeBadges value={contract.contractType} />
                        <span className="experience_year experience_period">{contract.period}</span>
                      </div>
                      <ul className="experience_description experience_list">
                        {(contract.bullets ?? []).map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </Fragment>
                );
              })}
              {job.bullets?.length > 0 && (
                <ul className="experience_description experience_list experience_shared_list">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EducationSection({ resumeData }) {
  return (
    <section className="education section" id="education">
      <SectionTitle>{resumeData.labels?.education ?? 'Education'}</SectionTitle>

      <div className="education_container bd-grid">
        {resumeData.education.map((item) => (
          <div className="experience_content" key={`${item.degree}-${item.period}`}>
            <div className="experience_data bd-grid">

              <div className="experience_header">
                <h3 className="experience_title">{item.degree}</h3>
                {item.period && <span className="experience_year">{item.period}</span>}
              </div>
              <span className="experience_company">
                {item.school}
                {item.location && <span className="experience_location"> — {item.location}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SummarySection({ resumeData }) {
  if (!resumeData.basics?.summary) return null;
  return (
    <section className="summary section" id="summary">
      <SectionTitle>{'Profil'}</SectionTitle>
      <p className="summary_text">{resumeData.basics.summary}</p>
    </section>
  );
}

function LanguagesSection({ resumeData }) {
  const languages = resumeData.languages ?? [];
  if (languages.length === 0) return null;
  return (
    <section className="languages section" id="languages">
      <SectionTitle>{resumeData.labels?.languages ?? 'Languages'}</SectionTitle>
      <div className="languages_container">
        <ul className="languages_content bd-grid">
          {languages.map((language) => (
            <li key={language.name} className="languages_name language_row">
              <span className="languages_text">{language.name}</span>
              <span className="language_level">{language.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CertificationsSection({ resumeData }) {
  const certifications = resumeData.certifications ?? [];
  if (certifications.length === 0) return null;
  return (
    <section className="certifications section" id="certifications">
      <SectionTitle>{resumeData.labels?.certifications ?? 'Certifications'}</SectionTitle>
      <ul className="certification_list">
        {certifications.map((item, index) => (
          <li className="certification_item" key={`${item.name}-${index}`}>
            {item.href ? <a href={item.href} target="_blank" rel="noreferrer" className="certification_name">{item.name}</a> : <span className="certification_name">{item.name}</span>}
            {item.provider && <span className="certification_provider">{item.provider}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function HighlightsSection({ resumeData }) {
  const highlights = resumeData.highlights ?? [];
  if (highlights.length === 0) return null;
  return (
    <section className="highlights section" id="highlights">
      <SectionTitle>{resumeData.labels?.highlights ?? 'Highlights'}</SectionTitle>
      <ul className="highlight_list">{highlights.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
    </section>
  );
}

function PageNav({ page, onPageChange, locale }) {
  const isCvActive = page === 'cv' || page === 'application';
  const isCoverLetterActive = page === 'cover-letter';
  const isTrackerActive = page === 'tracker';

  return (
    <nav className="page_nav" aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}>
      <button
        type="button"
        className={`page_nav_button ${isCvActive ? 'is-active' : ''}`}
        onClick={() => onPageChange('cv')}
      >
        {locale === 'fr' ? 'CV' : 'Resume'}
      </button>
      <button
        type="button"
        className={`page_nav_button ${isCoverLetterActive ? 'is-active' : ''}`}
        onClick={() => onPageChange('cover-letter')}
      >
        {locale === 'fr' ? 'Lettre de motivation' : 'Cover Letter'}
      </button>
      <button
        type="button"
        className={`page_nav_button ${isTrackerActive ? 'is-active' : ''}`}
        onClick={() => onPageChange('tracker')}
      >
        {locale === 'fr' ? 'Candidatures' : 'Applications'}
      </button>
    </nav>
  );
}

function CandidateSidebar({ locale, open, onToggle, refreshKey, onSelect, onApps, activeId }) {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState('');
  const [companyQuery, setCompanyQuery] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/applications')
      .then((r) => {
        if (!r.ok) throw new Error('load failed');
        return r.json();
      })
      .then((data) => {
        if (active) {
          const list = Array.isArray(data) ? data : [];
          setApps(list);
          setError('');
          onApps?.(list);
        }
      })
      .catch(() => {
        if (active) setError(locale === 'fr' ? 'Hors ligne' : 'Offline');
      });
    return () => {
      active = false;
    };
  }, [refreshKey, locale, onApps]);

  const labels = {
    title: locale === 'fr' ? 'Mes candidatures' : 'My applications',
    empty: locale === 'fr' ? 'Aucune candidature.' : 'No applications yet.',
    open: locale === 'fr' ? 'Ouvrir la liste' : 'Open list',
    close: locale === 'fr' ? 'Réduire la liste' : 'Collapse list',
    search: locale === 'fr' ? 'Rechercher une entreprise…' : 'Search company…',
    noMatch: locale === 'fr' ? 'Aucune entreprise trouvée.' : 'No companies found.',
  };
  const normalizedCompanyQuery = companyQuery.trim().toLocaleLowerCase();
  const filteredApps = apps.filter((app) =>
    !normalizedCompanyQuery || (app.company ?? '').toLocaleLowerCase().includes(normalizedCompanyQuery),
  );

  return (
    <aside className={`cand_sidebar ${open ? 'is-open' : 'is-collapsed'}`}>
      <button
        type="button"
        className="cand_sidebar_toggle"
        onClick={onToggle}
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={['fas', open ? 'angles-left' : 'angles-right']} />
      </button>
      {open && (
        <div className="cand_sidebar_body">
          <h2 className="cand_sidebar_title">{labels.title}</h2>
          {apps.length > 0 && (
            <label className="cand_sidebar_search">
              <FontAwesomeIcon icon={['fas', 'magnifying-glass']} aria-hidden="true" />
              <input
                type="search"
                value={companyQuery}
                onChange={(event) => setCompanyQuery(event.target.value)}
                placeholder={labels.search}
                aria-label={labels.search}
              />
            </label>
          )}
          {error && <p className="cand_sidebar_error">{error}</p>}
          {apps.length === 0 && !error ? (
            <p className="cand_sidebar_empty">{labels.empty}</p>
          ) : filteredApps.length === 0 && !error ? (
            <p className="cand_sidebar_empty">{labels.noMatch}</p>
          ) : (
            <ul className="cand_sidebar_list">
              {filteredApps.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    className={`cand_sidebar_item ${activeId === app.id ? 'is-active' : ''}`}
                    onClick={() => onSelect(app)}
                  >
                    <span className="cand_sidebar_item_title">{app.title}</span>
                    <span className="cand_sidebar_item_company">{app.company}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}

function LetterHistorySidebar({ locale, open, onToggle, letters, activeId, onSelect }) {
  const [companyQuery, setCompanyQuery] = useState('');
  const fr = locale === 'fr';
  const labels = {
    title: fr ? 'Historique des lettres' : 'Cover letter history',
    defaultItem: fr ? 'Lettre par défaut' : 'Default cover letter',
    empty: fr ? 'Aucune lettre enregistrée.' : 'No saved letters yet.',
    open: fr ? 'Ouvrir la liste' : 'Open list',
    close: fr ? 'Réduire la liste' : 'Collapse list',
    search: fr ? 'Rechercher une entreprise…' : 'Search company…',
    noMatch: fr ? 'Aucune entreprise trouvée.' : 'No companies found.',
  };
  const normalizedQuery = companyQuery.trim().toLocaleLowerCase();
  const filteredLetters = letters.filter((item) =>
    !normalizedQuery || (item.company ?? '').toLocaleLowerCase().includes(normalizedQuery),
  );

  return (
    <aside className={`cand_sidebar ${open ? 'is-open' : 'is-collapsed'}`}>
      <button
        type="button"
        className="cand_sidebar_toggle"
        onClick={onToggle}
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={['fas', open ? 'angles-left' : 'angles-right']} />
      </button>
      {open && (
        <div className="cand_sidebar_body">
          <h2 className="cand_sidebar_title">{labels.title}</h2>
          {letters.length > 0 && (
            <label className="cand_sidebar_search">
              <FontAwesomeIcon icon={['fas', 'magnifying-glass']} aria-hidden="true" />
              <input
                type="search"
                value={companyQuery}
                onChange={(event) => setCompanyQuery(event.target.value)}
                placeholder={labels.search}
                aria-label={labels.search}
              />
            </label>
          )}
          <ul className="cand_sidebar_list">
            <li>
              <button
                type="button"
                className={`cand_sidebar_item ${activeId === null ? 'is-active' : ''}`}
                onClick={() => onSelect(null)}
              >
                <span className="cand_sidebar_item_title">{labels.defaultItem}</span>
              </button>
            </li>
            {letters.length === 0 && <p className="cand_sidebar_empty">{labels.empty}</p>}
            {letters.length > 0 && filteredLetters.length === 0 && (
              <p className="cand_sidebar_empty">{labels.noMatch}</p>
            )}
            {filteredLetters.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`cand_sidebar_item ${activeId === item.id ? 'is-active' : ''}`}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="cand_sidebar_item_title">{item.jobTitle || item.company}</span>
                  <span className="cand_sidebar_item_company">{item.company}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function FloatingTools({ locale, page, onCopy, onPaste, onCopyPrompt, onEditResume, onCopyCoverLetter, onEditCoverLetter }) {
  if (page === 'tracker') return null;
  const isCoverLetter = page === 'cover-letter';

  const tools = [
    isCoverLetter
      ? { key: 'copy-cl', icon: 'copy', label: locale === 'fr' ? 'Copier le texte' : 'Copy text', action: onCopyCoverLetter }
      : { key: 'copy', icon: 'copy', label: locale === 'fr' ? 'Copier JSON' : 'Copy JSON', action: onCopy },
    { key: 'prompt', icon: 'wand-magic-sparkles', label: locale === 'fr' ? 'Prompt IA' : 'AI prompt', action: onCopyPrompt },
    isCoverLetter && { key: 'edit-cl', icon: 'pen-to-square', label: locale === 'fr' ? 'Modifier la lettre' : 'Edit cover letter', action: onEditCoverLetter },
    !isCoverLetter && (page === 'application' || page === 'cv') && { key: 'edit', icon: 'pen-to-square', label: locale === 'fr' ? 'Modifier ce CV' : 'Edit this resume', action: onEditResume },
    isCoverLetter
      ? { key: 'paste', icon: 'paste', label: locale === 'fr' ? 'Coller JSON' : 'Paste JSON', action: onPaste }
      : { key: 'paste', icon: 'paste', label: locale === 'fr' ? 'Coller JSON' : 'Paste JSON', action: onPaste },
  ].filter(Boolean);

  return (
    <div className="floating_tools" aria-label={locale === 'fr' ? 'Outils' : 'Tools'}>
      {tools.map((tool) => (
        <button key={tool.key} type="button" className="floating_tool_menu_button" onClick={tool.action}>
          <FontAwesomeIcon icon={['fas', tool.icon]} />
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  );
}

function ActionToast({ message }) {
  if (!message) return null;
  const isError = /impossible|invalid|invalide|failed|échec|offline|hors ligne/i.test(message);
  return (
    <div className={`action_toast ${isError ? 'is-error' : 'is-success'}`} role={isError ? 'alert' : 'status'} aria-live="polite">
      <FontAwesomeIcon icon={['fas', isError ? 'triangle-exclamation' : 'circle-check']} />
      <span>{message}</span>
    </div>
  );
}

const SECTION_ORDER = ['profile', 'contact', 'summary', 'highlights', 'skills', 'softSkills', 'languages', 'experience', 'education', 'certifications'];

const SECTION_COMPONENTS = {
  profile: Home,
  contact: Contact,
  summary: SummarySection,
  highlights: HighlightsSection,
  skills: Skills,
  softSkills: SoftSkillsSection,
  languages: LanguagesSection,
  experience: ExperienceSection,
  education: EducationSection,
  certifications: CertificationsSection,
};

// Base body font size (--normal 0.82rem at 16px root) used to show the CV text size in px.
const BASE_FONT_PX = 0.82 * 16;

const defaultCvSettings = {
  fontScale: 1,
  titleScale: 1,
  titleCaps: true,
  accent: '#12467c',
  showImage: true,
  photoSize: 96,
  columns: { profile: 'left', contact: 'left', summary: 'right', highlights: 'right', skills: 'left', softSkills: 'left', languages: 'left', experience: 'right', education: 'right', certifications: 'left' },
  visible: { profile: true, contact: true, summary: true, highlights: true, skills: true, softSkills: true, languages: true, experience: true, education: true, certifications: true },
  sectionScale: { profile: 1, contact: 0.8, summary: 0.81, highlights: 1, skills: 0.78, softSkills: 0.77, languages: 0.81, experience: 0.81, education: 0.79, certifications: 1 },
  experienceSpacing: { marginTopOn: true, marginTop: 0.4, gapOn: true, gap: 0.34 },
};

const CANADA_FIELD_ORDER = ['name', 'title', 'tagline', 'location', 'phone', 'email', 'links', 'summary', 'skills', 'languages', 'experience', 'education'];

const defaultCanadaSettings = {
  fontScale: 1,
  pageMargins: { top: 12, right: 15, bottom: 12, left: 15 },
  visible: Object.fromEntries(CANADA_FIELD_ORDER.map((key) => [key, true])),
};

const COLOR_PRESETS = ['#12467c', '#0d3763', '#1f7a44', '#a9761a', '#b23b3b', '#5b3fa0', '#0f766e', '#111827'];

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function CvCustomizer({
  locale,
  variant = 'cv',
  open,
  onToggle,
  settings,
  onSettingsChange,
  onSave,
  onReset,
  saveState,
}) {
  const fr = locale === 'fr';
  const isCanada = variant === 'canada';
  const [openGaps, setOpenGaps] = useState({});
  const [hex, setHex] = useState('');

  const patch = (next) => onSettingsChange({ ...settings, ...next });
  const setColumn = (key, col) =>
    onSettingsChange({ ...settings, columns: { ...settings.columns, [key]: col } });
  const setVisible = (key, val) =>
    onSettingsChange({ ...settings, visible: { ...settings.visible, [key]: val } });
  const setSectionScale = (key, val) =>
    onSettingsChange({ ...settings, sectionScale: { ...settings.sectionScale, [key]: val } });
  const setExperienceSpacing = (patch) =>
    onSettingsChange({ ...settings, experienceSpacing: { ...defaultCvSettings.experienceSpacing, ...settings.experienceSpacing, ...patch } });
  const setPageMargin = (edge, value) =>
    onSettingsChange({ ...settings, pageMargins: { ...settings.pageMargins, [edge]: value } });

  const sectionLabels = fr
    ? { profile: 'Identité', contact: 'Contact', summary: 'Profil', highlights: 'Points forts', languages: 'Langues', skills: 'Compétences', softSkills: 'Qualités', experience: 'Expériences professionnelles', education: 'Formations', certifications: 'Certifications' }
    : { profile: 'Identity', contact: 'Contact', summary: 'Profile', highlights: 'Highlights', languages: 'Languages', skills: 'Skills', softSkills: 'Soft Skills', experience: 'Experience', education: 'Education', certifications: 'Certifications' };
  const canadaFieldLabels = fr
    ? { name: 'Nom', title: 'Titre professionnel', tagline: 'Accroche', location: 'Localisation', phone: 'Téléphone', email: 'E-mail', links: 'Liens', education: 'Formation', experience: 'Expérience', skills: 'Compétences', languages: 'Langues' }
    : { name: 'Name', title: 'Professional title', tagline: 'Tagline', location: 'Location', phone: 'Phone', email: 'Email', links: 'Links', education: 'Education', experience: 'Experience', skills: 'Skills', languages: 'Languages' };

  function applyHex() {
    const value = hex.trim();
    if (!HEX_RE.test(value)) return;
    const full =
      value.length === 4
        ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
        : value;
    patch({ accent: full });
    setHex('');
  }

  const saveLabel =
    saveState === 'saving'
      ? fr ? 'Enregistrement…' : 'Saving…'
      : saveState === 'saved'
        ? fr ? 'Enregistré !' : 'Saved!'
        : saveState === 'error'
          ? fr ? 'Échec' : 'Failed'
          : fr ? 'Enregistrer' : 'Save';

  return (
    <>
      <button
        type="button"
        className={`cvx-fab ${open ? 'is-open' : ''}`}
        onClick={onToggle}
        aria-label={fr ? 'Personnaliser le CV' : 'Customize resume'}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={['fas', open ? 'xmark' : 'sliders']} />
      </button>
      {open && (
        <div className="cvx-panel" role="dialog" aria-label={fr ? 'Personnalisation' : 'Customization'}>
          <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Taille du texte' : 'Text size'}</h3>
            <div className="cvx-row">
              <input
                type="range"
                min="0.8"
                max="1.15"
                step="0.01"
                value={settings.fontScale}
                onChange={(e) => patch({ fontScale: Number(e.target.value) })}
              />
              <span className="cvx-value">
                {Math.round(settings.fontScale * 100)}% · {isCanada ? `${(settings.fontScale * 10.25).toFixed(1)}pt` : `${(settings.fontScale * BASE_FONT_PX).toFixed(1)}px`}
              </span>
            </div>
          </div>

          {!isCanada && <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Titres de section' : 'Section titles'}</h3>
            <div className="cvx-row">
              <input
                type="range"
                min="0.6"
                max="1.3"
                step="0.01"
                value={settings.titleScale ?? 1}
                onChange={(e) => patch({ titleScale: Number(e.target.value) })}
              />
              <span className="cvx-value">{Math.round((settings.titleScale ?? 1) * 100)}%</span>
            </div>
            <label className="cvx-check">
              <input
                type="checkbox"
                checked={settings.titleCaps ?? true}
                onChange={(e) => patch({ titleCaps: e.target.checked })}
              />
              <span>{fr ? 'Majuscules et espacement' : 'Uppercase and letter spacing'}</span>
            </label>
          </div>}

          {isCanada && <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Marges de la page PDF' : 'PDF page margins'}</h3>
            {[
              ['top', fr ? 'Haut' : 'Top'],
              ['right', fr ? 'Droite' : 'Right'],
              ['bottom', fr ? 'Bas' : 'Bottom'],
              ['left', fr ? 'Gauche' : 'Left'],
            ].map(([edge, label]) => (
              <label className="cvx-margin-control" key={edge}>
                <span>{label} · {settings.pageMargins[edge]} mm</span>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={settings.pageMargins[edge]}
                  onChange={(event) => setPageMargin(edge, Number(event.target.value))}
                />
              </label>
            ))}
          </div>}

          {!isCanada && <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Couleur' : 'Color'}</h3>
            <div className="cvx-swatches">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`cvx-swatch ${settings.accent.toLowerCase() === c.toLowerCase() ? 'is-active' : ''}`}
                  style={{ background: c }}
                  onClick={() => patch({ accent: c })}
                  aria-label={c}
                />
              ))}
            </div>
            <div className="cvx-row">
              <input
                className="cvx-input"
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#1a2b3c"
              />
              <button type="button" className="cvx-btn" onClick={applyHex}>
                {fr ? 'Ajouter' : 'Add'}
              </button>
            </div>
          </div>}

          <div className="cvx-block">
            <h3 className="cvx-title">{isCanada ? (fr ? 'Champs affichés' : 'Visible fields') : (fr ? 'Éléments & colonnes' : 'Elements & columns')}</h3>
            {!isCanada && <label className="cvx-check">
              <input
                type="checkbox"
                checked={settings.showImage}
                onChange={(e) => patch({ showImage: e.target.checked })}
              />
              <span>{fr ? 'Photo de profil' : 'Profile photo'}</span>
            </label>}
            {!isCanada && <label className="cvx-photo-size">
              <span>{fr ? 'Taille de la photo' : 'Photo size'} · {settings.photoSize ?? 96}px</span>
              <input
                type="range"
                min="60"
                max="140"
                step="1"
                value={settings.photoSize ?? 96}
                onChange={(e) => patch({ photoSize: Number(e.target.value) })}
                disabled={!settings.showImage}
              />
            </label>}
            {(isCanada ? CANADA_FIELD_ORDER : SECTION_ORDER).map((key) => (
              <div className="cvx-section-control" key={key}>
              <div className="cvx-field-row">
                <label className="cvx-check">
                  <input
                    type="checkbox"
                    checked={settings.visible[key]}
                    onChange={(e) => setVisible(key, e.target.checked)}
                  />
                  <span>{isCanada ? canadaFieldLabels[key] : sectionLabels[key]}</span>
                </label>
                {!isCanada && <div className="cvx-seg">
                  <button
                    type="button"
                    className={settings.columns[key] === 'left' ? 'is-active' : ''}
                    onClick={() => setColumn(key, 'left')}
                    disabled={!settings.visible[key]}
                  >
                    {fr ? 'G' : 'L'}
                  </button>
                  <button
                    type="button"
                    className={settings.columns[key] === 'right' ? 'is-active' : ''}
                    onClick={() => setColumn(key, 'right')}
                    disabled={!settings.visible[key]}
                  >
                    {fr ? 'D' : 'R'}
                  </button>
                </div>}
                {!isCanada && key === 'experience' && <button
                  type="button"
                  className={`cvx-gap-toggle${openGaps[key] ? ' is-open' : ''}`}
                  onClick={() => setOpenGaps((prev) => ({ ...prev, [key]: !prev[key] }))}
                  title={fr ? 'Espaces de la description' : 'Description spacing'}
                  aria-expanded={!!openGaps[key]}
                >
                  {openGaps[key] ? '▴' : '▾'}
                </button>}
              </div>
              {!isCanada && <label className="cvx-zone-size"><span>{fr ? 'Taille' : 'Size'} {Math.round((settings.sectionScale?.[key] ?? 1) * 100)}% · {((settings.sectionScale?.[key] ?? 1) * settings.fontScale * BASE_FONT_PX).toFixed(1)}px</span><input type="range" min="0.75" max="1.3" step="0.01" value={settings.sectionScale?.[key] ?? 1} onChange={(e) => setSectionScale(key, Number(e.target.value))} /></label>}
              {!isCanada && key === 'experience' && openGaps[key] && (() => {
                const sp = { ...defaultCvSettings.experienceSpacing, ...settings.experienceSpacing };
                return (
                  <div className="cvx-exp-spacing">
                    <label className="cvx-check">
                      <input type="checkbox" checked={sp.marginTopOn} onChange={(e) => setExperienceSpacing({ marginTopOn: e.target.checked })} />
                      <span>{fr ? 'Marge haute' : 'Top margin'}</span>
                    </label>
                    <label className="cvx-zone-size"><span>{fr ? 'Valeur' : 'Value'} {sp.marginTop.toFixed(2)}rem</span><input type="range" min="0" max="2" step="0.02" value={sp.marginTop} disabled={!sp.marginTopOn} onChange={(e) => setExperienceSpacing({ marginTop: Number(e.target.value) })} /></label>
                    <label className="cvx-check">
                      <input type="checkbox" checked={sp.gapOn} onChange={(e) => setExperienceSpacing({ gapOn: e.target.checked })} />
                      <span>{fr ? 'Espace entre lignes (gap)' : 'Line gap'}</span>
                    </label>
                    <label className="cvx-zone-size"><span>{fr ? 'Valeur' : 'Value'} {sp.gap.toFixed(2)}rem</span><input type="range" min="0" max="2" step="0.02" value={sp.gap} disabled={!sp.gapOn} onChange={(e) => setExperienceSpacing({ gap: Number(e.target.value) })} /></label>
                  </div>
                );
              })()}
              </div>

            ))}
          </div>

          <div className="cvx-actions">
            {onSave && <button
              type="button"
              className="cvx-btn cvx-btn--primary"
              onClick={onSave}
              disabled={saveState === 'saving'}
            >
              <FontAwesomeIcon icon={['fas', 'floppy-disk']} /> {saveLabel}
            </button>}
            <button type="button" className="cvx-btn" onClick={onReset}>
              <FontAwesomeIcon icon={['fas', 'rotate-left']} /> {fr ? 'Réinitialiser' : 'Reset'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ServiceModal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className="service-modal-backdrop" onMouseDown={onClose}>
      <div className={`service-modal ${wide ? 'is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="service-modal-head">
          <h2>{title}</h2>
          <button type="button" className="service-close" onClick={onClose} aria-label="Close"><FontAwesomeIcon icon={['fas', 'xmark']} /></button>
        </header>
        <div className="service-modal-body">{children}</div>
      </div>
    </div>
  );
}

function PromptModal({ locale, resumeData, initialInstructions, onSave, onClose, onCopied }) {
  const fr = locale === 'fr';
  const [instructions, setInstructions] = useState(initialInstructions || DEFAULT_PROMPT_INSTRUCTIONS);
  const [jobOffer, setJobOffer] = useState('');
  const [experienceSeeds, setExperienceSeeds] = useState(() => loadExperienceSeeds(resumeData.experience));
  const prompt = buildResumePrompt(
    JSON.stringify(getPromptResume(resumeData), null, 2),
    jobOffer,
    instructions,
    experienceSeeds,
  );

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      onCopied(fr ? 'Prompt et offre copiés !' : 'Prompt and job offer copied!');
      onClose();
    } catch {
      onCopied(fr ? 'Copie impossible' : 'Copy failed');
    }
  }

  return (
    <ServiceModal title={fr ? 'Préparer le prompt IA' : 'Prepare AI prompt'} onClose={onClose} wide>
      <div className="service-form-grid prompt-grid">
        <label className="service-field">
          <span>{fr ? 'Instructions du prompt' : 'Prompt instructions'}</span>
          <textarea rows="14" value={instructions} onChange={(event) => setInstructions(event.target.value)} />
        </label>
        <label className="service-field">
          <span>{fr ? "Offre d'emploi" : 'Job offer'}</span>
          <textarea rows="14" value={jobOffer} onChange={(event) => setJobOffer(event.target.value)} placeholder={fr ? "Collez l'offre complète ici" : 'Paste the full job offer here'} />
        </label>
        <fieldset className="seed-experiences is-full">
          <legend>Seeds</legend>
          <p className="seed-experiences-hint">
            {fr
              ? 'Ajoutez les projets ou détails réellement réalisés pour chaque expérience. Chaque ligne enrichira uniquement l’expérience correspondante dans le prompt.'
              : 'Add projects or details you actually worked on for each experience. Each line will enrich only its matching experience in the prompt.'}
          </p>
          <div className="seed-experiences-list">
            {resumeData.experience.map((experience, index) => {
              const seedKey = getExperienceSeedKey(experience, index);
              const role = experience.role || (fr ? `Expérience ${index + 1}` : `Experience ${index + 1}`);
              return (
                <section className="seed-experience-card" key={seedKey}>
                  <header className="seed-experience-heading">
                    <span className="seed-experience-number">{String(index + 1).padStart(2, '0')}</span>
                    <div className="seed-experience-title">
                      <strong>{role}</strong>
                      {experience.company && <span>{experience.company}</span>}
                    </div>
                  </header>
                  <label className="service-field seed-experience-input">
                    <span>{fr ? 'Projets et détails' : 'Projects and details'}</span>
                    <textarea
                      rows="3"
                      value={experienceSeeds[seedKey] || ''}
                      onChange={(event) => {
                        const nextSeeds = { ...experienceSeeds, [seedKey]: event.target.value };
                        setExperienceSeeds(nextSeeds);
                        localStorage.setItem('resumePromptExperienceSeeds_v1', JSON.stringify(nextSeeds));
                      }}
                      placeholder={fr
                        ? 'Décrivez les projets, tâches ou outils utilisés (une information par ligne).'
                        : 'Describe projects, tasks, or tools used (one detail per line).'}
                    />
                  </label>
                  {experience.period && <span className="seed-experience-period">{experience.period}</span>}
                </section>
              );
            })}
          </div>
        </fieldset>
      </div>
      <label className="service-field">
        <span>{fr ? 'Prompt complet à copier' : 'Complete prompt to copy'}</span>
        <textarea className="prompt-preview" rows="9" value={prompt} readOnly />
      </label>
      <footer className="service-modal-actions">
        <button type="button" className="cvx-btn" onClick={() => { setInstructions(DEFAULT_PROMPT_INSTRUCTIONS); onSave(DEFAULT_PROMPT_INSTRUCTIONS); }}>{fr ? 'Prompt par défaut' : 'Default prompt'}</button>
        <button type="button" className="cvx-btn" onClick={() => onSave(instructions)}><FontAwesomeIcon icon={['fas', 'floppy-disk']} /> {fr ? 'Enregistrer le prompt' : 'Save prompt'}</button>
        <button type="button" className="cvx-btn cvx-btn--primary" onClick={copyPrompt}><FontAwesomeIcon icon={['fas', 'copy']} /> {fr ? 'Copier tout' : 'Copy all'}</button>
      </footer>
    </ServiceModal>
  );
}

function PostPasteResumeChoiceModal({ locale, onEditNow, onClose }) {
  const fr = locale === 'fr';

  return (
    <ServiceModal title={fr ? 'CV de candidature prêt' : 'Application resume ready'} onClose={onClose}>
      <div className="service-confirm-copy">
        <p>
          {fr
            ? 'La candidature a été créée avec son CV. Vous pouvez le modifier maintenant pour cette entreprise si vous le souhaitez.'
            : 'The application has been created with its resume. You can edit it now for this company if you want.'}
        </p>
      </div>
      <footer className="service-modal-actions">
        <button type="button" className="cvx-btn" onClick={onClose}>
          {fr ? 'Garder tel quel' : 'Keep as is'}
        </button>
        <button type="button" className="cvx-btn cvx-btn--primary" onClick={onEditNow}>
          <FontAwesomeIcon icon={['fas', 'pen-to-square']} /> {fr ? 'Modifier ce CV' : 'Edit this resume'}
        </button>
      </footer>
    </ServiceModal>
  );
}

const BASIC_FIELDS = ['firstName', 'lastName', 'title', 'tagline', 'email', 'phone', 'location'];

function ResumeEditorModal({ locale, resumeData, onSave, onReset, onClose, saveState, mode = 'default' }) {
  const fr = locale === 'fr';
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(resumeData)));
  const isApplication = mode === 'application';
  const labels = fr
    ? { firstName: 'Prénom', lastName: 'Nom', title: 'Titre', tagline: 'Accroche', email: 'Email', phone: 'Téléphone', location: 'Localisation' }
    : { firstName: 'First name', lastName: 'Last name', title: 'Title', tagline: 'Tagline', email: 'Email', phone: 'Phone', location: 'Location' };

  const updateBasics = (field, value) => setDraft((prev) => ({ ...prev, basics: { ...prev.basics, [field]: value } }));
  const updateItem = (section, index, field, value) => setDraft((prev) => ({
    ...prev,
    [section]: (prev[section] ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  }));
  const updateContract = (index, contractIndex, field, value) => setDraft((prev) => ({
    ...prev,
    experience: (prev.experience ?? []).map((item, itemIndex) => itemIndex === index
      ? { ...item, contracts: (item.contracts ?? []).map((contract, cIndex) => cIndex === contractIndex ? { ...contract, [field]: value } : contract) }
      : item),
  }));
  const addItem = (section, item) => setDraft((prev) => ({ ...prev, [section]: [...(prev[section] ?? []), item] }));
  const removeItem = (section, index) => setDraft((prev) => ({ ...prev, [section]: (prev[section] ?? []).filter((_, itemIndex) => itemIndex !== index) }));

  const repeatable = (title, section, fields, emptyItem) => (
    <fieldset className="editor-section">
      <legend>{title}</legend>
      {(draft[section] ?? []).map((item, index) => (
        <div className="editor-item" key={`${section}-${index}`}>
          <div className="editor-item-head"><strong>{item.name || item.title || item.role || item.degree || `${title} ${index + 1}`}</strong><button type="button" className="service-remove" onClick={() => removeItem(section, index)} aria-label={fr ? 'Supprimer' : 'Remove'}><FontAwesomeIcon icon={['fas', 'trash']} /></button></div>
          <div className="service-form-grid">
            {fields.filter(({ key }) => !(section === 'experience' && Array.isArray(item.contracts) && key === 'period')).map(({ key, label, multiline, list }) => (
              <label className={`service-field ${multiline || list ? 'is-full' : ''}`} key={key}>
                <span>{label}</span>
                {multiline || list ? <textarea rows={multiline ? 4 : 3} value={list ? (item[key] ?? []).join('\n') : item[key] ?? ''} onChange={(event) => updateItem(section, index, key, list ? event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) : event.target.value)} /> : <input value={item[key] ?? ''} onChange={(event) => updateItem(section, index, key, event.target.value)} />}
              </label>
            ))}
          </div>
          {section === 'experience' && Array.isArray(item.contracts) && item.contracts.map((contract, contractIndex) => (
            <div className="service-form-grid" key={`contract-${contractIndex}`}>
              <label className="service-field"><span>{fr ? 'Type de contrat' : 'Contract type'}</span><input value={contract.contractType ?? ''} onChange={(event) => updateContract(index, contractIndex, 'contractType', event.target.value)} /></label>
              <label className="service-field"><span>{fr ? 'Période' : 'Period'}</span><input value={contract.period ?? ''} onChange={(event) => updateContract(index, contractIndex, 'period', event.target.value)} /></label>
              <label className="service-field is-full"><span>{fr ? `Missions du contrat ${contractIndex + 1}, une par ligne` : `Contract ${contractIndex + 1} bullets, one per line`}</span><textarea rows={3} value={(contract.bullets ?? []).join('\n')} onChange={(event) => updateContract(index, contractIndex, 'bullets', event.target.value.split('\n').map((value) => value.trim()).filter(Boolean))} /></label>
            </div>
          ))}
        </div>
      ))}
      <button type="button" className="cvx-btn" onClick={() => addItem(section, emptyItem)}><FontAwesomeIcon icon={['fas', 'plus']} /> {fr ? 'Ajouter' : 'Add'} {title.toLowerCase()}</button>
    </fieldset>
  );

  return (
    <ServiceModal title={isApplication ? (fr ? 'Modifier le CV de cette candidature' : 'Edit this application resume') : (fr ? 'Modifier le CV par défaut' : 'Edit default resume')} onClose={onClose} wide>
      <fieldset className="editor-section">
        <legend>{fr ? 'Informations personnelles' : 'Personal information'}</legend>
        <div className="service-form-grid">
          {BASIC_FIELDS.map((field) => <label className="service-field" key={field}><span>{labels[field]}</span><input type={field === 'email' ? 'email' : 'text'} value={draft.basics?.[field] ?? ''} onChange={(event) => updateBasics(field, event.target.value)} /></label>)}
          <label className="service-field is-full"><span>{fr ? 'Résumé professionnel' : 'Professional summary'}</span><textarea rows="4" value={draft.basics?.summary ?? ''} onChange={(event) => updateBasics('summary', event.target.value)} /></label>
          <label className="service-field is-full"><span>{fr ? 'Points forts, un par ligne' : 'Highlights, one per line'}</span><textarea rows="4" value={(draft.highlights ?? []).join('\n')} onChange={(event) => setDraft((prev) => ({ ...prev, highlights: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} /></label>
        </div>
      </fieldset>
      <fieldset className="editor-section">
        <legend>{fr ? 'Titres des sections' : 'Section titles'}</legend>
        <div className="service-form-grid">
          {Object.entries(draft.labels ?? {}).map(([key, value]) => (
            <label className="service-field" key={key}>
              <span>{key}</span>
              <input value={value ?? ''} onChange={(event) => setDraft((prev) => ({ ...prev, labels: { ...prev.labels, [key]: event.target.value } }))} />
            </label>
          ))}
        </div>
      </fieldset>
      {repeatable(fr ? 'Groupes de compétences' : 'Skill groups', 'skillGroups', [{ key: 'title', label: fr ? 'Groupe' : 'Group' }, { key: 'items', label: fr ? 'Compétences, une par ligne' : 'Skills, one per line', list: true }], { title: '', items: [] })}
      <fieldset className="editor-section">
        <legend>{fr ? 'Qualités' : 'Soft skills'}</legend>
        <label className="service-field is-full">
          <span>{fr ? 'Une par ligne' : 'One per line'}</span>
          <textarea rows="3" value={(draft.softSkills ?? []).join('\n')} onChange={(event) => setDraft((prev) => ({ ...prev, softSkills: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
        </label>
      </fieldset>
      {repeatable(fr ? 'Langues' : 'Languages', 'languages', [{ key: 'name', label: fr ? 'Langue' : 'Language' }, { key: 'level', label: fr ? 'Niveau' : 'Level' }], { name: '', level: '' })}
      {repeatable(fr ? 'Expériences' : 'Experience', 'experience', [{ key: 'role', label: fr ? 'Poste' : 'Role' }, { key: 'company', label: fr ? 'Entreprise' : 'Company' }, { key: 'location', label: fr ? 'Lieu' : 'Location' }, { key: 'period', label: fr ? 'Période' : 'Period' }, { key: 'bullets', label: fr ? 'Missions, une par ligne' : 'Bullets, one per line', list: true }], { role: '', company: '', location: '', period: '', bullets: [] })}
      {repeatable(fr ? 'Formations' : 'Education', 'education', [{ key: 'degree', label: fr ? 'Diplôme' : 'Degree' }, { key: 'school', label: fr ? 'École' : 'School' }, { key: 'location', label: fr ? 'Lieu' : 'Location' }, { key: 'period', label: fr ? 'Période' : 'Period' }], { degree: '', school: '', location: '', period: '' })}
      {repeatable('Certifications', 'certifications', [{ key: 'name', label: fr ? 'Nom' : 'Name' }, { key: 'provider', label: fr ? 'Organisme' : 'Provider' }, { key: 'href', label: 'URL' }], { name: '', provider: '', href: '' })}
      <footer className="service-modal-actions sticky-actions">
        <button type="button" className="cvx-btn" onClick={() => { onReset(); onClose(); }}><FontAwesomeIcon icon={['fas', 'rotate-left']} /> {isApplication ? (fr ? 'Revenir au CV enregistré de la candidature' : 'Restore saved application resume') : (fr ? 'Restaurer le CV original' : 'Restore original resume')}</button>
        <button type="button" className="cvx-btn cvx-btn--primary" onClick={() => onSave(draft)} disabled={saveState === 'saving'}><FontAwesomeIcon icon={['fas', 'floppy-disk']} /> {saveState === 'saving' ? (fr ? 'Enregistrement…' : 'Saving…') : isApplication ? (fr ? 'Enregistrer ce CV de candidature' : 'Save this application resume') : (fr ? 'Enregistrer comme CV par défaut' : 'Save as default resume')}</button>
      </footer>
    </ServiceModal>
  );
}

function JobInfo({ locale, job, onPrev, onNext, hasResume }) {
  const fr = locale === 'fr';
  const L = {
    heading: fr ? 'Poste ciblé' : 'Target job',
    createdAt: fr ? 'Date de création' : 'Created on',
    prev: fr ? 'Précédent' : 'Previous',
    next: fr ? 'Suivant' : 'Next',
    missions: fr ? 'Missions' : 'Missions',
    requirements: fr ? 'Exigences' : 'Requirements',
    description: fr ? 'Description du poste' : 'Job description',
    missingProfile: fr ? 'Ce qui manque à mon profil' : 'Profile gaps',
    contract: fr ? 'Contrat' : 'Contract',
    cvUsed: fr ? 'CV utilisé chargé' : 'Used resume loaded',
    noCv: fr ? 'Aucun CV valide enregistré' : 'No valid resume stored',
    open: fr ? "Voir l'offre" : 'Open posting',
    qualified: fr ? 'Qualifié' : 'Qualified',
    notQualified: fr ? 'Non qualifié' : 'Not qualified',
    chance: fr ? "Chances d'entretien" : 'Interview chance',
    assessment: fr ? 'Évaluation' : 'Assessment',
  };
  const createdDate = job.createdAt ? new Date(job.createdAt) : null;
  const formattedCreatedDate = createdDate && !Number.isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString(fr ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : '';
  const hasScore = typeof job.matchScore === 'number' && !Number.isNaN(job.matchScore);
  const scoreTone = !hasScore ? '' : job.matchScore >= 60 ? 'is-ok' : job.matchScore >= 35 ? 'is-warn' : 'is-bad';
  return (
    <section className="jobinfo">
      <header className="jobinfo_head">
        <div className="jobinfo_headings">
          <span className="jobinfo_eyebrow">{L.heading}</span>
          <h2 className="jobinfo_title">{job.title}</h2>
          <p className="jobinfo_company">
            {job.company}
            {job.location ? ` — ${job.location}` : ''}
          </p>
        </div>
        <div className="jobinfo_nav">
          <button type="button" onClick={onPrev} aria-label={L.prev}>
            <FontAwesomeIcon icon={['fas', 'chevron-left']} />
          </button>
          <button type="button" onClick={onNext} aria-label={L.next}>
            <FontAwesomeIcon icon={['fas', 'chevron-right']} />
          </button>
        </div>
      </header>

      <div className="jobinfo_meta">
        {formattedCreatedDate && (
          <span className="jobinfo_pill">
            <FontAwesomeIcon icon={['fas', 'calendar-day']} /> {L.createdAt}: {formattedCreatedDate}
          </span>
        )}
        <span className={`jobinfo_pill ${hasResume ? 'is-ok' : 'is-warn'}`}>
          {hasResume ? L.cvUsed : L.noCv}
        </span>
        {hasScore && (
          <span className={`jobinfo_pill jobinfo_score ${scoreTone}`}>
            {L.chance}: {job.matchScore}%
          </span>
        )}
        {typeof job.qualified === 'boolean' && (
          <span className={`jobinfo_pill ${job.qualified ? 'is-ok' : 'is-bad'}`}>
            {job.qualified ? L.qualified : L.notQualified}
          </span>
        )}
        {job.contractType && (
          <span className="jobinfo_pill">
            {L.contract}: {job.contractType}
          </span>
        )}
        {job.status && <span className="jobinfo_pill">{job.status}</span>}
        {job.url && (
          <a className="jobinfo_link" href={job.url} target="_blank" rel="noreferrer">
            {L.open} <FontAwesomeIcon icon={['fas', 'arrow-up-right-from-square']} />
          </a>
        )}
      </div>

      {hasScore && (
        <div className="jobinfo_gauge" aria-hidden="true">
          <span className={`jobinfo_gauge_fill ${scoreTone}`} style={{ width: `${job.matchScore}%` }} />
        </div>
      )}

      {job.assessment && (
        <p className="jobinfo_summary">
          <strong>{L.assessment}: </strong>
          {job.assessment}
        </p>
      )}

      {job.summary && <p className="jobinfo_summary">{job.summary}</p>}

      {Array.isArray(job.missions) && job.missions.length > 0 && (
        <div className="jobinfo_block">
          <h3>{L.missions}</h3>
          <ul>
            {job.missions.map((m, i) => (
              <li key={`m-${i}`}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(job.requirements) && job.requirements.length > 0 && (
        <div className="jobinfo_block">
          <h3>{L.requirements}</h3>
          <ul>
            {job.requirements.map((r, i) => (
              <li key={`r-${i}`}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {job.jobDescription && (
        <div className="jobinfo_block">
          <h3>{L.description}</h3>
          <p className="jobinfo_desc">{job.jobDescription}</p>
        </div>
      )}

      {job.missingProfile && (
        <div className="jobinfo_block">
          <h3>{L.missingProfile}</h3>
          <p className="jobinfo_desc">{job.missingProfile}</p>
        </div>
      )}
    </section>
  );
}

const LETTER_PARAGRAPH_COUNT = 5;
const LETTER_FONT_PT = 10.5;

const LETTER_BLOCKS = [
  { key: 'header', fr: 'En-tête', en: 'Header' },
  { key: 'subject', fr: 'Objet', en: 'Subject' },
  { key: 'salutation', fr: "Formule d'appel", en: 'Salutation' },
  { key: 'part1', fr: '1 · Qui je suis', en: '1 · About me' },
  { key: 'part2', fr: '2 · Ce que je propose', en: '2 · What I offer' },
  { key: 'part3', fr: "3 · L'entreprise vue par moi", en: '3 · The company from my view' },
  { key: 'part4', fr: '4 · Nous deux', en: '4 · Us together' },
  { key: 'part5', fr: '5 · Remerciements', en: '5 · Thank you' },
  { key: 'signoff', fr: 'Formule de politesse', en: 'Closing' },
  { key: 'signature', fr: 'Signature', en: 'Signature' },
];

const defaultLetterSettings = {
  fontScale: 1,
  accent: '#12467c',
  lineHeight: 1.6,
  visible: Object.fromEntries(LETTER_BLOCKS.map((block) => [block.key, true])),
  sectionScale: Object.fromEntries(LETTER_BLOCKS.map((block) => [block.key, 1])),
};

function mergeLetterSettings(saved = {}) {
  return {
    ...defaultLetterSettings,
    ...saved,
    visible: { ...defaultLetterSettings.visible, ...(saved.visible ?? {}) },
    sectionScale: { ...defaultLetterSettings.sectionScale, ...(saved.sectionScale ?? {}) },
  };
}

const DEFAULT_LETTER_PROMPT_INSTRUCTIONS = `You are an experienced career writer who helps people write cover letters (lettres de motivation) that sound like they were written by a real person, not by a template or an AI.

## Your task
Write ONE cover letter for the candidate. Use only the job offer and the candidate resume provided at the bottom. Use the default cover letter only as a reference for structure and tone: rewrite everything and never copy its sentences.

## Language
- Choose the letter language from the candidate resume JSON below, not from the job offer: if that resume is written in English, write the whole letter in English, otherwise write it in French.
- Write the whole letter in that one language, with natural, correct grammar and punctuation.

## Structure: exactly 5 body paragraphs, in this order
1. About me: who the candidate is, their background and what drives them. Use one or two concrete facts from the resume.
2. What I offer: what the candidate concretely brings to the company, matched to the requirements of the job. Balance relevant technical experience with non-technical contributions such as teamwork, communication, understanding needs, documentation, coordination, autonomy or ownership. Use only examples supported by the resume or job offer, and avoid turning this paragraph into a list of tools.
3. The company from my point of view: why this company and this role interest the candidate, based on the job offer (mission, product, projects, team, values, stack). Do not invent facts about the company. If the offer says little, stay general and honest.
4. Us together: how the candidate would contribute to the team beyond writing code or building technical solutions. Connect their working style, collaboration and delivery responsibilities to the role and challenges described in the offer, using only supported facts.
5. Thank you: a short, sincere closing paragraph that thanks the reader for their time and suggests a conversation or an interview.

## Writing style: it must sound human
- Write like a thoughtful person writing to someone they respect: clear, warm, direct, confident without bragging.
- Vary sentence length. Mix short and longer sentences.
- Be specific instead of general. Prefer a concrete fact over an adjective.
- Keep the letter focused on the candidate's overall contribution, not just technology. Mention technologies only when they help explain an achievement or match a key requirement, and give comparable attention to how the candidate works with people and helps projects move forward.
- Avoid clichés and filler. Never use phrases such as: "je suis passionné", "fort de", "je me permets", "au sein d'une entreprise", "dans un monde en constante évolution", "je suis convaincu que", "votre entreprise leader", "I am passionate about", "I am writing to express my interest", "I would be a perfect fit", "in today's fast-paced world", "dynamic team", "synergy", "leverage".
- No em dashes, no bullet points, no headings inside the paragraphs.
- Do not use colons (:) or semicolons (;) anywhere in the letter. Split the idea into two sentences instead.
- No emojis, icons, arrows, asterisks, hashtags or decorative symbols. Plain sentences and normal punctuation only (period, comma, question mark, apostrophe, parentheses).
- Length: about 250 to 330 words across the 5 paragraphs, 2 to 4 sentences per paragraph.
- No flattery about the company unless it is stated in the offer.

## Facts
- Use only facts found in the resume and the job offer. Never invent employers, dates, tools, numbers, diplomas or projects.
- If the offer asks for something the resume does not show, leave it out instead of claiming it.
- Keep company names, job titles and technologies exactly as written in the sources.

## Output format
Return ONLY one valid JSON object, with no markdown fences and no text before or after it:
{
  "letter": {
    "language": "en if the candidate resume is in English, otherwise fr",
    "company": "company name from the offer",
    "jobTitle": "job title from the offer",
    "location": "job location from the offer, or empty string",
    "url": "job offer URL if present, otherwise empty string",
    "subject": "short subject line, for example: Candidature au poste de Data Engineer",
    "salutation": "for example: Madame, Monsieur, or Dear Hiring Manager,",
    "body": [
      "paragraph 1: about me",
      "paragraph 2: what I offer",
      "paragraph 3: the company from my point of view",
      "paragraph 4: us together",
      "paragraph 5: thank you"
    ],
    "signoff": "for example: Cordialement, or Best regards,"
  }
}
- "body" must contain exactly 5 non-empty strings.
- Do not add the candidate's name, address or contact details in the body. The app adds them.
- Escape double quotes inside strings. No trailing commas.`;

function getDefaultLetter(locale) {
  if (locale === 'fr') {
    return {
      locale: 'fr',
      company: '[Entreprise]',
      jobTitle: '[Poste]',
      location: '',
      url: '',
      subject: 'Candidature au poste de [Poste] chez [Entreprise]',
      salutation: 'Madame, Monsieur,',
      body: [
        "Je suis [titre professionnel], et mon parcours tourne autour de [domaine principal]. Ce qui me motive au quotidien, c'est de transformer des données brutes en outils fiables que les équipes utilisent vraiment. [Ajoutez une ou deux réalisations concrètes tirées de votre CV.]",
        "Je peux apporter à [Entreprise] une expérience en [domaine utile au poste], ainsi qu'une façon de travailler fondée sur [qualité ou responsabilité attestée par le CV]. Sur [projet ou mission], j'ai [contribution ou résultat concret]. J'accorde aussi de l'importance à la communication, au partage d'informations et au suivi des sujets avec l'équipe.",
        "Ce qui m'attire chez [Entreprise], c'est [élément précis tiré de l'offre : produit, projets, valeurs ou équipe]. Je retrouve cette façon de travailler dans [ce que vous avez observé], et c'est le type d'environnement dans lequel je veux progresser.",
        "Je pense que mon profil et le poste de [Poste] se rejoignent sur [point commun]. J'aimerais contribuer aux projets en apportant à la fois mes compétences métier et ma capacité à collaborer, clarifier les besoins et assurer un suivi fiable. Je serais heureux de construire cette dynamique avec votre équipe.",
        "Je vous remercie sincèrement du temps que vous consacrez à la lecture de ma candidature. Je serais ravi d'échanger avec vous lors d'un entretien pour approfondir ces points.",
      ],
      signoff: 'Cordialement,',
    };
  }

  return {
    locale: 'en',
    company: '[Company]',
    jobTitle: '[Job title]',
    location: '',
    url: '',
    subject: 'Application for the [Job title] position at [Company]',
    salutation: 'Dear Hiring Manager,',
    body: [
      "I'm a [professional title], and most of my work so far has been about [main field]. What keeps me interested is turning messy data into tools people actually rely on. [Add one or two concrete achievements from your resume.]",
      "I can bring [relevant experience] to [Company], along with a way of working grounded in [resume-supported quality or responsibility]. On [project or mission], I [concrete contribution or result]. I also value clear communication, sharing context and following through with the team.",
      "What draws me to [Company] is [specific point from the offer: product, projects, values or team]. I recognise that way of working in [what you observed], and it is the kind of environment where I want to keep growing.",
      "I think my background and the [Job title] role meet on [common ground]. I would like to contribute both my professional skills and my ability to collaborate, clarify needs and follow work through reliably. I would be glad to build that kind of working relationship with your team.",
      "Thank you for taking the time to read my application. I would be glad to talk with you in an interview and go deeper into any of these points.",
    ],
    signoff: 'Best regards,',
  };
}

function loadDefaultLetter(locale) {
  try {
    const saved = JSON.parse(localStorage.getItem(`defaultLetter_${locale}`) || 'null');
    if (saved && Array.isArray(saved.body) && saved.body.length === LETTER_PARAGRAPH_COUNT) {
      return { ...getDefaultLetter(locale), ...saved };
    }
  } catch {
    // Fall back to the built-in template when the stored letter is unreadable.
  }
  return getDefaultLetter(locale);
}

// Accepts `{ "letter": {...} }` or the letter object itself and returns a clean letter, or null.
function normalizeLetterPayload(source) {
  const letter = source && typeof source === 'object' && source.letter && typeof source.letter === 'object'
    ? source.letter
    : source;
  if (!letter || typeof letter !== 'object' || Array.isArray(letter)) return null;

  const body = Array.isArray(letter.body) ? letter.body.map((p) => String(p ?? '').trim()) : [];
  const data = {
    company: String(letter.company ?? '').trim(),
    jobTitle: String(letter.jobTitle ?? '').trim(),
    location: String(letter.location ?? '').trim(),
    url: String(letter.url ?? '').trim(),
    subject: String(letter.subject ?? '').trim(),
    salutation: String(letter.salutation ?? '').trim(),
    body,
    signoff: String(letter.signoff ?? '').trim(),
    locale: letter.language === 'en' ? 'en' : 'fr',
  };
  return data.company && body.length === LETTER_PARAGRAPH_COUNT && body.every(Boolean) ? data : null;
}

function buildJobOfferText(app) {
  const header = [
    `Poste / Job title: ${app.title ?? ''}`,
    `Entreprise / Company: ${app.company ?? ''}`,
    app.location ? `Lieu / Location: ${app.location}` : '',
    app.url ? `Lien / URL: ${app.url}` : '',
  ].filter(Boolean).join('\n');
  const details = app.jobDescription?.trim()
    ? app.jobDescription.trim()
    : [app.summary, ...(app.missions ?? []), ...(app.requirements ?? [])].filter(Boolean).join('\n');
  return [header, details].filter(Boolean).join('\n\n');
}

function buildLetterPrompt({ instructions, jobOffer, resumeJson, defaultLetter }) {
  return `${instructions.trim()}

## Job offer
${jobOffer.trim() || '(paste the job offer here)'}

## Candidate resume (JSON)
${resumeJson}

## Default cover letter (reference for structure and tone only, rewrite it)
${defaultLetter}
`;
}

function letterToPlainText(letter, candidateName = '') {
  return [letter.subject, letter.salutation, ...letter.body, letter.signoff, candidateName]
    .filter(Boolean)
    .join('\n\n');
}

function LetterView({ locale, resumeData, letter, settings }) {
  const fr = locale === 'fr';

  const contactItems = getContactItems(resumeData);
  const candidateName = `${resumeData.basics.firstName} ${resumeData.basics.lastName}`;
  const candidateTitle = resumeData.basics.title || 'Data Engineer';
  const isVisible = (key) => settings.visible[key] !== false;
  const blockStyle = (key) => ({ '--block-scale': settings.sectionScale[key] ?? 1 });

  return (
    <div className="cover-letter-wrapper">
      <div className="cover-letter-preview">
        <div
          className="cover-letter"
          id="area-cover-letter"
          style={{
            '--letter-font-scale': settings.fontScale,
            '--letter-line-height': settings.lineHeight,
            '--accent': settings.accent,
          }}
        >
          {isVisible('header') && (
            <header className="cl-header" style={blockStyle('header')}>
              <div className="cl-header-main">
                <h1 className="cl-name">{candidateName}</h1>
                <div className="cl-title">{candidateTitle}</div>
              </div>
              <div className="cl-contact-list">
                {contactItems.map((item) => (
                  <span className="cl-contact-item" key={item.value}>
                    <FontAwesomeIcon icon={['fas', item.icon]} className="cl-contact-icon" />
                    <span>{item.value}</span>
                  </span>
                ))}
                {resumeData.links?.map((link) => (
                  <span className="cl-contact-item" key={link.label}>
                    <FontAwesomeIcon icon={getLinkIcon(link)} className="cl-contact-icon" />
                    <span>{link.value}</span>
                  </span>
                ))}
              </div>
            </header>
          )}

          <div className="cl-divider" />

          <div className="cl-body">
            {isVisible('subject') && letter.subject && (
              <div className="cl-subject-line" style={blockStyle('subject')}>
                <strong>{letter.subject}</strong>
              </div>
            )}
            {isVisible('salutation') && letter.salutation && (
              <p className="cl-paragraph is-salutation" style={blockStyle('salutation')}>
                {letter.salutation}
              </p>
            )}
            {letter.body.map((paragraph, index) => {
              const key = `part${index + 1}`;
              if (!isVisible(key)) return null;
              return (
                <p className="cl-paragraph" key={key} style={blockStyle(key)}>
                  {paragraph}
                </p>
              );
            })}
            {isVisible('signoff') && letter.signoff && (
              <p className="cl-paragraph is-closing" style={blockStyle('signoff')}>
                {letter.signoff}
              </p>
            )}
          </div>

          {isVisible('signature') && (
            <footer className="cl-signature-block" style={blockStyle('signature')}>
              <div className="cl-signature-name">{candidateName}</div>
              <div className="cl-signature-title">{candidateTitle}</div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

function LetterEditorModal({ locale, letter, onSave, onClose }) {
  const fr = locale === 'fr';
  const [draft, setDraft] = useState(() => ({
    ...letter,
    body: [...letter.body],
  }));

  const setField = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  const setPart = (index) => (e) => {
    const value = e.target.value;
    setDraft((prev) => ({ ...prev, body: prev.body.map((p, i) => (i === index ? value : p)) }));
  };
  const canSave = Boolean(draft.company.trim()) && draft.body.every((p) => p.trim());

  return (
    <ServiceModal
      title={fr ? 'Modifier la lettre de motivation' : 'Edit cover letter'}
      onClose={onClose}
      wide
    >
      <div className="service-form-grid">
        <label className="service-field">
          <span>{fr ? 'Entreprise *' : 'Company *'}</span>
          <input value={draft.company} onChange={setField('company')} />
        </label>
        <label className="service-field">
          <span>{fr ? 'Poste' : 'Job title'}</span>
          <input value={draft.jobTitle} onChange={setField('jobTitle')} />
        </label>
        <label className="service-field">
          <span>{fr ? 'Lieu' : 'Location'}</span>
          <input value={draft.location} onChange={setField('location')} />
        </label>
        <label className="service-field">
          <span>{fr ? 'Lien de l’offre' : 'Offer URL'}</span>
          <input value={draft.url} onChange={setField('url')} />
        </label>
        <label className="service-field is-full">
          <span>{fr ? 'Objet' : 'Subject'}</span>
          <input value={draft.subject} onChange={setField('subject')} />
        </label>
        <label className="service-field is-full">
          <span>{fr ? "Formule d'appel" : 'Salutation'}</span>
          <input value={draft.salutation} onChange={setField('salutation')} />
        </label>
        {draft.body.map((paragraph, index) => {
          const block = LETTER_BLOCKS.find((b) => b.key === `part${index + 1}`);
          return (
            <label className="service-field is-full" key={block.key}>
              <span>{fr ? block.fr : block.en}</span>
              <textarea
                rows="5"
                className="cl-editor-textarea"
                value={paragraph}
                onChange={setPart(index)}
              />
            </label>
          );
        })}
        <label className="service-field is-full">
          <span>{fr ? 'Formule de politesse' : 'Closing'}</span>
          <input value={draft.signoff} onChange={setField('signoff')} />
        </label>
      </div>
      <footer className="service-modal-actions sticky-actions">
        <button type="button" className="cvx-btn" onClick={onClose}>
          {fr ? 'Annuler' : 'Cancel'}
        </button>
        <button
          type="button"
          className="cvx-btn cvx-btn--primary"
          disabled={!canSave}
          onClick={() => {
            onSave(draft);
            onClose();
          }}
        >
          <FontAwesomeIcon icon={['fas', 'floppy-disk']} /> {fr ? 'Enregistrer la lettre' : 'Save cover letter'}
        </button>
      </footer>
    </ServiceModal>
  );
}

function LetterPromptModal({ locale, resumeData, defaultLetter, initialInstructions, onSave, onClose, onCopied }) {
  const fr = locale === 'fr';
  const [instructions, setInstructions] = useState(initialInstructions || DEFAULT_LETTER_PROMPT_INSTRUCTIONS);
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [jobOffer, setJobOffer] = useState('');
  const [resumeJson, setResumeJson] = useState(() => JSON.stringify(getPromptResume(resumeData), null, 2));
  const defaultLetterText = letterToPlainText(defaultLetter, `${resumeData.basics.firstName} ${resumeData.basics.lastName}`);
  const prompt = buildLetterPrompt({ instructions, jobOffer, resumeJson, defaultLetter: defaultLetterText });

  useEffect(() => {
    let active = true;
    fetch('/api/applications')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active && Array.isArray(data)) setApplications(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  function chooseCandidature(id) {
    setSelectedId(id);
    const app = applications.find((item) => item.id === id);
    if (!app) return;
    setJobOffer(buildJobOfferText(app));
    let appResume = null;
    try {
      appResume = JSON.parse(app.resumeJson || 'null');
    } catch {
      appResume = null;
    }
    setResumeJson(
      JSON.stringify(getPromptResume(isValidResumeData(appResume) ? appResume : resumeData), null, 2),
    );
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      onCopied(fr ? 'Prompt de lettre copié !' : 'Cover letter prompt copied!');
      onClose();
    } catch {
      onCopied(fr ? 'Copie impossible' : 'Copy failed');
    }
  }

  return (
    <ServiceModal title={fr ? 'Prompt de la lettre de motivation' : 'Cover letter prompt'} onClose={onClose} wide>
      <div className="service-form-grid prompt-grid">
        <label className="service-field">
          <span>{fr ? 'Instructions du prompt' : 'Prompt instructions'}</span>
          <textarea rows="14" value={instructions} onChange={(event) => setInstructions(event.target.value)} />
        </label>
        <div className="service-field">
          <span>{fr ? 'Candidature' : 'Candidature'}</span>
          <select className="letter-select" value={selectedId} onChange={(e) => chooseCandidature(e.target.value)}>
            <option value="">{fr ? 'Choisir une candidature (optionnel)' : 'Pick a candidature (optional)'}</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {[app.company, app.title].filter(Boolean).join(' · ') || app.id}
              </option>
            ))}
          </select>
          <textarea rows="11" value={jobOffer} onChange={(event) => setJobOffer(event.target.value)} placeholder={fr ? "Collez l'offre complète ici" : 'Paste the full job offer here'} />
        </div>
      </div>
      <label className="service-field">
        <span>{fr ? 'Prompt complet à copier' : 'Complete prompt to copy'}</span>
        <textarea className="prompt-preview" rows="9" value={prompt} readOnly />
      </label>
      <footer className="service-modal-actions">
        <button type="button" className="cvx-btn" onClick={() => { setInstructions(DEFAULT_LETTER_PROMPT_INSTRUCTIONS); onSave(DEFAULT_LETTER_PROMPT_INSTRUCTIONS); }}>{fr ? 'Prompt par défaut' : 'Default prompt'}</button>
        <button type="button" className="cvx-btn" onClick={() => onSave(instructions)}><FontAwesomeIcon icon={['fas', 'floppy-disk']} /> {fr ? 'Enregistrer le prompt' : 'Save prompt'}</button>
        <button type="button" className="cvx-btn cvx-btn--primary" onClick={copyPrompt}><FontAwesomeIcon icon={['fas', 'copy']} /> {fr ? 'Copier tout' : 'Copy all'}</button>
      </footer>
    </ServiceModal>
  );
}

const LETTER_SECTION_LABEL = (block, fr) => (fr ? block.fr : block.en);

function LetterCustomizer({ locale, open, onToggle, settings, onSettingsChange, onSave, onReset, saveState }) {
  const fr = locale === 'fr';
  const [hex, setHex] = useState('');

  const patch = (next) => onSettingsChange({ ...settings, ...next });
  const setVisible = (key, val) =>
    onSettingsChange({ ...settings, visible: { ...settings.visible, [key]: val } });
  const setSectionScale = (key, val) =>
    onSettingsChange({ ...settings, sectionScale: { ...settings.sectionScale, [key]: val } });

  function applyHex() {
    const value = hex.trim();
    if (!HEX_RE.test(value)) return;
    const full =
      value.length === 4
        ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
        : value;
    patch({ accent: full });
    setHex('');
  }

  const saveLabel =
    saveState === 'saving'
      ? fr ? 'Enregistrement…' : 'Saving…'
      : saveState === 'saved'
        ? fr ? 'Enregistré !' : 'Saved!'
        : saveState === 'error'
          ? fr ? 'Échec' : 'Failed'
          : fr ? 'Enregistrer' : 'Save';

  return (
    <>
      <button
        type="button"
        className={`cvx-fab ${open ? 'is-open' : ''}`}
        onClick={onToggle}
        aria-label={fr ? 'Personnaliser la lettre' : 'Customize cover letter'}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={['fas', open ? 'xmark' : 'sliders']} />
      </button>
      {open && (
        <div className="cvx-panel" role="dialog" aria-label={fr ? 'Personnalisation de la lettre' : 'Cover letter customization'}>
          <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Taille du texte' : 'Text size'}</h3>
            <div className="cvx-row">
              <input
                type="range"
                min="0.8"
                max="1.15"
                step="0.01"
                value={settings.fontScale}
                onChange={(e) => patch({ fontScale: Number(e.target.value) })}
              />
              <span className="cvx-value">
                {Math.round(settings.fontScale * 100)}% · {(settings.fontScale * LETTER_FONT_PT).toFixed(1)}pt
              </span>
            </div>
          </div>

          <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Interligne' : 'Line spacing'}</h3>
            <div className="cvx-row">
              <input
                type="range"
                min="1.3"
                max="2"
                step="0.05"
                value={settings.lineHeight}
                onChange={(e) => patch({ lineHeight: Number(e.target.value) })}
              />
              <span className="cvx-value">{settings.lineHeight.toFixed(2)}</span>
            </div>
          </div>

          <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Couleur' : 'Color'}</h3>
            <div className="cvx-swatches">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`cvx-swatch ${settings.accent.toLowerCase() === c.toLowerCase() ? 'is-active' : ''}`}
                  style={{ background: c }}
                  onClick={() => patch({ accent: c })}
                  aria-label={c}
                />
              ))}
            </div>
            <div className="cvx-row">
              <input
                className="cvx-input"
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#1a2b3c"
              />
              <button type="button" className="cvx-btn" onClick={applyHex}>
                {fr ? 'Ajouter' : 'Add'}
              </button>
            </div>
          </div>

          <div className="cvx-block">
            <h3 className="cvx-title">{fr ? 'Blocs & tailles' : 'Blocks & sizes'}</h3>
            {LETTER_BLOCKS.map((block) => (
              <div className="cvx-section-control" key={block.key}>
                <div className="cvx-field-row">
                  <label className="cvx-check">
                    <input
                      type="checkbox"
                      checked={settings.visible[block.key] !== false}
                      onChange={(e) => setVisible(block.key, e.target.checked)}
                    />
                    <span>{LETTER_SECTION_LABEL(block, fr)}</span>
                  </label>
                </div>
                <label className="cvx-zone-size">
                  <span>
                    {fr ? 'Taille' : 'Size'} {Math.round((settings.sectionScale[block.key] ?? 1) * 100)}% · {((settings.sectionScale[block.key] ?? 1) * settings.fontScale * LETTER_FONT_PT).toFixed(1)}pt
                  </span>
                  <input
                    type="range"
                    min="0.75"
                    max="1.3"
                    step="0.01"
                    value={settings.sectionScale[block.key] ?? 1}
                    onChange={(e) => setSectionScale(block.key, Number(e.target.value))}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="cvx-actions">
            <button
              type="button"
              className="cvx-btn cvx-btn--primary"
              onClick={onSave}
              disabled={saveState === 'saving'}
            >
              <FontAwesomeIcon icon={['fas', 'floppy-disk']} /> {saveLabel}
            </button>
            <button type="button" className="cvx-btn" onClick={onReset}>
              <FontAwesomeIcon icon={['fas', 'rotate-left']} /> {fr ? 'Réinitialiser' : 'Reset'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ApplicationPageHeader({ locale, job, format, onFormatChange, onHome, onDetails, onDelete }) {
  return (
    <header className="application-page-header">
      <div>
        <span className="application-page-kicker">{locale === 'fr' ? 'Candidature' : 'Application'}</span>
        <h1>{job?.title || (locale === 'fr' ? 'Candidature' : 'Application')}</h1>
        <p>{job?.company}</p>
        <div className="application-format-nav" role="group" aria-label={locale === 'fr' ? 'Format du CV' : 'Resume format'}>
          <button type="button" className={format === 'cv' ? 'is-active' : ''} onClick={() => onFormatChange('cv')}>
            {locale === 'fr' ? 'CV standard' : 'Standard resume'}
          </button>
          <button type="button" className={format === 'canada' ? 'is-active' : ''} onClick={() => onFormatChange('canada')}>
            {locale === 'fr' ? 'CV canadien' : 'Canadian resume'}
          </button>
        </div>
      </div>
      <div className="application-page-actions">
        <button type="button" className="action_button" onClick={onDetails}>
          <FontAwesomeIcon icon={['fas', 'circle-info']} />
          <span>{locale === 'fr' ? 'Détails' : 'Details'}</span>
        </button>
        <button type="button" className="action_button application-delete-button" onClick={onDelete}>
          <FontAwesomeIcon icon={['fas', 'trash']} />
          <span>{locale === 'fr' ? 'Supprimer la candidature' : 'Delete application'}</span>
        </button>
        <button type="button" className="action_button action_button_primary" onClick={onHome}>
          <FontAwesomeIcon icon={['fas', 'house']} />
          <span>{locale === 'fr' ? 'Retour au CV par défaut' : 'Back to default resume'}</span>
        </button>
      </div>
    </header>
  );
}

function AppCustome() {
  const [locale, setLocale] = useState('fr');
  const [page, setPage] = useState('cv');
  const [jsonError, setJsonError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openCandidate, setOpenCandidate] = useState(null);
  const [cvSettings, setCvSettings] = useState(defaultCvSettings);
  const [cvPanelOpen, setCvPanelOpen] = useState(false);
  const [resumeEditorOpen, setResumeEditorOpen] = useState(false);
  const [letterEditorOpen, setLetterEditorOpen] = useState(false);
  const [letterPromptOpen, setLetterPromptOpen] = useState(false);
  const [letterPanelOpen, setLetterPanelOpen] = useState(false);
  const [letterSaveState, setLetterSaveState] = useState('');
  const [letters, setLetters] = useState([]);
  const [activeLetterId, setActiveLetterId] = useState(null);
  const [defaultLetter, setDefaultLetter] = useState(() => loadDefaultLetter(locale));
  const [letterSettings, setLetterSettings] = useState(defaultLetterSettings);
  const [letterPromptInstructions, setLetterPromptInstructions] = useState(() => localStorage.getItem('coverLetterPromptInstructions') || DEFAULT_LETTER_PROMPT_INSTRUCTIONS);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptInstructions, setPromptInstructions] = useState(() => localStorage.getItem('resumePromptInstructions_v3') || DEFAULT_PROMPT_INSTRUCTIONS);
  const [cvSaveState, setCvSaveState] = useState('');
  const [activeJob, setActiveJob] = useState(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingApplication, setDeletingApplication] = useState(false);
  const [jobResume, setJobResume] = useState(null);
  const [jobList, setJobList] = useState([]);
  const [applicationFormat, setApplicationFormat] = useState('cv');
  const [defaultFormat, setDefaultFormat] = useState('cv');
  const [defaultResumeRevision, setDefaultResumeRevision] = useState(0);

  const baseResume = locale === 'fr' ? resumeDataFr : resumeDataEn;
  const baseCanada = locale === 'fr' ? resumeDataCanadaFr : resumeDataCanadaEn;
  const isApplicationPage = page === 'application';
  const isCanadaView = (isApplicationPage || page === 'cv') && (isApplicationPage ? applicationFormat : defaultFormat) === 'canada';
  const hasOwnSettings = isApplicationPage || isCanadaView;
  const overrideKey = isCanadaView ? `canada-${locale}` : `cv-${locale}`;
  const loadSavedDefaultResume = (base, canada = false) => {
    const key = `defaultResume_${canada ? 'canada-' : ''}${locale}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      return isValidResumeData(saved) ? normalizeResumeData(base, saved) : base;
    } catch {
      return base;
    }
  };
  void defaultResumeRevision;
  const displayResume = normalizeResumeData(
    baseResume,
    isApplicationPage ? jobResume ?? baseResume : loadSavedDefaultResume(baseResume, false),
  );
  const displayCanada = normalizeResumeData(
    baseCanada,
    isApplicationPage ? jobResume ?? baseCanada : loadSavedDefaultResume(baseCanada, true),
  );

  const activeData = isCanadaView ? displayCanada : displayResume;
  const isLetterPage = page === 'cover-letter';
  const activeLetter = letters.find((item) => item.id === activeLetterId) ?? null;
  const displayedLetter = activeLetter ?? defaultLetter;

  useEffect(() => {
    const resumeElement = document.getElementById(page === 'cover-letter' ? 'area-cover-letter' : 'area-cv');
    if (!resumeElement) return undefined;

    const updateOverflowState = () => {
      const a4HeightPx = (297 / 25.4) * 96;
      resumeElement.classList.toggle('is-overflowing', resumeElement.scrollHeight > a4HeightPx + 1);
    };

    updateOverflowState();
    const observer = new ResizeObserver(updateOverflowState);
    observer.observe(resumeElement);
    const contentObserver = new MutationObserver(updateOverflowState);
    contentObserver.observe(resumeElement, { childList: true, characterData: true, subtree: true });

    return () => {
      observer.disconnect();
      contentObserver.disconnect();
    };
  }, [activeJob, applicationFormat, page]);

  // Update document metadata so the printed PDF gets a meaningful title
  // and keywords (most browsers include the title in PDF metadata).
  useEffect(() => {
    const meta = getResumeMeta(locale, isCanadaView ? 'canada' : page);
    document.title = meta.title;
    document.documentElement.lang = locale === 'fr' ? 'fr' : 'en';
    updateMeta('description', meta.description);
    updateMeta('subject', meta.title);
    updateMeta('keywords', meta.keywords);
  }, [isCanadaView, locale, page]);

  function updateMeta(name, content) {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.name = name;
      document.head.appendChild(element);
    }
    element.content = content;
  }

  function handleDownload() {
    const previousTitle = document.title;
    const isCoverLetter = page === 'cover-letter';
    const targetElementId = isCoverLetter ? 'area-cover-letter' : 'area-cv';
    const printElement = document.getElementById(targetElementId);
    const format = isCoverLetter
      ? (displayedLetter.company ? `Cover_Letter_${displayedLetter.company.replace(/\s+/g, '_')}` : 'Cover_Letter')
      : (isCanadaView ? 'Canadian_Resume' : 'Resume');
    const a4HeightPx = (297 / 25.4) * 96;
    const contentHeight = printElement?.scrollHeight ?? a4HeightPx;
    const printScale = Math.min(1, a4HeightPx / contentHeight);

    printElement?.style.setProperty('--print-scale', String(printScale));
    printElement?.style.setProperty('--print-width', `${210 / printScale}mm`);
    printElement?.style.setProperty('--print-min-height', `${297 / printScale}mm`);
    document.title = `${activeData.basics.firstName}_${activeData.basics.lastName}_${format}_${locale.toUpperCase()}`;
    window.addEventListener('afterprint', () => {
      document.title = previousTitle;
      printElement?.style.removeProperty('--print-scale');
      printElement?.style.removeProperty('--print-width');
      printElement?.style.removeProperty('--print-min-height');
      if (!hasOwnSettings && !isLetterPage) {
        setCvSettings(defaultCvSettings);
        setCvPanelOpen(false);
      }
    }, { once: true });
    window.print();
  }

  async function handleCopy() {
    try {
      const payload = { ...activeData, metadata: getResumeMeta(locale, page) };
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setJsonError(locale === 'fr' ? 'Copié !' : 'Copied!');
      setTimeout(() => setJsonError(''), 1500);
    } catch {
      setJsonError(locale === 'fr' ? 'Copie impossible' : 'Copy failed');
    }
  }

  useEffect(() => {
    let active = true;
    fetch('/api/cover-letters')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (active && Array.isArray(data)) setLetters(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setDefaultLetter(loadDefaultLetter(locale));
    setLetterSettings(defaultLetterSettings);
    fetch(`/api/cv-settings/${encodeURIComponent(`letter-${locale}`)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.settings) setLetterSettings(mergeLetterSettings(data.settings));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [locale]);

  function showToast(message, duration = 1800) {
    setJsonError(message);
    setTimeout(() => setJsonError(''), duration);
  }

  async function handleCopyLetterText() {
    const candidateName = `${baseResume.basics.firstName} ${baseResume.basics.lastName}`;
    try {
      await navigator.clipboard.writeText(letterToPlainText(displayedLetter, candidateName));
      showToast(locale === 'fr' ? 'Lettre de motivation copiée !' : 'Cover letter copied!');
    } catch {
      showToast(locale === 'fr' ? 'Copie impossible' : 'Copy failed');
    }
  }

  async function handleSaveLetterEdit(draft) {
    const fr = locale === 'fr';
    if (!activeLetter) {
      const next = { ...draft, locale };
      setDefaultLetter(next);
      localStorage.setItem(`defaultLetter_${locale}`, JSON.stringify(next));
      showToast(fr ? 'Lettre par défaut enregistrée !' : 'Default cover letter saved!');
      return;
    }
    try {
      const res = await fetch(`/api/cover-letters/${encodeURIComponent(activeLetter.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('save failed');
      const updated = await res.json();
      setLetters((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      showToast(fr ? 'Lettre enregistrée !' : 'Cover letter saved!');
    } catch {
      showToast(fr ? 'Échec de l’enregistrement' : 'Save failed');
    }
  }

  async function handleDeleteLetter() {
    if (!activeLetter) return;
    const fr = locale === 'fr';
    if (!window.confirm(fr ? 'Supprimer cette lettre ?' : 'Delete this cover letter?')) return;
    try {
      const res = await fetch(`/api/cover-letters/${encodeURIComponent(activeLetter.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      setLetters((prev) => prev.filter((item) => item.id !== activeLetter.id));
      setActiveLetterId(null);
      showToast(fr ? 'Lettre supprimée' : 'Cover letter deleted');
    } catch {
      showToast(fr ? 'Échec de la suppression' : 'Delete failed');
    }
  }

  async function handlePasteLetter() {
    const fr = locale === 'fr';
    let text = '';
    try {
      text = await navigator.clipboard.readText();
    } catch {
      showToast(fr ? 'Collage impossible' : 'Paste failed');
      return;
    }
    let letter = null;
    try {
      letter = normalizeLetterPayload(JSON.parse(text));
    } catch {
      letter = null;
    }
    if (!letter) {
      showToast(fr ? 'JSON de lettre invalide' : 'Invalid letter JSON');
      return;
    }
    try {
      const res = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letter),
      });
      if (!res.ok) throw new Error('create failed');
      const created = await res.json();
      setLetters((prev) => [created, ...prev]);
      setActiveLetterId(created.id);
      showToast(fr ? 'Lettre créée !' : 'Cover letter created!', 1500);
    } catch {
      showToast(fr ? 'Échec de l’enregistrement de la lettre' : 'Failed to save the letter');
    }
  }

  function handleSaveLetterPrompt(value) {
    setLetterPromptInstructions(value);
    localStorage.setItem('coverLetterPromptInstructions', value);
    showToast(locale === 'fr' ? 'Prompt de lettre enregistré !' : 'Cover letter prompt saved!', 1500);
  }

  async function saveLetterSettings(settings) {
    setLetterSaveState('saving');
    try {
      const res = await fetch(`/api/cv-settings/${encodeURIComponent(`letter-${locale}`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error('save failed');
      setLetterSaveState('saved');
      setTimeout(() => setLetterSaveState(''), 1500);
    } catch {
      setLetterSaveState('error');
      setTimeout(() => setLetterSaveState(''), 2000);
    }
  }

  function handleResetLetterSettings() {
    setLetterSettings(defaultLetterSettings);
    saveLetterSettings(defaultLetterSettings);
  }

  function handleCopyPrompt() {
    setPromptOpen(true);
  }

  function handleSavePrompt(value) {
    setPromptInstructions(value);
    localStorage.setItem('resumePromptInstructions_v3', value);
    setJsonError(locale === 'fr' ? 'Prompt enregistré !' : 'Prompt saved!');
    setTimeout(() => setJsonError(''), 1500);
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      const source = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      const { application, ...resume } = source;
      if (!isValidResumeData(resume)) {
        setJsonError(locale === 'fr' ? 'Format JSON invalide' : 'Invalid JSON format');
        return;
      }
      const hasAppInfo =
        application && typeof application === 'object' && application.title && application.company;
      if (!hasAppInfo) {
        setJsonError(locale === 'fr'
          ? 'Titre et entreprise manquants dans le JSON. Le CV par défaut reste inchangé.'
          : 'Application title and company are missing from the JSON. The default resume is unchanged.');
        setTimeout(() => setJsonError(''), 3500);
        return;
      }

      const normalResume = normalizeResumeData(baseResume, resume);
      const coverLetter = application.coverLetter ? String(application.coverLetter) : (source.coverLetter ? String(source.coverLetter) : '');
      try {
        const created = await createApplication({
            title: String(application.title),
            company: String(application.company),
            url: application.url ? String(application.url) : '',
            location: application.location ? String(application.location) : '',
            contractType: application.contractType ? String(application.contractType) : '',
            summary: application.summary ? String(application.summary) : '',
            missions: Array.isArray(application.missions) ? application.missions.map(String) : [],
            requirements: Array.isArray(application.requirements) ? application.requirements.map(String) : [],
            jobDescription: application.jobDescription ? String(application.jobDescription) : '',
            missingProfile: application.missingProfile ? String(application.missingProfile) : '',
            qualified: application.qualified === true,
            matchScore: Number.isFinite(Number(application.matchScore)) ? Number(application.matchScore) : null,
            assessment: application.assessment ? String(application.assessment) : '',
            coverLetter,
            status: 'Applied',
            resumeJson: JSON.stringify(normalResume, null, 2),
        });
        setRefreshKey((k) => k + 1);
        if (created && created.id) {
          selectJob(created);
        }
        setJsonError(locale === 'fr' ? 'Candidature créée avec CV et lettre de motivation !' : 'Application created with resume and cover letter!');
      } catch {
        setJsonError(locale === 'fr' ? 'Échec de création de la candidature' : 'Could not create the application');
      }
      setTimeout(() => setJsonError(''), 2500);
    } catch {
      setJsonError(locale === 'fr' ? 'Format JSON invalide' : 'Invalid JSON format');
    }
  }

  // Load saved layout preferences only for application-specific resumes.
  useEffect(() => {
    if (!hasOwnSettings) {
      setCvSettings(defaultCvSettings);
      return undefined;
    }
    let active = true;
    const defaults = isCanadaView ? defaultCanadaSettings : defaultCvSettings;
    setCvSettings(defaults);
    fetch(`/api/cv-settings/${encodeURIComponent(overrideKey)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (data.settings) {
          setCvSettings(isCanadaView
            ? {
                ...defaultCanadaSettings,
                ...data.settings,
                pageMargins: { ...defaultCanadaSettings.pageMargins, ...(data.settings.pageMargins ?? {}) },
                visible: { ...defaultCanadaSettings.visible, ...(data.settings.visible ?? {}) },
              }
            : {
                ...defaultCvSettings,
                ...data.settings,
                columns: { ...defaultCvSettings.columns, ...(data.settings.columns ?? {}) },
                visible: { ...defaultCvSettings.visible, ...(data.settings.visible ?? {}) },
                sectionScale: { ...defaultCvSettings.sectionScale, ...(data.settings.sectionScale ?? {}) },
                experienceSpacing: { ...defaultCvSettings.experienceSpacing, ...(data.settings.experienceSpacing ?? {}) },
              });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hasOwnSettings, isCanadaView, overrideKey]);

  async function persistCv(targetKey = overrideKey) {
    setCvSaveState('saving');
    try {
      const res = await fetch(`/api/cv-settings/${encodeURIComponent(targetKey)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: cvSettings }),
      });
      if (!res.ok) throw new Error('save failed');
      setCvSaveState('saved');
      setTimeout(() => setCvSaveState(''), 1500);
    } catch {
      setCvSaveState('error');
      setTimeout(() => setCvSaveState(''), 2000);
    }
  }

  function handleSaveCv() {
    persistCv();
  }

  async function persistApplicationResume(resume) {
    if (!activeJob?.id) return;
    const fixedResume = normalizeResumeData(isCanadaView ? baseCanada : baseResume, resume);
    setCvSaveState('saving');
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(activeJob.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...activeJob, resumeJson: JSON.stringify(fixedResume, null, 2) }),
      });
      if (!res.ok) throw new Error('save failed');
      const updated = await res.json();
      setActiveJob(updated);
      setJobResume(fixedResume);
      setJobList((prev) => prev.map((item) => item.id === updated.id ? updated : item));
      setRefreshKey((key) => key + 1);
      setCvSaveState('saved');
      setTimeout(() => setCvSaveState(''), 1500);
    } catch {
      setCvSaveState('error');
      setTimeout(() => setCvSaveState(''), 2000);
    }
  }

  function restoreApplicationResume() {
    if (!activeJob) return;
    try {
      const savedResume = JSON.parse(activeJob.resumeJson || '');
      if (isValidResumeData(savedResume)) setJobResume(savedResume);
    } catch {
      setJobResume(null);
    }
  }

  function handleSaveResume(resume) {
    if (activeJob) {
      persistApplicationResume(resume);
      return;
    }
    const fixedResume = normalizeResumeData(isCanadaView ? baseCanada : baseResume, resume);
    const key = `defaultResume_${isCanadaView ? 'canada-' : ''}${locale}`;
    localStorage.setItem(key, JSON.stringify(fixedResume));
    setDefaultResumeRevision((value) => value + 1);
    setCvSaveState('saved');
    setTimeout(() => setCvSaveState(''), 1500);
  }

  function resetDefaultResume() {
    const key = `defaultResume_${isCanadaView ? 'canada-' : ''}${locale}`;
    localStorage.removeItem(key);
    setDefaultResumeRevision((value) => value + 1);
    setResumeEditorOpen(false);
  }

  async function handleResetCv() {
    if (!hasOwnSettings) {
      setCvSettings(defaultCvSettings);
      return;
    }
    const defaults = isCanadaView ? defaultCanadaSettings : defaultCvSettings;
    setCvSettings(defaults);
    setCvSaveState('saving');
    try {
      const res = await fetch(`/api/cv-settings/${encodeURIComponent(overrideKey)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: defaults, overrides: null }),
      });
      if (!res.ok) throw new Error('reset failed');
      setCvSaveState('saved');
      setTimeout(() => setCvSaveState(''), 1500);
    } catch {
      setCvSaveState('error');
    }
  }

  // Opens an applied job: loads the exact resume that was used and shows its details.
  function selectJob(app) {
    setActiveJob(app);
    let parsed = null;
    try {
      const data = JSON.parse(app.resumeJson || '');
      if (isValidResumeData(data)) parsed = data;
    } catch {
      parsed = null;
    }
    setJobResume(parsed);
    setApplicationFormat('cv');
    setPage('application');
    setJobDetailsOpen(false);
    setDeleteConfirmOpen(false);
    setSidebarOpen(true);
  }

  function clearJob() {
    setActiveJob(null);
    setJobResume(null);
    setJobDetailsOpen(false);
    setDeleteConfirmOpen(false);
    setResumeEditorOpen(false);
    setCvPanelOpen(false);
    setCvSettings(defaultCvSettings);
    setApplicationFormat('cv');
    setPage('cv');
  }

  async function deleteActiveApplication() {
    if (!activeJob?.id || deletingApplication) return;
    setDeletingApplication(true);
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(activeJob.id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete failed');
      setDeleteConfirmOpen(false);
      setRefreshKey((key) => key + 1);
      setActiveJob(null);
      setJobResume(null);
      setJobDetailsOpen(false);
      setResumeEditorOpen(false);
      setCvPanelOpen(false);
      setPage('tracker');
      setJsonError(locale === 'fr' ? 'Candidature supprimée.' : 'Application deleted.');
      setTimeout(() => setJsonError(''), 2500);
    } catch {
      setJsonError(locale === 'fr' ? 'Impossible de supprimer la candidature.' : 'Could not delete the application.');
    } finally {
      setDeletingApplication(false);
    }
  }

  function stepJob(delta) {
    if (!activeJob || jobList.length === 0) return;
    const idx = jobList.findIndex((a) => a.id === activeJob.id);
    if (idx === -1) return;
    const next = jobList[(idx + delta + jobList.length) % jobList.length];
    selectJob(next);
  }

  const effectiveSettings = isCanadaView
    ? {
        ...defaultCanadaSettings,
        ...(hasOwnSettings ? cvSettings : {}),
        pageMargins: { ...defaultCanadaSettings.pageMargins, ...(hasOwnSettings ? cvSettings.pageMargins : {}) },
        visible: { ...defaultCanadaSettings.visible, ...(hasOwnSettings ? cvSettings.visible : {}) },
        experienceSpacing: { ...defaultCvSettings.experienceSpacing, ...(hasOwnSettings ? cvSettings.experienceSpacing : {}) },
      }
    : {
        ...defaultCvSettings,
      ...cvSettings,
      columns: { ...defaultCvSettings.columns, ...(cvSettings.columns ?? {}) },
      visible: { ...defaultCvSettings.visible, ...(cvSettings.visible ?? {}) },
      sectionScale: { ...defaultCvSettings.sectionScale, ...(cvSettings.sectionScale ?? {}) },
      experienceSpacing: { ...defaultCvSettings.experienceSpacing, ...(cvSettings.experienceSpacing ?? {}) },
      };
  const expSpacing = effectiveSettings.experienceSpacing;
  const expVars = {
    '--exp-desc-margin-top': `${expSpacing.marginTopOn ? expSpacing.marginTop : 0}rem`,
    '--exp-desc-gap': `${expSpacing.gapOn ? expSpacing.gap : 0}rem`,
  };
  const leftSections = SECTION_ORDER.filter(
    (key) => effectiveSettings.visible[key] && effectiveSettings.columns?.[key] === 'left',
  );
  const rightSections = SECTION_ORDER.filter(
    (key) => effectiveSettings.visible[key] && effectiveSettings.columns?.[key] === 'right',
  );

  return (
    <div className="app_frame">
      {isLetterPage ? (
        <LetterHistorySidebar
          locale={locale}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          letters={letters}
          activeId={activeLetterId}
          onSelect={setActiveLetterId}
        />
      ) : (
        <CandidateSidebar
          locale={locale}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          refreshKey={refreshKey}
          activeId={activeJob?.id}
          onApps={setJobList}
          onSelect={selectJob}
        />
      )}
      <ActionToast message={jsonError} />
      <main className="l-main bd-container">
        <div className="workspace_toolbar">
          <PageNav
            page={page}
            onPageChange={(nextPage) => {
              if (nextPage === 'cv') {
                if (page === 'cover-letter') {
                  setPage(activeJob ? 'application' : 'cv');
                } else {
                  clearJob();
                }
              } else if (nextPage === 'cover-letter') {
                setResumeEditorOpen(false);
                setCvPanelOpen(false);
                setPage('cover-letter');
              } else if (nextPage === 'tracker') {
                setResumeEditorOpen(false);
                setCvPanelOpen(false);
                setPage('tracker');
              }
            }}
            locale={locale}
          />
          <FloatingTools
            locale={locale}
            page={page}
            onCopy={handleCopy}
            onPaste={isLetterPage ? handlePasteLetter : handlePaste}
            onCopyPrompt={isLetterPage ? () => setLetterPromptOpen(true) : handleCopyPrompt}
            onEditResume={() => setResumeEditorOpen(true)}
            onCopyCoverLetter={handleCopyLetterText}
            onEditCoverLetter={() => setLetterEditorOpen(true)}
          />
        </div>
        {page !== 'tracker' && (
          <ActionBar
            locale={locale}
            onLocaleChange={setLocale}
            onDownload={handleDownload}
          />
        )}
        {page !== 'tracker' && !isLetterPage && promptOpen && <PromptModal locale={locale} resumeData={baseResume} initialInstructions={promptInstructions} onSave={handleSavePrompt} onClose={() => setPromptOpen(false)} onCopied={(message) => { setJsonError(message); setTimeout(() => setJsonError(''), 1800); }} />}
        {page === 'cv' && resumeEditorOpen && !activeJob && (
          <ResumeEditorModal
            locale={locale}
            resumeData={isCanadaView ? displayCanada : displayResume}
            onSave={handleSaveResume}
            onReset={resetDefaultResume}
            onClose={() => setResumeEditorOpen(false)}
            saveState={cvSaveState}
            mode="default"
          />
        )}
        {page === 'cv' && resumeEditorOpen && activeJob && (
          <ResumeEditorModal
            locale={locale}
            resumeData={normalizeResumeData(isCanadaView ? baseCanada : baseResume, jobResume ?? (isCanadaView ? baseCanada : baseResume))}
            onSave={handleSaveResume}
            onReset={() => { restoreApplicationResume(); setResumeEditorOpen(false); }}
            onClose={() => setResumeEditorOpen(false)}
            saveState={cvSaveState}
            mode="application"
          />
        )}
        {page !== 'tracker' && page !== 'cover-letter' && (
          <CvCustomizer
            locale={locale}
            variant={isCanadaView ? 'canada' : 'cv'}
            open={cvPanelOpen}
            onToggle={() => setCvPanelOpen((o) => !o)}
            settings={effectiveSettings}
            onSettingsChange={setCvSettings}
            onSave={hasOwnSettings ? handleSaveCv : undefined}
            onReset={handleResetCv}
            saveState={cvSaveState}
          />
        )}
        {isLetterPage ? (
          <section className="cover-letter-page">
            {letterEditorOpen && (
              <LetterEditorModal
                locale={locale}
                letter={displayedLetter}
                onSave={handleSaveLetterEdit}
                onClose={() => setLetterEditorOpen(false)}
              />
            )}
            {letterPromptOpen && (
              <LetterPromptModal
                locale={locale}
                resumeData={baseResume}
                defaultLetter={defaultLetter}
                initialInstructions={letterPromptInstructions}
                onSave={handleSaveLetterPrompt}
                onClose={() => setLetterPromptOpen(false)}
                onCopied={(message) => showToast(message)}
              />
            )}
            <div className="active-job-toolbar letter-toolbar" aria-label={locale === 'fr' ? 'Lettres de motivation' : 'Cover letters'}>
              <select
                className="letter-select"
                value={activeLetterId ?? ''}
                onChange={(e) => setActiveLetterId(e.target.value || null)}
                aria-label={locale === 'fr' ? 'Choisir une lettre' : 'Choose a letter'}
              >
                <option value="">{locale === 'fr' ? 'Lettre par défaut' : 'Default cover letter'}</option>
                {letters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {[item.company, item.jobTitle].filter(Boolean).join(' · ')}{item.locale === 'en' ? ' (EN)' : ''}
                  </option>
                ))}
              </select>
              {activeLetter && (
                <button type="button" className="action_button" onClick={handleDeleteLetter}>
                  <FontAwesomeIcon icon={['fas', 'trash']} />
                  <span>{locale === 'fr' ? 'Supprimer cette lettre' : 'Delete this letter'}</span>
                </button>
              )}
            </div>
            <LetterView
              locale={locale}
              resumeData={baseResume}
              letter={displayedLetter}
              settings={letterSettings}
            />
            <LetterCustomizer
              locale={locale}
              open={letterPanelOpen}
              onToggle={() => setLetterPanelOpen((o) => !o)}
              settings={letterSettings}
              onSettingsChange={setLetterSettings}
              onSave={() => saveLetterSettings(letterSettings)}
              onReset={handleResetLetterSettings}
              saveState={letterSaveState}
            />
          </section>
        ) : page === 'cv' && isCanadaView ? (
          <>
            <div className="application-format-nav default-format-nav" role="group" aria-label={locale === 'fr' ? 'Format du CV' : 'Resume format'}>
              <button type="button" className={defaultFormat === 'cv' ? 'is-active' : ''} onClick={() => setDefaultFormat('cv')}>
                {locale === 'fr' ? 'CV standard' : 'Standard resume'}
              </button>
              <button type="button" className={defaultFormat === 'canada' ? 'is-active' : ''} onClick={() => setDefaultFormat('canada')}>
                {locale === 'fr' ? 'CV canadien' : 'Canadian resume'}
              </button>
            </div>
            <CanadianCV resumeData={displayCanada} locale={locale} settings={effectiveSettings} />
          </>
        ) : page === 'cv' ? (
          <>
            <div className="application-format-nav default-format-nav" role="group" aria-label={locale === 'fr' ? 'Format du CV' : 'Resume format'}>
              <button type="button" className={defaultFormat === 'cv' ? 'is-active' : ''} onClick={() => setDefaultFormat('cv')}>
                {locale === 'fr' ? 'CV standard' : 'Standard resume'}
              </button>
              <button type="button" className={defaultFormat === 'canada' ? 'is-active' : ''} onClick={() => setDefaultFormat('canada')}>
                {locale === 'fr' ? 'CV canadien' : 'Canadian resume'}
              </button>
            </div>
            {activeJob && (
              <div className="active-job-toolbar" aria-label={locale === 'fr' ? 'CV de candidature' : 'Application resume'}>
                <button type="button" className="action_button" onClick={() => setJobDetailsOpen(true)}><FontAwesomeIcon icon={['fas', 'circle-info']} /><span>{locale === 'fr' ? 'Détails de la candidature' : 'Application details'}</span></button>
                <button type="button" className="action_button" onClick={() => setResumeEditorOpen(true)}><FontAwesomeIcon icon={['fas', 'pen-to-square']} /><span>{locale === 'fr' ? 'Modifier ce CV' : 'Edit this resume'}</span></button>
                <button type="button" className="action_button" onClick={clearJob}><FontAwesomeIcon icon={['fas', 'rotate-left']} /><span>{locale === 'fr' ? 'Revenir au CV par défaut' : 'Return to default resume'}</span></button>
              </div>
            )}
            {activeJob && jobDetailsOpen && (
              <ServiceModal title={locale === 'fr' ? 'Détails de la candidature' : 'Application details'} onClose={() => setJobDetailsOpen(false)} wide>
              <JobInfo
                locale={locale}
                job={activeJob}
                hasResume={!!jobResume}
                onPrev={() => stepJob(-1)}
                onNext={() => stepJob(1)}
              />
              </ServiceModal>
            )}
            <div className="cv-preview">
              <div
                className="resume"
                id="area-cv"
                style={{
                  '--cv-font-scale': effectiveSettings.fontScale,
                  '--title-scale': effectiveSettings.titleScale ?? 1,
                  '--title-transform': (effectiveSettings.titleCaps ?? true) ? 'uppercase' : 'none',
                  '--title-letter-spacing': (effectiveSettings.titleCaps ?? true) ? '0.24em' : '0.02em',
                  '--photo-size': `${effectiveSettings.photoSize ?? 96}px`,
                  '--accent': effectiveSettings.accent,
                  '--accent-strong': effectiveSettings.accent,
                }}
              >
                <aside className="resume_left">
                  {leftSections.map((key) => {
                    const Section = SECTION_COMPONENTS[key];
                    return <div className="cv-section-zone" style={{ '--section-scale': effectiveSettings.sectionScale[key], ...expVars }} key={key}><Section resumeData={displayResume} locale={locale} showImage={effectiveSettings.showImage} /></div>;
                  })}
                </aside>
                <section className="resume_right">
                  {rightSections.map((key) => {
                    const Section = SECTION_COMPONENTS[key];
                    return <div className="cv-section-zone" style={{ '--section-scale': effectiveSettings.sectionScale[key], ...expVars }} key={key}><Section resumeData={displayResume} locale={locale} showImage={effectiveSettings.showImage} /></div>;
                  })}
                </section>
              </div>
            </div>
          </>
        ) : page === 'application' ? (
          <section className="application-page">
            {activeJob ? (
              <>
                {resumeEditorOpen && (
                  <ResumeEditorModal
                    locale={locale}
                    resumeData={isCanadaView ? displayCanada : displayResume}
                    onSave={handleSaveResume}
                    onReset={() => { restoreApplicationResume(); setResumeEditorOpen(false); }}
                    onClose={() => setResumeEditorOpen(false)}
                    saveState={cvSaveState}
                    mode="application"
                  />
                )}
                <ApplicationPageHeader
                  locale={locale}
                  job={activeJob}
                  format={applicationFormat}
                  onFormatChange={setApplicationFormat}
                  onHome={clearJob}
                  onDetails={() => setJobDetailsOpen(true)}
                  onDelete={() => setDeleteConfirmOpen(true)}
                />
                {deleteConfirmOpen && (
                  <ServiceModal
                    title={locale === 'fr' ? 'Confirmer la suppression' : 'Confirm deletion'}
                    onClose={() => setDeleteConfirmOpen(false)}
                  >
                    <p className="service-confirm-copy">
                      {locale === 'fr'
                        ? `Supprimer la candidature « ${activeJob.title} » chez ${activeJob.company} ? Cette action est définitive.`
                        : `Delete the application “${activeJob.title}” at ${activeJob.company}? This action cannot be undone.`}
                    </p>
                    <footer className="service-modal-actions">
                      <button type="button" className="cvx-btn" onClick={() => setDeleteConfirmOpen(false)} disabled={deletingApplication}>
                        {locale === 'fr' ? 'Annuler' : 'Cancel'}
                      </button>
                      <button type="button" className="trk-btn trk-btn--danger" onClick={deleteActiveApplication} disabled={deletingApplication}>
                        <FontAwesomeIcon icon={['fas', 'trash']} />
                        {deletingApplication
                          ? locale === 'fr' ? 'Suppression…' : 'Deleting…'
                          : locale === 'fr' ? 'Supprimer définitivement' : 'Delete permanently'}
                      </button>
                    </footer>
                  </ServiceModal>
                )}
                {jobDetailsOpen && (
                  <ServiceModal title={locale === 'fr' ? 'Détails de la candidature' : 'Application details'} onClose={() => setJobDetailsOpen(false)} wide>
                    <JobInfo
                      locale={locale}
                      job={activeJob}
                      hasResume={!!jobResume}
                      onPrev={() => stepJob(-1)}
                      onNext={() => stepJob(1)}
                    />
                  </ServiceModal>
                )}
                {isCanadaView ? (
                  <CanadianCV resumeData={displayCanada} locale={locale} settings={effectiveSettings} />
                ) : (
                  <div className="cv-preview">
                    <div
                      className="resume"
                      id="area-cv"
                      style={{
                        '--cv-font-scale': effectiveSettings.fontScale,
                        '--title-scale': effectiveSettings.titleScale ?? 1,
                        '--title-transform': (effectiveSettings.titleCaps ?? true) ? 'uppercase' : 'none',
                        '--title-letter-spacing': (effectiveSettings.titleCaps ?? true) ? '0.24em' : '0.02em',
                        '--photo-size': `${effectiveSettings.photoSize ?? 96}px`,
                        '--accent': effectiveSettings.accent,
                        '--accent-strong': effectiveSettings.accent,
                      }}
                    >
                      <aside className="resume_left">
                        {leftSections.map((key) => {
                          const Section = SECTION_COMPONENTS[key];
                          return <div className="cv-section-zone" style={{ '--section-scale': effectiveSettings.sectionScale[key], ...expVars }} key={key}><Section resumeData={displayResume} locale={locale} showImage={effectiveSettings.showImage} /></div>;
                        })}
                      </aside>
                      <section className="resume_right">
                        {rightSections.map((key) => {
                          const Section = SECTION_COMPONENTS[key];
                          return <div className="cv-section-zone" style={{ '--section-scale': effectiveSettings.sectionScale[key], ...expVars }} key={key}><Section resumeData={displayResume} locale={locale} showImage={effectiveSettings.showImage} /></div>;
                        })}
                      </section>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="application-empty">{locale === 'fr' ? 'Sélectionnez une candidature.' : 'Select an application.'}</p>
            )}
          </section>
        ) : (
          <ApplicationTracker
            locale={locale}
            refreshKey={refreshKey}
            openCandidate={openCandidate}
            onConsumeOpen={() => setOpenCandidate(null)}
            onOpenApplication={selectJob}
          />
        )}
      </main>
    </div>
  );
}

export default AppCustome;
