// Structured source for the /research/ page, rendered by src/research.njk.
//
// `body` entries hold inline HTML (<strong>, <a>) and are printed with `| safe`.
// `venue` is the publication line under the title; `links` is the Paper / DOI
// row at the foot of an entry; `summary` is the one-liner that llms.txt prints,
// kept here so the machine-readable index cannot drift from the page. Newest first — the template does not sort.
module.exports = {
  orcid: {
    id: "0009-0002-9817-0368",
    url: "https://orcid.org/0009-0002-9817-0368",
  },
  lead: "This is my public research work so far. My current work is in <strong>reinforcement learning under partial observability</strong>: belief states, <strong>world modelling</strong>, and <strong>meta-learning</strong>, oriented towards multi-agent systems and embodied AI. Some of it should become public soon.",
  publications: [
    {
      title:
        "Multi-Agent Reinforcement Learning for Drone-Based Search and Rescue Missions",
      venue: "Master's Thesis - MSc in Industrial Mathematics",
      summary:
        "multi-agent reinforcement learning architectures for drone search and rescue, analysing stability, convergence and genuine collaboration. Complete, not yet published.",
      body: [
        "My Master's thesis studies different <strong>multi-agent AI architectures based on reinforcement learning</strong>, with particular attention to their stability, convergence behaviour, and collaborative dynamics. The work evaluates these architectures across environments of increasing complexity, designed to resemble search and rescue missions where teams of drones must locate one or more targets in novel scenarios.",
        "The goal is to identify an AI architecture that, with the necessary real-world adaptations, could eventually be deployed beyond simplified environments and inputs. A central part of the work is to distinguish genuine <strong>collaboration and generalisation</strong> from the mere memorisation of patterns, while analysing what each architecture reveals about learning, coordination, and robustness.",
        "The thesis is now complete, and I will share it here soon.",
      ],
      links: [],
    },
    {
      title:
        "Weakly Supervised Segmentation of Macroalgae Through Gradient Analysis in Convolutional Neural Networks and Segment Anything Model",
      venue: "August 2026 — Applied Sciences (MDPI), Vol. 16, Issue 17",
      summary:
        "weakly supervised macroalgae segmentation, analysing CNN gradients across all intermediate layers to guide SAM2 from image-level labels alone.",
      body: [
        "This paper explores a practical way to understand what a convolutional neural network learns when distinguishing between different macroalgae genera. Instead of looking only at the final convolutional layer, as Grad-CAM typically does, we analyse the gradients across all intermediate layers, revealing how early spatial details and deeper semantic features complement one another. We then use that information to guide SAM2 in locating and segmenting the algae from image-level labels alone. Beyond this particular application, the work offers an intuitive framework for studying intermediate CNN representations and suggests that using the full hierarchy can produce more informative localisations than relying only on the deepest layer, while remaining competitive with established multi-layer methods such as LayerCAM.",
      ],
      links: [
        { label: "Paper", url: "https://www.mdpi.com/2076-3417/16/17/8470" },
        { label: "DOI", url: "https://doi.org/10.3390/app16178470" },
      ],
    },
    {
      title:
        "Real-Time Aerodynamic Airfoil Optimisation Using Deep Reinforcement Learning with Proximal Policy Optimisation",
      venue: "November 2025 — Aerospace (MDPI), Vol. 12, Issue 11",
      summary:
        "aerospace research applying PPO to real-time airfoil optimisation under geometric constraints.",
      body: [
        "This work began as my Bachelor's thesis and eventually developed into a published paper. It applies <strong>deep reinforcement learning</strong> with Proximal Policy Optimisation (PPO) to optimise aerodynamic airfoil profiles in real time within the context of <strong>morphing wings</strong>. The approach learns to satisfy both aerodynamic objectives and complex geometric constraints while maintaining low computational cost and millisecond-level optimisation speed.",
        "The code is available on <a href=\"https://github.com/Pablomg02/DRLFoil\">GitHub</a>. It was written while I was still learning a great deal about software development, and much of it was implemented manually at a time when AI coding tools were far less capable, so the codebase is certainly improvable.",
      ],
      links: [
        { label: "Paper", url: "https://www.mdpi.com/2226-4310/12/11/971" },
        { label: "DOI", url: "https://doi.org/10.3390/aerospace12110971" },
      ],
    },
  ],
};
