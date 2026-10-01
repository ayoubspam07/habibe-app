import React, { useRef } from 'react';
import './App.css';
import jsPDF from 'jspdf';
// FontAwesome & External Scripts (Can be added in public/index.html or via useEffect)
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fas, fab);

const Header = () => (
<></>
  // <header className="l-header" id="header">
  //   <nav className="nav bd-container">
  //     <a href="#" className="nav_logo">Ayoub BOUDRA</a>
  //     <div className="nav_menu" id="nav-menu">
  //       <ul className="nav_list">
  //         {[
  //           { id: 'home', icon: 'house', label: 'Home' },
  //           { id: 'profile', icon: 'user', label: 'Profile' },
  //           { id: 'skills', icon: 'computer', label: 'Skills' },
  //           { id: 'languages', icon: 'comments', label: 'Languages' },
  //           { id: 'experience', icon: 'briefcase', label: 'Experiences' },
  //           { id: 'certificates', icon: 'graduation-cap', label: 'Certificates' },
  //           { id: 'education', icon: 'book-bookmark', label: 'Education' },
  //           { id: 'interests', icon: 'icons', label: 'Interests' },
  //         ].map(({ id, icon, label }) => (
  //           <li className="nav_item" key={id}>
  //             <a href={`#${id}`} className="nav_link">
  //               <FontAwesomeIcon icon={["fas", icon]} className="nav_icon" /> {label}
  //             </a>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <div className="nav_toggle" id="nav-toggle">
  //       <FontAwesomeIcon icon={["fas", "bars"]} />
  //     </div>
  //   </nav>
  // </header>
);

const Home = () => (
  <section className="home" id="home">
    <div className="home_container section bd-grid">
      <div className="home_data bd-grid">
        <img src="/pictures/profile_2.jpg" className="home_img" id="home-img" />
        <h1 className="home_title">Ayoub <b>BOUDRA</b></h1>
        {/* <h3 className="home_profession">À la recherche d'un alternance en</h3> */}
        {/* <h3>Consultant Data</h3>  */}
        <div>
          <a download id="download-button" className="home_button-movil">Download</a>
        </div>
      </div>
      <div className="home_address bd-grid">
        <span className="home_information">
          <p className="home_link">
            <FontAwesomeIcon icon={["fas", "envelope"]} className="home_icon" /> ayoub.boudra1@gmail.com
          </p>
        </span>
        <span className="home_information">
          <p className="home_link">
            <FontAwesomeIcon icon={["fas", "phone"]} className="home_icon" /> +33 7 51 23 51 69
          </p>
        </span>
        <a  href="https://www.linkedin.com/in/ayoub-boudra/" target="_blank" className="social_link">
          <FontAwesomeIcon icon={["fab", "linkedin"]} className="social_icon" /> /in/ayoub-boudra
        </a>
        {/* <a href='https://github.com/ayoubboudra1' target="_blank"   className="social_link">
          <FontAwesomeIcon icon={["fab", "github"]} className="social_icon" /> /ayoubboudra1
        </a> */}
        {/* <p className="home_link">
          <FontAwesomeIcon icon={["fas", "map-marker-alt"]} className="home_icon" /> Mobilité National en France
        </p> */}
        {/* <p className="home_link">
          <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="home_icon" /> 2 semaines entreprise / 1 semaine cours
        </p> */}
        {/* <a href='#'  target='_blank' rel="noreferrer" className="social_link">
          <FontAwesomeIcon icon="fa-solid fa-globe" className='social_icon' /> /ayoubboudra1
        </a>/ */}
      </div>
    </div>
  </section>
);

const Languages = () => ( 
  <section className="languages section" id="languages">
    <h2 className="section-title">Langues</h2>
    <div className="languages_container">
      <ul className="languages_content bd-grid">
        {[
          { name: 'Français', level: 'Courant' },
          { name: 'Anglais', level: 'Courant' },
          { name: 'Arabe', level: 'Courant' },
        ].map(({ name, level }, index) => (
          <li key={index} className="languages_name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="languages_text" style={{ flex: 1, textAlign: 'left' }}>{name}</span>
            <span className="languages_text" style={{ flex: 1, textAlign: 'center' }}>{level}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);


const Skills = () => (
  <div className="skills-container">
    <section className="skills section" id="technical-skills">
      <h2 className="section-title">
        Compétence Technique
      </h2>
      
      <div className="skills-subsection">
        <div className="certificate_container bd-grid">
          {[
            { 
              title: "Data Product", 
              detail: "Conception de pipelines (Airflow, dbt) + outils décisionnels (Power BI/Tableau)",
            },
            { 
              title: "Développement Web", 
              detail: "ReactJS, Next.js, Flask, Spring Boot, REST APIs",
            },
            { 
              title: "Développement Data", 
              detail: "Python, SQL, architectures cloud (AWS/GCP/Azure)",
            },
            { 
              title: "IA Appliquée", 
              detail: "LLMs, NLP (Hugging Face), analyse temps réel (Kafka/Spark)",
            },
            { 
              title: "Création de Sites Web", 
              detail: "HTML/CSS, JavaScript, CMS (WordPress), SEO",
            }
          ].map(({ title, detail, icon }, index) => (
            <div key={`tech-${index}`} className="certificate_content">
              <div className="certificate_data bd-grid">
                <h3 className="certificate_year">
                  {title}
                </h3>
                <span className="certificate_title">{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>   
    </section>

    <section className="skills section" id="business-skills">
      <h2 className="section-title">
        Soft Skills
      </h2>

      <div className="skills-subsection">
        <div className="certificate_container bd-grid">
          {[
            { 
              title: "Gestion de Projet", 
              detail: "Agile/Scrum (Jira/Kanban), Roadmap produit",
            },
            { 
              title: "Business Development", 
              detail: "Analyse marché & modélisation financière",
            },
            { 
              title: "Pitch & Vente", 
              detail: "Présentation clients, démonstrations (expérience freelance)",
            },
            { 
              title: "Marketing Digital", 
              detail: "Réseaux sociaux, content marketing",
            }
          ].map(({ title, detail, icon }, index) => (
            <div key={`biz-${index}`} className="certificate_content">
              <div className="certificate_data bd-grid">
                <h3 className="certificate_year">
                  {title}
                </h3>
                <span className="certificate_title">{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);


const ExperienceSection = ()  => {
  return    <section className="experience section" id="experience">
                        <h2 className="section-title">Experiences</h2>

                        <div className="experience_container bd-grid">
                            <div className="experience_content">
                                <div className="experience_time">
                                    <span className="experience_rounder"></span>
                                    <span className="experience_line"></span>
                                </div>
                                <div className="experience_data bd-grid">
                                    <div className="experience_header">
                                        <h3 className="experience_title">Data Engineer</h3>
                                        <span className="experience_year">Mars 2025 - Août 2025</span>
                                    </div>
                                    
                                    <span className="experience_company">NAPTA | Paris, France</span>
                                    
                                <ul className="experience_description">
                                    <li className='li_margin'>Conception et optimisation de pipelines ETL (Airflow, Python) intégrant des données provenant d’APIs, de DataLake et de stockages cloud (AWS S3/Blob). Modernisation des systèmes existants avec des DAGs optimisés et un refactoring du code, améliorant l'efficacité des traitements.</li>
                                    <li className='li_margin'>Déploiement de solutions cloud AWS (EC2, S3, MWAA) avec des pipelines CI/CD (GitLab) pour automatiser les workflows.</li>
                                    <li className='li_margin'>Collaboration avec des équipes pluridisciplinaires en méthode Agile/Scrum (Jira) pour livrer des solutions data adaptées aux besoins des clients. Gestion du cycle de vie complet des données et développement d’outils en self-service pour améliorer l’autonomie des clients.</li>
                                </ul>
                                </div>
                            </div>
                            <div className="experience_content">
                                <div className="experience_time">
                                    <span className="experience_rounder"></span>
                                    <span className="experience_line"></span>
                                </div>
                                <div className="experience_data bd-grid">
                                    <div className="experience_header">
                                        <h3 className="experience_title">Software Engineer - Gen IA</h3>
                                        <span className="experience_year">Février 2024 - Juin 2024</span>
                                    </div>
                                    <span className="experience_company">Powergo | Casablanca, Maroc</span>
                                    <ul className="experience_description">
                                    <li>Développement d'une application web basée sur l’IA pour simplifier la gestion des subventions.</li>
                                    <li>Intégration de modèles de langage (LLMs) pour la génération automatique de contenu et l’analyse de données.</li>
                                    <li>Automatisation de la collecte de données via API afin d’améliorer la précision.</li>
                                    <li>Gestion du projet selon la méthode Kanban pour assurer la coordination et la livraison des jalons.</li>
                                    </ul>

                                </div>
                            </div>
                            <div className="experience_content">
                                <div className="experience_time">
                                    <span className="experience_rounder"></span>
                                </div>
                                <div className="experience_data bd-grid">
                                    <div className="experience_header">
                                        <h3 className="experience_title">Software Engineer</h3>
                                        <span className="experience_year">May 2022 - June 2022</span>
                                    </div>
                                    <span className="experience_company">INNOV-DS | Fes, Maroc</span>
                                    <ul className="experience_description">
                                        <li>Développement d’un système de gestion commerciale full-stack automatisant l’ensemble des opérations, y compris le traitement des ventes, le suivi des stocks et la logistique d’expédition.</li>
                                        <li>Conception et mise en œuvre d’un schéma de base de données normalisé (3NF) avec indexation optimisée, améliorant les performances des requêtes.</li>
                                        <li>Collaboration au sein d’une équipe Agile Scrum de 10 personnes, avec une participation active à la planification des sprints, aux réunions quotidiennes et aux rétrospectives.</li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </section>
}

const EducationSection = () => {
  return (
<section className="education section" id="education">
  <h2 className="section-title">Formations</h2>

  <div className="education_container bd-grid">
    {/* <div className="experience_content">
      <div className="experience_time">
        <span className="experience_rounder"></span>
        <span className="experience_line"></span>
      </div>
      <div className="experience_data bd-grid">
        <div className="experience_header">
          <h3 className="experience_title">Master Data et IA</h3>
          <span className="experience_year">2025 - 2026</span>
        </div>
        <span className="experience_company">Ynov Campus Paris, France</span>
      </div>
    </div> */}

    <div className="experience_content">
      <div className="experience_time">
        <span className="experience_rounder"></span>
        <span className="experience_line"></span>
      </div>
      <div className="experience_data bd-grid">
        <div className="experience_header">
          <h3 className="experience_title">Master Sciences et Ingénierie des Données</h3>
          <span className="experience_year">2024 - 2025</span>
        </div>
        <span className="experience_company">Université d’Aix-Marseille – Marseille, France</span>
      </div>
    </div>

    <div className="experience_content">
      <div className="experience_time">
        <span className="experience_rounder"></span>
        <span className="experience_line"></span>
      </div>
      <div className="experience_data bd-grid">
        <div className="experience_header">
          <h3 className="experience_title">Master en Science des Données et Systèmes Intelligents</h3>
          <span className="experience_year">2023 - 2024</span>
        </div>
        <span className="experience_company">Faculté des Sciences et Techniques</span>
      </div>
    </div>

    <div className="experience_content">
      <div className="experience_time">
        <span className="experience_rounder"></span>
      </div>
      <div className="experience_data bd-grid">
        <div className="experience_header">
          <h3 className="experience_title">Licence en Génie Informatique</h3>
          <span className="experience_year">2018 - 2022</span>
        </div>
        <span className="experience_company">Faculté des Sciences et Techniques</span>
      </div>
    </div>
  </div>

  <div className="education_content">
    <div className="education_time">
      <span className="education_rounder"></span>
      <span className="custom_experience_line"></span>
    </div>
    <div className="education_data bd-grid" style={{ marginTop: '10px' }}>
      <h3 className="education_title">Certifications & Formations en ligne</h3>
      <div className="experience_header bd-grid">
        <span className="education_studies">AWS Certified Data Engineer – Associate (Udemy 22h)</span>
      </div>
    </div>
  </div>
</section>

  );
};


const ProjectsSection = () => {
  return (
                        <section class="experience section" id="experience">
                        <h2 class="section-title">Projets</h2>

                        <div class="experience_container bd-grid">
          {/* <div class="experience_content">
            <div class="experience_time">
                <span class="experience_rounder"></span>
                <span class="experience_line"></span>
            </div>
            <div class="experience_data bd-grid">
                <a href="#" class="experience_title" target="_blank">Implémentation d'un Data Warehouse avec Snowflake & dbt<i class="fa-brands fa-github"></i></a>
                <p class="experience_description">
                    Conception et déploiement d'un entrepôt de données analytiques retail de bout en bout utilisant Snowflake pour le stockage cloud, dbt pour les transformations SQL (staging → marts) et Airflow pour l'orchestration. Ingestion des données depuis PostgreSQL, S3 et Google Analytics via Fivetran, modélisation en schéma en étoile et assurance qualité avec des tests dbt. Automatisation des pipelines avec CI/CD (GitHub Actions) et fourniture d'analyses via Tableau.
                </p>
            </div>
        </div>
        <div class="experience_content">
            <div class="experience_time">
                <span class="experience_rounder"></span>
                <span class="experience_line"></span>
            </div>
            <div class="experience_data bd-grid">
                <a href="#" class="experience_title" target="_blank">Architecture Data Lakehouse sur Azure avec ADF, Databricks et Synapse<i class="fa-brands fa-github"></i></a>
                <p class="experience_description">
                    Réalisation d’un pipeline de traitement de données de bout en bout sur Azure, en partant d’une base SQL Server on-premise vers Power BI. Les données sont ingérées via Azure Data Factory, stockées dans Azure Data Lake Gen2 selon une architecture en couches (Bronze, Silver, Gold), transformées avec Azure Databricks, puis chargées dans Azure Synapse Analytics pour permettre une visualisation interactive dans Power BI. 
                </p>
            </div>
        </div> */}
        <div class="experience_content">
          <div class="experience_time">
            <span class="experience_rounder"></span>
            <span class="experience_line"></span>
          </div>
          <div class="experience_data bd-grid">
            <a href="#" class="experience_title" target="_blank">
              Système d’analyse comportementale en temps réel Deep Learning & Edge AI
              <i class="fa-brands fa-github"></i>
            </a>
            <p class="experience_description">
              Développement d’un système intelligent de surveillance basé sur l’IoT et le Deep Learning pour analyser des flux vidéo en temps réel. Le dispositif utilise Jetson Nano avec une caméra IMX219 pour détecter les individus, estimer leur âge, sexe et posture. Le pipeline repose sur NVIDIA DeepStream, Kafka, Spark et Cassandra pour assurer une analyse en continu et générer des alertes précises. Le projet vise à renforcer la sécurité publique par une détection proactive de comportements à risque.
            </p>
          </div>
        </div>
        <div class="experience_content">
          <div class="experience_time">
            <span class="experience_rounder"></span>
            <span class="experience_line"></span>
          </div>
          <div class="experience_data bd-grid">
            <a href="#" class="experience_title" target="_blank">
              Analyse des performances commerciales et visualisation avec Power BI
              <i class="fa-brands fa-github"></i>
            </a>
            <p class="experience_description">
              Projet d’analyse des ventes d’une entreprise de distribution sur une période de 2 ans. Nettoyage et transformation des données (Excel, SQL Server) pour identifier les KPIs (CA, marge, panier moyen, taux de conversion). Création de tableaux de bord dynamiques dans Power BI avec segmentation par région, période et catégorie de produits. Mise en place de mesures DAX personnalisées pour le suivi des objectifs. 
            </p>
          </div>
        </div>


        <div class="experience_content">
            <div class="experience_time">
                <span class="experience_rounder"></span>
                <span class="experience_line"></span>
            </div>
            <div class="experience_data bd-grid">
                <a href="https://github.com/ayoubboudra1/TER-serverless-bikes" class="experience_title" target="_blank">Plateforme de données serverless (AWS/Snowflake)<i class="fa-brands fa-github"></i></a>
                <p class="experience_description">
                    Conception d'une architecture cloud serverless sur AWS (Lambda, Step Functions, S3) pour ingérer et transformer des données open-data, avec Snowflake comme entrepôt et Metabase pour la visualisation. Déploiement automatisé via Terraform (IaC), implémentation de dashboards de surveillance (CloudWatch), et optimisation des coûts avec le free tier AWS.
                </p>
            </div>
        </div>
        <div class="experience_content">
            <div class="experience_time">
                <span class="experience_rounder"></span>
            </div>
            <div class="experience_data bd-grid">
                <h3 class="experience_title">Système de détection de fraude temps réel</h3>
                <p class="experience_description">
                    Système de détection de fraude temps réel utilisant Kafka (streaming), Spark (ETL), et MLflow (MLOps). Entraînement mensuel automatisé (Airflow) avec alertes immédiates. Visualisation via Power BI.
                </p>
            </div>
        </div>
    </div>
                    </section>
  );
};

const APropos = () => (
  <section className="about section" id="about">
    <h2 className="section-title">À Propos de Moi</h2>
    <div className="about_container bd-grid">
      <p className="experience_description">
Titulaire d’un Master 2 en Data Science et Intelligence Artificielle, je souhaite compléter mes compétences par une formation en management de projet. Le Master de Management à votre formation est l’opportunité idéale pour acquérir les outils nécessaires au pilotage de projets ambitieux. Je suis convaincu que cette formation me permettra de concrétiser mes objectifs professionnels.
</p>    </div>
  </section>
);

const AppFormation = () => {

  return (
    <div>
      <Header />
      <main className="l-main bd-container">
            {/* {!isVisible && <FontAwesomeIcon onClick={handlePrint} icon={["fas", "download"]} className="generate-pdf" title="Generate PDF" id="resume-button" />} */}

        <div className="resume"  id="area-cv">
          <div className="resume_left">
            <Home />
            <Languages />
            <Skills />
          </div>
          <div className='resume_right'>
            <h3 className='home_title' style={{margin:"2rem 0 2rem 0"}} ><b>CV pour Formation en Management </b></h3>
            <APropos />
            {/* <ProjectsSection /> */}
            <ExperienceSection />
            <EducationSection />
            {/* <ProjectsSection /> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppFormation;
