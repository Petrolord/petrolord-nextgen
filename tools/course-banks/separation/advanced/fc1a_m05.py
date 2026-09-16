import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Expert m05, What the Method Does Not Know. Digest sections 17, 3, 9, 11.

q(2, "The K derating and its floor are held for the literature. What may a design report take from them, and what may it not?",
 "It may state the published table values and the fact that the engine derates, and it may not lean on a derated figure as though it were calculated.",
 ["It may quote the derated K of 0.300000 at 600.000000 psig as a design basis, and it may not quote the floor of 0.120000, which is the only half of the rule that is unchecked.",
  "It may use any derated K below the floor of 0.120000, and it may not use one above it, since the floor marks where the rule of thumb was checked against a source.",
  "It may quote the rule where a vessel is vertical, and it may not where a vessel is horizontal, because only the vertical rows of the table carry a checked derating."],
 "What is unchecked is the published form: whether the slope is 0.01 per 100 psi, whether it starts at 100 psig, and whether any source puts a floor there at all. A conclusion built on a derated K carries the uncertainty of the rule.")

q(0, "verticalNoneAt650psig returns K 0.125000 with derated true, floored false and nearFloor true, against the floor of 0.120000. What is nearFloor reporting?",
 "That the floor did not catch this K, and that one more 100 psi step of the same rule would put it under, so the value sits 0.005000 from the edge of the range where the rule of thumb stops meaning anything.",
 ["That the engine has replaced the value the rule produced, since a K landing within one step of 0.120000 is reported at the floor rather than at the figure the derating actually gave for that row.",
  "That a warning has been raised on this row, which is the engine asking for a vendor K wherever the derating comes close enough to the floor that the rule behind it stops meaning anything.",
  "That the derating rule ran twice on this row, which is how a bare drum starting from 0.180000 falls to within half a step of the floor at an operating pressure as modest as this one."],
 "nearFloor is true when the floor did not catch the value and one more 100 psi step of the rule would. It is a flag and not a warning: the return on that row still carries a null warning, and floored and nearFloor are never true together.")

q(1, "At 3000.000000 psig the derating gives -0.110000 and the engine returns 0.120000 with floored true. How should that number be read?",
 "As the engine declining to extrapolate, so the K it returned was chosen rather than computed, and a vendor K is the only honest input at that pressure.",
 ["As the lowest K any mist extractor can produce, measured across the six published rows of the table and rounded to the nearest hundredth for reporting.",
  "As a conservative K, since holding the value up at 0.120000 rather than letting it fall gives a smaller settling velocity and a larger vessel.",
  "As the derated value with its sign corrected, because a negative settling coefficient is an arithmetic artefact of the rule rather than a statement about the vessel."],
 "A linear rule extrapolated far enough produces a negative number, which is the clearest signal that it is being used outside the range anybody intended. The floor is a guard rail and 0.120000 has no derivation behind it here.")

q(3, "A vendor supplies K as an override and the engine returns source typed with derated false and floored false. What does the engine do about the table value at that pressure?",
 "Nothing at all: it never compares the two and raises no warning when they are far apart.",
 ["It records the table value beside the override so a reviewer can see both, which is what the derated and floored flags are reporting as false on that row.",
  "It refuses an override that sits more than one derating step away from the table value at that pressure, which is the guard that keeps a typed K honest.",
  "It applies the pressure derating to the override as well, so a typed K of 0.28 falls by 0.01 per 100 psi above 100 psig in the same way a table value does."],
 "An override wins outright and says so. A vendor K of 0.9 would be taken silently, which is why an override belongs in a report beside the pressure it was quoted for.")

q(0, "A horizontal vessel needs a droplet settling velocity for its gas length. What does this engine use, and why is that held?",
 "It uses the Souders-Brown velocity at the horizontal K, which was written to say what velocity a gas may carry without lifting liquid out, and that packaging has not been read against a published method.",
 ["It uses the Stokes velocity of the smallest droplet in the specification, which is held because the field constant 1.78e-6 sits four parts in a thousand below the SI derivation on every one of the three published Stokes cases.",
  "It uses the gas velocity in the gas space, which is held because the gas area depends on a liquid level somebody typed in rather than measured.",
  "It uses a settling velocity measured on the published cases, which is held because all of those cases are synthetic rather than measured on a separator."],
 "The two quantities are related and they are not the same. Until the published method is read, the gas length and everything drawn from it are held.")

q(2, "The engine gate pins that the gas length can never exceed the gas height. What follows from that, and what would have to be re-read if the literature moves the packaging?",
 "Gas can control only a vessel that is gas overloaded or shorter than its own diameter; the gas length, that claim and that observation would all have to be re-read together.",
 ["That a horizontal vessel is always liquid controlled, and only the published cases would have to be re-run if the packaging moved, since the engine gate pinning the ratio at 1 would still hold whatever the literature says.",
  "That the gas margin can never fall below 1, and the margin table across the ABANA-2 family would have to be recomputed if the settling velocity were defined from a droplet diameter instead of from the Souders-Brown packaging.",
  "That the gas length is always shorter than the liquid length, and the controlling field would have to be re-read while the two lengths themselves would stand."],
 "The gas length is the velocity ratio times the gas height, and the capacity rule caps that ratio at 1. Every published case where gas controls is a case where gasCapacityOk is false.")

q(1, "gasOverloaded6ftGasControls runs a gas velocity of 2.829421 ft/s against a settling velocity of 0.500000 ft/s. What is the honest reading of that vessel today?",
 "That it is gas overloaded, with a margin of 0.176715 and gasCapacityOk false, which is a result from the capacity comparison rather than from the borrowed packaging.",
 ["That its gas length of 16.976527 ft is the design length for the duty, since the gas requirement is the larger of the two lengths on that row and the engine reports it as the controlling requirement.",
  "That its settling velocity of 0.500000 ft/s is too low to be trusted, because a figure that round is a placeholder rather than a Souders-Brown velocity computed at the horizontal K of the mist extractor.",
  "That the vessel is too short, since a gas length of 16.976527 ft against a gas height of 3.000000 ft is the ratio the capacity rule caps at 1."],
 "The margin is a real result. The gas length of 16.976527 ft depends on the held packaging, so a conclusion drawn from it carries that premise with it.")

q(3, "A layout report quotes 90.0000 m between a flare and a control room and 64.6458 m of flare setback. What separates those two figures?",
 "One is a table value somebody recorded and one is computed from 828000.0000 kW of heat release.",
 ["One is measured on the site at the datum of the plan and one is computed from the duty, so the first moves whenever the survey is redone and the second stays where it is.",
  "One is a radiation figure and one is a spacing figure, and the layout check compares the two kinds against different distances, centre to centre against edge to edge.",
  "One is held for the literature and one is not, since the API 521 allowable of 4.730000 kW/m2 that produced 64.6458 m is a checked publication with a source behind it."],
 "Change the relief rate, the heating value or the allowable and the setback moves. Change nothing and 90.0000 m stays 90.0000 m, because it was never a function of anything.")

q(0, "The engine carries four API 521 radiation levels with words attached, from 1.580000 kW/m2 for continuous exposure up to 9.460000 kW/m2 for seconds only on an escape route. How should those labels be used?",
 "As recorded values with no source checked, so the allowable chosen for a calculation is an input somebody has to stand behind and the wording beside it is a convenience.",
 ["As the four allowables the engine will accept, since a setback computed at any other level is refused with a message naming the allowable input as one that has to be picked from the published set.",
  "As checked publication values, which is why the flare setback of 64.6458 m computed at 4.730000 kW/m2 can be quoted without qualification.",
  "As a ranking of severity, so the level chosen follows from how long people are expected to stay rather than from any site standard."],
 "The levels and their wordings are recorded rather than verified. The computed half of a setback moves with its duty, and the level it was computed against is a decision.")

q(2, "The spacing table returns null for a tank beside a skid. What is the right handling, and what is the temptation?",
 "Carry it as an unknown pair and put the question to whoever owns the site standard; the temptation is a zero, which claims no separation is required.",
 ["Substitute the nearest comparable pair from the table, such as the 15.000000 m recorded between a separator and a tank, and note the substitution in the report.",
  "Treat the pair as skipped, since an item the table cannot score is an item the layout check could not reach and belongs in the skipped list with a reason.",
  "Compute a setback for it from the duty of the nearer item, which is what the engine does for a flare or a pool fire when no table figure exists."],
 "ERHA reports 12 unknown type pairs from one skid, and a flow meter, a pig launcher or a booster package returns null the same way. Complete is false on almost any real plot for that reason.")

q(1, "Every published case in this course is synthetic. What can that kind of golden prove?",
 "That two implementations written by different people in different unit systems agree on the arithmetic, which catches a slip or a dropped conversion and cannot catch a method that is wrong in both files.",
 ["That the engine reproduces measured separator performance within the tolerance each case carries, since the oracle was written from the same physics in SI units where the engine works in field units, which is the cross-check the golden set was built to make.",
  "That the engine is correct wherever the two agree and in doubt wherever they do not, which is why the Stokes ratio of 1.004184 is recorded as an open question.",
  "That the published cases cover the domain, since an oracle can be run at any conditions and the cases were chosen to span the range the engine is used in."],
 "If the physics being encoded is the wrong physics, the oracle agrees with the engine and both are confidently wrong together. Agreement between two implementations is evidence about arithmetic.")

q(3, "The four distance cases agree exactly across haversine, Vincenty and the chord, at 89.4099 m, 489.2584 m, 55.5975 m and 1111.9508 m. What does that establish?",
 "That the distance arithmetic is sound at site scale, and nothing at all about whether the coordinates match the steel.",
 ["That the earth radius the engine uses is the right one for a site plan, since three separate methods built on it return the same figure at four different latitudes.",
  "That a site plan can be treated as a flat grid at these distances, which is why the chord and the two surface methods land on the same answer to four decimals.",
  "That the layout check will not produce a false breach, because the distances behind its 69 comparisons are exact to the precision the engine prints them at."],
 "Three methods agreeing to the printed figure is evidence about the arithmetic. A coordinate that was typed from a drawing rather than surveyed is a different question and no golden here touches it.")

q(0, "The Stokes oracle sits at 1.004184 times the engine on all three published cases. Why is that kept and stated rather than repaired?",
 "The field form with its constant of 1.78e-6 is what the standards and the vendor datasheets are written in, so the course keeps the form and carries the size of the gap, four parts in a thousand and always low.",
 ["Because the oracle is the approximation, since an SI derivation of g d2 dRho over 18 mu ignores the shape factor that the field constant absorbs.",
  "Because the gap is smaller than the tolerance any golden carries, so repairing it would move no published expectation.",
  "Because the two forms disagree only at large droplet sizes, where 0.320400 ft/s meets 0.321740 ft/s, and no verdict in the course is decided there."],
 "This is a stated convention with its size named rather than a held item. Any gate on droplet settling holds a tolerance wider than that, because a case cut fine enough could turn a verdict on the constant alone.")

q(2, "The DAK z factor refuses a gas at Tpr 0.848 and accepts one at Ppr 0.149 with a note. Why are the two treated differently?",
 "Outside the validity range of 1.000000 to 3.000000 in Tpr the answer would be an extrapolation and is refused; below the fit data at Ppr 0.200000 the surface runs to the ideal gas limit, which is where an ordinary low-pressure separator sits.",
 ["A refusal is reserved for a reduced temperature and a note for a reduced pressure, because the fit is a function of pressure alone once the temperature is inside its band.",
  "The cold case would have produced a negative z and the low-pressure case would not, so only one of the two could be returned as a number at all.",
  "The low-pressure case was accepted because a note is cheaper than a refusal on a common condition, and the cold case is rare enough to refuse outright."],
 "The accepted case returns z 0.986286 and a density of 0.317797 lb/ft3 with its note. A refusal is a golden too, because it records where the method stops.")

q(1, "A reviewer dismisses the whole golden set because every case is synthetic. What has that argument missed?",
 "Those cases caught real defects in this engine, and the constant Stokes ratio of 1.004184 is a finding that appeared only because two implementations were run side by side.",
 ["That the goldens are measured wherever a case carries a note, since a note records an observation from a separator rather than a figure from the oracle that re-derives the same physics in SI units.",
  "That a synthetic case can be run at conditions no separator has ever been operated at, which makes it stronger evidence than a measurement would be.",
  "That the distance cases are not synthetic, since haversine and Vincenty are published methods and their agreement at 89.4099 m is an external check."],
 "The mistake runs both ways. Reading a green suite as agreement with measured separator performance upgrades the claim, and dismissing the suite throws away the arithmetic evidence it does carry.")

emit(Q, '/root/fc-wip-separation/banks/fc1a_m05.json')
finish()
