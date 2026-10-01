import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUser, faBriefcase, faGraduationCap, faBook } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Header = () => null;

const Accueil = () => (
  <section className="home" id="home">
    <div className="home_container section bd-grid">
      <div className="home_data bd-grid">
        <img src="/pictures/khaoula1.jpeg" className="home_img" id="home-img" style={{objectFit:"contain",zoom:1.2}} />
        <h1 className="home_title">Khaoula <b>KOUCHIH</b></h1>
        <h3 className="home_profession">Étudiante en Génie Industriel</h3>
      </div>
      <div className="home_address bd-grid">
        <span className="home_information">
          <p className="home_link">
            <FontAwesomeIcon icon={faEnvelope} className="home_icon select-disabled" /> khaoulakouchih@yahoo.com
          </p>
        </span>
        <span className="home_information">
          <p className="home_link">
            <FontAwesomeIcon icon={faPhone} className="home_icon select-disabled" /> +33 6 98 60 47 93
          </p>
        </span>
        <p className="social_link">
          <FontAwesomeIcon icon={faLinkedin} className="home_icon select-disabled" /> /in/khaoula-kouchih
        </p>
      </div>
    </div>
  </section>
);

const APropos = () => (
  <section className="about section" id="about">
    <h2 className="section-title">À Propos de Moi</h2>
    <div className="about_container bd-grid">
      <p className="experience_description">
Future étudiante en Master Génie Industriel, diplômée en Génie Industriel, je suis à la recherche d’une alternance à
partir de septembre 2025 dans le domaine de l’amélioration continue. Passionnée par l’optimisation des processus,
rigoureuse et proactive, je suis motivée à contribuer à la réduction des gaspillages, à l’analyse des performances et à la
mise en œuvre d’actions concrètes pour renforcer l’efficacité opérationnelle.</p>
    </div>
  </section>
);

const Formation = () => (
  <section className="education section" id="education">
    <h2 className="section-title">Formation</h2>
    <div className="education_container bd-grid">
      <div className="education_content">
        <div className="education_time">
          <span className="education_rounder"></span>
          <span className="education_line"></span>
        </div>
        <div className="education_data bd-grid">
          <h3 className="education_title">Licence 3 Ingénierie mécanique et matériaux I2M</h3>
          <span className="education_year">2024 - 2025</span>
          <span className="education_studies">UNIVERSITÉ DE LORRAINE - UFR MATHÉMATIQUES, INFORMATIQUE, MÉCANIQUE, Metz - France</span>
        </div>
      </div>
      
      <div className="education_content">
        <div className="education_time">
          <span className="education_rounder"></span>
          <span className="education_line"></span>
        </div>
        <div className="education_data bd-grid">
          <h3 className="education_title">Licence en Génie Industriel</h3>
          <span className="education_year">2023 - 2024</span>
          <span className="education_studies">FACULTÉ DES SCIENCES ET TECHNIQUES, Fès - Maroc</span>
        </div>
      </div>
      
      <div className="education_content">
        <div className="education_time">
          <span className="education_rounder"></span>
          <span className="education_line"></span>
        </div>
        <div className="education_data bd-grid">
          <h3 className="education_title">DEUST Mathématiques, Informatique, Physique</h3>
          <span className="education_year">2020 - 2023</span>
          <span className="education_studies">FACULTÉ DES SCIENCES ET TECHNIQUES, Fès - Maroc</span>
        </div>
      </div>
      
      <div className="education_content">
        <div className="education_time">
          <span className="education_rounder"></span>
        </div>
        <div className="education_data bd-grid">
          <h3 className="education_title">Baccalauréat Sciences Physiques</h3>
          <span className="education_year">2019 - 2020</span>
          <span className="education_studies">LYCÉE ZAYNAB ENNAFZAOUIYA, Oujda - Maroc</span>
        </div>
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section className="experience section" id="experience">
    <h2 className="section-title">Expérience</h2>
    <div className="experience_container bd-grid">
      <div className="experience_content">
        <div className="experience_time">
          <span className="experience_rounder"></span>
          <span className="experience_line"></span>
        </div>
        <div className="experience_data bd-grid">
          <h3 className="experience_title">Stage en Laboratoire</h3>
          <span className="experience_year">Avril 2025 - En cours</span>
          <span className="experience_company">Laboratoire LGIPM – Metz, France</span>
          <p className="experience_description">
            Stage en laboratoire au LGIPM (UFR MIM) portant sur l'étude de la fiabilité d'un système éolien à travers l'analyse des défaillances (modèle de Weibull, modèle de Cox) et la définition de stratégies de maintenance optimisées.
          </p>
        </div>
      </div>
      
      <div className="experience_content">
        <div className="experience_time">
          <span className="experience_rounder"></span>
        </div>
        <div className="experience_data bd-grid">
          <h3 className="experience_title">Stage Technicien Production</h3>
          <span className="experience_year">Avril 2024 - Juin 2024</span>
          <span className="experience_company">Floquet Monopole</span>
          <p className="experience_description">
            Analyse des performances de la ligne DV258 avec mise en œuvre des principes d'amélioration continue, identification des problèmes, proposition de solutions pour optimiser l'efficacité, et collaboration avec l'équipe de production pour améliorer la qualité et réduire les arrêts machines.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Competences = () => (
  <section className="skills section" id="skills">
    <h2 className="section-title">Compétences</h2>
    <div className="skills_container bd-grid">
      <div className="skills_content">
        <h3 className="experience_title">Amélioration Continue</h3>
        <ul className="experience_description" style={{width:"230px"}}>
          <li>Démarches Lean et Six Sigma (DMAIC, PDCA)</li>
          <li>Analyse et amélioration des processus</li>
          <li>VSM, 5S, Kaizen</li>
          <li>Standardisation des processus</li>
        </ul>
      </div>
      
      <div className="skills_content">
        <h3 className="experience_title">Indicateurs de performance</h3>
        <ul className="experience_description" style={{width:"230px"}}>
          <li>Suivi et analyse des KPI (TRS, MTBF, taux de non-conformité)</li>
          <li>Diagnostic des pertes de performance</li>
          <li>Analyse des arrêts de production</li>
        </ul>
      </div>
      
      <div className="skills_content">
        <h3 className="experience_title">Qualité & Résolution de problèmes</h3>
        <ul className="experience_description" style={{width:"230px"}}>
          <li>Outils qualité (Ishikawa, Pareto, AMDEC, 5 pourquoi)</li>
          <li>Démarches CAPA (Corrective and Preventive Actions)</li>
          <li>Conformité produit et analyse des non-conformités</li>
        </ul>
      </div>
      
      <div className="skills_content">
        <h3 className="experience_title">Gestion de projet</h3>
        <ul className="experience_description" style={{width:"230px"}}>
          <li>Planification et suivi d'actions d'amélioration</li>
          <li>Outils MS Project (Gantt, PERT)</li>
          <li>Pilotage par les délais et les résultats</li>
        </ul>
      </div>
      
      <div className="skills_content">
        <h3 className="experience_title">Outils numériques</h3>
        <ul className="experience_description" style={{width:"230px"}}>
          <li>Excel avancé (tableaux croisés, macros)</li>
          <li>PowerPoint pour reporting</li>
          <li>Logiciels de simulation (Abaqus, Matlab)</li>
        </ul>
      </div>
      
      <div className="skills_content">
        <h3 className="experience_title">Expérience pratique</h3>
        <p className="experience_description" style={{width:"230px"}}>
          Application en contexte industriel (ligne de production) et projets universitaires
        </p>
      </div>
    </div>
  </section>
);

// const Outils = () => (
//   <section className="tools section" id="tools">
//     <h2 className="section-title">Outils & Logiciels</h2>
//     <div className="tools_container bd-grid">
//       <div className="tools_content">
//         <p className="tools_description">
//         </p>
//       </div>
//     </div>
//   </section>
// );

const Langues = () => (
  <section className="languages section" id="languages">
    <h2 className="section-title">Langues</h2>
    <div className="languages_container">
      <ul className="languages_content bd-grid">
        <li className="languages_name" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <span className="languages_text" style={{flex:1,textAlign:"left"}}>Français</span>
          <span className="languages_text" style={{flex:1,textAlign:"left"}}>Courant</span>
        </li>
        <li className="languages_name" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <span className="languages_text" style={{flex:1,textAlign:"left"}}>Anglais</span>
          <span className="languages_text" style={{flex:1,textAlign:"left"}}>Courant</span>
        </li>
      </ul>
    </div>
  </section>
);

const Projets = () => (
  <section className="projects section" id="projects">
    <h2 className="section-title">Projet Universitaire</h2>
    <div className="projects_container bd-grid">
        <div className="experience_data bd-grid">
          <h3 className="experience_title">Diagnostic de performance et fiabilisation d’un poste de production</h3>
          <span className="experience_year">2024 – Licence Génie Industriel – Faculté des Sciences et Techniques de Fès</span>
          <p className="experience_description">
            analyser les pertes de performance d’un poste de production simulé afin d’identifier les causes de non-performance et de proposer des solutions d’amélioration continue.
          </p>
          <ul className="experience_description">
            <li>Cartographie du processus de production (VSM)</li>
            <li>Calcul du TRS (Taux de Rendement Synthétique) pour mesurer la disponibilité, la performance et la qualité</li>
            <li>Analyse des arrêts via la méthode des 5M et Ishikawa</li>
            <li>Identification des causes principales par Pareto et mise en place d’un plan d’actions PDCA</li>
          </ul>
        </div>
    </div>
  </section>
//   Titre : Diagnostic de performance et fiabilisation d’un poste de production
// Année : 2024 – Licence Génie Industriel – Faculté des Sciences et Techniques de Fès

// Objectif : analyser les pertes de performance d’un poste de production simulé afin d’identifier les causes de non-performance et de proposer des solutions d’amélioration continue.

// Contenu du projet :
// 	•	Cartographie du processus de production (VSM)
// 	•	Calcul du TRS (Taux de Rendement Synthétique) pour mesurer la disponibilité, la performance et la qualité
// 	•	Analyse des arrêts via la méthode des 5M et Ishikawa
// 	•	Identification des causes principales par Pareto et mise en place d’un plan d’actions PDCA
);

const App = () => {
  return (
    <div>
      <Header />
      <main className="l-main bd-container">
        <div className="resume" id="area-cv">
          <div className="resume_left">
            <Accueil />
            <Langues />
            <Competences />
          </div>
          <div className="resume_right">
            <APropos />
            <Formation />
            <Experience />
            <Projets />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;