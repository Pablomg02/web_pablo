// Structured source for the /experience/ page, rendered by src/experience.njk.
//
// Rich-text fields (`lead`, `body`, `bullets`) hold inline HTML — <strong> and
// <a> only — and are printed with `| safe`. Everything else is plain text and
// is escaped by Nunjucks. Adding a role means adding an object here; the
// markup and spacing live in the template and the stylesheet, not in the copy.
module.exports = {
  lead: "My work combines artificial intelligence research, engineering, and leadership across startups, academia, and technical student organisations.",
  groups: [
    {
      title: "Current Experience",
      roles: [
        {
          org: "ATRG",
          role: "Researcher",
          period: "November 2024 – Present",
          body: [
            "ATRG (Aerospace Technology Research Group) is a research group at the University of Vigo with <strong>more than 17 years of experience</strong> behind high-impact space missions, including XatCobeo, Spain's first nanosatellite, HUMESAT-D, and Lume-1.",
            "My contribution focuses on <strong>artificial intelligence</strong>, particularly across projects spanning both the aeronautical and space domains:",
          ],
          bullets: [
            "Researched and implemented AI models for aerospace vehicles, including onboard computer vision systems, pose-estimation methods, and self-training pipelines based on weak labelling.",
            "Developed a time-series analysis solution from planning and modelling through to deployment.",
            "Completed my Master's thesis within ATRG on multi-agent AI, using drone systems as a case study to analyse interaction during learning and deployment.",
            "Owned the end-to-end development of private static and interactive web projects, covering frontend interfaces, backend APIs, and deployment with tools such as Node.js and FastAPI.",
            "Contributed to additional internal AI research and development projects.",
          ],
          links: [{ label: "LinkedIn", url: "https://www.linkedin.com/company/atrg" }],
        },
        {
          org: "XISTRA",
          role: "Founder",
          period: "In development",
          body: [
            "XISTRA is a <strong>deep-tech AI startup</strong> built around a single thesis: true intelligence emerges from the capacity to learn autonomously, not from data alone. Current AI systems are trained rigidly on existing patterns; they cannot explore their environment, adapt to new situations, or improve their own performance through experience.",
            "Our mission is to change that by building AI that enables robotic systems to <strong>learn from their surroundings</strong> and maximise performance in dynamic, previously unseen environments. We see ourselves first and foremost as a research company, with the goal of translating laboratory advances into real-world robots, starting with drones because of their versatility and broad applicability.",
            "We are still at an early stage. My focus is on <strong>world models and training methods</strong>, building the technical foundation for our first commercial offering.",
          ],
          links: [{ label: "LinkedIn", url: "https://www.linkedin.com/company/xistra" }],
        },
      ],
    },
    {
      title: "Previous Experience",
      roles: [
        {
          org: "Aguia Advanced Analytics",
          role: "Trainee Engineer",
          period: "June 2023 – August 2023",
          body: [
            "I worked full-time as a trainee engineer at Aguia Analítica Avanzada, a Galician data analysis startup that applies <strong>state-of-the-art AI algorithms</strong> to drone imagery to assess road surface conditions.",
            "During this time, I worked on the modelling and implementation of <strong>computer vision neural networks</strong>, as well as data processing and process automation, gaining first-hand experience in the development of an early-stage R&amp;D project.",
          ],
          links: [{ label: "Webpage", url: "https://aguian.com/" }],
        },
        {
          org: "UVigo Aerotech",
          role: "Team Leader",
          period: "September 2021 – August 2024",
          body: [
            "UVigo Aerotech is a student team at the University of Vigo, the only one of its kind in Galicia, dedicated to developing aerospace technologies for research and competition. During my time with the team, I led our participation in <strong>five fixed-wing drone competitions</strong>, developing five different aircraft, including MOBULA-0, <strong>Spain's first competition flying wing</strong>.",
            "I also founded the <strong>Research &amp; Development group</strong>, focused on pioneering technologies such as experimental AI models, morphing wing materials, and simulation software to support the rest of the team. I currently remain involved as an advisor.",
          ],
          links: [{ label: "Webpage", url: "https://uvigoaerotech.com/" }],
        },
        {
          org: "MAD Formula Team",
          role: "Performance Engineer",
          period: "September 2024 – December 2025",
          body: [
            "I worked with the Formula Student team at Universidad Carlos III de Madrid, contributing to the <strong>Modelling &amp; Performance department</strong>. I helped develop a new on-track vehicle simulator, enabling its use for early-stage decision-making and complex optimisations throughout each season's car development.",
            "Additionally, I contributed to optimising the development of the car's <strong>aeromap</strong>, reducing the time required and improving fidelity through statistical and modelling techniques.",
          ],
          links: [{ label: "Webpage", url: "https://madformulateam.com/" }],
        },
        {
          org: "AEAE",
          role: "Vice-President",
          period: "March 2021 – March 2024",
          body: [
            "Working with the Board, I helped shape the vision for AEAE, <strong>Spain's leading association for aeronautics and space engineering students</strong>. I co-organised four national congresses, managed corporate relations, and coordinated nationwide workshops for Aero Design, Formula Student, and Rocketry teams.",
            "A highlight was the <strong>XXVII Congress in Ourense</strong> (March 2023), the first held at my home school, which achieved record-breaking attendance.",
          ],
          links: [{ label: "Webpage", url: "https://aeroespaciales.org/" }],
        },
        {
          org: "School of Aeronautical Engineering",
          role: "Main Representative",
          period: "October 2021 – June 2024",
          body: [
            "I was elected as the <strong>main representative of more than 250 students</strong> at the School of Aeronautical and Space Engineering. I coordinated and promoted a new series of events aimed at connecting the school with industry through conferences, courses, and professional talks.",
            "One standout initiative was the <strong>I EEAE Alumni Forum</strong>, which brought together over 200 attendees for a series of talks by former students, strengthening the link between alumni and current generations.",
          ],
          links: [
            {
              label: "Webpage",
              url: "https://www.linkedin.com/company/delegaci%C3%B3n-do-estudantado-da-eeae",
            },
          ],
        },
      ],
    },
  ],
};
