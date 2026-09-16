import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Expert final exam, 42 questions across the six Expert modules.
# Most questions need two modules at once: geometry with verdicts, verdicts
# with the sweep, the sweep with the held items, the layout with provenance.

q(0, "On lowLevelSmallOilDropCarryunder the retired chord rule handed the carryunder check a water layer of 0.617770 ft where the exact interface sits at 1.249328 ft. What was that worth on that one case?",
 "The rising oil drop was timed across less than half the water the drum holds, so the crossing came back shorter than the vessel makes it, and the reported verdict still did not move.",
 ["The drop was timed across more water than the drum holds, so the check was the conservative one and the vessels it failed would in fact have separated.",
  "The reported carryunder verdict on that case went from false to true, which is the disagreement that exposed the chord rule in the first place.",
  "Nothing on that case, because the retired layer was divided into the retention volume and the droplet checks always read the exact interface."],
 "Every retired figure sits below its exact one and the direction never varies. The oil layer on the same case is 1.750672 ft against a retired 1.544424 ft, thin the same way.")

q(2, "AGBAMI at 10.000000 ft needs 12.311666 ft of length, and the same 10.000000 ft diameter appears in the family as a row of slenderness 1.231167. What does that pairing tell a reader about the vessel the tier has been sizing?",
 "It is a working drum that the band of 3.000000 to 5.000000 excludes on shape alone, and the family prefers 7.000000 ft instead.",
 ["It is the preferred vessel of the family, since the studio sized the stream at 10.000000 ft and the sweep confirms that choice at a slenderness of 1.231167.",
  "It is infeasible, because a slenderness of 1.231167 is outside the band.",
  "It is a different vessel from the one the family swept."],
 "The 10.000000 ft row is feasible with ld-out-of-band alone at 12.311666 ft of length. The preferred row is 7.000000 ft at 25.125850 ft and a slenderness of 3.589407.")

q(1, "Tighten the AGBAMI water specification to 150.000000 micron and the whole family returns preferred null with status none-feasible. Which two facts have to be put together to explain that?",
 "A droplet verdict gates feasibility, and at 0.001575 ft/s the drop needs 1238.6620 s against 300.0000 s of residence in the vessel the retentions size.",
 ["The band of 3.000000 to 5.000000 excludes the rows that clear the tighter specification, and the sweep reports none-feasible whenever the surviving rows are out of band.",
  "Every row lengthens under the tighter specification until its slenderness leaves the band, and a family with no row in band reports none-feasible.",
  "The tighter specification lowers the gas margin on every row, and gas-capacity is the reason that gates feasibility on a three-phase family."],
 "Each row keeps its length and slenderness and each gains water-carryover. A vessel that carries water into the oil outlet has not separated the stream, whatever its shape.")

q(3, "A sweep returns preferred null and a layout returns pass null. What do the two nulls have in common, and where do they differ?",
 "Both carry a status word that says which situation produced them, and one is about vessels while the other is about comparisons that were never made.",
 ["Both mean the calculation was refused, and they differ only in which input was missing when the refusal was raised by the engine.",
  "Both mean nothing qualified, and they differ in that a null preferred diameter can be recovered by widening the band while a null pass cannot be recovered at all.",
  "Both are rendered as blanks by any caller, and they differ in that one of them is accompanied by a warning string while the other is silent."],
 "preferredStatus reads none-feasible or none-in-band; passStatus reads nothing-checked. A blank cell loses the distinction, and the two nulls call for different work.")

q(0, "worstAbsolute on ERHA is 43.8223 m short of a table figure of 90.0000 m. What has to be said about that finding when it is escalated?",
 "That the requirement behind it is a recorded table value with no source checked, so the shortfall is real and the distance it is measured against is a figure a site standard may replace.",
 ["That the shortfall is the largest on the plan and the requirement is computed from the flare duty of 828000.0000 kW.",
  "That the pair also appears in the relative ranking, where 0.486914 is the largest fraction reported.",
  "That the figure is provisional because complete is false on that plan."],
 "The same station carries a computed flare setback of 64.6458 m that moves with its duty. A breach against a table figure and a breach against a computed setback are findings of different kinds.")

q(2, "A three-phase verdict clears by 111.4796 s against 300.0000 s. How does the stated Stokes convention of 1.004184 bear on that result?",
 "It does not change the verdict, because four parts in a thousand of either figure is nowhere near the gap between them.",
 ["It widens the crossing time to the oracle figure, which is the value any published verdict should be quoted at once the field form has been converted.",
  "It halves the margin, since the ratio applies to the velocity and the crossing time goes as the square of it in the field form of the law.",
  "It makes the verdict unquotable, since the constant is unchecked."],
 "The convention matters only where a crossing time and a residence time nearly meet. Its size is stated so that a gate on droplet settling can hold a tolerance wider than it.")

q(3, "A row in a sweep is infeasible with reason gas-capacity. How much of that verdict rests on the held Souders-Brown packaging?",
 "The margin comparison itself is a real result; the gas LENGTH that the same packaging produces is the part that is held.",
 ["All of it, since the margin is the gas velocity over the Souders-Brown velocity and both halves of that ratio come from the held packaging.",
  "None of it and none of the gas length either, because the capacity rule and the length requirement are computed from the gas area rather than from a settling velocity.",
  "Only the sign of it, because the packaging decides which side of 1 the margin falls on."],
 "gasOverloaded6ftGasControls runs 2.829421 ft/s against 0.500000 ft/s for a margin of 0.176715. The honest reading of a gas-controlled horizontal vessel today is that the vessel is gas overloaded.")

q(1, "Put the three-phase steps in the order the engine performs them.",
 "The retentions give the share, the share gives an area, the area inverts to an interface, the layers follow, and the verdicts come last because they need the sized vessel.",
 ["The interface is placed first from the liquid level, the layers follow from it, the retentions then set the length, and the verdicts are taken against the retention times.",
  "The verdicts are taken first to establish feasibility, then the share and the interface, and the length is computed last from whichever phase controlled.",
  "The length comes first from the liquid retention volume, the areas follow from it, and the share and the interface are read back from the areas."],
 "AGBAMI holds 0.516129 of its liquid area as water, which places the interface at 3.049149 ft under 1.950851 ft of oil, and the verdicts are compared against residences the length produced.")

q(0, "Two published layouts sit either side of the line: s3SkippedItemPassesButIncomplete reports complete false with pass true, and s3ZeroRequirementPairOnly reports complete true with pass null. What does the pair establish?",
 "That the two fields are independent: one cleared every comparison it made while an item was skipped, and the other was fully judged with nothing in it to clear.",
 ["That pass is computed only where complete has come back true, so the pass true on the first case is the residue of a verdict the engine ought to have withheld once it knew an item on the plan had been skipped.",
  "That a zero-requirement pair leaves a layout incomplete, which is the reason the second case comes back with pass null rather than with the pass true that its single unbreached pair would otherwise have earned it.",
  "That a skipped item is the only thing able to make complete false, so the 12 unknown type pairs that ERHA reports beside its 69 checks leave the complete flag on that plan exactly where it stood."],
 "The first is checked 3 with one item whose coordinates could not be read. The second is checked 0 with one zero-requirement pair, complete true and passStatus nothing-checked.")

q(2, "Two retired behaviours failed open in different parts of the engine: droplet verdicts on a NaN gravity, and a layout that passed with nothing checked. What is the shared shape?",
 "An absence of information rendered as a positive result, which is quiet, where a defect that fails closed announces itself the first time somebody runs it.",
 ["A number computed from an input that was out of its domain, which is why both were repaired by adding a domain check on the input rather than on the output.",
  "A default substituted for a missing figure, which is why FC1-0 replaced both defaults with refusals that name the input they want.",
  "A boolean returned where a status word was needed, which is why both now return null with a reason attached to them."],
 "waterCarryover false is the word for a vessel that passed, and pass true on s3AllUnplacedNothingChecked was reported beside checked 0.")

q(1, "A report quotes a preferred diameter of 7.000000 ft for ABANA-2 and a pass true for the plot it will stand on. What is missing from each half?",
 "The band the preference was taken in with its status word, and the completeness reading beside the pass.",
 ["The slenderness of 4.342025 and the count of 69 checks, which are the two figures a reviewer compares the headline answers against on any package.",
  "The droplet specification and the datum of the plan, because a preference and a distance are both meaningless without the reference they were taken against.",
  "The reason list on the preferred row and the zero-requirement count, since those two are what turn a bare answer into a finding somebody can act on."],
 "7.000000 ft in a band of 3.000000 to 5.000000 and a null in a band of 4.000000 to 5.000000 are two honest answers, and a pass with complete false was judged on the comparisons that could be made.")

q(3, "Pinning the AGBAMI water share at 0.300000 returns 8.510368 ft for the oil and 21.181362 ft for the water, and names the water in retentionPhase. What does that field add to the two lengths?",
 "It names the phase whose retention bought the reported 21.181362 ft, so anyone shortening the drum knows whose holding time is being spent.",
 ["It names the phase whose retention time was typed as the longer of the two, which restates an input the caller already had.",
  "It names the phase that will leave through the wrong outlet first, so water there is the carryover verdict under another name.",
  "It records that the split was pinned rather than proportional, which is why a proportional run leaves it null."],
 "The two lengths say how long each phase wants the vessel to be. The field says which of them won, and a proportional run leaves it null because the two agree inside 1e-9.")

q(0, "Why does complete come back false on almost any real plot, and what should a reviewer do with that?",
 "The spacing table has no entry for a flow meter, a skid, a pig launcher or a booster package, so one modern item produces unknown pairs; the reading is to treat complete as a pointer at the skipped list and the unknown pairs and then judge whether the remainder matters.",
 ["The layout check counts only positive requirements, so a plot with many zero-scored valve pairs is reported as incomplete until those pairs are given a distance.",
  "Any plan with a radiation source produces a skipped item, because a source has to be placed twice, once as an item and once as a duty.",
  "Complete is false whenever any comparison fails, so a plot with breaches on it can never be reported as complete."],
 "ERHA reports 12 unknown pairs from one skid. Two skipped items that are a spare tank and a redundant source are a different remainder from two that are the flare and the control room.")

q(2, "Four items in this course are held for the literature. Which of the following is one of them?",
 "The horizontal use of the Souders-Brown velocity as the droplet settling velocity in the gas length requirement.",
 ["The DAK correlation for the z factor, which is why the engine refuses a reduced temperature outside 1.000000 to 3.000000 rather than extrapolating into it.",
  "The exact inversion of the segment area to an interface depth, which is bisected 100 times and has not been checked against a closed form solution.",
  "The retention-proportional split of the liquid cross-section."],
 "The four are the K derating with its 0.120000 floor, the borrowed settling velocity, the API 521 labels and the spacing table figures. A held item may be taught as a limit and never as an answer.")

q(1, "At 150.000000 micron the AGBAMI 7.000000 ft row reads inRange true, feasible false, reasons water-carryover. What does that combination say to a designer?",
 "The shape is right and the separation is not, so the work is on the stream, the specification or the internals rather than on the band.",
 ["The band is wrong for this duty, because a row that is in range and infeasible is the signature of a band that admits vessels the family cannot deliver.",
  "The row is the one to order, since it is the only row still in range.",
  "The sweep is inconsistent, because a row cannot be in band and infeasible."],
 "inRange and feasible are independent. Every row in that family carries water-carryover, so preferred is null with status none-feasible whatever the band says.")

q(3, "A row carries reasons water-carryover and ld-out-of-band. Which objection can be answered by changing an input to the sweep, and which cannot?",
 "The band is an input and can be argued with; the carryover is a statement about the vessel.",
 ["Both can be answered by changing an input, since the droplet specification is as much an input to the sweep as the band is and either one moves the reason list.",
  "Neither can be answered by changing an input, because both reasons are computed from the stream and the drum and neither depends on anything the caller supplies.",
  "The carryover can be answered by widening the band until the row falls outside it, and the slenderness objection cannot be answered at all."],
 "Widening a band can move a preference between qualifying vessels and can remove a preference, and it can never make an infeasible row feasible.")

q(0, "A works order lists the two ERHA rankings and a set of droplet verdicts. Which statement about reporting holds for both?",
 "A single headline answer is not enough in either place: one ranking hides the other, and one verdict without its droplet size hides the specification it was taken at.",
 ["Both should be reported as fractions, since a shortfall of 0.597753 and a crossing time against a residence are both ratios at heart.",
  "Both should be escalated on the largest absolute figure, which is 43.8223 m on the plot and 1238.6620 s in the vessel.",
  "Both are provisional until the held items behind them are read against the literature."],
 "worstAbsolute names the flare pair and worstRelative the pump pair, and waterCarryover false at 500.000000 micron becomes true at 150.000000 micron on the same drum.")

q(1, "Which figure in an Expert package would move if the duty behind it moved?",
 "The flare setback of 64.6458 m, which is computed from 828000.0000 kW of heat release.",
 ["The table requirement of 90.0000 m between a flare and a control room, which is scaled by the engine from the heat release of the flare it is measured against.",
  "The oil residence of 300.0000 s under the proportional split, which is recomputed from the vessel each time the retention volume changes.",
  "The spacing of 3.000000 m between two pumps, which the engine raises with the rate the pumps carry."],
 "A computed figure moves when its duty moves and a copied figure never moves. The 21 zero-requirement pairs on ERHA are table figures of 0.000000 m for the same reason.")

q(2, "A three-phase family is swept and the engineer widens the band to bring in more rows. On which of the two null statuses can that possibly help?",
 "none-in-band, where feasible vessels exist and the band is excluding them on shape.",
 ["none-feasible, where a wider band admits rows the narrow one excluded and one of them may clear the verdicts once it is judged.",
  "Both of them, since a wider band changes the reason lists and a row whose only remaining reason is removed comes back feasible.",
  "Neither of them, because the band is compared against a slenderness and a slenderness cannot be changed by an input at all."],
 "The AGBAMI family at 500.000000 micron in a band of 4.000000 to 5.000000 is all feasible and all out of band. The same family at 150.000000 micron is infeasible in any band.")

q(3, "The ERHA bund gives 59.5294 m from the pool centre and 50.5294 m from the pool edge. Why does the difference of 9.0000 m matter to a layout check?",
 "The layout check measures centre to centre, so passing it the edge figure makes it short by half the bund.",
 ["The two figures apply to different allowables, so a check run against 50.5294 m is using a level the site standard has not approved for continuous exposure.",
  "The edge figure is the conservative one, so a check run against the centre figure would report breaches that the plan does not actually have on it.",
  "The difference is the flame height correction, which is applied only where the point source model is being used inside the flame."],
 "That was the defect the Suite layer carried. The pool is 18.000000 m across and the tank icon on the plan is the pool centre, so every pair measured against the bund was handed a requirement 9.0000 m too small.")

q(0, "A vessel is sized, its verdicts clear and its plot reports pass true with complete false. What may be concluded?",
 "That the comparisons somebody was able to make all cleared, and that the review has a remainder which has to be read before the package is signed.",
 ["That the plot is acceptable, since pass is the field that reports the result and complete reports only how the review was carried out by whoever ran it.",
  "That nothing may be concluded, because a plan that is not complete has not been judged and its pass field is not meaningful.",
  "That the vessel may be ordered and the plot re-run, since a pass on an incomplete plan is always superseded by the next run."],
 "s3SkippedItemPassesButIncomplete reports 3 checks cleared with one item skipped for bad coordinates. The skipped list is the place to look before signing.")

q(1, "On ABANA-2 the band widens from 3.000000 to 5.000000 out to 3.000000 to 7.000000 and the preference holds at 7.000000 ft. What would have happened under the retired rule, and why does that matter beyond the sweep?",
 "It would have moved to the 6.000000 ft row, which cannot carry its gas, so a preference about shape would have changed an engineering answer.",
 ["It would have held at 7.000000 ft as well, since the retired rule also compared rows by diameter once more than one of them was inside the band.",
  "It would have returned null, because the retired rule refused to answer when a band change brought a new row into range.",
  "It would have moved to the 8.000000 ft row, which is feasible and which comes into range as the band widens toward its slenderness of 2.908817."],
 "The 6.000000 ft row is inRange true, feasible false, reasons gas-capacity at that band. A rule that takes the first row in band lets an input about shape overrule a physical test.")

q(2, "One figure in a proportional three-phase result was typed into the input form before the run and printed back out after it. Which one?",
 "The oil residence of 300.0000 s on the proportional AGBAMI case.",
 ["The interface of 3.049149 ft, which is the depth the water share of 0.516129 was pinned at by the person who set the controller.",
  "The water share of 0.516129, which is the water cut of the stream arriving at the inlet of the vessel.",
  "The requirement of 12.311666 ft, which is the length that was typed into the sweep as the vessel the vendor had quoted."],
 "The proportional split gives both phases the same length, so the residences come back as the 5.000000 minutes and 8.000000 minutes that were typed in.")

q(0, "A reviewer asks why the course teaches the K derating at all if it is held. What is the answer?",
 "Because it moves every dimension below it and a reader has to know what produced the number, while the number itself carries the uncertainty of a rule of thumb rather than the precision of its six decimals.",
 ["Because the derating is checked at the table values and unchecked only at the floor, so the taught part is the half that has a source behind it.",
  "Because a held item becomes an answer once a course teaches it, which is how the four held items are cleared one by one.",
  "Because the derating is the only part of the chain a vendor cannot override, so a designer has to work it by hand."],
 "A vertical mesh pad falls from 0.350000 to 0.300000 at 600.000000 psig, and the settling velocity, the diameter, the margin and the feasibility of every row move with it.")

q(3, "A vessel is sized behind a mist extractor whose derated K sits a little above the floor, and the family it is swept in returns a preferred diameter. What has to travel with that preference?",
 "That the K is a rule of thumb held for the literature: verticalNoneAt650psig sits 0.005000 above the floor of 0.120000 with nearFloor true, and the gas margin on every row came from it.",
 ["Nothing beyond the band it was swept in, since the K enters through the settling velocity and the gas margin printed on each row has already carried it into every feasibility flag the family reports.",
  "The oracle ratio of 1.004184, because a K taken from the derating rule sits four parts in a thousand below the SI derivation in the same way the field form of Stokes law does on every published case.",
  "The floored flag, which comes back true on any K this close to 0.120000 and marks the value as chosen rather than computed."],
 "verticalNoneAt650psig returns K 0.125000 with derated true and floored false, which is 0.005000 above the floor and 50 psi of operating pressure away from being floored. The derating and the floor are held, so the uncertainty of the rule travels with every row the family reports.")

q(1, "A carryunder result and a preferred diameter both come from a run made before FC1-0. What is the right handling of each?",
 "Re-run both, because one was measured against a chord-rule layer and the other may be a vessel that was merely first in the list or could not carry its gas.",
 ["Keep the carryunder result and re-run the preference, since the droplet arithmetic was never in question and only the sweep rule changed in the FC1-0 repairs.",
  "Re-run the carryunder result and keep the preference, since a preferred diameter is a recommendation rather than a computed figure and does not expire.",
  "Keep both and mark them provisional, since neither repair changed a number and both changed only how the answer is reported to a caller."],
 "Neither needs new physics. They need the same cases run again through the repaired engine and the answers compared.")

q(2, "What makes the pairing of the two ERHA rankings a judgement rather than a calculation?",
 "The engine returns both and names neither the worst, so somebody has to decide whether 43.8223 m of missing plot or 0.597753 of a small requirement leads the works order.",
 ["The rankings are computed from different quantities and the engine combines them into a single index that a reviewer then interprets before any works order is written.",
  "Only one of the two is computed, since worstRelative is a fraction of a table figure and a table figure is recorded rather than calculated, with no source checked.",
  "The rankings disagree only on plans where a computed setback and a table figure are both breached, so the judgement is about which requirement to trust."],
 "A fraction has no size in it and a shortfall in metres has no sense of proportion in it. Two pumps 1.7933 m short are a day of steelwork; a control room 43.8223 m short is a different plot.")

q(0, "A three-phase sizing call is made with no oil viscosity. What comes back, and what would have come back before FC1-0 had the oil gravity been the missing input instead?",
 "A SeparatorInputError naming muOilCp comes back now, and a missing gravity used to produce two droplet verdicts of false from comparisons against NaN.",
 ["An error object naming the viscosity comes back now, and a missing gravity used to throw on sgOil in the same way, so the two inputs have always been handled identically.",
  "A vessel sized without droplet verdicts comes back now, and a missing gravity used to do the same thing.",
  "A refusal comes back in both cases, since the repair made every missing input throw and the two behave identically."],
 "A verdict for an input the engine could not read is a verdict that says nothing, and false is the word this engine uses for a vessel that passed.")

q(3, "Why can a three-phase row be infeasible while its two-phase neighbour at the same diameter is not?",
 "A droplet verdict gates feasibility on a three-phase row and there is no such verdict on a two-phase one.",
 ["Because a three-phase row is sized from two retention volumes rather than one, so its length is always the larger and its slenderness always further outside the band.",
  "Because the gas capacity rule is applied to the gas space above two liquids rather than one, which lowers the margin on any three-phase row at a given diameter.",
  "Because the interface inversion adds an error to the length."],
 "The reason vocabulary is gas-capacity, ld-out-of-band, water-carryover and none. water-carryover appears on the AGBAMI family at 150.000000 micron and on horizontal3DropletVerdictsGateFeasibility.")

q(1, "The distance cases agree exactly across three methods and the Stokes cases disagree by a constant. Why are both results useful?",
 "Exact agreement says the distance arithmetic is sound at site scale, and a constant ratio of 1.004184 rules out a slip and points straight at a packaged constant.",
 ["Exact agreement proves the coordinates on the plan are correct, and the constant ratio proves the field form of Stokes law is the one the standards intend.",
  "Exact agreement shows the goldens are measurements, and the constant ratio shows the engine carries a defect that is small enough to leave in place.",
  "Both show the oracle and the engine were written by the same method, which is what a golden set is built to demonstrate."],
 "A slip in the working would wander with the inputs. The distance figures are 89.4099 m, 489.2584 m, 55.5975 m and 1111.9508 m across haversine, Vincenty and the chord.")

q(2, "A designer lowers the interface on AGBAMI to cure a carryover and then re-runs the sweep. Which two results have to be read again?",
 "Both droplet verdicts, because the water layer thickened while the oil layer thinned, and the family, because a row whose verdict turns changes its feasibility.",
 ["The gas margin and the slenderness, because moving the interface changes the gas area and therefore the length the drum needs once the level has moved with it.",
  "The retention lengths alone, because the layers set the two phase lengths and nothing else in the result depends on where the interface sits once the drum is fixed.",
  "The preferred diameter alone, because a verdict that turns removes a row from the family and the preference is the only field that can move."],
 "AGBAMI holds 1.950851 ft of oil over 3.049149 ft of water and the two verdicts pull in opposite directions. A row carrying water-carryover comes back feasible false.")

q(0, "What does a sweep report about a row it has judged infeasible?",
 "Everything it reports about any other row: the length it would need for its liquid, its slenderness, both flags and the full reason list, because a reader is entitled to see the shape of the problem.",
 ["Only the reason it failed, since a length for a vessel that does not work would be misleading in a table a reviewer may read quickly.",
  "The length and the reason, but no slenderness, since a slenderness is meaningful only for rows that could be ordered.",
  "A null row with its diameter, which is how the sweep marks a vessel that cannot carry the duty it was given."],
 "On ABANA-2 the 5.000000 ft row reports 59.572579 ft at a slenderness of 11.914516 with both flags false. A reader who filters the sweep loses the fact that the two smallest diameters failed on gas.")

q(1, "On gasOverloaded6ftGasControls the retention asks 0.689497 ft and the vessel comes back at 16.976527 ft with the controlling requirement gas. If the literature check moves the borrowed settling velocity, which of those two figures moves with it?",
 "16.976527 ft, because a gas-controlled length is computed through the velocity held for the literature, while 0.689497 ft is a volume over an area.",
 ["Both of them, since the borrowed settling velocity fixes the liquid area that the retention volume is divided by, so a move in the packaging carries 0.689497 ft along with the gas figure.",
  "0.689497 ft only, because a retention length is where a settling velocity enters a three-phase vessel and a gas length is fixed once the bore and the level are typed.",
  "Neither of them, because the case is published as a golden and a golden expectation is frozen by the file it lives in whatever the literature check later decides."],
 "A gas length is a velocity ratio carried onto a height, so it reads the borrowed velocity twice over. A retention length reads a volume and an area and no velocity at all.")

q(3, "The ERHA plan carries one chemical injection skid, a tank whose coordinates cannot be read and a radiation source that was never placed. What does the layout check do with the three of them?",
 "It records 12 unknown type pairs and 2 skipped items with their reasons, and it judges the rest of the plan.",
 ["It refuses the whole layout with an error object, because a list containing an item it cannot place is not a list of placed items in the sense the check requires.",
  "It scores the unknown pairs at zero so the plan can be judged, and it counts the two skipped items among the zero-requirement pairs for the same reason.",
  "It drops the three items and reports complete true on what remains, since a plan judged on the items that were placed is complete for those items."],
 "ERHA reports exactly that and still makes 69 comparisons. The skipped list does not invalidate the checks that were made; it says the review has a remainder.")

q(2, "Which pair of figures in an Expert answer must never be quoted as though they were the same quantity?",
 "The gas-liquid chord of 10.000000 ft and the oil-water interface of 3.049149 ft, one a width across the drum and one a depth from the bottom of it.",
 ["The interface of 3.049149 ft and the water layer of 3.049149 ft, which are printed as the same number and describe different things in the engine's return.",
  "The liquid level of 0.500000 and the water share of 0.516129, which are both fractions and are both applied to the cross-section.",
  "The length of 12.311666 ft and the retention length of 12.311666 ft, which agree on a proportional case and diverge on a gas-controlled one."],
 "Both are horizontal lines in the same drawing, which is why the chord was taken for the interface before FC1-0. Neither is available as a substitute for the other.")

q(0, "What does the retired sweep rule and the retired layout rule have in common?",
 "Each returned a confident answer where the honest answer was that nothing qualified: a diameter where no row was feasible, and a pass where no comparison had been made.",
 ["Each ignored an input the caller had supplied, the band in one case and the spacing table in the other.",
  "Each reported the right answer in the wrong field, which is why both repairs were changes to the return shape.",
  "Each failed closed, so both produced alarms that sent engineers back to re-run cases that were sound."],
 "verticalNoneFeasible preferred 3.000000 ft under the retired rule and returns none-feasible now. s3AllUnplacedNothingChecked reported pass true with checked 0.")

q(1, "AGBAMI as sized holds the oil 300.0000 s, and a 500.000000 micron water drop crosses the 1.950851 ft oil layer in 111.4796 s. A specification of 250.000000 micron settles that drop at 0.004375 ft/s. What happens to waterCarryover?",
 "It turns true, because a quarter of the speed is four times the 111.4796 s crossing and the oil is held only 300.0000 s.",
 ["It stays false, because 0.004375 ft/s still carries the drop through 1.950851 ft inside the 300.0000 s the oil is held.",
  "It turns true and takes oilCarryunder with it, because one specification governs both drops and 217.8010 s lengthens in the same proportion.",
  "It is unchanged and the drum lengthens instead, because the engine raises the oil retention until the crossing fits inside it."],
 "Velocity goes as the square of the diameter, so halving the drop quarters the speed and quadruples the crossing. At 150.000000 micron the same reading gives 1238.6620 s against 300.0000 s and the warning fires.")

q(3, "What is the honest way to report a vessel sized with a vendor K?",
 "State the K, the pressure it was quoted at, and that nothing reconciled it against the table.",
 ["State the K and the derated table value beside it, since the engine returns both on an override so that a reviewer can compare them at that pressure.",
  "State the K alone, since an override wins outright and the table value at that pressure has no bearing on the vessel that was sized from it.",
  "State the K and the floor of 0.120000, since the floor is the only part of the table that still applies once an override has been supplied to the engine."],
 "An override returns source typed with derated and floored both false, and no warning is raised when a typed K sits far from the table.")

q(2, "A layout reports 69 checks and a sweep reports six rows. What do the two counts have in common as headline numbers?",
 "Each depends on what was put in front of the engine, so a bigger count is not a better review or a better family.",
 ["Each is a count of results that passed, so the two can be compared directly against the counts of what failed.",
  "Each is fixed by the engine rather than by the caller, so the two are the parts of a package a reviewer does not have to check.",
  "Each is reported without a status word, which is why both need a second field beside them before they can be read."],
 "Adding relief valves adds pairs to a plan and adding diameters adds rows to a family. ERHA carries 21 zero-requirement pairs beside its 69 checks.")

q(0, "The retired Suite layer handed the layout check the pool setback of 50.5294 m measured from the bund edge, where the requirement at the tank is 59.5294 m. What did that cost on the crude tank to heater treater pair?",
 "The pair reads 9.3696 m short of the real requirement and only 0.3696 m short of the retired one, so the defect showed as a smaller number rather than as a pass.",
 ["The pair clears the retired figure outright at 50.1598 m against 50.5294 m, so the retired reading turned that breach into a pass and left the plot with 5 to report.",
  "The pair reads 9.3696 m short either way, because the half bund falls out of a shortfall measured between the same two items on the same plan.",
  "The pair is untouched, because a heater treater beside a tank is scored from the table at 30.000000 m rather than against a computed pool setback."],
 "Every row of that comparison differs by the 9.0000 m half bund. Judged the retired way the plot still fails, 6 breaches against 6, so a reviewer saw 0.3696 m where the real shortfall is 9.3696 m and no change at all in the count.")

q(1, "A three-phase result reports controlling liquid-retention with retentionPhase null, and a sweep row reports feasible true with ld-out-of-band. What do both pairs of fields illustrate?",
 "An answer and its qualifier travel together: one says which contest set the length and that no phase won inside it, and one says the vessel works and is not the shape that was asked for.",
 ["A defect in the reporting, since a null and a reason on an otherwise clean row are both artefacts of fields that FC1-0 added and did not populate.",
  "Two ways of reporting a tie, one between phases and one between a vessel and a band.",
  "A conflict between fields, since a controlling requirement with no phase and a feasible row with a reason each carry two statements that cannot both be true."],
 "The proportional split makes both phase lengths agree, so no phase is named. Slenderness is a preference about shape, so ld-out-of-band alone leaves feasible true.")

q(2, "Which of these would be a legitimate Expert answer of the form null with a reason?",
 "A preferred diameter on a family where every row carries water-carryover, reported as null with status none-feasible.",
 ["A vessel length on a drum whose liquid level was given as 1, reported as null because the level lies outside its range.",
  "A settling velocity for a droplet with no viscosity, reported as null with a reason naming the missing viscosity.",
  "An interface depth on a case where the water area exceeds the circle, reported as null with a reason about the area."],
 "The AGBAMI family at 150.000000 micron returns exactly that. A liquid level of 1 throws a SeparatorInputError, and a droplet with no viscosity and an area outside the circle come back as objects carrying an error string.")

emit(Q, '/root/fc-wip-separation/banks/fc1a_exam.json', expect_n=42)
finish()
