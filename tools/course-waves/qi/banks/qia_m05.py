import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert m05, Prospects.
# Sources: crest, spill and closure on the Ekene Sand top grid and the
# map-edge spill, the climb to a crest, anomaly conformance on the two
# designed teaching anomalies, evidence independence, and the assessment's
# decision table.

q(2, "spillAnalysis runs on the Ekene Sand top grid with no seed and no contact. What column from crest to spill does it return?",
 "2.380249 ft, from a crest of -5051.568570 to a spill of -5053.948819 ft.",
 ["0.643935 ft, the scatter of the downdip edge of designed anomaly A about one contour.",
  "6.992237 ft, the edge scatter of designed anomaly B, the anomaly cut at the middle column.",
  "20 ft, the level below the spill that bounds designed anomaly B on the Ekene grid."],
 "The crest is -5051.568570 ft and the spill -5053.948819 ft, a column of 2.380249 ft. 0.643935 and 6.992237 ft are the edge scatters of anomalies A and B, and 20 ft is B's stated level below the spill.")

q(0, "On that grid the spill is flagged as limited by the map edge, and the closure at the wells' contact of -5118.110236 ft is reported not closed. What may a study say of the closure figures?",
 "They are the map's limit: six wells grid too little of the structure to close the trap.",
 ["They measure the trap, since the flood found a spill 2.380249 ft below the crest.",
  "The trap is breached, since oil seen at the wells sits below a spill the map measured.",
  "They hold at the wells' contact, since a contact below the spill closes the trap on the map."],
 "The map spills at the edge of its own mapped area, 2.380249 ft below the crest and above the contact the wells see; the engine flags the edge, and a closure figure from this grid is the map's limit and no measurement of the trap. A contact at or above the spill leaves the closure closed, so -5118.110236 ft leaves it open.")

q(3, "How does spillAnalysis find the spill elevation?",
 "A priority flood from the crest expands the highest frontier node; the spill is the running minimum when it first reaches the mapped edge.",
 ["A priority flood from the crest expands the lowest frontier node first, and the spill is the first node it reaches beside a null.",
  "It steps from the crest to the lowest of the eight neighbours of each node, and the spill is the elevation where that walk stops.",
  "It takes the deepest node of the mapped area as the spill and the shallowest as the crest, and the column is their difference."],
 "From the crest, the highest mapped node unless a seed is stated, a priority flood always expands the highest frontier node; the spill elevation is the running minimum when the flood first reaches the edge of the mapped area. Connectivity is four-neighbour.")

q(1, "A depth grid has a gap of null nodes inside the mapped area. How does the closure engine treat a node beside that gap?",
 "As the mapped edge, the same as a node on the edge of the grid.",
 ["As an interior node: the flood bridges the gap by eight-neighbour steps.",
  "As a refusal: the engine stops and asks for a grid with no nulls inside it.",
  "As the crest, since a node beside a null is the start the flood takes first."],
 "The mapped edge is any grid-edge node or any node beside a null, so the flood can spill into a gap. Connectivity is four-neighbour, and the crest is the highest mapped node unless a seed is stated.")

q(1, "What does the closure engine return at the spill of the Ekene Sand top grid, beside the column?",
 "11 nodes, an area of 1184030.145838 ft2 and a gross rock volume of 1519731.367693 ft3.",
 ["201 nodes, the mapped part of the grid, and an area of 1184030.145838 ft2 at the spill.",
  "11 nodes and a gross rock volume of 1184030.145838 ft3, the printed area read in cubic feet.",
  "11 nodes and an oil volume in barrels, turned from the gross rock volume of 1519731.367693 ft3."],
 "At the spill the closure holds 11 nodes, area 1184030.145838 ft2, gross rock volume 1519731.367693 ft3. 201 is the count of mapped nodes on the 25 by 20 grid, and closure returns gross rock volume only, no volume in barrels.")

q(0, "A prospect is picked at the mapped node nearest the grid's centre, column 12, row 9, at -5057.417979 ft. Where does climbToCrest end?",
 "At node 310, -5051.568570 ft, the same crest as the highest mapped node.",
 ["At the spill, -5053.948819 ft, where the climb meets the edge of the mapped area.",
  "At -5057.417979 ft: the climb needs a stated seed to step.",
  "At a local high below the crest, since the climb steps only to its four neighbours."],
 "The climb starts from the nearest mapped node and steps to the highest of its eight neighbours until none is higher; from column 12, row 9 it ends at node 310, -5051.568570 ft, the highest mapped node, so it reaches the same crest.")

q(2, "Designed teaching anomaly A, every mapped node shallower than the spill, returns conformance 0.729467. How does the assessment read it?",
 "It fits: 0.729467 is at or above 0.7.",
 ["It sits between 0.3 and 0.7.",
  "It cuts across, short of 1.",
  "It fits perfectly, since its share inside the closure, 1.000000, is the conformance the table reads."],
 "The decision table counts conformance 0.7 and above as fitting and under 0.3 as cutting across. A returns 0.729467, so it fits; 1.000000 is its share inside the closure, a separate output.")

q(3, "Why does a clean contour, anomaly A with an edge scatter of only 0.643935 ft, still score well below a conformance of 1.000000 on this grid?",
 "Conformance is 1 - scatter / relief, and the relief is the 2.380249 ft column of a map that spills at its edge.",
 ["Conformance is 1 - share inside the closure, so A's 1.000000 share costs it the difference.",
  "Conformance is the scatter divided by 20 ft, the stated level below the spill used for anomaly B.",
  "Conformance is read against the wells' contact at -5118.110236 ft, far below A's edge."],
 "Conformance = 1 - scatter / relief, clipped to 0 to 1, with the relief the closure's from crest to spill: 2.380249 ft here, the column of a grid that spills at its own edge. A's 0.643935 ft scatter against that relief gives 0.729467.")

q(0, "Anomaly A's implied contact is -5053.959008 ft and the spill is -5053.948819 ft. What sets A's edge points?",
 "Each is an anomaly node beside a lower node outside it, read at their midpoint.",
 ["Each is the spill itself, so the contact repeats -5053.948819 ft.",
  "Each is the deepest anomaly node, so the implied contact is A's lowest mapped depth.",
  "Each is the wells' contact read at that node, -5118.110236 ft, carried onto the grid."],
 "The engine reads the downdip edge as an anomaly node beside a lower node outside it, at their midpoint. A's edge implies -5053.959008 ft, just below the spill of -5053.948819 ft, and far from the wells' -5118.110236 ft.")

q(2, "Designed anomaly B, cut at the grid's middle column, has an edge scatter of 6.992237 ft. What does anomalyConformance return for it?",
 "Conformance 0.000000, share inside 0.152778, and an implied contact of -5068.442175 ft that the engine still returns.",
 ["A refusal, since B's scatter is larger than the closure's whole relief and leaves no conformance.",
  "Conformance 0.152778, its share inside the closure read as its conformance.",
  "Conformance 0.729467 and share 1.000000, since B holds every node of A inside it."],
 "With a scatter of 6.992237 ft against a relief of 2.380249 ft, 1 - scatter / relief falls below zero and is clipped to 0.000000. B shares 0.152778 of its 72 nodes with the closure; its implied contact of -5068.442175 ft is still returned, and under 0.3 the edge cuts across.")

q(3, "A prospect lists a full-stack RMS amplitude, an impedance from the same full stack and a far-stack brightening. What does evidenceIndependence return?",
 "3 supporting items and 2 independent sources, with full_stack the shared source.",
 ["3 supporting items and 3 independent sources, one for each attribute in the list.",
  "1 independent source, since every attribute is read from one seismic survey.",
  "2 supporting items, the impedance being dropped as a copy of the RMS amplitude."],
 "Attributes computed from one seismic response are one piece of evidence: the RMS amplitude and the impedance share full_stack, and the far-stack brightening is a second source. 3 supporting items, 2 independent sources.")

q(1, "The first row of the decision table matures a prospect. With one independent source in place of two, every other input the same, what does assessProspect return?",
 "Investigate, with the seismic support still supports.",
 ["Mature, with support moved down to neutral.",
  "Retain, with neutral support, as for a missing feasibility verdict.",
  "Downgrade, with support against, since one source is evidence against."],
 "Maturing needs two independent supporting sources. The same case with one returns investigate and supports: the recommendation drops while the support holds.")

q(0, "No anomaly is seen on a prospect where the feasibility study says the case would be visible. What does the assessment return?",
 "Downgrade, with seismic support against.",
 ["Retain, with neutral support, since absence of an anomaly says nothing either way.",
  "Investigate, with neutral support, as for a competing explanation judged likely.",
  "Mature, with support against."],
 "The absence of an anomaly counts against a prospect only where the feasibility study says the case would be visible: no anomaly, feasible, returns downgrade and against. With feasibility not stated it returns retain and neutral.")

q(2, "The first row of the decision table matures a prospect: conformance 0.83, inside 0.9, two independent sources, feasible. A competing explanation (tuning, a lithology change or a processing artefact) is now judged likely, every other input the same. What does the assessment return?",
 "Investigate, with neutral seismic support.",
 ["Mature, with support kept at supports.",
  "Downgrade, with support set at against.",
  "Retain, with neutral support, the anomaly set aside as an artefact."],
 "A competing explanation is an input with a status of open, ruled out or likely; one judged likely holds the prospect at investigate, and the decision table's last row returns neutral support.")

q(1, "What thresholds does the assessment's decision table state?",
 "Conformance 0.7 and above fits, under 0.3 cuts across; two independent supporting sources to mature.",
 ["Conformance 0.3 and above fits, under 0.7 cuts across; three supporting items to mature.",
  "Conformance 0.729467 and above fits, the score of anomaly A; one independent source to mature.",
  "Share inside the closure 0.7 and above fits, under 0.3 cuts across; two sources to investigate."],
 "The decision table states conformance 0.7 and above fits and under 0.3 cuts across, and two independent supporting sources to mature. 0.729467 is anomaly A's score, and the thresholds are on conformance.")

emit(Q, '/root/qi-wip-qi/banks/qia_m05.json', expect_n=15)
finish()
