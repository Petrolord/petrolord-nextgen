import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional m02, the hydrocyclone. Digest Section 9 throughout, which
# Professional m02 owns. The bore direction here is the SECTION'S OWN
# STATEMENT and its derived invariant column, which settle a direction the
# lesson prose leaves open.

q(1, "Droplets entering a liner are spread across its cross section BY AREA. What follows for the droplet in the middle of the distribution?",
 "It enters at the half-area radius, 0.707106781187 of the bore radius, because half of the flow area sits inside that circle.",
 ["It enters at half of the bore radius, since equal radii carry equal volumes of water down the tube.",
  "It enters at the wall, because the tangential inlet delivers the whole feed against the outside of the liner.",
  "It enters at the oil core radius, which is where the module places the median of any feed it is given."],
 "Equal areas of the inlet carry equal volumes of water, so equal areas carry equal volumes of oil. That radius is a criterion rather than a stored constant, and the module never carries it as a choice.")

q(3, "How does this module get the residence time of one liner?",
 "The liner volume divided by the flow going through that one liner, which on the KOKORI bank is 0.000673478925 m3 over 0.000690049023 m3/s.",
 ["The liner length divided by the tangential velocity the inlet slot develops at that flow.",
  "The bank volume divided by the total flow through the vessel, since every liner in a bank is fed in parallel from one common header.",
  "The travel to the oil core divided by the rise velocity the same droplet would have under gravity alone."],
 "Nothing else enters it. The result is 0.975987 s, which is just under a second, and everything a de-oiling liner does it does inside that.")

q(0, "What distance does the module take the cut droplet to cross, and what fixes it?",
 "The gap from the half-area radius in to the oil core, which on the 0.035 m bore is 0.003624368671 m.",
 ["The full bore radius, since a droplet must reach the axis of the liner to be taken off in the overflow.",
  "The liner length of 0.7 m, which is the path the water follows as it spirals down the tube.",
  "The difference between the liner radius and the half-area radius, which is the outer half of the flow area."],
 "The travel is a radial distance, so the two radii that bound it are what set it. The half-area radius is a criterion and the core position is DECLARED, which makes one end of this gap a modelling choice.")

q(2, "A liner is lengthened from 0.5 m to 1 m at a fixed bore. What happens to the travel and to the cut size?",
 "The travel does not move at all, and the cut goes from 5.242462 micron to 3.706980 micron.",
 ["The travel and the cut both fall, because a longer tube brings the oil core closer to the wall along its length.",
  "Neither one moves, because length reaches the field and the gap alike.",
  "The travel rises with the length and the cut rises with it, from 3.706980 micron to 5.242462 micron."],
 "Lengthening a tube does not change its radius, so the radial gap is untouched. What a longer liner buys is residence time at the same travel, and the cut gets finer with it.")

q(3, "A designer widens the liner bore at a fixed length and a fixed flow per liner. Which way does the reported cut size go?",
 "Finer, and it goes as one over the square root of the bore.",
 ["Coarser, because a wider bore puts the wall further from the axis and the droplet has more to cross.",
  "Coarser at first and then finer, because the residence gain only overtakes the travel cost past the declared bore.",
  "It does not move, because the bore reaches the cut only through the field, and the field is fixed by the turndown."],
 "The residence goes as the SQUARE of the bore, because the liner volume does, while the travel from the half-area radius to the core goes only as the bore itself. The residence wins by exactly one power.")

q(1, "Why does the bore win for the residence rather than for the travel?",
 "Because the liner volume carries the bore squared and so the residence does, while the radial gap carries only one power of it.",
 ["Because the field rises with the bore as well, and the field and the residence together outweigh the extra distance.",
  "Because the migration velocity rises with the bore, so the droplet crosses a longer gap at a higher speed.",
  "Because a wider liner is held to run at a lower turndown, and a lower turndown buys a longer residence at the very same flow."],
 "Both effects are real and they pull opposite ways. Counting the powers is what settles it, and it settles it the same way at every bore rather than only at the sampled ones.")

q(0, "Across the bore sweep at a fixed length the field column reads 1322.687929 g on every row. Why?",
 "Because no dimension of the liner enters the field, which is set by the turndown alone.",
 ["Because the sweep was run at the ceiling, where the reported field cannot rise any further whatever the bore is.",
  "Because the bore raises the tangential velocity and lowers the radius by the same factor, so the field cancels.",
  "Because the field is DECLARED at 1000 g and the module scales it only with the liner count of the bank."],
 "The turndown is the flow through one liner over its design flow, and neither of those carries a bore. That is what makes the race in this sweep a race between the residence and the travel and nothing else.")

q(2, "The digest prints a derived column beside the bore sweep, the cut size multiplied by the square root of the bore. What does it read?",
 "0.828906 on every one of the five rows, across a tenfold span of bore from 0.01 to 0.1 m.",
 ["0.828906 on the declared bore alone, and it drifts away from that figure at the two extremes of the span.",
  "1.000000 on every row, because the column is normalised against the module's own declared bore of 0.035 m.",
  "It rises steadily with the bore, so the exponent is the stronger one."],
 "A derived column that holds still is a claim about the FORM of a relationship and it can be read by eye. A constant there says the cut goes as one over the root of the bore exactly.")

q(1, "Is there a bore at which a wider liner starts cutting coarser again?",
 "No, and that is a statement about the law rather than about the sampled rows, because one over a square root has no turning point.",
 ["Yes, and it sits just above the widest bore in the sweep, which is why the table stops at 0.1 m.",
  "Yes, at the bore where the cut droplet leaves the creeping flow band and the migration velocity stops rising.",
  "The module cannot say either way, because the sweep it printed covers only a tenfold span of bore and a turn could easily lie outside it."],
 "A sweep can only ever report the rows it walked. Here the exponent is exact and the derived column proves it, so the direction is settled for every bore and not only for the five that were printed.")

q(3, "The oil core is moved from 0.5 of the liner radius to 0.65. What does the module report?",
 "A travel of 0.000999368671 m and a cut of 2.326580 micron.",
 ["A travel of 0.006249368671 m and a cut of 5.817992 micron, since the gap widens as the core moves out.",
  "The same travel and the same cut, because the core position is a reporting convention rather than an input.",
  "A refusal, because a core past half of the radius leaves the median droplet with nothing to cross."],
 "Moving the core outward shortens the gap the median droplet has to make, so the liner appears to catch finer oil. The core position is DECLARED and has no published source here, so a reader moving it is moving a modelling assumption.")

q(0, "A caller asks for an oil core at 0.75 of the liner radius and the module REFUSES. What does the refusal rest on?",
 "That the core must sit inside the half-area radius or the median droplet starts inside it and has nothing to cross.",
 ["That the customary core fraction for a de-oiling liner lies between 0 and 0.7071 in the published literature.",
  "That a core that wide leaves too little annulus for the clean water to leave through at the design flow.",
  "That the cut size would fall below the creeping flow band, where the migration velocity is no longer honest."],
 "That is a criterion rather than a range check somebody chose. Past one over the root of two the question the model answers has stopped making sense, and the refusal quotes the reason rather than a limit.")

q(2, "How is the cut size of a liner defined in this module?",
 "As the droplet whose radial migration just crosses the travel in the residence time.",
 ["As the droplet at which the marched capture fraction first exceeds the oracle's own reported figure.",
  "As the droplet whose rise under gravity equals the surface loading.",
  "As the droplet where the declared sharpness of 3 gives one half."],
 "On the KOKORI bank the droplet has 0.003624368671 m to cross and 0.003713541683 m/s to do it in, and those two divide into the residence of 0.975987 s. The grade curve is what the train integrates afterwards and it plays no part in finding the cut.")

q(1, "The KOKORI bank reports a shear penalty of 1.000000. What does that tell a reader?",
 "That the ideal cut and the reported cut are the same number here, 4.430689 and 4.430689.",
 ["That the bank is running exactly at its design flow, which is the only turndown at which no penalty applies.",
  "That the penalty was suppressed because the reported field had already reached its ceiling on this bank.",
  "That the liner applies no shear, so the inlet reaches it untouched."],
 "The reported cut is the ideal cut with a penalty multiplied onto it, and the penalty is one until the bank is pushed past its envelope. This bank sits at a turndown of 1.150082, which is inside it.")

q(0, "The `cutBasis` string on every hydrocyclone return names three things the model leaves out. Which three?",
 "Re-entrainment, the reject split and the shear the liner itself applies.",
 ["The fouling of the liner, the pressure drop across it and the reject split it operates at.",
  "Re-entrainment, the droplet coalescence inside the core and the backwash the bank needs.",
  "The inlet slot geometry, the swirl decay along the tube and the oil recovery balance."],
 "The same string adds that field de-oilers are customarily credited with a coarser cut than this. A reader who takes the cut size and leaves the basis behind has taken half of what the engine returned.")

q(3, "Why does the module report a Reynolds number of 0.030870 beside the KOKORI liner cut?",
 "So a reader can see that the migration velocity was computed where the creeping flow law behind it is honest.",
 ["So a reader can convert that migration velocity into the equivalent rise velocity the same droplet would have had under gravity alone.",
  "Because the Reynolds number is what the reported field is divided by to give the shear penalty.",
  "Because the oracle needs it in order to march droplets of that diameter from starting radii spread by area."],
 "Every device in this module reports the Reynolds number of its OWN cut droplet and warns the same way. A cut that fell outside the band would say so on the same return instead of arriving quietly.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_m02.json', label='fc7i_m02', expect_n=15)
finish()
