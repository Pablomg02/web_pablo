// Structured source for the /research/ and /es/research/ pages, rendered by
// src/_includes/pages/research.njk.
//
// Text that changes with the language is an object keyed by language
// ({ en, es }) read through the `localize` filter. A publication's `title`
// stays a plain string on purpose: it is the title the work was published
// under, so the Spanish page cites it as is rather than inventing a new one.
//
// `body` entries hold inline HTML (<strong>, <a>) and are printed with `| safe`.
// `venue` is the publication line under the title; `links` is the Paper / DOI
// row at the foot of an entry; `summary` is the one-liner that llms.txt prints
// (English only, like llms.txt), kept here so the machine-readable index
// cannot drift from the page. Newest first — the template does not sort.
const paper = { en: "Paper", es: "Artículo" };

module.exports = {
  title: { en: "Research", es: "Investigación" },
  orcid: {
    id: "0009-0002-9817-0368",
    url: "https://orcid.org/0009-0002-9817-0368",
  },
  lead: {
    en: "This is my public research work so far. My current work is in <strong>reinforcement learning under partial observability</strong>: belief states, <strong>world modelling</strong>, and <strong>meta-learning</strong>, oriented towards multi-agent systems and embodied AI. Some of it should become public soon.",
    es: "Este es mi trabajo de investigación público hasta ahora. Actualmente trabajo en <strong>aprendizaje por refuerzo con observabilidad parcial</strong>: estados de creencia, <strong>modelos del mundo</strong> y <strong>metaaprendizaje</strong>, orientado a sistemas multiagente y a la IA corporeizada. Parte de ello debería hacerse público pronto.",
  },
  publications: [
    {
      title:
        "Multi-Agent Reinforcement Learning for Drone-Based Search and Rescue Missions",
      venue: {
        en: "Master's Thesis - MSc in Industrial Mathematics",
        es: "Trabajo Fin de Máster - Máster en Matemática Industrial",
      },
      summary:
        "multi-agent reinforcement learning architectures for drone search and rescue, analysing stability, convergence and genuine collaboration. Complete, not yet published.",
      body: {
        en: [
          "My Master's thesis studies different <strong>multi-agent AI architectures based on reinforcement learning</strong>, with particular attention to their stability, convergence behaviour, and collaborative dynamics. The work evaluates these architectures across environments of increasing complexity, designed to resemble search and rescue missions where teams of drones must locate one or more targets in novel scenarios.",
          "The goal is to identify an AI architecture that, with the necessary real-world adaptations, could eventually be deployed beyond simplified environments and inputs. A central part of the work is to distinguish genuine <strong>collaboration and generalisation</strong> from the mere memorisation of patterns, while analysing what each architecture reveals about learning, coordination, and robustness.",
          "The thesis is now complete, and I will share it here soon.",
        ],
        es: [
          "Mi Trabajo Fin de Máster estudia distintas <strong>arquitecturas de IA multiagente basadas en aprendizaje por refuerzo</strong>, con especial atención a su estabilidad, su comportamiento de convergencia y sus dinámicas de colaboración. El trabajo evalúa estas arquitecturas en entornos de complejidad creciente, diseñados para parecerse a misiones de búsqueda y rescate en las que equipos de drones deben localizar uno o varios objetivos en escenarios nuevos.",
          "El objetivo es identificar una arquitectura de IA que, con las adaptaciones necesarias al mundo real, pudiera llegar a desplegarse más allá de entornos y entradas simplificados. Una parte central del trabajo consiste en distinguir la <strong>colaboración y la generalización</strong> genuinas de la mera memorización de patrones, analizando al mismo tiempo lo que cada arquitectura revela sobre el aprendizaje, la coordinación y la robustez.",
          "El trabajo ya está terminado y lo compartiré aquí pronto.",
        ],
      },
      links: [],
    },
    {
      title:
        "Weakly Supervised Segmentation of Macroalgae Through Gradient Analysis in Convolutional Neural Networks and Segment Anything Model",
      venue: {
        en: "August 2026 — Applied Sciences (MDPI), Vol. 16, Issue 17",
        es: "Agosto de 2026 — Applied Sciences (MDPI), vol. 16, n.º 17",
      },
      summary:
        "weakly supervised macroalgae segmentation, analysing CNN gradients across all intermediate layers to guide SAM2 from image-level labels alone.",
      body: {
        en: [
          "This paper explores a practical way to understand what a convolutional neural network learns when distinguishing between different macroalgae genera. Instead of looking only at the final convolutional layer, as Grad-CAM typically does, we analyse the <strong>gradients across all intermediate layers</strong>, revealing how early spatial details and deeper semantic features complement one another. We then use that information to guide SAM2 in locating and segmenting the algae <strong>from image-level labels alone</strong>.",
          "Beyond this particular application, the work offers an intuitive framework for studying intermediate CNN representations and suggests that using the <strong>full hierarchy</strong> can produce more informative localisations than relying only on the deepest layer, while remaining competitive with established multi-layer methods such as LayerCAM.",
        ],
        es: [
          "Este artículo explora una forma práctica de entender qué aprende una red neuronal convolucional cuando distingue entre distintos géneros de macroalgas. En lugar de fijarnos solo en la última capa convolucional, como suele hacer Grad-CAM, analizamos los <strong>gradientes de todas las capas intermedias</strong>, lo que muestra cómo se complementan los detalles espaciales de las primeras capas y los rasgos semánticos de las más profundas. Después usamos esa información para guiar a SAM2 en la localización y segmentación de las algas <strong>a partir únicamente de etiquetas a nivel de imagen</strong>.",
          "Más allá de esta aplicación concreta, el trabajo ofrece un marco intuitivo para estudiar las representaciones intermedias de una CNN y sugiere que usar <strong>toda la jerarquía</strong> puede dar localizaciones más informativas que basarse solo en la capa más profunda, sin dejar de ser competitivo con métodos multicapa consolidados como LayerCAM.",
        ],
      },
      links: [
        { label: paper, url: "https://www.mdpi.com/2076-3417/16/17/8470" },
        { label: "DOI", url: "https://doi.org/10.3390/app16178470" },
      ],
    },
    {
      title:
        "Real-Time Aerodynamic Airfoil Optimisation Using Deep Reinforcement Learning with Proximal Policy Optimisation",
      venue: {
        en: "November 2025 — Aerospace (MDPI), Vol. 12, Issue 11",
        es: "Noviembre de 2025 — Aerospace (MDPI), vol. 12, n.º 11",
      },
      summary:
        "aerospace research applying PPO to real-time airfoil optimisation under geometric constraints.",
      body: {
        en: [
          "This work began as my Bachelor's thesis and eventually developed into a published paper. It applies <strong>deep reinforcement learning</strong> with Proximal Policy Optimisation (PPO) to optimise aerodynamic airfoil profiles in real time within the context of <strong>morphing wings</strong>. The approach learns to satisfy both aerodynamic objectives and complex geometric constraints while maintaining low computational cost and millisecond-level optimisation speed.",
          "The code is available on <a href=\"https://github.com/Pablomg02/DRLFoil\">GitHub</a>. It was written while I was still learning a great deal about software development, and much of it was implemented manually at a time when AI coding tools were far less capable, so the codebase is certainly improvable.",
        ],
        es: [
          "Este trabajo empezó como mi Trabajo Fin de Grado y acabó convirtiéndose en un artículo publicado. Aplica <strong>aprendizaje por refuerzo profundo</strong> con Proximal Policy Optimisation (PPO) para optimizar perfiles aerodinámicos en tiempo real en el contexto de las <strong>alas adaptativas</strong> (<em>morphing wings</em>). El método aprende a cumplir tanto los objetivos aerodinámicos como restricciones geométricas complejas, con un coste computacional bajo y una velocidad de optimización del orden de milisegundos.",
          "El código está disponible en <a href=\"https://github.com/Pablomg02/DRLFoil\">GitHub</a>. Lo escribí cuando todavía estaba aprendiendo mucho sobre desarrollo de software, y buena parte lo implementé a mano en una época en la que las herramientas de programación con IA eran mucho menos capaces, así que el código es, sin duda, mejorable.",
        ],
      },
      links: [
        { label: paper, url: "https://www.mdpi.com/2226-4310/12/11/971" },
        { label: "DOI", url: "https://doi.org/10.3390/aerospace12110971" },
      ],
    },
  ],
};
