---
layout: page.njk
title: Research
description: Publications and research work in AI, aerospace, and reinforcement learning.
permalink: /research/
---

# Research

[ORCID: 0009-0002-9817-0368](https://orcid.org/0009-0002-9817-0368)

This is my public research work so far. My current work is in **reinforcement learning under partial observability**: belief states, **world modelling**, and **meta-learning**, oriented towards multi-agent systems and embodied AI. Some of it should become public soon.

---

## Multi-Agent Reinforcement Learning for Drone-Based Search and Rescue Missions
*Master's Thesis - MSc in Industrial Mathematics*

My Master's thesis studies different **multi-agent AI architectures based on reinforcement learning**, with particular attention to their stability, convergence behaviour, and collaborative dynamics. The work evaluates these architectures across environments of increasing complexity, designed to resemble search and rescue missions where teams of drones must locate one or more targets in novel scenarios.

The goal is to identify an AI architecture that, with the necessary real-world adaptations, could eventually be deployed beyond simplified environments and inputs. A central part of the work is to distinguish genuine **collaboration and generalisation** from the mere memorisation of patterns, while analysing what each architecture reveals about learning, coordination, and robustness.

The thesis is now complete, and I will share it here soon.

---

## Weakly Supervised Segmentation of Macroalgae Through Gradient Analysis in Convolutional Neural Networks and Segment Anything Model
*August 2026 — Applied Sciences (MDPI), Vol. 16, Issue 17*

This paper explores a practical way to understand what a convolutional neural network learns when distinguishing between different macroalgae genera. Instead of looking only at the final convolutional layer, as Grad-CAM typically does, we analyse the gradients across all intermediate layers, revealing how early spatial details and deeper semantic features complement one another. We then use that information to guide SAM2 in locating and segmenting the algae from image-level labels alone. Beyond this particular application, the work offers an intuitive framework for studying intermediate CNN representations and suggests that using the full hierarchy can produce more informative localisations than relying only on the deepest layer, while remaining competitive with established multi-layer methods such as LayerCAM.

[Paper](https://www.mdpi.com/2076-3417/16/17/8470) — [DOI](https://doi.org/10.3390/app16178470)

---

## Real-Time Aerodynamic Airfoil Optimisation Using Deep Reinforcement Learning with Proximal Policy Optimisation
*November 2025 — Aerospace (MDPI), Vol. 12, Issue 11*

This work began as my Bachelor's thesis and eventually developed into a published paper. It applies **deep reinforcement learning** with Proximal Policy Optimisation (PPO) to optimise aerodynamic airfoil profiles in real time within the context of **morphing wings**. The approach learns to satisfy both aerodynamic objectives and complex geometric constraints while maintaining low computational cost and millisecond-level optimisation speed.

The code is available on [GitHub](https://github.com/Pablomg02/DRLFoil). It was written while I was still learning a great deal about software development, and much of it was implemented manually at a time when AI coding tools were far less capable, so the codebase is certainly improvable.

[Paper](https://www.mdpi.com/2226-4310/12/11/971) — [DOI](https://doi.org/10.3390/aerospace12110971)
