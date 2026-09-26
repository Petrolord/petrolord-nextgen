import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Professional m02, Carries with Uplift and Caps.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene carry fixture or a stated golden input. Every carry figure is quoted
# with its uplift, the share of entitlement it recovers from, its basis and
# any cap. No capstone name, term, series or value appears.

q(1, "The Ekene carry (synthetic) states a compound uplift of 8.000000 percent a year, carry recovery from 50.000000 percent of NOC's share of entitlement and basis \"contract\". NOC's carried cost is 16400000.000000 in 2027 and 12000000.000000 in 2028. What uplift does the engine charge in 2028?",
 "1312000.000000, 8 percent of the opening balance of 16400000.000000 alone",
 ["2376960.000000, 8 percent of the balance once the year's carried cost of 12000000.000000 has been added to it",
  "0.000000, since no uplift accrues until NOC's entitlement starts",
  "8200000.000000, the uplift added in the first year a cost is carried"],
 "The engine's basis reads \"8% a year on the opening balance, compounded yearly; a year's new cost earns none in its own year\", and its reason reads \"2028: 8% a year on the opening balance 16400000 adds 1312000\". 2376960.000000 is the 2029 uplift, charged on 2029's opening balance of 29712000.000000. The uplift runs from the first opening balance, before any entitlement. 8200000.000000 is what the 150 percent multiple adds in 2027 on a different carry.")

q(3, "2033 opens with 6729407.979520 still owed on the 8.000000 percent compound Ekene carry, which may take half of NOC's share (basis \"contract\"). That share is 18800000.000000. What does NOC keep?",
 "11532239.382118",
 ["9400000.000000, the half of its share that the carry recovery does not take in any year",
  "18800000.000000, its whole share, since the balance due is below the available amount and the carry closes",
  "7267760.617882, the amount the carriers recover in the year, which is what the engine credits back to NOC"],
 "The balance due in 2033 is 7267760.617882, less than the 9400000.000000 available, so only the balance is recovered and NOC keeps 11532239.382118 of its share of 18800000.000000. The engine's reason: \"2033: the balance 7267760.62 is recovered with 7267760.62 of the 9400000 available; the carried party receives 11532239.38 of its share 18800000\". The carry closes in 2033 with the balance paid out of that year's share, so NOC keeps less than its whole share.")

q(0, "The engine's 2033 reason on the Ekene compound carry prints the balance recovered as 7267760.62. Which figure does a Professional partner report quote as the balance, and why?",
 "7267760.617882, the numeric field at six decimals; the reason rounds money to the cent for reading",
 ["7267760.62, because the reason is the engine's own words and the field is a display figure",
  "The reason's 7267760.62, padded with zeros to six decimals for the report, since a report quotes the engine's own words",
  "Either one, since the two agree at the cent and so are the same figure"],
 "The course quotes the balance as the numeric field, 7267760.617882, and quotes the reason only verbatim. The course says a reason rounds money to the cent, with trailing zeros dropped, while every numeric field keeps full precision. Two figures that agree when printed at a coarser precision are not keyed as equal, and no whole-dollar rounding is applied to a field.")

q(2, "The golden input carry-ekene-pia states the Ekene carry with no uplift, carry recovery from 100.000000 percent of NOC's share, and basis \"pia-s85-4\". In which year is the carry recovered, and what does NOC keep that year?",
 "In 2031, keeping 13200000.000000 of its share of 22400000.000000",
 ["In 2030, when NOC's first share of 19200000.000000 arrives and is taken whole against the balance of 28400000.000000",
  "In 2033, the same payout year as the compound carry, since a carry recovery share does not move the payout year",
  "In 2031, keeping 11200000.000000"],
 "Under the Act's basis the balance stays 28400000.000000; 2030 recovers 19200000.000000 and leaves 9200000.000000, which 2031 clears: \"2031: the balance 9200000 is recovered with 9200000 of the 22400000 available; the carried party receives 13200000 of its share 22400000\". The golden input states carry recovery from the whole share; the engine holds no half. The compound carry runs to 2033 because its uplift grows the balance and it takes half the share.")

q(1, "A learner states the Ekene carry with basis \"pia-s85-4\" and an uplift of { type: \"compound\", ratePctPerYear: 8 }. What does the engine return?",
 "A refusal naming uplift.type: it must be \"none\" under basis \"pia-s85-4\", as the refund excludes interest, premium or markups on cost (PIA s.85(4)(c))",
 ["The compound ledger that recovers in 2033, with a note that the Act's basis is overridden by the stated contract uplift",
  "The Act's ledger recovering in 2031, the stated uplift ignored",
  "A refusal naming basis: a carry under the Act must be stated as a contract"],
 "The engine refuses the call, in its own words: uplift.type must be \"none\" under basis \"pia-s85-4\": the refund excludes interest, premium or markups on cost (PIA s.85(4)(c)); got \"compound\". A term the Act fixes is refused when a call breaks it; the engine neither overrides the basis nor drops the stated term quietly, and \"pia-s85-4\" is one of the two bases the engine accepts.")

q(3, "In the recovery calculator a learner starts from the Ekene carry under PIA s.85(4) and sets the uplift to { type: \"compound\" } with no rate typed. Which refusal does the engine give first?",
 "The refusal for the missing compound rate, naming uplift.ratePctPerYear",
 ["uplift.type must be \"none\" under basis \"pia-s85-4\", since the basis is checked before the terms of the uplift are read",
  "uplift must be an object { type } with type \"none\", \"compound\" or \"multiple\" (no default); got nothing",
  "None: the engine fills the missing rate with 0 and returns the Act's ledger, recovered in 2031"],
 "The course prints this change as a stated probe on carry-ekene-pia, with the engine's message \"uplift.ratePctPerYear must be a finite number at or above 0; got nothing\". The missing rate is refused before the Act's bar on an uplift is reached, so a learner must state a rate to see the Act's refusal. The uplift object is present here, so the no-uplift refusal does not fire, and the engine holds no rate of its own.")

q(0, "A 150 percent multiple is stated for the Ekene carry (carry-ekene-multiple, half of NOC's share available, basis \"contract\"). How is the balance due built up?",
 "It adds 8200000.000000 in 2027 and 6000000.000000 in 2028, each in the year its cost is carried, fixing the due at 42600000.000000",
 ["It adds 150 percent of the opening balance every year, compounding until the carry recovery is complete in 2034",
  "It adds 14200000.000000 in 2030, the first year NOC has any entitlement to recover from",
  "It adds nothing to the balance and takes 150 percent of each year's carry recovery"],
 "The engine's reasons read \"2027: the 150% multiple on the carried cost of 16400000 adds 8200000\" and \"2028: the 150% multiple on the carried cost of 12000000 adds 6000000\". After 2028 the uplift column is 0.000000 and the due stays 42600000.000000 until it is paid down; the carry is recovered in 2034 with 42600000.000000 recovered in all. A multiple is not a yearly rate and is not deferred to the first year of entitlement.")

q(2, "A contract for a carry states a multiple uplift of 90 percent, intending that the carriers forgive a tenth of the cost. What does the engine return?",
 "Refused by name, since a multiple under 100 would give back less than the cost",
 ["A ledger that recovers 90 percent of the carried cost and writes the other 10 percent off in the first year of carry recovery",
  "A ledger identical to no uplift, since the engine floors any multiple below 100 at 100",
  "A refusal naming the cap, as a partial carry recovery is written as a cap"],
 "The engine refuses the multiple by name: \"uplift.multiplePct must be a number at or above 100 (100 recovers the cost alone); got 90\". It writes nothing off and floors nothing. A carry recovery limited below the cost is a cap, which is a separate optional term; the refusal here names the multiple because that is the term stated below its bound.")

q(1, "Suppose the compounding Ekene carry (8 percent on the opening balance, half the share, basis \"contract\") is capped at 25000000.000000, as in carry-ekene-capped. What happens in 2032?",
 "4200000.000000 recovered, and 12929407.979520 written off as the cap is reached",
 ["10400000.000000 recovered, the whole amount available, with the cap applied only to the year's uplift",
  "4200000.000000 recovered, and 12929407.979520 left outstanding, still owed to the carriers from later entitlement",
  "Nothing recovered in 2032"],
 "By the end of 2031 the carriers have recovered 20800000.000000, so 4200000.000000 of the cap is left; the engine's reason reads \"2032: the stated cap 25000000 is reached with 4200000 recovered this year; the rest, 12929407.98, is written off\". The totals show 12929407.979520 written off and 0.000000 outstanding, with the year recovered reading none. A written-off balance is gone under the contract's terms; an outstanding one is still owed.")

q(3, "The golden input carry-ekene-short-horizon runs the compound Ekene carry (8.000000 percent a year, from 50.000000 percent of the share, basis \"contract\", no cap) over 2027 to 2031 only. What do its totals show?",
 "15860562.944000 outstanding and 0.000000 written off",
 ["15860562.944000 written off at the end of 2031, as a carry not recovered by the last year is closed by the engine",
  "A refusal, since a carry recovery must be given enough years to recover its balance",
  "20800000.000000 outstanding, the amount recovered in the five years being what remains owed"],
 "With no cap nothing is written off: the totals print 20800000.000000 recovered, 0.000000 written off and 15860562.944000 outstanding, and the engine's reason reads \"2031: 15860562.94 of the carry is not recovered by the last year\". A carry not recovered by the last year is a result with a reason; the engine computes no year beyond the ones it was given.")

q(0, "Two small golden ledgers state parties A 60, B 20 and N 20 percent, N carried, no uplift and carry recovery from 100 percent of N's share. On carry-recovered-exactly the 2028 balance of 200.000000 meets 200.000000 available; on carry-one-short 199.800000 is available. What does the engine return?",
 "The first is recovered in 2028 with N keeping 0; the second leaves 0.200000 carried to 2029 and recovered there",
 ["Both are recovered in 2028, since 199.800000 is within the engine's summing tolerance of the balance",
  "The first carries 0 to 2029 and closes there, the second writes off 0.200000",
  "Neither closes in 2028: a balance is closed only by a year with more available than it owes"],
 "At the boundary the engine recovers the carry in that year: \"2028: the balance 200 is recovered exactly by the 200 available; the carried party receives 0 of its share 200\". One short, it carries the rest: \"2028: 199.8 recovered of 200 due; 0.2 carried to 2029\" and \"2029: the balance 0.2 is recovered with 0.2 of the 200 available\". Nothing is written off without a cap, and the summing tolerance applies to participating interests summing to 100.")

q(2, "The golden input carry-cap-exactly-cost states parties A 60, B 20 and N 20 percent, a compound uplift of 10 percent, carry recovery from 100 percent of N's share and a cap of 200, equal to N's carried cost. What happens in 2028?",
 "The carriers get N's cost of 200 back and lose the 20.000000 uplift to the cap",
 ["The cost of 200 and the uplift of 20 are both recovered, as a cap bounds the carried cost alone and leaves the uplift on top of it",
  "200 is recovered and 20.000000 is carried to 2029 as outstanding, since a cap delays the uplift",
  "A refusal, since a cap may not equal the carried cost"],
 "The engine's reasons read \"2028: 10% a year on the opening balance 200 adds 20\" and \"2028: the stated cap 200 is reached with 200 recovered this year; the rest, 20, is written off\". A cap limits the whole carry recovery, uplift included, so a cap set at the cost recovers the cost alone. Written off means gone; it is not carried to 2029.")

q(3, "The golden input carry-cost-while-recovering states a compound uplift of 25 percent and carry recovery from 100 percent of the carried party's share. 2028 opens at 100.000000, carries a new cost of 100.000000 and has 50.000000 available. What balance closes 2028?",
 "175.000000",
 ["200.000000, with the 25 percent uplift charged on the year's new cost as well as on the opening balance",
  "225, the amount due, since nothing is recovered while the carry is still adding cost",
  "150.000000, as the year's new cost is added only after the year's carry recovery is taken and earns no uplift"],
 "The engine charges the uplift on the opening balance alone (25.000000 on 100.000000), adds the year's carried cost, and recovers from the same year's entitlement at the year end: \"2028: 50 recovered of 225 due; 175 carried to 2029\". Carry recovery runs while cost is still being carried, so the due of 225 is reduced by the 50 recovered.")

q(0, "On the carry with 8.000000 percent compounding, half of NOC's share taken and basis \"contract\", the carriers get back 7267760.617882 in 2033. How is that sum divided?",
 "To the carriers in their carry shares: EKO 3633880.308941, PA 2271175.193088, PB 1362705.115853",
 ["All of it to EKO as operator, which settles with PA and PB outside the carry recovery ledger",
  "To EKO, PA, PB and NOC by their beneficial interests of 40, 25, 15 and 20 percent",
  "To the joint account, where it reduces the next cash call of every paying party"],
 "The course prints the 2033 party flows: EKO recovery 3633880.308941, PA 2271175.193088, PB 1362705.115853 and NOC -7267760.617882, and states that the recovered amount goes to the carriers in their carry shares. NOC is the party paying the carry recovery, so it receives none of it, and the carry recovery is settled through the party flows of the carry recovery ledger.")

q(1, "At a discount rate of 0.100000 to a base year of 2027, what NPV does the engine return for NOC on the Ekene compound carry (8.000000 percent a year, from 50.000000 percent of its share, basis \"contract\") and on carry-ekene-pia (no uplift, from 100.000000 percent, basis \"pia-s85-4\")?",
 "49870804.456959 on the compound carry and 54584252.437515 on the carry under the Act",
 ["54584252.437515 on the compound carry and 49870804.456959 under the Act, as the uplift is paid to NOC",
  "49870804.456959 on both, since NPV is computed on the carried cost alone",
  "47640894.676658 on the compound carry, the lowest of the three carries"],
 "The canonical npv returns NOC 49870804.456959 on the compound carry and 54584252.437515 on the Act's carry: the uplift moves value from the carried party to its carriers. 47640894.676658 is NOC's NPV under the 150 percent multiple, a different term. Each NPV is quoted with its rate and base year because it depends on both.")

emit(Q, '/root/cat-wip-joa/banks/ec9i_m02.json', expect_n=15)
finish()
