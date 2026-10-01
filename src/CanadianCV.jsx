const CANADA_TEXT = {
  fr: {
    summary: 'Profil Professionnel',
    skills: 'Compétences Techniques',
    experience: 'Expérience Professionnelle',
    education: 'Formation & Diplômes',
    languages: 'Langues',
  },
  en: {
    summary: 'Professional Summary',
    skills: 'Technical Skills',
    experience: 'Professional Experience',
    education: 'Education',
    languages: 'Languages',
  },
};

function CanadianCV({ resumeData, locale, settings }) {
  const t = CANADA_TEXT[locale] ?? CANADA_TEXT.en;
  const { basics, links = [], skillGroups = [], experience = [], education = [], languages = [] } = resumeData;
  const visible = settings?.visible ?? {};
  const isVisible = (key) => visible[key] !== false;

  return (
    <div
      className="ca-resume"
      id="area-cv"
      style={{
        '--ca-font-size': `${10 * (settings?.fontScale ?? 1)}pt`,
        '--ca-page-padding-top': `${settings?.pageMargins?.top ?? 12}mm`,
        '--ca-page-padding-right': `${settings?.pageMargins?.right ?? 15}mm`,
        '--ca-page-padding-bottom': `${settings?.pageMargins?.bottom ?? 12}mm`,
        '--ca-page-padding-left': `${settings?.pageMargins?.left ?? 15}mm`,
      }}
    >
      <header className="ca-header">
        {isVisible('name') && <h1 className="ca-name">{basics.firstName} {basics.lastName}</h1>}
        {isVisible('title') && basics.title && <p className="ca-title">{basics.title}</p>}

        <div className="ca-contact">
          {isVisible('location') && basics.location && (
            <span className="ca-contact-item">
              {basics.location}
            </span>
          )}
          {isVisible('phone') && basics.phone && (
            <a className="ca-contact-item" href={`tel:${basics.phone.replace(/\s+/g, '')}`}>
              {basics.phone}
            </a>
          )}
          {isVisible('email') && basics.email && (
            <a className="ca-contact-item" href={`mailto:${basics.email}`}>
              {basics.email}
            </a>
          )}
          {isVisible('links') && links.map((link) => (
            <a
              key={link.label}
              className="ca-contact-item"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label || link.value}
            </a>
          ))}
        </div>
      </header>

      {isVisible('summary') && basics.summary && (
        <section className="ca-section">
          <h2 className="ca-section-title">{t.summary}</h2>
          <p className="ca-summary-text">{basics.summary}</p>
        </section>
      )}

      {isVisible('experience') && experience.length > 0 && (
        <section className="ca-section">
          <h2 className="ca-section-title">{t.experience}</h2>
          <div className="ca-list">
            {experience.map((job) => (
              <article className="ca-entry" key={`${job.company}-${job.role}`}>
                <div className="ca-entry-head">
                  <div className="ca-entry-identity">
                    <h3 className="ca-entry-title">{job.role}</h3>
                    <p className="ca-entry-sub">{job.company}</p>
                  </div>
                  <div className="ca-entry-meta">
                    <span className="ca-entry-period">{job.period}</span>
                    {job.location && <span className="ca-entry-location">{job.location}</span>}
                  </div>
                </div>
                {job.bullets?.length > 0 && (
                  <ul className="ca-bullets">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {isVisible('skills') && skillGroups.length > 0 && (
        <section className="ca-section">
          <h2 className="ca-section-title">{t.skills}</h2>
          <div className="ca-skills">
            {skillGroups.map((group) => (
              <div className="ca-skill-group" key={group.title}>
                <span className="ca-skill-group-title">{group.title}:</span>{' '}
                <span className="ca-skill-group-items">{group.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {isVisible('education') && education.length > 0 && (
        <section className="ca-section">
          <h2 className="ca-section-title">{t.education}</h2>
          <div className="ca-list ca-education-list">
            {education.map((item) => (
              <article className="ca-entry" key={`${item.degree}-${item.school}`}>
                <div className="ca-entry-head">
                  <div className="ca-entry-identity">
                    <h3 className="ca-entry-title">{item.degree}</h3>
                    <p className="ca-entry-sub">{item.school}</p>
                  </div>
                  <div className="ca-entry-meta">
                    {item.period && <span className="ca-entry-period">{item.period}</span>}
                    {item.location && <span className="ca-entry-location">{item.location}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {isVisible('languages') && languages.length > 0 && (
        <section className="ca-section">
          <h2 className="ca-section-title">{t.languages}</h2>
          <ul className="ca-languages">
            {languages.map((language) => (
              <li key={language.name}>
                <span className="ca-language-name">{language.name}:</span>{' '}
                <span className="ca-language-level">{language.level}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default CanadianCV;
