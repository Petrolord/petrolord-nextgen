# Limits of the quicklook

The chain you just ran is called a quicklook for a reason. It is fast, it needs nothing beyond the SP curve and the mud report, and on the typewell it lands within 0.2 percent of the laboratory route. But it earns that performance by making approximations that you must be able to name, because in some waters they stop being small.

## The equivalent-resistivity approximations

The equation of lesson 4 actually relates EQUIVALENT resistivities: $R_{mfe}$ and $R_{we}$, the values the fluids would have if they behaved as ideal NaCl solutions. The quicklook chain makes two documented simplifications: it treats the mud report's $R_{mf}$ as if it were $R_{mfe}$, and it treats the computed $R_{we}$ as if it were the true $R_w$. For moderately saline sodium chloride waters, both substitutions are good, and the typewell sits comfortably in that regime.

They degrade in two situations. In fresh waters, activity effects separate equivalent from true resistivity, and the divergence grows as salinity drops. And in unusual brines rich in divalent ions such as calcium and magnesium, the NaCl-equivalent assumption itself bends, because those ions do not conduct or exchange like sodium.

Full conversions between equivalent and true resistivities exist in the literature, the standard reference being Bateman and Konen (1977). The engine deliberately does NOT implement them yet: the coefficients will only be added when a page-referenced copy of the source is in hand to validate against, rather than guessed from secondary material. That is the same validation-first discipline that gates every engine on this platform, and it is worth noticing that leaving a correction OUT, visibly and documented, is more honest than shipping an unverified version of it. Until then, the quicklook is exact within its stated approximation, and you know precisely where that approximation lives.

## The field failure modes

Module lessons 1 and 2 introduced these; collect them here as the checklist you run before believing any SP-derived Rw.

Hydrocarbon suppression. Oil or gas in the pores mutes the electrochemical exchange and shrinks the deflection. Read water legs only.

Thin beds. A bed a few borehole diameters thick never develops the full static deflection. Correction charts exist; a thicker bed is better evidence.

Shaliness. Clay in the sand short-circuits the membrane potential. The cleanest available interval sets the floor on this error.

Baseline drift. Draw the shale baseline locally, bracketing the sand you read; never carry one baseline across hundreds of metres.

Bad $R_{mf}$. The mud report's filtrate resistivity is itself a measurement, quoted at surface temperature, and it must be Arps-corrected to formation temperature before entering the equation, exactly as module 2 corrected the water sample. An uncorrected $R_{mf}$ propagates linearly into $R_{we}$, and a mislabelled one propagates completely.

Every one of these except the last biases the deflection SMALL, which biases $R_{we}$ HIGH, which biases Archie saturations high and understates pay. The quicklook's errors are not symmetric, and knowing the direction of the bias is half the defence.

## The role the SP route deserves

Given all this, where does the SP quicklook belong in an Expert workflow? As an in-situ cross-check, and a powerful one. Its strengths are exactly the weaknesses of the other routes: it measures the formation where it sits, so it cannot suffer a mislabelled sample bottle or evaporation in storage, and it is available in nearly every old well where no sample was ever caught. Its weaknesses, the reading pitfalls above, are exactly what the laboratory and Pickett routes do not share.

So the standard is this: the SP route is strongest when it CONFIRMS another route, and at Expert level it is never a sole source. On the typewell it confirms the Arps-corrected sample almost exactly, 0.049831 against 0.049910 ohm.m, and module 4 will add the Pickett fit at 0.0500 to complete a three-way agreement. When you meet a well where the routes disagree instead, the checklist above is where you start looking for the culprit.

## Exercise

A colleague derives $R_{we} = 0.11$ ohm.m from an SP reading taken across a 1 m sand directly above a known oil-water contact, in a well whose produced-water sample gives $R_w = 0.05$ ohm.m after Arps correction. List the two reading conditions that most plausibly explain the disagreement, and state the direction each one biases the SP result. As a self-check: the bed is thin (deflection underdeveloped) and the interval likely carries hydrocarbons above the contact (deflection suppressed); both shrink the deflection and both bias $R_{we}$ HIGH, which is exactly the direction of the discrepancy. The sample value wins, and a re-read in the water leg below the contact would likely close the gap.
