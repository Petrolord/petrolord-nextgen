import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Professional m06, Section 16 and the Award.
# Every figure is quoted from digest.txt. The Act is the Nigerian Oil and Gas
# Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010), as
# enacted. Every s.14 outcome is quoted with its reading. The materials figures
# run on the fixture settings: omission rule average, delivery schedule 8 to 14
# weeks at 0.0025, life cycle 5 years at 0.1, a lowest-cost award. No capstone
# name, code, price or value appears.

q(1, "What does the engine's s.16 rule do for a Nigerian indigenous company with capacity whose evaluated cost is within 10 percent of the lowest?",
 "It protects the bid from being disqualified solely because it is not the lowest; it selects nothing",
 ["Selection of that bid over the lowest evaluated cost whenever its Nigerian content is also the highest",
  "A 10 percent cut in the bid's evaluated cost before the bids are ranked on the materials tender",
  "It moves the bid into the s.14 group, where the reading of the lead then decides the award"],
 "The engine states s.16 as 100 x (C - Cmin) <= 10 x Cmin for a Nigerian indigenous company with capacity, and its reason ends \"it is not disqualified solely because it is not the lowest (s.16)\". The course states it: s.16 protects and never selects. It changes no evaluated cost, and the s.14 group is a separate test at 1%.")

q(3, "MS3 is stated as indigenous with capacity and sits 6.445634 percent above the lowest evaluated cost, MS4. What does the engine return for it, and does the award move?",
 "MS3 is within the 10 percent margin and protected, and the award stays with the bid s.14 and the lowest evaluated cost select",
 ["Protection, and with it the award, as the only indigenous bid within the margin",
  "Outside the margin, because 6.445634 percent is measured against its own evaluated cost",
  "MS3 is placed in the s.14 group, and under the relative reading it leads with 86.240876"],
 "The engine returns MS3 with within margin true and the reason that it \"is not disqualified solely because it is not the lowest (s.16)\". Protection keeps a bid in the evaluation and selects nothing: the award is MS4 with no content rule or under the points reading, and MS2 under the relative reading. MS3 is outside the s.14 group at 6.445634 percent, so s.14 never reaches its 86.240876.")

q(0, "Stated bids: the lowest at 3000000, I10 at 3300000 and I11 one unit more, both indigenous with capacity. What does the s.16 test return?",
 "I10 at 10.000000 percent is within the margin, and I11 at 10.000033 percent is outside it",
 ["Both are outside, since the margin is strict and a bid exactly 10 percent above is left unprotected",
  "Both are within the margin, as the engine rounds each percentage to one decimal place first",
  "I10 is within and I11 is refused, because a bid just beyond the margin cannot be placed at all"],
 "The margin includes its edge: 100 x (C - Cmin) <= 10 x Cmin. I10 sits exactly 10 percent above and is protected; I11 at 10.000033 is not. Nothing is rounded, and a bid outside the margin is an ordinary result with within margin false.")

q(2, "A stated bid NC sits inside the 10 percent margin and is indigenous, with capacity stated false. How does it appear in the s.16 rows?",
 "It does not appear at all, since s.16 applies only to a company stated as both indigenous and with capacity",
 ["Listed with within margin true, as capacity matters only for bids that sit above the 10 percent margin of s.16",
  "Listed with within margin false, and a reason naming the missing capacity for the committee",
  "Refused by bids[0].capacity, since an indigenous bid must have capacity to be evaluated"],
 "The engine lists s.16 rows only for bids stated as indigenous and with capacity; NC is not listed. The selected bid in that stated case is LO. Capacity is a finding the caller states, and a false flag is a valid input.")

q(1, "An evaluator types \"yes\" in a bid's indigenous flag in place of a true or false. How does the engine respond?",
 "It refuses by the field, since bids[0].indigenous must be true or false when given",
 ["The text read as true, since any non-empty word counts as a positive finding by the committee",
  "Read as false, so the bid is left out of the s.16 rows without any note to the evaluator",
  "A refusal naming capacity, as indigenous and capacity have to be given as a matched pair"],
 "Whether a bidder is indigenous, and whether it has capacity, is stated by the caller as true or false; text is refused by the field bids[0].indigenous: \"bids[0].indigenous must be true or false when given\". The engine reads no truthiness into a word.")

q(0, "The whole tender is evaluated in one call with a combined award and a Nigerian content rule stated. What does the engine return?",
 "A refusal that tells the caller to state Nigerian content as a rated criterion with its weight instead",
 ["An award on combined score, with s.14 applied afterwards to bids within 1% on combined score",
  "The combined award with the content rule dropped silently and a note that s.14 applies to a lowest-cost award only",
  "A combined award in which each bid's content is added to its technical percentage before scoring"],
 "The engine refuses by the field nigerianContent: \"nigerianContent applies s.14 at the commercial stage of a lowest-cost award; with award 'combined' state Nigerian content as a rated criterion with its weight instead\". It never applies s.14 to a combined score and never drops a stated input silently.")

q(3, "Under a combined award Nigerian content enters as a rated criterion. What else then binds the technical weight that carries it?",
 "Its para 5.50 cell of the World Bank Regulations (7th ed.), so the weight still sits inside the band",
 ["Nothing more: a rated criterion for Nigerian content is exempt from the Rated Criteria weighting matrix of para 5.50",
  "The s.14 margin, so the content criterion may weigh at most 1 percent of the combined score",
  "The s.16 margin, so the content criterion must carry a weight of 10 percent within the score"],
 "A content criterion is part of the rated criteria, so the technical weight that carries it must still sit inside its para 5.50 cell, which the weighting band returns from the risk and the estimated cost. The s.14 and s.16 margins are price tests at the commercial stage and set no weight.")

q(2, "On the materials tender's fixture settings, evaluateTender with a lowest-cost award is run three ways. Which awards does it return?",
 "MS4 with no content rule stated, MS4 under the points reading, and MS2 under the relative reading",
 ["MS4 in all three runs, since s.14 cannot move a lowest-cost award away from the lowest evaluated cost at all",
  "MS2 in all three, as MS2 leads MS4 on Nigerian content whichever reading is stated",
  "MS3 under both readings, as the indigenous bid with the highest content on the tender"],
 "The end-to-end table prints: none stated gives MS4; points gives MS4; relative gives MS2 with the s.14 reason as the award reason. The lowest evaluated cost is MS4 in every run. MS3 is protected by s.16 and selected by nothing.")

q(1, "Under the points reading, s.14 is tested on the materials tender and does not apply. What award reason does the engine print?",
 "\"MS4 has the lowest evaluated cost\", the same reason as a run with no content rule stated",
 ["The s.14 reason with the lead of 4.541020, since a tested section always supplies the award reason",
  "A reason naming MS2 as leader, since MS2 heads the group on content under either reading",
  "A reason saying s.14 is not engaged, since a lead below 5 points leaves the group unformed"],
 "The table prints the award reason \"MS4 has the lowest evaluated cost\" for both the run with no content rule and the points run. Under the points reading the group is formed and MS2 leads, but the lead of 4.541020 is less than 5, so the award reason is the lowest evaluated cost's. \"Not engaged\" is the wording for a group of one bid.")

q(0, "Stating the relative reading moves the materials award. How is the move explained in the engine's output?",
 "The s.14 reason itself, readings included, which ends with s.14 selecting MS2 over the lowest evaluated cost MS4",
 ["\"MS2 has the lowest evaluated cost\", since the award moves to MS2 under the relative reading",
  "\"MS4 has the lowest evaluated cost\", followed by a note that s.14 changed the bid selected",
  "A reason naming MS3, the indigenous bid protected by s.16 inside the 10 percent margin"],
 "Under the relative reading the award reason is the s.14 reason, which begins \"2 bids within 1% of the lowest evaluated cost\" and ends its finding with \"at least 5% higher, so s.14 selects MS2 over the lowest evaluated cost MS4\", before its readings. MS2 does not have the lowest evaluated cost; MS4 does, at 546244.982386.")

q(3, "With a Nigerian content rule stated, one bid that reaches the commercial stage carries no ncPct. What does evaluateTender return?",
 "A refusal: \"bids[4].ncPct is required for every bid that reaches the commercial stage when nigerianContent is given\"",
 ["That bid's content taken as 0, which puts it at the bottom of any s.14 comparison",
  "The bid left out of the s.14 group, with the reason that its content is unknown",
  "A result with s.14 skipped for the whole tender and the lowest evaluated cost as the award"],
 "Every bid that reaches the commercial stage must carry its overall content once the content rule is stated, and the engine refuses by the field bids[4].ncPct with the message in the key. A missing figure is never read as 0, and nothing is skipped silently.")

q(2, "A lowest-cost evaluateTender call gives nigerianContent as a plain text string. What comes back?",
 "A refusal by nigerianContent: it must be { ncLeadBasis } when given",
 ["The points reading, the default when the object cannot be read as it is",
  "Lowest evaluated cost as the award, with the content rule ignored",
  "A refusal naming award, since content with text in it forces a combined award"],
 "The engine refuses: \"nigerianContent must be { ncLeadBasis } when given\". There is no default reading to fall back to, and a stated input is never dropped. The award basis is a separate required input with its own refusal.")

q(1, "Which of the materials bids has the highest overall Nigerian content, and why does s.14 never compare it?",
 "MS3 at 86.240876, since at 6.445634 percent above MS4 it sits outside the 1% group",
 ["MS2 at 61.584657, which s.14 compares with MS4 as leader of the group of two",
  "MS3 at 86.240876, since an indigenous bid is judged under s.16 and excluded from s.14",
  "MS5 at 49.874791, since a bid that fails the pass mark is left out of the content test"],
 "MS3's overall content, 86.240876, is the highest of the five. The s.14 group holds only bids within 1% of the lowest evaluated cost, MS4 and MS2, and MS3 sits 6.445634 percent above. Nothing in s.14 excludes an indigenous bid; MS3 is simply outside the margin. MS5's 49.874791 is the lowest content.")

q(3, "Suppose ncPct is typed as 101 on one bid in the s.14 and s.16 call. What comes back?",
 "The call is refused by bids[0].ncPct, whose content must sit from 0 to 100",
 ["Content clipped to 100, with a note in the reasons that the figure was capped",
  "The bid may lead any group it joins, since a content above 100 clears every lead",
  "A refusal naming the Schedule line, since a content above 100 must come from a stated target"],
 "Content is a percentage, and the engine refuses a figure outside 0 to 100 by the field bids[0].ncPct: \"bids[0].ncPct must be a number from 0 to 100\". It clips nothing. A stated target is an input to the content measurement, where no content above its total can arise.")

q(0, "The engine keeps s.14 and s.16 apart in its output. What does each return?",
 "s.14 a group, leader, runner-up, lead and selected bid; s.16 rows for indigenous bids with capacity, each with its percentage and margin flag",
 ["One combined ranking, in which the s.16 protection adds points to a bid's lead under s.14",
  "s.14 rows for every bid in the tender, and s.16 a single selected bid within 10 percent",
  "A shared lead figure used by both sections, read as points in s.14 and relative in s.16"],
 "contentPreference returns the s.14 group, leader, runner-up, lead and outcome with its readings, the s.16 rows and the bid selected. s.16 lists each indigenous bid with capacity with its percentage above the lowest and whether it is within the margin, and it selects nothing. s.16 carries no lead and no reading.")

emit(Q, '/root/cat-wip-procurement/banks/sc2i_m06.json', expect_n=15)
finish()
