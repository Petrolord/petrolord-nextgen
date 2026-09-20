# crude PANELS TASK. Three explorer panels over one teaching lab.

Read LESSON_TASK.md first. The digest is the only teaching truth, and a panel is
a lesson a learner can move.

## Shape

One lab, `src/components/course/panels/crude/crudeLab.js`, the ONLY file that
imports the vendored `packages/engines/engines/downstream/crudeAssay.js`,
`packages/engines/engines/downstream/productBlending.js` and
`packages/engines/lib/lp/simplex.js`. Every value it exports is pinned by vitest
in `crudeLab.test.js` against the figures the digest prints, so a panel and a
lesson can never disagree. The lab reads the teaching cases from
`crude_fields.mjs` as mirrored under `tools/course-waves/crude/`, through
`waveInputs.mjs`, never from `/root`.

Register the three ids in `src/content/courses/panelRegistry.js`:
`crude-assay-explorer`, `crude-valuation-explorer`, `crude-recipe-explorer`.
The manifests already carry them, so `src/lib/courseContent.test.js` fails
"every panel referenced by a manifest is registered" until they are registered.
That red is expected at the foundation and is this phase's to clear.

## THE BASIS RULE, AND IT IS THE PANEL RULE THAT MATTERS MOST HERE

**Every figure a panel shows is the engine's, on the engine's basis, with the
basis the engine names printed beside it.** A panel that wants to show the
wrong basis for contrast (API averaged on volume, sulfur on volume, the index on
volume, T50 at the grid, rowPrice) takes it from the lab, which computes it with
the engine's own helpers exactly as `crude_dump.mjs` does, and labels it as the
reading the engine does not use. A panel never does its own arithmetic. Every
computed figure displays to four decimals, the digest's precision, so a learner
reading a panel reads what a lesson quotes.

There is no clock in this course. The lab test proves it anyway: build the whole
snapshot under two faked system dates and under `TZ=Pacific/Pago_Pago` and
demand the same bytes.

## THE THREE

**`crude-assay-explorer`** (Associate throughout)

- the OBIGBO library as cards: API, SG, the per-mass properties, SARA, the TBP
  curve (SECTION 3);
- a blend builder over any two or three library crudes with a share slider each.
  At 65 and 35 of Obigbo Light and Egbema Medium every figure must match SECTION
  12. Beside each property, its basis in the engine's own words, and the
  wrong-basis reading from the lab with its difference (SECTIONS 4 to 6 and 8);
- blanking a property on one crude: the property reads "not blended" and names
  the crude (SECTION 7); the refusals as the engine's sentences;
- the curve plot with the measured points marked and the unknown region beyond a
  partial curve drawn as unknown (SECTION 9), and the cut set as bands with each
  cut's yield, the total and whether the set closes (SECTION 10);
- the stability screen: blended SARA, the CII against the two exported bands,
  and with SARA removed, the gravity screen that can raise a flag and never clear
  one (SECTION 11). "No verdict" is shown as its own state, never as a tick.

**`crude-valuation-explorer`** (Professional throughout)

- the KWALE blend's own curve beside its two crudes' curves, with a share slider
  (SECTION 13); the partial-assay blend with its dropped temperatures marked;
- T50 read off the blend's curve, with the grid reading and the averaged
  component midpoints drawn as the readings the engine does not use, and Watson
  K labelled as the screening figure it is (SECTION 14);
- the refinery's cut set as draggable cut points: moving one moves barrels
  between two cuts and nowhere else (SECTION 15);
- the netback as a waterfall: gross product value, losses on the product side,
  processing, freight, netback, then the marker differential (SECTIONS 16 and
  17). A blank cost is named as assumed zero, an unpriced cut is named and the
  valuation shows itself incomplete.

**`crude-recipe-explorer`** (Expert throughout)

- the textbook LP in two dimensions: the feasible region, its vertices, the
  optimum on a vertex, and the objective line; drag a right-hand side and watch
  the shadow price appear as the change in the optimum (SECTION 19);
- the APAPA PMS pool: components with cost, quality and availability; the
  template's specifications with their bases; the least-cost recipe, the achieved
  properties, giveaway, and binding rows highlighted (SECTIONS 20 to 22);
- **shadow prices as the value of relief**, per whole unit of the property, with
  rowPrice beside each and never in its place; drag a limit and show the
  re-solved saving next to the derivative so the learner sees them part (SECTION
  23); the marginal barrel next to the unit cost;
- the AGO pool with viscosity through the Refutas index on mass (SECTION 24);
- availability typed as 0 against left blank, a blank cost refused, a
  specification skipped with its reason, and infeasible shown as an answer with
  the engine's sentence (SECTION 25).

## THE CAPSTONE GUARD

Write `panelCapstoneGuard.test.js` on FC6's pattern: every graded value in
`fields.json`, rendered to four decimals and to two, signed and unsigned, must
appear in no panel, lab or page source, with a permanent plant proving the
detector fires. The guard must also refuse the names IDAMA, OGBELE and ONNE and
their crudes anywhere in the panel tree.

## Copy

No em dashes, no en dashes, no "X, not Y" contrastive in any label, tooltip or
caption. A basis is the engine's word; a refusal is the engine's sentence.
