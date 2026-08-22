# Reporting and the capstone

The last skill of the loop is communicating it. A petrophysical interpretation earns its keep when someone else can read it, audit it and act on it. This lesson describes the one-page summary that professional petrophysicists produce for a well like the typewell, and then lays out how you finish this course: quizzes, the final exam, and the capstone practical that issues your certificate.

## The one-page petrophysical summary

A reader of your summary should be able to reproduce your numbers without asking you a single question. That standard dictates the contents:

1. **Well identification.** Well name, field, the log runs used and their depth interval. For us: the typewell, logged from 2000 to 2100 m at half-metre sampling.
2. **Zones.** Every evaluated zone with its top and base. Here SAND_A spans 2010 to 2030 m and SAND_B spans 2050 to 2080 m.
3. **The parameter table.** Every constant the workflow consumed: matrix and fluid densities, the clean and clay gamma ray lines and the Vsh transform, $R_w$ and the Archie constants $a$, $m$, $n$. This table is the audit trail; omit it and your work cannot be checked.
4. **Cutoffs.** The three tests and their values: $\phi \ge 0.08$, $V_{sh} \le 0.5$, $S_w \le 0.6$.
5. **Per-zone results.** One row per zone: gross, net, net-to-gross, and the thickness-weighted averages of porosity and water saturation over the pay. For the typewell:

| Zone | Gross (m) | Net (m) | NTG | $\phi_{avg}$ | $S_{w,avg}$ |
|---|---|---|---|---|---|
| SAND_A | 20.5 | 18.0 | 0.878 | 0.208 | 0.361 |
| SAND_B | 30.5 | 5.5 | 0.180 | 0.142 | 0.542 |

6. **Method notes and assumptions.** Short prose: density porosity with quartz matrix, Larionov tertiary Vsh, Archie saturation with $R_w$ validated on the 2075 to 2078 m water leg, plus any intervals excluded for bad hole and any caveats from your sensitivity pass, such as SAND_B's proximity to the cutoffs.

**Worked example.** Consider the SAND_B row above. A reviewer can take the parameter table, recompute $\phi_D$, $V_{sh}$ and $S_w$ at any depth in 2050 to 2080 m, apply the stated cutoffs, and arrive at the same 5.5 m of net. That is what a reproducible report means, and it is precisely what you did by hand at 2020 m for SAND_A in the first lesson of this module.

## How the course finishes

The path from here to an Associate certificate has three gates, in a fixed order.

**Module quizzes.** Each module of this course ends with a quiz drawn at random from that module's question bank. You must read every lesson in a module before its quiz opens, and passing the quiz is what unlocks the next module. Attempts are served as a pinned set, so refreshing does not deal a new hand, and repeated failures trigger a cooldown to encourage rereading before retrying.

**The final exam.** When every module is complete, the final exam opens: a randomized, closed-book exam drawn from the whole course. It is deliberately broader than any single module quiz. Treat it as you would a professional certification sitting.

**The capstone practical.** Passing the final exam unlocks the capstone in the petrophysics Learning Mode app. The capstone is graded on exactly six numbers: $net_m$, $\phi_{avg}$ and $S_{w,avg}$ for SAND_A, and the same three for SAND_B, each computed from the typewell with the given parameter set and graded server-side within tolerance. The app runs the same engine that produced every number in this course, so an honest pass of the workflow yields the six numbers directly. Passing the capstone issues your Associate certificate with a public verification code, valid for twelve months.

There is no shortcut through the sequence and no timer pushing you along. The course is finished when the work is done, at whatever pace your evenings allow.

## Where to go next

The Intermediate tier takes the same well and deepens every stage: multi-method porosity from density, neutron and sonic, Pickett crossplots for $R_w$, and shaly-sand saturation models. Everything you validated here carries forward.

## Exercise

Draft the one-page summary for the typewell yourself, using only this course's materials: sections 1 through 6 with the real values. Then check it against a colleague's imaginary question for each section: could they identify the well, locate the zones, rerun the arithmetic, apply the cutoffs, verify each summary row and understand your assumptions from the page alone? If any answer is no, the missing item goes in before the page is done.
