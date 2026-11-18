const CANADA_TEXT = {
  fr: {
    summary: 'Profil Professionnel',
    skills: 'Compétences Techniques',
    languages: 'Langues',
    experience: 'Expérience Professionnelle',
    education: 'Formation & Diplômes',
  },
  en: {
    summary: 'Professional Summary',
    skills: 'Technical Skills',
    languages: 'Languages',
    experience: 'Professional Experience',
    education: 'Education',
  },
};

function CanadianCV({ resumeData, locale, settings }) {
  const t = CANADA_TEXT[locale] ?? CANADA_TEXT.en;
  const { basics, links = [], languages = [], skillGroups = [], experience = [], education = [] } = resumeData;
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
        {isVisible('tagline') && basics.tagline && <p className="ca-tagline">{basics.tagline}</p>}

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
            {experience.map((job) => {
              const renderBullets = (bullets) => bullets?.length > 0 && (
                <ul className="ca-bullets">
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              );

              return (
                <article className="ca-entry" key={`${job.company}-${job.role}`}>
                  <div className="ca-entry-head">
                    <div className="ca-entry-identity">
                      <h3 className="ca-entry-title">{job.role}</h3>
                      <p className="ca-entry-sub">{job.company}</p>
                    </div>
                    {job.contracts ? (
                      job.location && (
                        <div className="ca-entry-meta">
                          <span className="ca-entry-location">{job.location}</span>
                        </div>
                      )
                    ) : (
                      <div className="ca-entry-meta">
                        <span className="ca-entry-period">{job.period}</span>
                        {job.location && <span className="ca-entry-location">{job.location}</span>}
                        {job.contractType && job.contractType.split('·').map((type) => {
                          const label = type.trim();
                          return <span className="ca-contract-type-badge" key={label}>{label}</span>;
                        })}
                      </div>
                    )}
                  </div>
                  {job.contracts
                    ? job.contracts.map((contract) => (
                      <div className="ca-contract" key={`${contract.contractType}-${contract.period}`}>
                        <div className="ca-contract-head">
                          <span className="ca-contract-type-badge">{contract.contractType}</span>
                          <span className="ca-entry-period">{contract.period}</span>
                        </div>
                        {renderBullets(contract.bullets)}
                      </div>
                    ))
                    : renderBullets(job.bullets)}
                  {job.contracts && renderBullets(job.bullets)}
                </article>
              );
            })}
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

      {isVisible('languages') && languages.length > 0 && (
        <section className="ca-section">
          <h2 className="ca-section-title">{t.languages}</h2>
          <div className="ca-languages">
            {languages.map((language) => (
              <div className="ca-language-row" key={language.name}>
                <span className="ca-language-name">{language.name}</span>
                {language.level && <span className="ca-language-level">{language.level}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default CanadianCV;
