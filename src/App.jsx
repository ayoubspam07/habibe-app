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
        <h3 className="home_profession">Data Engineer</h3>
        <h3 className='home_profession_description'>Solides compétences pratiques en Data Engineering, Cloud, Big Data et DevOps</h3>
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
        <a href='https://github.com/ayoubboudra1' target="_blank"   className="social_link">
          <FontAwesomeIcon icon={["fab", "github"]} className="social_icon" /> /ayoubboudra1
        </a>
        <p className="home_link">
          <FontAwesomeIcon icon={["fas", "map-marker-alt"]} className="home_icon" /> Mobilité National en France
        </p>
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
  <section className="skills section" id="skills">
    <h2 className="section-title">Compétences</h2>
    <div className="certificate_container bd-grid">
      {[
        { title: "Langages de programmation", detail: "Python, SQL, Java, Shell, Scala" },
        { title: "Traitement de données & Big Data", detail: "Apache Spark, Hadoop, Delta Lake" },
        { title: "Orchestration & Pipelines de données", detail: "Apache Airflow, dbt, Apache NiFi, Kafka" },
        { title: "Bases de données", detail: "PostgreSQL, MySQL, SQL Server, MongoDB, Cassandra" },
        { title: "Data Warehousing", detail: "Snowflake, Amazon Redshift, Google BigQuery, Azure Synapse" },
        { title: "Cloud & Services managés", detail: "AWS, GCP, Azure" },
        { title: "Conteneurisation & Infrastructure", detail: "Docker, Kubernetes, Terraform" },
        { title: "CI/CD & DevOps", detail: "Git, GitHub, GitLab CI, Jenkins, CloudWatch" },
        { title: "Data Science & IA", detail: "Machine Learning, Deep Learning, RAG, Scikit-learn, TensorFlow, PyTorch, Pandas, NumPy, MLflow, Feature Engineering, Data Cleaning, Matplotlib, Seaborn, Plotly, Power BI, Tableau," },
        { title: "Tests & Qualité", detail: "Debugging, Tests unitaires" },
        { title: "Méthodologies de travail", detail: "Scrum, Agile, Jira, Kanban" },
        { title: "Développement Web & Intégration", detail: "JavaScript, Flask, Spring Boot, ReactJS, REST APIs" }
].map(({ title, detail }, index) => (
        <div key={index} className="certificate_content">
          <div className="certificate_data bd-grid">
            <h3 className="certificate_year">{title}</h3>
            <span className="certificate_title">{detail}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);


const APropos = () => (
  <section className="about section" id="about" style={{marginTop: "1rem"}}>
    <h2 className="section-title">À Propos de Moi</h2>
    <div className="about_container bd-grid">
      <p className="experience_description">
Data Engineer passionné par les environnements Cloud et Big Data, je souhaite contribuer à des projets à fort impact technologique. Grâce à ma double formation et à mes expériences concrètes en data engineering, cloud computing et traitement de données massives, je suis prêt à relever de nouveaux défis, à continuer à monter en compétences et à participer activement à la réussite des projets</p>
    </div>
  </section>
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
                                          <h3 className="experience_title">Data Science - IA Générative</h3>
                                          <span className="experience_year">Février 2024 - Juin 2024</span>
                                      </div>
                                      <span className="experience_company">Powergo | Casablanca, Maroc</span>
                                      <ul className="experience_description">
                                          <li>Implémentation d’un système RAG pour la génération automatisée de rapports personnalisés.</li>
                                          <li>Exploitation de données juridiques et historiques pour enrichir une base de connaissances contextuelle.</li>
                                          <li>Structuration d’une base MongoDB pour le stockage et l’indexation de données textuelles massives.</li>
                                          <li>Création de prompts dynamiques enrichis par une API de recherche web selon les besoins utilisateurs.</li>
                                          <li>Gestion du projet en méthode Kanban avec livraisons itératives.</li>
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
  return                     <section className="education section" id="education">
                        <h2 className="section-title">Formation</h2>
                      
                        <div className="education_container bd-grid">
                          <div className="experience_content">
                            <div className="experience_time">
                                <span className="experience_rounder"></span>
                                <span className="experience_line"></span>
                            </div>
                            <div className="experience_data bd-grid">
                                <div className="experience_header">
                                    <h3 className="experience_title">Master Science et ingénierie des données</h3>
                                    <span className="experience_year">2024 - 2025</span>
                                </div>
                                
                                <span className="experience_company">Aix-Marseille Université - Marseille, France</span>
                            </div>
                          </div>
                          <div className="experience_content">
                            <div className="experience_time">
                                <span className="experience_rounder"></span>
                                <span className="experience_line"></span>
                            </div>
                            <div className="experience_data bd-grid">
                                <div className="experience_header">
                                    <h3 className="experience_title">Master Sciences des Données et Systèmes Intelligents</h3>
                                    <span className="experience_year">2022 - 2024</span>
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
                                    <h3 className="experience_title">Licence Sciences et Techniques Génie Informatique</h3>
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
                            <div className="experience_header bd-grid">
                                <a href="https://learn.microsoft.com/api/achievements/share/en-gb/ayoubboudra-1521/W7W6DBWN?sharingId=2E84F23501872909" className="education_studies">Data Creer Path in Azure Cloud (Micrisof Learning)</a>
                            </div>
                            <div className="experience_header bd-grid">
                                <a href="https://www.mygreatlearning.com/certificate/PPQRCRSS" className="education_studies">Aws Cloud Basics (Greate Learning)</a>
                            </div>
                            </div>
                          </div>
                      
                      </section>
}



const ProjectsSection = () => {
  return (
    <section className="experience section" id="experience">
      <h2 className="section-title">Projets</h2>

      <div className="experience_container bd-grid">
        <div className="experience_content">
          <div className="experience_time">
            <span className="experience_rounder"></span>
            <span className="experience_line"></span>
          </div>
          <div className="experience_data bd-grid">
            <a href="#" className="experience_title" target="_blank" rel="noopener noreferrer">
              Implémentation d'un Data Warehouse avec Snowflake & dbt <i className="fa-brands fa-github"></i>
            </a>
            <p className="experience_description">
              Conception et déploiement d'un entrepôt de données analytiques retail de bout en bout utilisant Snowflake pour le stockage cloud, dbt pour les transformations SQL (staging → marts) et Airflow pour l'orchestration. Ingestion des données depuis PostgreSQL, S3 et Google Analytics via Fivetran, modélisation en schéma en étoile et assurance qualité avec des tests dbt. Automatisation des pipelines avec CI/CD (GitHub Actions) et fourniture d'analyses via Tableau.
            </p>
          </div>
        </div>

        <div className="experience_content">
          <div className="experience_time">
            <span className="experience_rounder"></span>
            <span className="experience_line"></span>
          </div>
          <div className="experience_data bd-grid">
            <a href="#" className="experience_title" target="_blank" rel="noopener noreferrer">
              Architecture Data Lakehouse sur Azure avec ADF, Databricks et Synapse <i className="fa-brands fa-github"></i>
            </a>
            <p className="experience_description">
              Réalisation d’un pipeline de traitement de données de bout en bout sur Azure, en partant d’une base SQL Server on-premise vers Power BI. Les données sont ingérées via Azure Data Factory, stockées dans Azure Data Lake Gen2 selon une architecture en couches (Bronze, Silver, Gold), transformées avec Azure Databricks, puis chargées dans Azure Synapse Analytics pour permettre une visualisation interactive dans Power BI.
            </p>
          </div>
        </div>

        <div className="experience_content">
          <div className="experience_time">
            <span className="experience_rounder"></span>
            <span className="experience_line"></span>
          </div>
          <div className="experience_data bd-grid">
            <a
              href="https://github.com/ayoubboudra1/TER-serverless-bikes"
              className="experience_title"
              target="_blank"
              rel="noopener noreferrer"
            >
              Plateforme de données serverless (AWS/Snowflake) <i className="fa-brands fa-github"></i>
            </a>
            <p className="experience_description">
              Conception d'une architecture cloud serverless sur AWS (Lambda, Step Functions, S3) pour ingérer et transformer des données open-data, avec Snowflake comme entrepôt et Metabase pour la visualisation. Déploiement automatisé via Terraform (IaC), implémentation de dashboards de surveillance (CloudWatch), et optimisation des coûts avec le free tier AWS.
            </p>
          </div>
        </div>

        <div className="experience_content">
          <div className="experience_time">
            <span className="experience_rounder"></span>
          </div>
          <div className="experience_data bd-grid">
            <h3 className="experience_title">Système de détection de fraude temps réel</h3>
            <p className="experience_description">
              Système de détection de fraude temps réel utilisant Kafka (streaming), Spark (ETL), et MLflow (MLOps). Entraînement mensuel automatisé (Airflow) avec alertes immédiates. Visualisation via Power BI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};



const App = () => {

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
            {/* <h3 className='home_title' style={{margin:".1rem 0 "}} ><b>Data Engineer – CDI/CDD – Solides compétences pratiques en ingénierie des données, Cloud, Big Data et DevOps</b></h3> */}
            {/* <APropos /> */}
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
