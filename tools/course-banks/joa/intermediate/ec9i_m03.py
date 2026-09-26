import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Professional m03, Back-in under the Act.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene back-in fixture or a stated golden input. The Act is the Petroleum
# Industry Act 2021 (Act No. 6), Official Gazette No. 142, Vol. 108, 27 August
# 2021, read on 2026-09-26. No capstone name, term, series or value appears.

q(2, "On the Ekene joint venture (synthetic) NOC backs in from a participating interest of 20.000000 to 40.000000 percent under basis \"pia-s85-4\". What participating interests does the engine return for EKO, PA and PB after the back-in?",
 "EKO 30.000000, PA 18.750000 and PB 11.250000, each keeping 60 / 80 of its interest",
 ["EKO 20.000000, PA 25.000000 and PB 15.000000, the operator alone ceding the 20 points",
  "EKO 40.000000, PA 25.000000 and PB 15.000000, as a back-in moves cost shares and leaves the participating interests as they were",
  "EKO 20.000000, PA 12.500000 and PB 7.500000, each giving up half its interest"],
 "The engine's rule reads \"new interest of another party = old x (100 - target) / (100 - current)\", and its reason \"NOC backs in from 20% to 40%: the others keep 60 / 80 of their interests\"; the table prints EKO 30.000000, PA 18.750000 and PB 11.250000. EKO 20.000000, PA 12.500000 and PB 7.500000 are the interests after a back-in to 60, where the others keep 40 / 80. A back-in changes participating interests; that is what distinguishes it from a carry.")

q(0, "The Ekene back-in golden input backin-ekene-pia states six cost lines, NOC's move from 20 to 40 percent, basis \"pia-s85-4\" and a refund from future entitlement. What refund does the engine return?",
 "98000000.000000: 20 percent of refundable costs of 490000000.000000, with 156000000.000000 excluded",
 ["490000000.000000: the refundable costs in full, since the Act says the Government shall refund fully",
  "196000000.000000: 40 percent of the refundable costs, NOC's new participating interest",
  "125200000.000000: 20 percent of the costs left once the bonus, the interest line and the markup are taken out"],
 "The engine's reason reads \"NOC backs in from 20% to 40%: the others keep 60 / 80 of their interests; refund 20% x refundable costs 490000000 = 98000000 (156000000 excluded)\". The refund is the change in interest (target less current) times the refundable costs. 196000000.000000 is the refund of the back-in to 60, a change of 40 points. 125200000.000000 is the contract-basis refund, which leaves the exploration wells in; the Act refunds development and production only.")

q(3, "Which of the Ekene back-in cost lines does the engine count as refundable under basis \"pia-s85-4\"?",
 "Front end engineering design, 40000000.000000 of development cost",
 ["The exploration wells Ekene-1 and Ekene-2, 136000000.000000, as proven costs incurred before participation",
  "The signature bonus of 10000000.000000, since a bonus paid for the licence is an unrecovered cost of the venture",
  "The operator markup on shared services, 2000000.000000, since it is part of what the joint account paid"],
 "The engine's basis reads \"development and production costs only; bonuses, penalties, interest, premium and markups excluded (PIA s.85(4)(c)); exploration is not development or production\", and the cost line table marks front end engineering design (development) refundable. Each of the other three prints a reason that it is not refundable, citing PIA s.85(4)(c).")

q(1, "A learner states a back-in to 61 percent under basis \"pia-s85-4\". What does the engine return?",
 "A refusal: targetPct must be at most 60 under basis \"pia-s85-4\" (the right to participate up to 60%, PIA s.85(4)(a)); got 61",
 ["A back-in computed at 60 percent, the most the Act allows, with the extra point reported and set aside",
  "A back-in to 61 percent, since the Act lets the ceiling be set as a bid parameter",
  "A refusal naming refundableKinds, as the Act reads a target over 60 as a stated list of costs"],
 "The engine refuses the target in its own words, citing s.85(4)(a): targetPct must be at most 60 under basis \"pia-s85-4\" (the right to participate up to 60%, PIA s.85(4)(a)); got 61. It does not cap the target silently. A target of exactly 60 is accepted (backin-pia-at-60), which is the boundary. The Act's words about a bid parameter do not make the engine accept 61 under its basis.")

q(2, "Under basis \"pia-s85-4\", what does the engine return for a back-in whose target equals the back-in party's current participating interest of 20?",
 "A refusal: targetPct must be above the back-in party's current interest 20; got 20",
 ["A result with no change of participating interests and a refund of 0.000000, reported with its reason",
  "A refusal naming refundForm, since a back-in with no change of interest has nothing to refund",
  "The Ekene back-in to 40 percent, the engine reading a target at the current interest as a doubling"],
 "The digest prints the refusal \"targetPct must be above the back-in party's current interest 20; got 20\". A back-in raises the back-in party's participating interest, so a target at its current figure is refused before any refund is computed, and the engine reads no target it was not given.")

q(0, "A contract under basis \"pia-s85-4\" states refundForm \"upfront\" for NOC's back-in. What does the engine return?",
 "A refusal citing s.85(4)(d) and s.85(4)(f): the refund must be \"from-future-entitlement\" under the Act's basis",
 ["The refund paid in full in the year of the back-in, since s.85(4)(f) lets the Government's refund be made in cash",
  "A refund from future entitlement, the engine substituting the Act's form for the stated one",
  "The refund of 125200000.000000 that the contract-basis case returns"],
 "The engine's message reads: refundForm must be \"from-future-entitlement\" under basis \"pia-s85-4\": no upfront payment by the Government (s.85(4)(d)); the refund is in cash or in kind from future production or entitlements (s.85(4)(f)); got \"upfront\". A term the Act fixes is refused when a call breaks it; the engine substitutes nothing. Cash under s.85(4)(f) is cash from future entitlement.")

q(3, "A learner copies the Ekene back-in under basis \"pia-s85-4\" and adds refundableKinds: [\"exploration\"] so that the exploration wells are refunded. What does the engine return?",
 "A refusal: refundableKinds must be left out under the Act's basis (development and production, s.85(4)(c))",
 ["A refund of 125200000.000000, as a stated list replaces the Act's kinds",
  "The Act's refund of 98000000.000000, with the stated list set aside in a reason",
  "A refusal naming costs[0].kind, since exploration is not one of the kinds the engine accepts on a cost line"],
 "The engine refuses: refundableKinds must be left out under basis \"pia-s85-4\" (development and production, s.85(4)(c)); got [\"exploration\"]. Under the Act the kinds are fixed, and a stated list is a contract-basis term. Exploration is an accepted kind on a cost line; the engine simply does not refund it under the Act.")

q(1, "The golden input backin-ekene-contract-upfront states the same six Ekene cost lines under basis \"contract\" with refundable kinds that include exploration, and refundForm \"upfront\". What refund does the engine return?",
 "125200000.000000 on refundable costs of 626000000.000000, with 20000000.000000 excluded",
 ["98000000.000000, as the Act's exclusions apply to every back-in whatever basis is stated",
  "156000000.000000, the excluded amount, which a contract basis refunds in place of the Act's kinds",
  "196000000.000000, the refund of a back-in to 60 percent"],
 "Under basis \"contract\" the stated kinds decide: the engine refunds 20 percent of 626000000.000000, which is 125200000.000000, and excludes the bonus, the interest line and the markup (20000000.000000) with the reason \"not a stated refundable kind\". The Act's list applies only under basis \"pia-s85-4\".")

q(2, "On the Ekene back-in under the Act, NOC's refund of 98000000.000000 is recovered from 50.000000 percent of its new share of future entitlement. In which year is it recovered, and what does NOC receive that year?",
 "In 2034, receiving 17600000.000000 of its share of 34400000.000000",
 ["In 2033, receiving 18800000.000000, as the balance of 35600000.000000 is cleared from the whole share that year",
  "In 2034, receiving 17200000.000000, the half of its share the refund recovery does not take",
  "In 2031, the year the Ekene carry under the Act is recovered, since both run on the same entitlement"],
 "The engine's reason reads \"2034: the balance 16800000 is recovered with 16800000 of the 17200000 available; the back-in party receives 17600000 of its share 34400000\". The refund recovery takes only the balance in its last year, so NOC keeps more than half its share. The recovery share is stated at 50 percent, so no year takes the whole share. The carry under the Act recovers a different, smaller balance from a different share.")

q(0, "The golden input backin-pia-at-60 takes NOC from 20 to 60 percent under basis \"pia-s85-4\", recovering the refund from 50.000000 percent of its new share over 2030 to 2036. What do the totals show?",
 "196000000.000000 refunded, 192000000.000000 recovered and 4000000.000000 outstanding, recovered in year none",
 ["A refusal, since 60 is the Act's ceiling and a target at the ceiling is outside it",
  "196000000.000000 recovered in 2036, the balance being cleared from the whole share in the last year",
  "196000000.000000 refunded with 4000000.000000 written off in 2036"],
 "A target equal to 60 is accepted (the boundary), and the refund of 196000000.000000 is 40 percent of 490000000.000000. By 2036 192000000.000000 has been recovered: \"2036: 4000000 of the refund is not recovered by the last year\". Outstanding means still owed; nothing is written off, because a back-in states no cap.")

q(3, "The small golden input backin-recovered-on-last-year takes N from 20 to 40 percent (parties A 60, B 20, N 20) with refundable costs of 1000.000000 and recovery from 50.000000 percent of N's new share. In 2031 the balance of 100.000000 meets 100.000000 available. What does the engine return?",
 "The refund is recovered in 2031, exactly, and N receives 100 of its share 200",
 ["100.000000 carried to 2032, since a balance is cleared only when more is available than is due",
  "The refund is recovered in 2030, when the first 100.000000 is taken",
  "The refund is recovered in 2031 and N receives 0, the whole share going to A and B"],
 "The engine's reason reads \"2031: the balance 100 is recovered exactly by the 100 available; the back-in party receives 100 of its share 200\". Available equal to the balance clears it in that year. Only half of N's share is available, so N keeps the other half; 2030 recovers 100 of the 200 due.")

q(1, "On the Ekene back-in to 40 percent under the Act, how does the engine divide NOC's refund of 98000000.000000 among the other parties?",
 "In proportion to the participating interest each gives up: EKO 49000000.000000, PA 30625000.000000, PB 18375000.000000",
 ["By their participating interests after the back-in, EKO 30.000000, PA 18.750000 and PB 11.250000, so EKO receives the most",
  "Equally among the three, since the Act refunds the Government's share with no stated split",
  "Wholly to EKO as operator, which paid the costs on the joint account and holds the refund for the others"],
 "The engine's rule reads \"refund = (target - current) / 100 x refundable costs, received in proportion to the interest given up\". EKO gives up 10.000000 points, PA 6.250000 and PB 3.750000, and the table prints refunds of 49000000.000000, 30625000.000000 and 18375000.000000. The split follows the points given up; the refund is not held by the operator.")

q(2, "Section 85(4) of the Act opens \"A contract as provided for under section 85 (2) (d)\". Which contract does that name, and when does the engine apply the s.85(4) figures?",
 "The concession agreement that may include a joint venture with NNPC Limited; the figures apply only under a stated basis \"pia-s85-4\"",
 ["The production sharing contract of s.85(2)(a); the engine applies the 60 percent ceiling to every PSC it computes",
  "Every contract under the Act; the engine applies the figures to any call that names NOC as a party",
  "The renegotiated PSC of s.311(2)(a)(iii); the figures apply whenever a cost oil limit is stated"],
 "The course reads s.85(4) as opening on the contract of s.85(2)(d), which is the concession agreement that may include a joint venture with NNPC Limited; a production sharing contract is s.85(2)(a). The engine applies the s.85(4) figures only under basis \"pia-s85-4\", which the caller states. A party's name decides nothing, and s.311(2)(a)(iii) is the renegotiated PSC's cost oil limit, reported in a basis only.")

q(3, "PIA s.85(4)(e) says the unrecovered costs to be refunded are settled by an agreed expert determination procedure. What does the engine do about that procedure?",
 "It computes none of it: the unrecovered cost figures are stated inputs",
 ["It applies a haircut to each stated cost line in place of the procedure",
  "It refunds only the cost lines marked verified, and treats every other line as excluded under s.85(4)(c)",
  "It reports the Ekene back-in refund as provisional until a determination is stated as an input"],
 "The engine's basis says, in its own words: the expert determination of the unrecovered costs (s.85(4)(e)); the unrecovered cost figures are stated inputs. It applies no haircut (that is s.311(2)(a)(iii), for disputed amounts in a renegotiated PSC, and the engine computes none), reads no verification flag, and returns the refund of 98000000.000000 as a figure on the stated costs.")

q(0, "A cost line in a back-in call states kind \"appraisal\". What does the engine return?",
 "A refusal naming costs[0].kind, which must be one of the eight kinds from \"exploration\" to \"markup\"",
 ["A back-in that counts the appraisal line as development, the nearest refundable kind under the Act",
  "A back-in that excludes the line with the reason that appraisal is not a stated refundable kind, as under a contract basis",
  "A back-in that refunds the line in full, since the Act excludes only the kinds it names"],
 "The engine's message reads: costs[0].kind must be one of \"exploration\", \"development\", \"production\", \"bonus\", \"penalty\", \"interest\", \"premium\", \"markup\"; got \"appraisal\". It maps no unknown kind onto a known one, so a cost line's kind must be stated as one of the eight before any refund is computed.")

emit(Q, '/root/cat-wip-joa/banks/ec9i_m03.json', expect_n=15)
finish()
