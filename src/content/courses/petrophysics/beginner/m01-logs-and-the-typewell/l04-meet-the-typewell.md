# Meet the typewell

Every module in this course, the module quizzes, the final exam and the graded capstone all work on one dataset: the **typewell**, a synthetic but geologically sensible vertical well built for teaching. Working a single well end to end is deliberate. By the time you sit the capstone you will know this well the way you will later know your first real one.

## The well at a glance

- One vertical well, logged from **2000 m to 2100 m**.
- **201 samples** at a constant **0.5 m** increment.
- Curves: **GR** (API), **RHOB** (g/cc) and **RT** (ohm.m) are the working set for this tier. **NPHI** (v/v) and **DT** (us/m) are also present and come into play at the Intermediate and Advanced tiers.
- Two sand targets separated by shale:
  - **SAND_A** from 2010 to 2030 m, the main target.
  - **SAND_B** from 2050 to 2080 m, a deeper, poorer interval.
- A known **water leg** from 2075 to 2078 m at the base of SAND_B, where the pores are fully brine filled. The higher tiers use it to derive water resistivity independently; at this tier you should simply know it is there and why it is useful.

## The character of the rocks

The shale sections bounding the sands have a consistent signature. At 2000 m the readings are GR about 120 API, RHOB about 2.55 g/cc and RT about 2 ohm.m: radioactive, relatively dense and electrically conductive, exactly what the physics of clay minerals and bound salty water predicts.

The clean sand in SAND_A reads very differently. At 2020 m, mid zone, the samples are GR 20 API, RHOB 2.3035 g/cc and RT 9.2554 ohm.m: quiet on gamma ray, light on density and several times more resistive than the shale. Those three shifts, all at the same depth, are the classic hydrocarbon-sand signature you learned to spot in the first lesson.

SAND_B is the cautionary tale. Its gamma ray is as quiet as SAND_A, but its porosity deteriorates with depth and its lower part sits in water. A zone can look clean on GR and still book very little pay, and SAND_B exists to make you prove that with numbers rather than assert it from pattern matching.

## The given constants

Real evaluations need parameters from cores, water samples and offset wells. The typewell ships with a complete, internally consistent set, pre-filled in the Learning Mode app and editable there:

| Parameter | Symbol | Value |
|---|---|---|
| Clean sand GR line | $GR_{clean}$ | 20 API |
| Clay GR line | $GR_{clay}$ | 120 API |
| Matrix density | $\rho_{ma}$ | 2.65 g/cc |
| Fluid density | $\rho_{fl}$ | 1.0 g/cc |
| Water resistivity | $R_w$ | 0.05 ohm.m |
| Archie constants | $a, m, n$ | 1, 2, 2 |
| Porosity cutoff | $\phi_{cut}$ | 0.08 |
| Shale cutoff | $V_{sh,cut}$ | 0.50 |
| Saturation cutoff | $S_{w,cut}$ | 0.60 |

You will meet each of these where it belongs: the GR lines in the shale volume module, the densities in the porosity module, $R_w$ and $a, m, n$ in the saturation module, and the three cutoffs when net pay is assembled. For now, notice one sanity check you can already run: the clay line, 120 API, matches what the shale at 2000 m actually reads, and the clean line, 20 API, matches the sand at 2020 m. Given parameters should always be confronted with the curves this way before you trust them.

## How the course uses the well

Each module from here on adds one link to the chain: shale volume from GR, then porosity from density, then water saturation from resistivity, then cutoffs and zone summaries. Every worked example quotes real typewell samples, so you can reproduce every number in this course by hand, and the Petrophysics app in Learning Mode runs the identical engine over the identical data if you want to explore interactively. The capstone at the end asks you for the summary numbers of both zones, computed with the given constants above, and grades them automatically against the engine.

## Exercise

From memory, then checking against this page: write down the depth windows of SAND_A, SAND_B and the water leg, and the values of the two GR lines. Then, using the samples quoted above, state which given parameter is directly confirmed by the shale reading at 2000 m and which by the sand reading at 2020 m. Check yourself: the shale confirms $GR_{clay} = 120$ API and the sand confirms $GR_{clean} = 20$ API.
