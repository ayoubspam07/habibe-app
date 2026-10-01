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
        <a href="https://www.linkedin.com/in/ayoub-boudra/" target="_blank" className="social_link">
          <FontAwesomeIcon icon={["fab", "linkedin"]} className="social_icon" /> /in/ayoub-boudra
        </a>
        <a href='https://github.com/ayoubboudra1' target="_blank" className="social_link">
          <FontAwesomeIcon icon={["fab", "github"]} className="social_icon" /> /ayoubboudra1
        </a>
        <p className="home_link">
          <FontAwesomeIcon icon={["fas", "map-marker-alt"]} className="home_icon" /> Nationwide Mobility in France
        </p>
        <p className="home_link">
          <FontAwesomeIcon icon={["fas", "car"]} className="home_icon" /> Driving License B
        </p>
      </div>
    </div>
  </section>
);


const Languages = () => (
<section className="languages section" id="languages">
    <h2 className="section-title">Languages</h2>
    <div className="languages_container">
        <ul className="languages_content bd-grid">
            <li className="languages_name" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span className="languages_text" style={{flex:1,textAlign:"left"}}>French</span>
                <span className="languages_text" style={{flex:1,textAlign:"left"}}>Fluent</span>
            </li>
            <li className="languages_name" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span className="languages_text" style={{flex:1,textAlign:"left"}}>English</span>
                <span className="languages_text" style={{flex:1,textAlign:"left"}}>Fluent</span>
            </li>
            <li className="languages_name" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span className="languages_text" style={{flex:1,textAlign:"left"}}>Arabic</span>
                <span className="languages_text" style={{flex:1,textAlign:"left"}}>Fluent</span>
            </li>
        </ul>
    </div>
</section>
);

const Skills = () => (
  <section className="skills section" id="skills">
    <h2 className="section-title">Skills</h2>
    <div className="certificate_container bd-grid">
      {[
        { title: "Programming Languages", detail: "Python, SQL, Java, Shell, Scala" },
        { title: "Data Processing & Big Data", detail: "Apache Spark, Hadoop, Delta Lake" },
        { title: "Data Orchestration & Pipelines", detail: "Apache Airflow, dbt, Apache NiFi, Kafka" },
        { title: "Databases", detail: "PostgreSQL, MySQL, SQL Server, MongoDB, Cassandra" },
        { title: "Data Warehousing", detail: "Snowflake, Amazon Redshift, Google BigQuery, Azure Synapse" },
        { title: "Cloud & Managed Services", detail: "AWS, GCP, Azure" },
        { title: "Containerization & Infrastructure", detail: "Docker, Kubernetes, Terraform" },
        { title: "CI/CD & DevOps", detail: "Git, GitHub, GitLab CI, Jenkins, CloudWatch" },
        { title: "Data Science & AI", detail: "Machine Learning, Deep Learning, RAG, Scikit-learn, TensorFlow, PyTorch, Pandas, NumPy, MLflow, Feature Engineering, Data Cleaning, Matplotlib, Seaborn, Plotly, Power BI, Tableau," },
        { title: "Testing & Quality", detail: "Debugging, Unit Tests" },
        { title: "Work Methodologies", detail: "Scrum, Agile, Jira, Kanban" },
        { title: "Web Development & Integration", detail: "JavaScript, Flask, Spring Boot, ReactJS, REST APIs" }
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



// import { Briefcase } from "lucide-react";

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
                                        <span className="experience_year">March 2025 - August 2025</span>
                                    </div>
                                    
                                    <span className="experience_company">NAPTA | Paris, France</span>
                                    
                                <ul className="experience_description">
                                    <li className='li_margin'>Design and optimization of ETL pipelines (Airflow, Python) integrating data from APIs, DataLake, and cloud storage (AWS S3/Blob). Modernized existing systems with optimized DAGs and code refactoring, improving processing efficiency.</li>
                                    <li className='li_margin'>Deployment of AWS cloud solutions (EC2, S3, MWAA) with CI/CD pipelines (GitLab) to automate workflows.</li>
                                    <li className='li_margin'>Collaboration with cross-functional teams using Agile/Scrum methodology (Jira) to deliver data solutions tailored to client needs. Full data lifecycle management and development of self-service tools to improve client autonomy.</li>
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
                                          <h3 className="experience_title">Data Science - Generative AI</h3>
                                          <span className="experience_year">February 2024 - June 2024</span>
                                      </div>
                                      <span className="experience_company">Powergo | Casablanca, Morocco</span>
                                      <ul className="experience_description">
                                          <li>Implemented a RAG system for automated generation of personalized reports.</li>
                                          <li>Used legal and historical data to enrich a contextual knowledge base.</li>
                                          <li>Structured a MongoDB database for massive textual data storage and indexing.</li>
                                          <li>Created dynamic prompts enhanced by a web search API based on user needs.</li>
                                          <li>Managed the project using the Kanban method with iterative deliveries.</li>
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
                                    <span className="experience_company">INNOV-DS | Fes, Morocco</span>
                                    <ul className="experience_description">
                                        <li>Developed a full-stack commercial management system automating all operations, including sales processing, inventory tracking, and shipping logistics.</li>
                                        <li>Designed and implemented a normalized (3NF) database schema with optimized indexing, improving query performance.</li>
                                        <li>Collaborated within a 10-person Agile Scrum team, actively participating in sprint planning, daily stand-ups, and retrospectives.</li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </section>
}

const EducationSection = () => {
  return <section className="education section" id="education">
    <h2 className="section-title">Education</h2>
  
    <div className="education_container bd-grid">
        {/* <div className="experience_content">
            <div className="experience_time">
                <span className="experience_rounder"></span>
                <span className="experience_line"></span>
            </div>
            <div className="experience_data bd-grid">
                <div className="experience_header">
                    <h3 className="experience_title">Master in Data and IA</h3>
                    <span className="experience_year">2025 - 2026</span>
                </div>
                <span className="experience_company">Ynouv Compus - Paris, France</span>
            </div>
        </div> */}
        <div className="experience_content">
            <div className="experience_time">
                <span className="experience_rounder"></span>
                <span className="experience_line"></span>
            </div>
            <div className="experience_data bd-grid">
                <div className="experience_header">
                    <h3 className="experience_title">Master in Data Science and Engineering</h3>
                    <span className="experience_year">2024 - 2025</span>
                </div>
                <span className="experience_company">Aix-Marseille University - Marseille, France</span>
            </div>
        </div>
        
        <div className="experience_content">
            <div className="experience_time">
                <span className="experience_rounder"></span>
                <span className="experience_line"></span>
            </div>
            <div className="experience_data bd-grid">
                <div className="experience_header">
                    <h3 className="experience_title">Master in Data Science and Intelligent Systems</h3>
                    <span className="experience_year">2022 - 2024</span>
                </div>
                <span className="experience_company">Faculty of Sciences and Technology</span>
            </div>
        </div>
        
        <div className="experience_content">
            <div className="experience_time">
                <span className="experience_rounder"></span>
            </div>
            <div className="experience_data bd-grid">
                <div className="experience_header">
                    <h3 className="experience_title">Bachelor in Computer Science Engineering</h3>
                    <span className="experience_year">2018 - 2022</span>
                </div>
                <span className="experience_company">Faculty of Sciences and Technology</span>
            </div>
        </div>
    </div>

    <div className="education_content">
        <div className="education_time">
            <span className="education_rounder"></span>
            <span className="custom_experience_line"></span>
        </div>
        <div className="education_data bd-grid" style={{marginTop: "10px"}}>
            <h3 className="education_title">Certifications & Online Training</h3>
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
  return (<section className="experience section" id="experience">
    <h2 className="section-title">Projects</h2>

        <div className="experience_container bd-grid">
        <div class="experience_content">
            <div class="experience_time">
                <span class="experience_rounder"></span>
                <span class="experience_line"></span>
            </div>
            <div class="experience_data bd-grid">
                <a href="#" class="experience_title" target="_blank">Data Warehouse Implementation with Snowflake & dbt<i class="fa-brands fa-github"></i></a>
                <p class="experience_description">
                Designed and deployed an end-to-end retail analytics data warehouse using Snowflake for cloud storage, dbt for SQL-based transformations (staging → marts), and Airflow for orchestration. Ingested data from PostgreSQL, S3, and Google Analytics via Fivetran, modeled it in a star schema, and ensured quality with dbt tests. Automated pipelines with CI/CD (GitHub Actions) and delivered insights via Tableau                                    </p>
            </div>
        </div>
        {/* <div class="experience_content">
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
                <a href="#" class="experience_title" target="_blank">Azure Data Lakehouse Architecture with ADF, Databricks and Synapse<i class="fa-brands fa-github"></i></a>
                <p class="experience_description">
                    Implementation of an end-to-end data processing pipeline on Azure, from on-premise SQL Server to Power BI. Data is ingested via Azure Data Factory, stored in Azure Data Lake Gen2 using a layered architecture (Bronze, Silver, Gold), transformed with Azure Databricks, then loaded into Azure Synapse Analytics to enable interactive visualization in Power BI.
                </p>
            </div>
        </div>
        <div className="experience_content">
            <div className="experience_time">
                <span className="experience_rounder"></span>
                <span className="experience_line"></span>
            </div>
            <div className="experience_data bd-grid">
                <p className="experience_title">Serverless Data Platform (AWS/Snowflake) <i className="fa-brands fa-github"></i></p>
                <p className="experience_description">
                    Designed a serverless cloud architecture on AWS (Lambda, Step Functions, S3) to ingest and transform open-data, with Snowflake as data warehouse and Metabase for visualization. Automated deployment via Terraform (IaC), implemented monitoring dashboards (CloudWatch), and optimized costs using AWS free tier.
                </p>
            </div>
        </div>
        <div className="experience_content">
            <div className="experience_time">
                <span className="experience_rounder"></span>
            </div>
            <div className="experience_data bd-grid">
                <h3 className="experience_title">Real-Time Fraud Detection System</h3>
                <p className="experience_description">
                    Real-time fraud detection system using Kafka (streaming), Spark (ETL), and MLflow (MLOps). Monthly automated training (Airflow) with immediate alerts. Visualization via Power BI.
                </p>
            </div>
        </div>
    </div>
</section>

  );
};

const AboutMe = () => (
  <section className="about section" id="about" style={{marginTop: "1rem"}}>
    <h2 className="section-title">About Me</h2>
    <div className="about_container bd-grid">
      <p className="experience_description">
        Data Engineer passionate about Cloud and Big Data environments, I aim to contribute to projects with high technological impact. Thanks to my dual academic background and hands-on experience in data engineering, cloud computing, and large-scale data processing, I am ready to take on new challenges, continue developing my skills, and actively contribute to the success of projects.
      </p>
    </div>
  </section>
);


const App2 = () => {



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
            <AboutMe />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App2;
