import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional m02, the wetted area in both orientations.
# Digest sections 12 and 13, at the rendering those sections print.
# Every figure is an engine return on the teaching vessel or on a published row.

q(1, "A horizontal vessel is wetted to a level. What is the wetted area the fire case starts from?",
 "The wetted arc round the circular segment, multiplied by the length of the vessel.",
 ["The plan area of the liquid surface, multiplied by the length of the vessel.",
  "The circumference of the vessel, multiplied by the liquid level.",
  "The lateral surface of the vessel, multiplied by the level as a fraction of the diameter."],
 "That expression is exact and carries no correlation in it, which makes the first link of the fire chain the one place an answer can be right beyond argument.")

q(3, "Stand the same vessel on end. What is the wetted area then?",
 "The circumference, multiplied by the wetted height.",
 ["The circular segment, multiplied by the wetted height.",
  "The circumference, multiplied by the level as a fraction of the diameter.",
  "The plan area of the vessel, multiplied by the wetted height."],
 "There is no segment and no arc angle in the vertical branch. The liquid touches the shell round one circle and the wetted surface is the band from the bottom tangent up to the level.")

q(0, "The teaching vessel is 12.000000 ft across and 45.000000 ft long at a level of 4.200000 ft. What does it return in each orientation?",
 "683.6960 ft2 lying down and 158.3363 ft2 standing up.",
 ["683.6960 ft2 lying down and 226.1947 ft2 standing up.",
  "848.2300 ft2 lying down and 158.3363 ft2 standing up.",
  "683.6960 ft2 in either orientation, since the level and the steel are the same."],
 "The printed ratio between the two readings is 4.317999814064. They are two exact answers to two different questions, and the orientation field is where the question is named.")

q(2, "At a level of exactly 6.000000 ft that vessel returns 848.2300 ft2. What else equals that figure?",
 "Half the lateral surface of the cylinder, to a printed ratio of 1.000000000000.",
 ["The whole lateral surface of the cylinder, at a ratio of 1.000000000000.",
  "The vertical reading at that same level, which the sweep also gives as 848.2300 ft2.",
  "Twice the area at a level of 2.400000 ft, which is 500.7394 ft2."],
 "Half full is the one level on a horizontal vessel with an answer anybody can reach without the segment: a diameter, a length and pi.")

q(0, "Why is exact agreement at half full a poor gate on the geometry, however useful it is as a sanity check?",
 "Any geometry that is wrong away from half full can still be exactly right there.",
 ["The agreement is only exact to six decimals, which is too coarse to separate two candidate expressions.",
  "The half-full case is the only level the published set does not carry, so nothing independent confirms it.",
  "A ratio of 1.000000000000 is printed rather than computed, so it cannot fail whatever the geometry does."],
 "One point of agreement between two expressions is a single equation, and a great many wrong expressions satisfy any single equation you care to write down. Ask what wrong answer a check would have caught.")

q(1, "The level sweep on the teaching vessel ends at 12.000000 ft with an area of 1696.4600 ft2. What is that figure?",
 "The whole lateral surface of the cylinder, since the level is clamped at the diameter.",
 ["The whole surface of the cylinder including both heads, since a full vessel is fully engulfed.",
  "The largest area the route will return before it refuses a level past the diameter.",
  "The area at the top of the published range, above which the route returns a note instead."],
 "A level above the diameter returns the same figure, because the shell cannot be more than fully wetted. Two levels on this vessel have closed-form answers, at the middle and at the top.")

q(3, "What does the wetted-area route do about the vessel heads?",
 "It ignores them, which is standard screening practice and conservative for the shell term.",
 ["It adds them on the horizontal branch and ignores them on the vertical one.",
  "It adds a dished-end allowance proportional to the level as a fraction of the diameter.",
  "It ignores them, which is standard screening practice and optimistic for the shell term."],
 "A wetted head would add area and therefore duty, so leaving it out cannot make the duty look smaller than the shell alone deserves. A head allowance for a detailed case is made outside this route.")

q(2, "A call arrives with an orientation string the route does not recognise. What comes back?",
 "A refusal naming the two orientations it accepts, and no area at all.",
 ["The horizontal reading, since that is the orientation most vessels in a pool fire have.",
  "An area of zero, which the duty route then refuses in its turn.",
  "A refusal, and a string differing only by a capital letter is refused in the same way."],
 "The match is case insensitive and trimmed, so a capital letter or a stray space still resolves. A silent default would hand a vertical tower a horizontal segment area and nothing on the screen would say so.")

q(1, "The published wetted-area set carries 7 rows and 3 of them are vertical. Why does that matter?",
 "The vertical branch has its own derived oracle route, so a defect in one orientation cannot hide behind the other.",
 ["The vertical rows are the only ones with a relative difference small enough to be meaningful.",
  "Three rows is the smallest number from which the arc expression can be recovered by fitting.",
  "The vertical rows are the only ones the fire chain is ever run on, so they carry all the weight."],
 "A published set exercising only horizontal geometry would pass a module with the vertical branch entirely wrong, and would report a clean run while doing it.")

q(0, "One published row is a vertical vessel 8.000000 ft across and 30.000000 ft long at a level of 0.000000 ft. What is unusual about how it is reported?",
 "Its relative difference is reported as unavailable rather than as zero.",
 ["Its engine area is reported as unavailable, because an empty vessel has no wetted geometry.",
  "It is the only row in the set whose published and engine figures differ.",
  "It carries no orientation, because an empty vessel is the same in both."],
 "A relative difference against a published zero has nothing to divide by. A tolerance that cannot be computed is reported as absent instead of as a pass, which is a small piece of honesty worth copying.")

q(3, "Which published row shows that a level above the vessel diameter is ordinary on the vertical branch?",
 "A vessel 10.000000 ft across and 40.000000 ft long wetted to 12.000000 ft, which returns 376.9911 ft2.",
 ["A vessel 8.000000 ft across and 24.000000 ft long wetted to 7.900000 ft, which returns 560.1633 ft2.",
  "A vessel 12.000000 ft across and 30.000000 ft long wetted to 1.200000 ft, which returns 231.6604 ft2.",
  "A vessel 10.000000 ft across and 40.000000 ft long wetted to 5.000000 ft, which returns 628.3185 ft2."],
 "A vertical vessel is wetted up its height, so the same level figure means different things in the two branches. On a horizontal vessel a level above the diameter is a signal that something is wrong.")

q(2, "Which published row sits on the height limit this course names?",
 "The 6.000000 ft tower wetted to 25.000000 ft, at 471.2389 ft2.",
 ["The 10.000000 ft tower wetted to 25.000000 ft, at 471.2389 ft2.",
  "The 8.000000 ft horizontal vessel wetted to 7.900000 ft, at 560.1633 ft2.",
  "The 6.000000 ft tower wetted to 12.000000 ft, at 376.9911 ft2."],
 "That row is the whole tower wetted and it is also the largest height the set exercises. A caller with a taller tower is past the limit and has to trim before the call.")

q(3, "Read the horizontal over vertical column of the level sweep from the lowest level downward. What does it do?",
 "It falls steeply, flattens, and then turns and rises again before the top.",
 ["It falls the whole way, from 10.767472 at the lowest level to 3.750000 at the top.",
  "It rises the whole way, because a standing vessel gains area faster than a lying one.",
  "It holds at 3.750000 from half full upward, since both readings are then linear in the level."],
 "The gap between the two readings is widest at a low level, because a lying vessel wets a broad band of shell for very little liquid while a standing one wets only a thin ring.")

q(0, "The engine attaches a note about the height limit to something. What, and how often?",
 "To every pool fire duty it returns.",
 ["To every wetted area it returns, since that is where the level enters.",
  "To the duties it computes above 25 ft of wetted height only.",
  "To the vertical readings only, since a horizontal vessel rarely reaches the limit."],
 "The note asks the caller to truncate the level before calling, and it is present on every duty rather than only on the ones the engine suspects. It cannot decide which those are, because it is never told where grade is.")

q(1, "The relative differences on the published wetted-area rows run from 1.990e-15 to 1.186e-13. What does a spread that size say?",
 "That the disagreement is the rounding of a double rather than anything about the geometry.",
 ["That the published figures were rounded on the way into print, like the fire duty rows.",
  "That the arc expression and the oracle agree only to the precision the published areas carry.",
  "That the vertical rows agree more closely than the horizontal ones, which is the point of carrying both."],
 "The oracle walks a polyline round the real circle and extrapolates rather than evaluating the same arc formula the engine uses, so the agreement is between two derivations and not one restated twice.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_m02.json', label='fc5i_m02', expect_n=15)
finish()
