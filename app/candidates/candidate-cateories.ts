// jobCategories.ts

export const candidateCategories = [
  {
    label: "Frontend Development",
    value: "frontend",
    subcategories: [
      {
        label: "React Developer",
        value: "react",
        skills: ["React", "TypeScript", "Redux", "CSS", "Tailwind CSS"]
      },
      {
        label: "Vue Developer",
        value: "vue",
        skills: ["Vue", "Pinia", "Composition API", "SCSS"]
      },
      {
        label: "Angular Developer",
        value: "angular",
        skills: ["Angular", "RxJS", "NgRx", "TypeScript"]
      }
    ]
  },
  {
    label: "Backend Development",
    value: "backend",
    subcategories: [
      {
        label: "Node.js Developer",
        value: "node",
        skills: ["Node.js", "Express", "MongoDB", "TypeScript"]
      },
      {
        label: "Python Developer",
        value: "python",
        skills: ["Python", "Django", "FastAPI", "PostgreSQL"]
      },
      {
        label: "Java Developer",
        value: "java",
        skills: ["Java", "Spring Boot", "MySQL", "REST APIs"]
      },
      {
        label: ".NET Developer",
        value: "dotnet",
        skills: ["C#", ".NET Core", "Entity Framework", "SQL Server"]
      }
    ]
  },
  {
    label: "Mobile Development",
    value: "mobile",
    subcategories: [
      {
        label: "Android Developer",
        value: "android",
        skills: ["Kotlin", "Jetpack Compose", "MVVM", "Room DB"]
      },
      {
        label: "iOS Developer",
        value: "ios",
        skills: ["Swift", "SwiftUI", "Combine", "CoreData"]
      },
      {
        label: "Flutter Developer",
        value: "flutter",
        skills: ["Flutter", "Dart", "Bloc", "Firebase"]
      },
      {
        label: "React Native Developer",
        value: "react_native",
        skills: ["React Native", "Redux", "TypeScript", "Expo"]
      }
    ]
  },
  {
    label: "DevOps & Cloud",
    value: "devops",
    subcategories: [
      {
        label: "DevOps Engineer",
        value: "devops_engineer",
        skills: ["Docker", "Kubernetes", "CI/CD", "Linux", "GitHub Actions"]
      },
      {
        label: "Cloud Engineer",
        value: "cloud_engineer",
        skills: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"]
      },
      {
        label: "Site Reliability Engineer",
        value: "sre",
        skills: ["Monitoring", "Alerting", "Incident Response", "Prometheus", "Grafana"]
      }
    ]
  },
  {
    label: "Data & AI",
    value: "data_ai",
    subcategories: [
      {
        label: "Data Scientist",
        value: "data_scientist",
        skills: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "SQL"]
      },
      {
        label: "Data Analyst",
        value: "data_analyst",
        skills: ["SQL", "Excel", "Power BI", "Tableau", "Python"]
      },
      {
        label: "ML Engineer",
        value: "ml_engineer",
        skills: ["Machine Learning", "Deep Learning", "PyTorch", "MLflow", "MLOps"]
      }
    ]
  },
  {
    label: "Design",
    value: "design",
    subcategories: [
      {
        label: "UI/UX Designer",
        value: "uiux_designer",
        skills: ["Figma", "Adobe XD", "Wireframing", "User Research"]
      },
      {
        label: "Graphic Designer",
        value: "graphic_designer",
        skills: ["Photoshop", "Illustrator", "Branding", "Typography"]
      },
      {
        label: "Product Designer",
        value: "product_designer",
        skills: ["Prototyping", "Figma", "Design Systems", "User Testing"]
      }
    ]
  },
  {
    label: "Sales & Marketing",
    value: "sales",
    subcategories: [
      {
        label: "Sales Manager",
        value: "sales_manager",
        skills: ["CRM", "Lead Generation", "Negotiation", "B2B Sales"]
      },
      {
        label: "Digital Marketer",
        value: "digital_marketer",
        skills: ["SEO", "Google Ads", "Content Marketing", "Analytics"]
      },
      {
        label: "Social Media Manager",
        value: "social_media",
        skills: ["Instagram", "Facebook Ads", "Canva", "Engagement Strategies"]
      }
    ]
  },
  {
    label: "Product Management",
    value: "product",
    subcategories: [
      {
        label: "Product Manager",
        value: "product_manager",
        skills: ["Roadmapping", "Agile", "Jira", "Stakeholder Management"]
      },
      {
        label: "Technical Product Manager",
        value: "technical_pm",
        skills: ["APIs", "Agile", "System Design", "Backlog Management"]
      }
    ]
  },
  {
    label: "Support",
    value: "support",
    subcategories: [
      {
        label: "Customer Support",
        value: "customer_support",
        skills: ["Email Handling", "Zendesk", "Conflict Resolution", "CRM"]
      },
      {
        label: "Technical Support",
        value: "technical_support",
        skills: ["Linux", "Remote Debugging", "Ticket Management", "Logs Analysis"]
      }
    ]
  },
  {
    label: "HR & Operations",
    value: "hr",
    subcategories: [
      {
        label: "HR Executive",
        value: "hr_executive",
        skills: ["Recruitment", "Onboarding", "Payroll", "HRMS"]
      },
      {
        label: "Talent Acquisition",
        value: "talent_acquisition",
        skills: ["Sourcing", "Interview Scheduling", "ATS", "Candidate Screening"]
      }
    ]
  }
];
