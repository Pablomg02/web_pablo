---
title: How a Wing Generates Lift
description: A short explanation of lift as the result of air being turned around the wing, the circulation it creates, and how curved streamlines set up the pressure difference.
date: 2026-06-23
topics:
  - Aerodynamics
---

*This is a test article &mdash; just an example while I prepare the real Notebook pieces.*

Ask why a wing lifts and you often get the "longer path on top" story, which turns out to be wrong. A cleaner picture is this: the wing **turns the air**, and turning air is what produces lift.

## Air turns at the leading edge

As the flow reaches the wing it splits and curves sharply around the rounded *leading edge*. Hugging the upper surface, it keeps bending and leaves the *trailing edge* aimed slightly downward. The wing has deflected a stream of air downward, and by Newton's third law the air pushes back on the wing &mdash; upward.

Seen as a whole, this bending is a net *rotation* of air around the wing: the flow moves a little faster over the top and slower underneath, as if a weak vortex were bound to the wing. That bound rotation is the heart of the matter.

## Curved streamlines need a pressure difference

The link between "the air curves" and "there is a force" is geometric. Whenever a streamline follows a curve of radius $R$, something must supply the centripetal acceleration, and the only thing available is a pressure gradient across the flow:

$$
\frac{\partial p}{\partial n} = \rho\, \frac{V^2}{R}.
$$

Pressure rises as you move *away* from the centre of curvature. Over the top of the wing the streamlines curve downward, with their centre of curvature below them, so pressure *falls* as you approach the surface &mdash; a suction. The tighter the curve (smaller $R$), the steeper the gradient and the stronger the pull. This radius-of-curvature view is the one Babinsky uses to explain lift without invoking equal transit times.[^babinsky]

## Circulation makes it quantitative

The rotation around the wing is measured by the *circulation* $\Gamma$, the integral of velocity around a loop enclosing the section. The Kutta–Joukowski theorem ties it directly to lift per unit span:

$$
L' = \rho\, V_\infty\, \Gamma.
$$

What fixes the value of $\Gamma$ is the *Kutta condition*: the flow must leave the sharp trailing edge smoothly, and only one amount of circulation lets it do that. Set that, and the lift follows.[^anderson]

[^babinsky]: H. Babinsky, "How do wings work?," *Physics Education*, vol. 38, no. 6, pp. 497–503, 2003. <https://doi.org/10.1088/0031-9120/38/6/001>
[^anderson]: J. D. Anderson, *Fundamentals of Aerodynamics*, 6th ed. New York: McGraw-Hill, 2017.
