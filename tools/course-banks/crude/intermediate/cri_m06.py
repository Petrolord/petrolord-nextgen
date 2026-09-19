import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Professional m06, the Professional reading. Every figure is from digest
# SECTION 18 (the Kwale valuation in one place, the studio's defaults and the
# oracle block), read with SECTIONS 13 to 17 as one valuation. Watson K at T50
# is HELD item C13 and is asked about as a limit only.

q(1, 'The Kwale valuation opens with a blend API of 33.1219. On what basis did the engine form it?',
 'Computed from the volume-blended specific gravity, never averaged directly.',
 ["Averaged directly from the two crudes' API numbers, weighted by volume share.",
  "Read off the blend's own curve at the fifty percent point, then converted.",
  'Specific gravity weighted by mass fraction from the two crudes, then converted to API.'],
 "That basis is the engine's own words for API. The Kwale blend's SG is 0.8595.")

q(3, 'In the Kwale valuation, which figure carries the label screening, and why?',
 'Watson K at T50, 11.8135, because T50 stands in for the mean average boiling point, which the studio does not compute.',
 ['The blend T50 of 587.3184 F, because an interpolated reading between two curve points is only a screen of the true midpoint.',
  "The differential of -7.5527 $/bbl, because a marker differential is a screen until the marker's own terms are checked by a trader.",
  'The loss value of 0.5939 $/bbl, because a loss percent typed by the refinery is a screen until it is measured across a year.'],
 'That choice is held item C13, a stated limit. The page labels K as the screening figure and nothing is graded on it.')

q(0, 'Which set of four checks does the digest show the Kwale valuation passing?',
 "The yields close; nothing is assumed zero; the loss comes off before the costs; the blend's netback matches its crudes' volume-weighted mean.",
 ['The yields close; the blend API matches the volume-weighted mean of the API numbers; the Watson K sits in a paraffinic band; the differential is positive.',
  "The yields total 100.0000 after scaling; every cost is typed; the loss is taken after the costs; the T50 matches the mean of the crudes' own T50.",
  'The curve has a point at every 10 percent; the cut set has a vacuum split; the netback exceeds the marker; the oracle reproduces the Watson K.'],
 'In the Kwale case the yields close, the netback of 64.9473 $/bbl is complete with nothing assumed zero, the loss appears as its own term of 0.5939 directly after gross, and the blend minus the mean is 0.0000.')

q(2, 'A learner opens the Crude Assay & Blending Studio with nothing typed and reads a netback of 69.7334 $/bbl. What is it the netback of?',
 "The studio's default pair, 60 and 40, on its default cuts and default valuation.",
 ["The Kwale blend, 55 and 45, on Kwale's cut set before freight is taken off.",
  "Kwale Light alone, valued on the studio's default cuts and default prices.",
  "The Kwale blend on the studio's default cuts, with Kwale's prices kept."],
 "Nothing in the default table is Kwale's. Before reading any figure on the page, read which pair, which cut set and which prices it rests on. The Kwale blend nets back 64.9473 $/bbl.")

q(1, "The studio's default table reads stability screen basis api-contrast. What does that say about the SARA behind it?",
 'SARA was not supplied for every crude, so the screen falls back to the gravity rule of thumb, which can raise a flag and can never clear one.',
 ['SARA was supplied for both crudes and blended on mass, and the gravity contrast confirmed the colloidal instability index.',
  "SARA was supplied for every crude, and api-contrast names the engine's check of the index against the lighter crude's gravity.",
  'The SARA fractions were blended on volume, and api-contrast names the volume basis used for the stability screen.'],
 'The Associate tier taught the screen: with SARA on every crude the engine forms the colloidal instability index. With SARA on only some crudes, or none, the screen falls back to gravity, which can raise a flag and cannot clear a blend.')

q(3, "What T50 and Watson K does the studio's default pair show, and on which basis is the K labelled?",
 'T50 617.1429 F interpolated, and Watson K at T50 of 11.7452, labelled screening.',
 ['T50 690 F from the grid, and Watson K at the grid reading of 12.0043, labelled screening.',
  'T50 587.3184 F interpolated, and Watson K at T50 of 11.8135, labelled screening.',
  'T50 617.1429 F interpolated, and Watson K of 11.7452 on the mean average boiling point.'],
 "The default table prints the blend T50 F (interpolated) as 617.1429 and Watson K at T50 (screening) as 11.7452. 587.3184 and 11.8135 are the Kwale blend's.")

q(0, "Why is a check that recomputes an engine's figure with the engine's own formula no evidence?",
 'If the formula is wrong, the check is wrong the same way, and the two agree on the wrong answer.',
 ['It is evidence, since agreement to four decimal places on every golden case rules out a wrong formula.',
  'It is no evidence only when the check is written in Python and the engine in JavaScript, since the languages round apart.',
  'It is no evidence because it runs on the goldens, which the engine itself wrote.'],
 'Agreement is evidence only when the second computation gets there by a different road. The crude assay engine is held to an independent Python oracle written from the rules.')

q(2, "How does oracle_crudeassay.py reach a blend's T50, and how does that road differ from the engine's?",
 'By bisection on the curve for the temperature at which it reaches 50, where the engine interpolates between the two points either side.',
 ['By interpolating between the two points either side of 50 percent, where the engine searches by bisection.',
  "By the volume-weighted mean of the two crudes' own T50 figures, where the engine reads the blend's own curve between two points either side.",
  'By reading the first curve point at or past 50 percent, where the engine interpolates.'],
 "The oracle finds T50 by bisection. The Kwale blend's T50 is 587.3184 F.")

q(3, "What form does the Python oracle give the Kwale netback, beside netbackValue's formula?",
 "As a 100,000 bbl account on a loaded cargo, where the engine's formula runs per barrel of crude.",
 ["As the engine's own per barrel formula rerun line for line in Python, where the engine runs it in JavaScript.",
  "As the volume-weighted mean of the crudes' own netbacks, where the engine values the blend's own cut yields.",
  'As a gross product value alone, where the engine goes on to take the loss, processing cost and freight off.'],
 'The oracle loads a cargo in barrels and pounds and keeps the netback as a 100,000 bbl account. netbackValue states every term per barrel of crude. The Kwale netback is 64.9473 $/bbl.')

q(1, 'What golden cases is oracle_crudeassay.py checked on, counted from the vendored file?',
 '6 blends, 4 curve cases and 1 blended default curve.',
 ['4 blends, 6 curve cases and 1 blended default curve.',
  '6 blends, 4 curve cases and 14 blended curve points.',
  '11 blends, 8 curve cases and 1 blended default curve.'],
 'The golden sets are counted from the vendored file: blends 6, curve cases 4, blended default curve 1.')

q(0, 'The oracle loads a cargo in barrels and pounds. What does that let it reach by its own road?',
 'The mass-basis figures, from pounds on a loaded cargo, where the engine converts volume shares to mass shares with resolveFractions.',
 ['The D86 to TBP conversion, which the engine refuses to make until a coefficient table is supplied to it.',
  "The cut points: pounds let the oracle place each cut on a mass curve beside the engine's volume curve.",
  'The marker: pounds let the oracle value the marker by the tonne, where the engine values it by the barrel.'],
 "The engine converts once: each crude's mass share is its volume share times its specific gravity, over the sum of those products. The oracle is written from the rules and loads a cargo instead.")

q(2, 'What can the oracle not settle about Watson K at T50?',
 'Whether T50 is the right stand-in for the mean average boiling point, since an oracle written to the same rule agrees with it.',
 ['Its value for the Kwale blend, since a bisection cannot reach a figure that the engine reaches by interpolation.',
  'Its sign, since the oracle bisects the curve and cannot tell which side of the 50 percent point the boiling temperature lies on.',
  'Its label, since the oracle checks figures alone and never reads the words the studio prints beside a figure on the page.'],
 'An oracle confirms that the engine computes what the rules say. It cannot decide which rule is right, which is why held items are stated as limits.')

q(3, "The studio's default table shows Vacuum gasoil at 27.7681 volume percent. The Kwale blend on the studio's default cuts yields 26.6940. What separates the two figures?",
 'The blend: the default pair at 60 and 40 against Kwale Light and Ughelli Medium at 55 and 45, on the same default cuts.',
 ["The cut set: 27.7681 is on the studio's default cuts and 26.6940 on the Kwale refinery's own cuts, which end at atmospheric residue.",
  'The basis: 27.7681 is the vacuum gasoil yield weighted on mass and 26.6940 the same yield weighted on volume.',
  'The reading: 27.7681 is read at the first grid point past each cut point and 26.6940 interpolated on the curve.'],
 "The default table is the studio's default pair on its default cuts. The Kwale blend on the same default cuts, a vacuum refinery's cut set, yields 26.6940 percent vacuum gasoil.")

q(1, 'In what order does the Kwale valuation run from the two crudes to the differential?',
 'Blend the curve on volume, cut it into yields, price the cuts, take the loss off the product value, subtract the costs, then set the netback against the marker.',
 ["Blend the crudes' T50 on volume, draw the cut yields from that T50, price the cuts, subtract the costs, then take the loss and set the result against the marker.",
  'Blend the curve on mass, cut it into yields, subtract processing and freight from each product price, take the loss, then set the netback against the marker.',
  'Blend the curve on volume, price the cuts, subtract processing and freight, take the loss off what remains, then set the netback against the marker.'],
 "The blend's curve is formed on volume and the cut yields are read off it; the loss comes off the product value before processing and freight; the differential is the netback minus the marker's 72.5 $/bbl.")

q(0, 'Which figures of the Kwale valuation did module 4 build, and on what rule?',
 'The gross of 74.2412, the loss value of 0.5939 and the netback of 64.9473 $/bbl, with the loss taken on the product side before the costs.',
 ['The gross of 74.2412, the loss value of 0.5939 and the differential of -7.5527 $/bbl, with the loss taken after the costs.',
  'The yields of 20.5591 and 43.0526 and the gross of 74.2412 $/bbl, with the yields weighted on mass before pricing.',
  'The netback of 64.9473 and the differential of -7.5527 $/bbl, with the marker taken off before the processing cost.'],
 'Module 3 built the cut yields and module 5 the differential against the marker of 72.5 $/bbl.')

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/intermediate/cri_m06.json', label='cri_m06', expect_n=15)
finish()
