import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Expert m01, Sole Risk and Non-Consent. Every key rests on the engine's
# nonConsent return on a golden input (the Ekene-4 sidetrack, the last-barrel
# and mid-year cases, the two-declining case) or on a refusal the digest prints
# verbatim; scratch/bank-advanced/witness.mjs recomputes each one. The Ekene
# joint venture is synthetic. No capstone figure appears here.

K = [1, 3, 0, 2, 0, 2, 3, 1, 3, 0, 1, 2, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A nonConsent call on the synthetic Ekene-4 sidetrack names EKO (participating interest 40.000000), PA (25.000000) and NOC (20.000000) as consenting, and PB (15.000000) declines. What share of the project does EKO hold?",
 "47.058824, its participating interest over the consenting parties' total",
 ["40.000000, its participating interest in the licence carried over unchanged",
  "50.000000, its paying interest under the Ekene carry of NOC's cost share",
  "61.538462, its part of the paying interests left once PB and NOC are set aside"],
 "The engine's basis says the consenting parties pay the cost in proportion to their participating interests among themselves, so EKO holds 40.000000 of the 85 consenting points: 47.058824. 40.000000 ignores that PB is out; 50.000000 is EKO's paying interest under the Ekene carry, which this call does not state; 61.538462 is EKO's share of the default cover, a different call.")

# 2
x("NOC, with a participating interest of 20.000000, consents to an 18000000.000000 sidetrack that PB declines, on a call stating no carry. How much of that cost falls on NOC?",
 "4235294.117647, what NOC's 23.529412 percent of the project comes to",
 ["0.000000, because NOC is carried in full and a carried party pays no cost",
  "3600000.000000, its 20.000000 participating interest applied to the cost",
  "2700000.000000, the same proportionate share of the cost that PB declined"],
 "With no carry stated in this call, NOC consents as a party paying its own share of the project, and the engine returns 4235294.117647. Its paying interest of 0.000000 belongs to the Ekene carry, which this call does not state; 3600000.000000 would leave PB's 15.000000 unpaid; 2700000.000000 is PB's proportionate share, the premium base.")

# 3
x("PB, holding 15.000000 percent, declines the Ekene-4 operation costing 18000000.000000, and the contract states a premium multiple of 400.000000 percent. What premium does the engine compute?",
 "10800000.000000, 400.000000 percent of PB's proportionate share of 2700000.000000",
 ["2700000.000000, the proportionate share alone, since the multiple only sets timing",
  "27000000.000000, one thousand percent of the share, the Norwegian entry figure",
  "7800000.000000, the balance the ledger still carries after the first year's take"],
 "The engine's rule is premium = proportionate share of the cost x premiumMultiplePct / 100: 18000000.000000 x 15.000000 percent is 2700000.000000, and at 400.000000 percent the premium is 10800000.000000. 2700000.000000 is the base at 100 percent; 27000000.000000 is the buy-in at 1000.000000 percent; 7800000.000000 is the closing balance of 2031.")

# 4
x("A learner lists all four Ekene parties, EKO, PA, PB and NOC, in `consenting` on a nonConsent call. What does the engine return?",
 "A refusal naming `consenting`, since a call in which every party consents is a joint operation",
 ["A result in which every premium is 0.000000 and the whole cost is split between the four parties by participating interest",
  "A refusal naming premiumMultiplePct, since no multiple can apply when nobody declines",
  "A result that treats the last party listed as the declining one and computes that party's premium at the stated multiple"],
 "The engine's own words are: consenting must be leaving at least one non-consenting party (every party consents: a joint operation); got [\"EKO\",\"PA\",\"PB\",\"NOC\"]. A call where everyone consents is a joint operation, so the engine refuses it by the field `consenting`; it returns no result, names no other field and never picks a decliner for you.")

# 5
x("Which statement about the premium multiple matches the engine's nonConsent refusals?",
 "Below 100 is refused, and exactly 100 is accepted and returns the proportionate share alone",
 ["Below 100 is accepted and read as a discount on the proportionate share, so the premium is smaller than the cost",
  "Exactly 100 is refused, because a premium must add something on top of the cost the consenting parties funded",
  "A missing multiple is replaced with the Norwegian one thousand percent"],
 "The engine's message is premiumMultiplePct must be a number at or above 100 (a stated contract figure; 100 recovers the cost alone). A stated 50 is refused, and so is a call that states nothing; on the golden case where A alone consents at 100.000000 percent, B's premium is 300.000000 on a share of 300.000000. The engine holds no Norwegian figure.")

# 6
x("For 2031 the Ekene sidetrack states a grossValue of 30000000 and deductions of 10000000, and the declining PB holds 15.000000 percent. What is PB's share of net value?",
 "3000000.000000, its participating interest of the net value of the year",
 ["4500000.000000, its participating interest of the gross value of the year",
  "3750000.000000, a paying interest of 18.750000 applied to the net value",
  "10800000.000000, the whole premium taken back in the operation's first year"],
 "The engine's recovery rule reads the non-consenting party's share of max(0, grossValue - deductions): 15.000000 percent of the net value gives 3000000.000000 (engine). 4500000.000000 skips the deductions; 3750000.000000 uses PB's paying interest under the Ekene carry, which this call does not state; a year can only yield its own share, so the premium of 10800000.000000 is recovered over five years.")

# 7
x("PB's ledger reaches 2035 with 1350000.000000 left to take and a share of net value of 1500000.000000. How much does PB itself receive that year?",
 "150000.000000, the rest of its 2035 share after the balance is recovered",
 ["0.000000, because its interest reverts only from the year after the payout",
  "1500000.000000, its whole share, since the balance was due at the opening",
  "1350000.000000, the balance itself, returned to it once the ledger closes"],
 "The engine states reversion inside the period: in the year the premium is recovered the rest of that year's share is the non-consenting party's. Its reason reads PB 2035: the balance 1350000 is recovered with 1350000 of the 1500000 available; the non-consenting party receives 150000 of its share 1500000. Nothing waits for 2036, and the balance goes to the consenting parties.")

# 8
x("On the golden case nc-premium-last-barrel, A (50.000000), B (30.000000) and C (20.000000) share a well costing 1000.000000; A and B consent and C declines at 300.000000 percent. C's 2031 share of net value, 400.000000, equals its balance exactly. What does the engine report?",
 "C receives 0.000000 in 2031 and its interest reverts in 2031, whole share from 2032",
 ["C receives 400.000000 in 2031, because a share equal to the balance reverts at once",
  "C's interest reverts in 2032, the first year in which C receives any of its share",
  "C's balance of 400.000000 carries into 2032 so the ledger closes on a positive take"],
 "The engine's reason is C 2031: the balance 400 is recovered exactly by the 400 available; the non-consenting party receives 0 of its share 400, and the engine reports reversion in 2031. The boundary rule is reversion from the next period with nothing received that year; C's share of 200.000000 in 2032 is its own. The balance closes at 0.000000 in 2031.")

# 9
x("The golden case nc-premium-reverts-mid-year states the same well, parties and 300.000000 percent as the last-barrel case, with C's 2031 share of net value at 600.000000 against a balance of 400.000000. What does C receive in 2031?",
 "200.000000, the rest of its 600.000000 share once the 400.000000 balance is taken",
 ["0.000000, since the consenting parties hold the whole of the payout year's share of net value",
  "600.000000, its whole share, since the balance was already recovered in 2030",
  "400.000000, the amount of the balance paid back to C when the ledger closes"],
 "The engine's reason reads C 2031: the balance 400 is recovered with 400 of the 600 available; the non-consenting party receives 200 of its share 600. Holding the whole payout year for the consenting parties is a convention the engine does not take; 2030 recovered only 200.000000 of the 600.000000 due; the balance itself goes to A and B.")

# 10
x("On the golden case nc-two-nonconsenting-deductions-exceed, A alone consents to a well costing 1000.000000 at 100.000000 percent, and B (30.000000) and C (20.000000) decline. The 2030 year states deductions of 150 against a gross value of 100. What happens to the premium recovery in 2030?",
 "Net value is 0.000000, nothing is recovered, and each balance waits whole for 2031",
 ["The shortfall of the year is charged to B and C and added to their balances",
  "The deductions are carried to 2031 and taken off that year's gross value first",
  "B and C share a single pooled balance of the two premiums, recovered in 2031"],
 "The engine floors net value at max(0, grossValue - deductions) and writes 2030: deductions 150 exceed the gross value 100: no net value, nothing recovered. It never turns a negative net value into a charge, carries no deductions forward, and keeps a ledger per declining party: B's 300.000000 and C's 200.000000 are each recovered in 2031.")

# 11
x("On the same two-declining case, B's 2031 share of net value is 1200.000000 and its balance is 300.000000. What does B receive in 2031?",
 "900.000000, what remains of B's own 1200.000000 once its 300.000000 is taken",
 ["1200.000000, since a premium at 100.000000 percent is no premium at all",
  "600.000000, since B and C split what the pooled balance leaves over",
  "0.000000, because B's interest reverts only from the following year"],
 "The engine's reason reads B 2031: the balance 300 is recovered with 300 of the 1200 available; the non-consenting party receives 900 of its share 1200. A multiple of 100 still recovers the cost; 600.000000 is what C receives from its own share of 800.000000; the engine reverts both inside 2031.")

# 12
x("PB owes a premium of 10800000.000000 at a stated 400.000000 percent, and its ledger closes 2031 at 7800000.000000. What is due in 2032?",
 "7800000.000000, the opening balance with no uplift and no default interest added",
 ["7800000.000000 plus an uplift the engine accrues on each year's opening balance",
  "10800000.000000, as each year starts the premium again until reversion arrives",
  "2550000.000000, the share of net value of 2032, as due and share are one field"],
 "The engine's ledger prints 2032 opening 7800000.000000 and due 7800000.000000: the premium recovery carries nothing while it waits. The uplift on an opening balance belongs to a carry recovery; 10800000.000000 is due only in the first year; 2550000.000000 is the 2032 share of net value, which the ledger prints in its own column.")

# 13
x("Which use of the word \"premium\" follows the rule this course legislates for it?",
 "The stated multiple of a non-consenting party's proportionate share of an operation's cost",
 ["Any extra charge on cost, such as the operator's markup on its shared services",
  "The default interest a defaulting party owes for each day past the due date",
  "The uplift a carried party repays on its carried cost before it receives production"],
 "The course's vocabulary gives premium one meaning: the stated multiple of a non-consenting party's proportionate share of an operation's cost, 10800000.000000 for PB at 400.000000 percent. A markup, default interest and a carry uplift each have their own name, and the Act lists premium beside markups as costs a back-in does not refund.")

# 14
x("A learner types \"penalty\" as the `mode` of a nonConsent call on the Ekene-4 sidetrack. What does the engine answer?",
 "A refusal naming `mode`, listing the two modes it reads and quoting \"penalty\" back",
 ["A premium recovery ledger, read as a penalty with the stated multiple of 400.000000",
  "A buy-in payment, the mode the engine applies when the stated one is not known",
  "A refusal naming premiumMultiplePct, as a penalty mode carries no stated multiple"],
 "The engine refuses the field it cannot read and quotes the value back: mode must be one of \"recover-from-production\", \"buy-in\"; got \"penalty\". It never substitutes a mode, and the multiple on the call was stated, so the refusal names `mode` alone.")

# 15
x("The Norwegian Joint Operating Agreement (unofficial English translation, PDF dated 27 February 2007, cited from the Wayback Machine capture of 26 May 2024, read on 2026-09-26) is quoted for sole risk. What does its Art. 18.6 set?",
 "Each party in a sole risk project participates in proportion to its participating interest, unless agreed otherwise",
 ["A premium of four hundred percent of the proportionate share, recovered year by year from the declining party's own production",
  "The reversion of a declining party's interest from the year after the payout year",
  "A bar on any later entry by the parties that declined the sole risk operation"],
 "Art. 18.6 reads \"In sole risk projects each Party participates in proportion to his Participating interest, unless the Parties otherwise agree.\" The 400.000000 percent is a stated input of the Ekene call and premium recovery from production is taught by concept; reversion inside the period is the engine's convention; entry rules for a sole risk development sit in Art. 19, which the engine does not compute.")

emit(Q, '/root/cat-wip-joa/banks/ec9a_m01.json', expect_n=15)
finish()
