// Structured source for the /experience/ and /es/experience/ pages, rendered
// by src/_includes/pages/experience.njk.
//
// Text that changes with the language is an object keyed by language
// ({ en, es }) and is read through the `localize` filter; text that reads the
// same in both (an organisation's own name, a URL) stays a plain string. A
// missing translation fails the build.
//
// Rich-text fields (`lead`, `body`, `bullets`) hold inline HTML — <strong> and
// <a> only — and are printed with `| safe`. Everything else is plain text and
// is escaped by Nunjucks. Adding a role means adding an object here; the
// markup and spacing live in the template and the stylesheet, not in the copy.
//
// `summary` on a current role is the one-liner llms.txt prints for it. It is
// English only, like llms.txt.
const webpage = { en: "Webpage", es: "Web" };

module.exports = {
  title: { en: "Experience", es: "Experiencia" },
  lead: {
    en: "My work combines artificial intelligence research, engineering, and leadership across startups, academia, and technical student organisations.",
    es: "Mi trabajo combina investigación en inteligencia artificial, ingeniería y liderazgo en startups, en la universidad y en organizaciones técnicas de estudiantes.",
  },
  groups: [
    {
      title: { en: "Current Experience", es: "Experiencia actual" },
      roles: [
        {
          org: { en: "University of Vigo", es: "Universidade de Vigo" },
          role: { en: "PhD Candidate", es: "Doctorando" },
          period: {
            en: "October 2026 – Present",
            es: "octubre de 2026 – presente",
          },
          summary:
            "PhD in Aerospace Technology at the University of Vigo on belief-state and world-model-based learning for autonomous aerial systems in partially observable environments.",
          body: {
            en: [
              "I am a PhD candidate in the <strong>Aerospace Technology doctoral programme</strong> at the University of Vigo.",
              "My thesis, <em>Belief-state and world-model-based learning for autonomous aerial systems in partially observable environments</em>, designs, develops and analyses belief-state and world-model learning methods to improve how autonomous aerial systems act and adapt online when information is incomplete.",
              "The work focuses on high-uncertainty scenarios, training agents to act in unknown environments, under unknown conditions, and alongside unknown teammates and adversaries — where current methods struggle to adapt and generalise.",
            ],
            es: [
              "Soy doctorando del <strong>programa de doctorado en Tecnología Aeroespacial</strong> de la Universidade de Vigo.",
              "Mi tesis, <em>Aprendizaje basado en estados de creencia y modelos del mundo para sistemas aéreos autónomos en entornos parcialmente observables</em>, diseña, desarrolla y analiza métodos de aprendizaje basados en estados de creencia y modelos del mundo para mejorar la actuación y adaptación en línea de los sistemas aéreos autónomos cuando la información es incompleta.",
              "El trabajo se centra en escenarios de alta incertidumbre, entrenando agentes que actúen en entornos desconocidos, bajo condiciones desconocidas y junto a compañeros y adversarios desconocidos, donde los métodos actuales presentan limitaciones de adaptación y generalización.",
            ],
          },
          links: [{ label: webpage, url: "https://www.uvigo.gal/" }],
        },
        {
          org: "ATRG",
          role: { en: "Researcher", es: "Investigador" },
          period: { en: "November 2024 – Present", es: "Noviembre de 2024 – Actualidad" },
          summary:
            "Research work on AI for aerospace vehicles: onboard computer vision, pose estimation, weakly-labelled self-training pipelines, and a Master's thesis on multi-agent AI.",
          body: {
            en: [
              "ATRG (Aerospace Technology Research Group) is a research group at the University of Vigo with <strong>more than 17 years of experience</strong> behind high-impact space missions, including XatCobeo, Spain's first nanosatellite, HUMESAT-D, and Lume-1.",
              "My contribution focuses on <strong>artificial intelligence</strong>, particularly across projects spanning both the aeronautical and space domains. Some of the projects I have worked on so far include AI models for aerospace vehicles, such as <strong>onboard computer vision</strong>, <strong>pose estimation</strong> and self-training pipelines based on weak labelling.",
              "I also completed my <strong>Master's thesis</strong> here on multi-agent AI, using drone systems as a case study to analyse interaction during learning and deployment — the starting point of what is now my PhD research.",
            ],
            es: [
              "ATRG (Aerospace Technology Research Group) es un grupo de investigación de la Universidade de Vigo con <strong>más de 17 años de experiencia</strong> detrás de misiones espaciales de gran impacto, como XatCobeo, el primer nanosatélite español, HUMESAT-D y Lume-1.",
              "Mi aportación se centra en la <strong>inteligencia artificial</strong>, sobre todo en proyectos que abarcan tanto el ámbito aeronáutico como el espacial. Algunos de los proyectos en los que he trabajado hasta ahora incluyen modelos de IA para vehículos aeroespaciales, como <strong>visión por computador a bordo</strong>, <strong>estimación de pose</strong> y pipelines de autoentrenamiento basados en etiquetado débil.",
              "También realicé aquí mi <strong>Trabajo Fin de Máster</strong> sobre IA multiagente, con sistemas de drones como caso de estudio para analizar la interacción durante el aprendizaje y el despliegue, que fue el inicio de lo que hoy es mi doctorado.",
            ],
          },
          links: [
            { label: webpage, url: "https://aerospacetech.org/" },
            { label: "LinkedIn", url: "https://www.linkedin.com/company/atrg" },
          ],
        },
        {
          org: {
            en: "School of Aerospace Engineering",
            es: "Escuela de Ingeniería Aeroespacial",
          },
          role: { en: "Substitute Professor", es: "Profesor sustituto" },
          period: { en: "September 2026 – Present", es: "Septiembre de 2026 – Actualidad" },
          summary:
            "Substitute professor at the School of Aerospace Engineering (EEAE) of the University of Vigo, teaching Real-Time Systems, Aerospace Technology, and Propulsion Systems.",
          body: {
            en: [
              "I teach as a <strong>substitute professor</strong> at the <strong>School of Aerospace Engineering</strong> (EEAE) of the University of Vigo.",
              "This academic year I teach <strong>Real-Time Systems</strong>, <strong>Aerospace Technology</strong>, and <strong>Propulsion Systems</strong>.",
            ],
            es: [
              "Doy clase como <strong>profesor sustituto</strong> en la <strong>Escuela de Ingeniería Aeroespacial</strong> (EEAE) de la Universidade de Vigo.",
              "Este curso imparto <strong>Sistemas en Tiempo Real</strong>, <strong>Tecnología Aeroespacial</strong> y <strong>Sistemas de Propulsión</strong>.",
            ],
          },
          links: [{ label: webpage, url: "https://aero.uvigo.es/" }],
        },
        {
          org: "XISTRA",
          role: { en: "Founder", es: "Fundador" },
          period: { en: "In development", es: "En desarrollo" },
          summary:
            "Deep-tech AI startup founded by Pablo, focused on autonomous learning for robotic systems, especially drones. Still in development.",
          body: {
            en: [
              "XISTRA is a <strong>deep-tech AI startup</strong> built around a single thesis: true intelligence emerges from the capacity to learn autonomously, not from data alone.",
              "The project is still at a very early stage, and I am nurturing it with the care it deserves through my PhD and research. It will become public in the future.",
            ],
            es: [
              "XISTRA es una <strong>startup deep-tech de IA</strong> construida en torno a una única tesis: la verdadera inteligencia surge de la capacidad de aprender de forma autónoma, no solo de los datos.",
              "El proyecto está todavía en una fase muy temprana y le estoy dedicando el mimo que requiere a través de mi doctorado y mi investigación. En el futuro será algo público.",
            ],
          },
          links: [
            { label: webpage, url: "https://xistra.net" },
            { label: "LinkedIn", url: "https://www.linkedin.com/company/xistra" },
          ],
        },
      ],
    },
    {
      title: { en: "Previous Experience", es: "Experiencia anterior" },
      roles: [
        {
          org: "Aguia Advanced Analytics",
          role: { en: "Trainee Engineer", es: "Ingeniero en prácticas" },
          period: { en: "June 2023 – August 2023", es: "Junio de 2023 – Agosto de 2023" },
          body: {
            en: [
              "I worked full-time as a trainee engineer at Aguia Analítica Avanzada, a Galician data analysis startup that applies <strong>state-of-the-art AI algorithms</strong> to drone imagery to assess road surface conditions.",
              "During this time, I worked on the modelling and implementation of <strong>computer vision neural networks</strong>, as well as data processing and process automation, gaining first-hand experience in the development of an early-stage R&amp;D project.",
            ],
            es: [
              "Trabajé a tiempo completo como ingeniero en prácticas en Aguia Analítica Avanzada, una startup gallega de análisis de datos que aplica <strong>algoritmos de IA de última generación</strong> a imágenes tomadas con drones para evaluar el estado del firme de las carreteras.",
              "Durante ese tiempo trabajé en el modelado y la implementación de <strong>redes neuronales de visión por computador</strong>, así como en el procesamiento de datos y la automatización de procesos, y conocí de primera mano el desarrollo de un proyecto de I+D en fase temprana.",
            ],
          },
          links: [{ label: webpage, url: "https://aguian.com/" }],
        },
        {
          org: "UVigo Aerotech",
          role: { en: "Team Leader", es: "Jefe de equipo" },
          period: { en: "September 2021 – August 2024", es: "Septiembre de 2021 – Agosto de 2024" },
          body: {
            en: [
              "UVigo Aerotech is a student team at the University of Vigo, the only one of its kind in Galicia, dedicated to developing aerospace technologies for research and competition. During my time with the team, I led our participation in <strong>five fixed-wing drone competitions</strong>, developing five different aircraft, including MOBULA-0, <strong>Spain's first competition flying wing</strong>.",
              "I also founded the <strong>Research &amp; Development group</strong>, focused on pioneering technologies such as experimental AI models, morphing wing materials, and simulation software to support the rest of the team. I currently remain involved as an advisor.",
            ],
            es: [
              "UVigo Aerotech es un equipo de estudiantes de la Universidade de Vigo, el único de su tipo en Galicia, dedicado a desarrollar tecnologías aeroespaciales para investigación y competición. Durante mi etapa en el equipo dirigí nuestra participación en <strong>cinco competiciones de drones de ala fija</strong>, con cinco aeronaves distintas, entre ellas MOBULA-0, <strong>la primera ala volante de competición de España</strong>.",
              "También fundé el <strong>grupo de Investigación y Desarrollo</strong>, centrado en tecnologías pioneras como modelos experimentales de IA, materiales para alas adaptativas y software de simulación para dar apoyo al resto del equipo. Hoy sigo vinculado como asesor.",
            ],
          },
          links: [{ label: webpage, url: "https://uvigoaerotech.com/" }],
        },
        {
          org: "MAD Formula Team",
          role: { en: "Performance Engineer", es: "Ingeniero de rendimiento" },
          period: { en: "September 2024 – December 2025", es: "Septiembre de 2024 – Diciembre de 2025" },
          body: {
            en: [
              "I worked with the Formula Student team at Universidad Carlos III de Madrid, contributing to the <strong>Modelling &amp; Performance department</strong>. I helped develop a new on-track vehicle simulator, enabling its use for early-stage decision-making and complex optimisations throughout each season's car development.",
              "Additionally, I contributed to optimising the development of the car's <strong>aeromap</strong>, reducing the time required and improving fidelity through statistical and modelling techniques.",
            ],
            es: [
              "Trabajé con el equipo de Formula Student de la Universidad Carlos III de Madrid, en el <strong>departamento de Modelado y Rendimiento</strong>. Ayudé a desarrollar un nuevo simulador del vehículo en pista, que permitió usarlo para tomar decisiones en fases tempranas y para optimizaciones complejas a lo largo del desarrollo del coche de cada temporada.",
              "Además, contribuí a optimizar el desarrollo del <strong>aeromapa</strong> del coche, reduciendo el tiempo necesario y mejorando su fidelidad mediante técnicas estadísticas y de modelado.",
            ],
          },
          links: [{ label: webpage, url: "https://madformulateam.com/" }],
        },
        {
          org: "AEAE",
          role: { en: "Vice-President", es: "Vicepresidente" },
          period: { en: "March 2021 – March 2024", es: "Marzo de 2021 – Marzo de 2024" },
          body: {
            en: [
              "Working with the Board, I helped shape the vision for AEAE, <strong>Spain's leading association for aeronautics and space engineering students</strong>. I co-organised four national congresses, managed corporate relations, and coordinated nationwide workshops for Aero Design, Formula Student, and Rocketry teams.",
              "A highlight was the <strong>XXVII Congress in Ourense</strong> (March 2023), the first held at my home school, which achieved record-breaking attendance.",
            ],
            es: [
              "Junto a la Junta Directiva, ayudé a definir la visión de la AEAE, <strong>la principal asociación de estudiantes de ingeniería aeronáutica y espacial de España</strong>. Coorganicé cuatro congresos nacionales, gestioné las relaciones con empresas y coordiné talleres a nivel nacional para equipos de Aero Design, Formula Student y cohetería.",
              "Lo más destacado fue el <strong>XXVII Congreso en Ourense</strong> (marzo de 2023), el primero celebrado en mi escuela, que batió récords de asistencia.",
            ],
          },
          links: [{ label: webpage, url: "https://aeroespaciales.org/" }],
        },
        {
          org: {
            en: "School of Aerospace Engineering",
            es: "Escuela de Ingeniería Aeroespacial",
          },
          role: { en: "Main Representative", es: "Delegado de estudiantes" },
          period: { en: "October 2021 – June 2024", es: "Octubre de 2021 – Junio de 2024" },
          body: {
            en: [
              "I was elected as the <strong>main representative of more than 250 students</strong> at the School of Aerospace Engineering. I coordinated and promoted a new series of events aimed at connecting the school with industry through conferences, courses, and professional talks.",
              "One standout initiative was the <strong>I EEAE Alumni Forum</strong>, which brought together over 200 attendees for a series of talks by former students, strengthening the link between alumni and current generations.",
            ],
            es: [
              "Fui elegido <strong>delegado de más de 250 estudiantes</strong> de la Escuela de Ingeniería Aeroespacial. Coordiné e impulsé una nueva serie de eventos para acercar la escuela a la industria a través de conferencias, cursos y charlas profesionales.",
              "Una de las iniciativas más destacadas fue el <strong>I Foro de Antiguos Alumnos de la EEAE</strong>, que reunió a más de 200 asistentes en una serie de charlas de antiguos alumnos y reforzó el vínculo entre ellos y las generaciones actuales.",
            ],
          },
          links: [
            { label: webpage, url: "https://aero.uvigo.es/" },
            {
              label: "LinkedIn",
              url: "https://www.linkedin.com/company/delegaci%C3%B3n-do-estudantado-da-eeae",
            },
          ],
        },
      ],
    },
  ],
};
