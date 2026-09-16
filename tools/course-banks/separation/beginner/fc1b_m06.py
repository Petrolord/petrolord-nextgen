import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Associate m06, The Associate Reading. Digest section 6 and the method
# the three lessons of this module set out.

q(1, "Step six of the method is three backward checks. What are they?",
 "An absolute pressure 14.7 above its gauge pressure, a margin of exactly 1.000000 meaning the diameter came from the gas, and a mixture density between the oil and the water.",
 ["A z inside the DAK range of 1.0 to 3.0, a K flagged neither derated nor floored, and a slenderness inside the band a fabricator quotes.",
  "A gas rate restated in MMscfd, a liquid rate restated in bpd and a retention volume restated in ft3, which catch the unit errors surviving every other step of the chain.",
  "A settling velocity above the gas velocity, a liquid depth below the vessel height and an area inside the circle."],
 "A mixture density outside the range between the oil and the water is arithmetically impossible, and a margin of exactly 1.000000 says nobody chose the diameter."),

q(0, "A worksheet on ABANA-1 reports a mixture density of 65.520000 lb/ft3. Which backward check catches it, and what has happened?",
 "The mixture has to sit between oil at 53.675380 and water at 64.896000 lb/ft3, and that figure is the AGBAMI water density read off the wrong row.",
 ["The margin check, since a liquid that heavy lifts the settling velocity above 1.458422 ft/s.",
  "No check catches it, since 65.520000 lb/ft3 is an ordinary produced liquid.",
  "The gauge and absolute check, since a mixture is computed at conditions and the wrong pressure was used."],
 "The weighting is by volume rate, so the answer always lands between the two densities. ABANA-1 holds oil at 53.675380 and water at 64.896000 lb/ft3, and its mixture is 55.171463."),

q(2, "The method settles the conditions before anything else. What is the argument for that order?",
 "Every figure after them is conditional on them, and half the wrong answers in this subject are right answers computed at the wrong pressure.",
 ["The conditions are the only inputs this engine refuses outright, so a run cannot be stopped later.",
  "The conditions are the only figures a question states directly, and the method is written so that every given number is written down before any derived one is computed.",
  "The two pressures are the only pair sharing a unit, so settling them removes the one ambiguity."],
 "Write down the gauge pressure, the absolute pressure, the temperature in degF and in degR, and the gas gravity. The absolute figure feeds the reduced pressure and the gas law while the gauge figure feeds the K lookup."),

q(3, "A graded question puts a stream at Tpr 3.176. What is the answer?",
 "The refusal and its reason, because a z factor there does not exist.",
 ["The z at the nearest edge of the range, which is Tpr 3.0, with a note recording that the stream sat outside the validity range and the value was taken at the bound.",
  "The z from the ideal gas limit of 1, since a reduced temperature above the range describes a gas far from its critical point, where the ideal law is the better description.",
  "The z of the nearest published case, 0.828979."],
 "\"Tpr 3.176 is above the DAK validity range of 1.0 to 3.0, so the z-factor is refused\". Inventing one is worse than reporting that it does not exist."),

q(0, "The tier's summary lists the gas density as set by pressure, temperature, gravity and z. What sets the actual gas rate?",
 "The standard rate and the conditions.",
 ["The standard rate and the vessel diameter, since a rate at conditions is a velocity across an area, and the area is what the conditions are applied over in the vessel.",
  "The gas density of 2.239712 lb/ft3 and the standard rate, since a volume at conditions is a mass rate divided by the density the gas carries at those conditions.",
  "The settling velocity of 1.458422 ft/s and the gas area of 3.308855 ft2, which is the product the engine reports as the volume the vessel has to pass each second."],
 "1273.148148 standard ft3/s scaled by 14.7 over the absolute pressure, by the absolute temperature over 520 degR, and by z gives 29.490437 ft3/s on ABANA-2. Nothing about the vessel appears in it."),

q(1, "A gas gravity is typed as 0.700000 on a stream that is 0.680000. What does a reader see on the report?",
 "Nine ordinary numbers, because every figure downstream prints normally on a chain that is internally consistent.",
 ["A pseudo-critical pair of 377.590000 degR and 663.336000 psia beside conditions of 614.700000 psia and 95.000000 degF, a combination the row flags as inconsistent.",
  "A z outside the DAK range, since the reduced pair moves with the gravity.",
  "A velocity margin away from 1.000000 at the gas-required diameter."],
 "A single wrong condition at the top produces a vessel that is confidently the wrong size at the bottom, with every intermediate figure printing normally on the way down."),

q(2, "Which figure in the ABANA-1 chain rests on something this course holds for the literature?",
 "The K of 0.300000, and with it the settling velocity of 1.458422 ft/s and every margin built on that velocity.",
 ["The z of 0.908065, because the correlation is a fit with a validity range on it.",
  "The mixture of 55.171463 lb/ft3, because rate weighting is a convention the module adopts and no source is named for weighting by volume rather than by mass.",
  "The retention volume of 35.091146 ft3, because 3.000000 minutes is a judgement."],
 "The base row of 0.350000 stands. The step to 0.300000 at 600.000000 psig, and the 0.120000 floor beneath it, are recorded as customary practice whose published form has not been checked."),

q(3, "A supplier's K is given for the ABANA-1 mesh pad. What changes in the chain, and what does the report then say?",
 "The pressure step drops out, the settling velocity is rebuilt on the typed figure, and source reads typed with derated and floored both false.",
 ["Nothing changes until 100.000000 psig is passed, since the rule reaches a typed K the same way.",
  "The velocity is rebuilt and the report carries both the typed K and the table K at that pressure.",
  "The base row is replaced and the floor is kept, since 0.120000 is a property of the method."],
 "An override replaces the whole lookup. It is not blended with the table and it is not derated afterwards, and nothing compares it against the table value."),

q(1, "ABANA-1 needs 2.052551 ft and the studio prefers a 3.000000 ft vessel. What are the liquid depth and the height there?",
 "4.964382 ft of liquid and 10.964382 ft of height.",
 ["10.605223 ft of liquid and 16.605223 ft of height, which is the pair the gas-required diameter produces and the one the chain carries forward to the preferred vessel.",
  "4.964382 ft of liquid and 16.605223 ft of height, since the depth falls with the wider floor while the allowance and the disengagement space above it are unchanged.",
  "2.792465 ft of liquid, 8.792465 ft tall."],
 "The allowance of 6.000000 ft is added to the depth, so 4.964382 ft of liquid gives a drum 10.964382 ft tall. The 2.792465 ft depth belongs to the 4.000000 ft row."),

q(2, "Lay the same drum on its side. What does the vessel gain that this tier never had to size?",
 "A length, which has to satisfy two separate requirements at once.",
 ["A second diameter, since a horizontal drum is sized on its cross-section and on the chord of the gas-liquid surface, which are two independent widths across the same circle.",
  "A second allowance running the length of the drum.",
  "A second settling velocity, since the drop falls across the gas rather than against it and the vertical and horizontal rows of the table are both live in one vessel."],
 "A vertical drum is settled by an area and a depth. Lay it down and the cross-section becomes a circle cut by a liquid level, and the length has to meet both requirements."),

q(0, "This tier held one liquid with one density throughout. What two verdicts does a three-phase vessel have to survive?",
 "A drop of water crossing the oil layer, and a drop of oil rising through the water.",
 ["A drop of water crossing the oil layer, and an interface sitting where the gas-liquid chord places it, which is the geometry a vertical vessel never has to compute.",
  "A gas velocity below the settling velocity, and a liquid depth leaving room for the allowance, which are this tier's two verdicts applied to a vessel with two liquids in it.",
  "An oil retention time and a water retention time."],
 "A real three-phase separator holds oil over water with an interface between them, and where that interface sits follows from the retentions rather than from the gas-liquid geometry."),

q(3, "Three habits are named as carrying into the later tiers. Which one guards against the psig and psia pair?",
 "Naming the unit beside every figure.",
 ["Running the chain in order, since the absolute pressure is computed in the first step and any later step needing it takes the figure that step produced rather than the gauge reading.",
  "Reading a refusal as a finding, since the engine names pPsia and pPsig separately in its messages and the two guards differ in what each will accept as a valid pressure.",
  "Checking the mixture against the two liquid densities, which is the one backward check running on a figure that both pressures have already reached by the time it is computed."],
 "Both print as numbers around six hundred. 600.000000 psig and 614.700000 psia belong to the same vessel, so the label is the only thing that separates them."),

q(1, "State one thrown refusal and one returned error from this tier, and say what separates them.",
 "\"gasSg must be a finite, positive gas gravity with air = 1 (got undefined)\" is thrown and names an input to fix, while { error: \"settling needs a positive K and a liquid denser than the gas\" } is returned as data.",
 ["\"Tpr 3.176 is above the DAK validity range of 1.0 to 3.0, so the z-factor is refused\" is thrown and { error: \"unknown sizing mode 'cylindrical'\" } is returned, which is what separates them.",
  "\"liquidLevelFrac must lie strictly between 0 and 1 (got 0)\" is thrown and \"pPsig must be a finite, non-negative gauge pressure (got -20)\" is returned, and what separates them is which field the value sat in.",
  "Both examples in this tier are thrown, and what separates a throw from a returned error is only whether a sweep happened to be running at the moment the fault was met."],
 "A throw names an input somebody has to go and fix. A returned error says the inputs were fine and the method has no answer for the state they describe, so it arrives beside the results."),

q(2, "Step five says size, then judge. What are the two verdicts at the end of it?",
 "A velocity margin, which below 1 means the vessel does not carry its gas, and a slenderness, which is a shape to be reasonable about.",
 ["A velocity margin and a retention check, since the liquid has to be held for the time the basis asked for and a depth that fails to deliver it fails the vessel as well.",
  "A feasibility flag and a preferred diameter, returned once every offered size has been compared.",
  "A z inside its range and a K that was neither derated nor floored."],
 "A margin below 1 disqualifies a vessel whatever its other numbers look like. A slenderness is reported rather than judged."),

q(0, "What can this tier not tell a reader about the K it sized every vessel with?",
 "Whether it is right.",
 ["Whether it belongs to the right orientation, since an id carries both halves and the engine refuses a horizontal row on a vertical run, which leaves a reader nothing to check.",
  "Whether it was applied to the right stream, since the six base rows are shared by every vessel and nothing on a row records which stream it was read for.",
  "Whether it was measured, since every figure in the table is an allowable velocity coefficient fitted to observed carryover and the module states the sample each row was fitted to."],
 "The six base rows are published. The step from 0.350000 to 0.300000 and the 0.120000 floor beneath it are the part to treat as provisional, and the discipline is to rest no conclusion on the unchecked part."),

emit(Q, '/root/fc-wip-separation/banks/fc1b_m06.json', expect_n=15)
finish()
