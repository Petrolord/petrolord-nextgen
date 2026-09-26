import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Professional m02, Make-Up Expiry and the End of the Term.
# Every figure is quoted from digest.txt (the engine's returns on the golden
# inputs and the Ekene power plant fixture). The end-of-term rule is keyed as
# the stated contract term it is. The one question on a last-year deficiency
# keys the engine's stated reading as the engine's, and says so.

q(1, "A golden case pays a deficiency of 200.000000 in 2027 under a make-up period of 2 contract years. Which is the last year in which the engine lets any of it be taken as make-up?",
 "2029, the year y + N, with the rest expiring at its end",
 ["2028, counting the deficiency year as the first",
  "2030, since a make-up right of N years is usable for N whole years after the period's last year",
  "Any year to the end of the term"],
 "A make-up period of N contract years after a deficiency year y runs to the end of year y + N inclusive, so 2027 plus 2 is 2029, and the engine's reason reads \"the buyer may make up 200 in the 2 contract years after 2027, to the end of 2029\". The period starts in the year after the deficiency, so 2028 is its first year and 2029 its last. None is available in 2030, the year after. The period is a stated term, so it does not run on to the end of the term.")

q(3, "In the golden case whose make-up of 200.000000 from 2027 reaches the last year of its 2 year period, the buyer takes 100.000000 of make-up in 2029. What does the engine return for that year?",
 "100.000000 taken, and 100.000000 from 2027 expired at the end of 2029",
 ["100.000000 taken, with the other 100.000000 still open for 2030 because the period ends on its last day",
  "0.000000 taken, because make-up is never usable in the last year of its own period under the stated terms",
  "200.000000 taken, the whole entry"],
 "Make-up is usable in the last year of its period and the rest expires at that year's end: the engine's reasons read \"make-up of 100 taken from the make-up aggregate 200\" and \"make-up of 100 from 2027 expired unrecovered at the end of 2029, the last year of its make-up period\". Nothing of the entry reaches 2030. The last year is inside the period, so a draw in it is allowed. The draw is limited by the take above the Adjusted ACQ, so the last year releases nothing extra.")

q(0, "A buyer who paid a deficiency of 200.000000 in 2027, with a make-up period of 2 contract years, takes nothing above its Adjusted ACQ in 2028 or 2029 and plans to recover the gas in 2030. What does the engine hold for it in 2030?",
 "Nothing: the whole 200.000000 expired at the end of 2029",
 ["200.000000, available in 2030 because the entry never had a year with a take above the Adjusted ACQ to draw on",
  "Half of the unused entry, rolling into the year after its period",
  "200.000000 as a carry-forward credit, which the engine converts from any make-up that goes unused"],
 "The engine's reason reads \"make-up of 200 from 2027 expired unrecovered at the end of 2029, the last year of its make-up period\", and in 2030 the entry holds 0.000000. A year with no take above the Adjusted ACQ does not extend the period. No share of an expired entry rolls on. Make-up and carry-forward are separate rights; unused make-up never turns into a credit.")

q(2, "The same deficiency of 200.000000 from 2027 is run with a make-up period of 1 contract year. In 2028 the take above the Adjusted ACQ allows 50.000000 of make-up. What does the engine return for 2028?",
 "50.000000 drawn; the other 150.000000 lapses as 2028 closes",
 ["50.000000 taken and 150.000000 still open until the end of 2029, one year after the draw",
  "0.000000 taken, since a period of 1 contract year gives the buyer no year of make-up at all to draw in",
  "200.000000 taken, the whole entry at once"],
 "With N = 1 the period is 2028 alone, the year after the deficiency: the engine draws 50.000000 and its reason reads \"make-up of 150 from 2027 expired unrecovered at the end of 2028, the last year of its make-up period\". A draw does not restart the period. A period of 1 contract year is one usable year. A draw is limited by the take above the Adjusted ACQ, so the whole entry cannot be forced through.")

q(2, "A contract states a make-up period of 0 years, and the buyer falls 200.000000 short in 2027 at a take-or-pay price of 3. What does the engine return?",
 "Payment of 600.000000 with no make-up right arising",
 ["A refusal, since a make-up period below 1 year is outside the integers the engine accepts for the term",
  "No deficiency payment at all",
  "A deficiency payment of 600.000000 with the make-up right carried to the end of the term by default"],
 "A period of 0 years is accepted (the refusal is for a non-integer or a negative figure) and the engine's reason reads \"the deficiency payment is 200 x 3 = 600; the make-up period is 0 years, so no make-up right arises\". The deficiency payment follows from the take-or-pay quantity whatever the period says, so it is still paid. The engine holds no default period to fall back on.")

q(0, "In 2031 the Ekene power plant (synthetic) takes 268800.000000 of make-up from an aggregate of 478800.000000 opened by its 2028 deficiency, under a make-up period of 3 contract years. What happens to the remaining 210000.000000?",
 "It expires unrecovered at the end of 2031, the last year of its period",
 ["It carries into 2032 as make-up",
  "It is refunded to the buyer at the 2031 take-or-pay price, because the agreement's make-up terms name a refund",
  "It stays open until 2034"],
 "2028 plus 3 is 2031, so the engine's reason reads \"make-up of 210000 from 2028 expired unrecovered at the end of 2031, the last year of its make-up period\". Expiry at the end of the period comes before any end-of-term rule, which acts only on entries still open when the term ends. The power plant states forfeit at the end of the term; it is the export feed agreement that states a refund.")

q(3, "The 210000.000000 of make-up that expires at the end of 2031 was paid for in the power plant's 2028 deficiency payment, which rests on the fixture's stated planning price. What does its expiry do to the money?",
 "The seller keeps what was paid, and the buyer loses the right to take that gas",
 ["The 2028 payment for it is reversed",
  "The seller owes damages at the stated seller shortfall price",
  "It becomes a carry-forward credit for the buyer"],
 "A deficiency payment buys the right to take the gas later; when an entry expires the right ends and nothing is paid back, which is why the power plant ledger shows 210000.000000 in makeUpExpired and no refund. No payment is reversed. Seller shortfall damages price gas the seller did not make available, which is a different event. Carry-forward is built only from takes above a base, and expired make-up does not feed it.")

q(1, "A golden case ends its term in 2029 with 150.000000 of make-up still open from 2027, under the end-of-term rule 'refund'. The take-or-pay price is 2.5 in 2027 and 4 in 2029. What does the engine refund?",
 "600.000000, the 150.000000 at the last year's price of 4",
 ["The 150.000000 at the 2027 take-or-pay price of 2.5, the price at which the buyer first paid for it",
  "500.000000, the whole of the 2027 deficiency payment returned to the buyer",
  "1000.000000, which adds the 2029 deficiency payment of 400.000000 to the refund of the earlier make-up"],
 "The engine's reason reads \"the delivery period ends with make-up of 150 unrecovered; the seller refunds 150 x 4 = 600\", at the take-or-pay price of the last contract year, as the model agreement's Alternative 2 prints it. The deficiency year's price is not the basis of the refund. 500.000000 was the 2027 payment on 200.000000, and 50.000000 of that gas was already taken. The last year's own deficiency payment stays with the seller.")

q(0, "The Commonwealth Secretariat's model agreement (2025, CC BY 4.0) prints alternatives for make-up left at the end of the Delivery Period. At which price does its Alternative 2 have the seller pay the Make-Up Aggregate back?",
 "The Take or Pay Price in the Contract Year in which the Delivery Period expires",
 ["The deficiency year's own Take or Pay Price",
  "The average Contract Price over the term",
  "The domestic base price reported for the year the term ends"],
 "Alternative 2 reads: \"Seller shall pay to Buyer an amount equal to the value of the Make-Up Aggregate multiplied by the Take or Pay Price in the Contract Year in which the Delivery Period expires.\" The deficiency years' prices and a term average do not enter it. The domestic base price is a Nigerian sector price and a stated input; a make-up refund is a contract term priced by the contract.")

q(3, "In the last contract year of the same refund case, 2029, the buyer counts 700.000000 against a take-or-pay quantity of 800.000000 and pays 400.000000. What does the engine's stated reading do with that year's own deficiency of 100.000000?",
 "Under the engine's stated reading it opens no make-up right, so the refund covers the 2027 entry only",
 ["A make-up right refunded at once, raising the refund to 1000.000000",
  "Added to the aggregate and forfeited",
  "It is refunded at the 2029 price of 4"],
 "The engine states its reading in its own words, \"a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years' make-up only)\", and its reason for 2029 reads \"the delivery period ends with this year, so no make-up right arises\". This is the engine's stated choice where the text leaves the point open. On that reading nothing from 2029 enters the aggregate, so there is nothing of it to refund or forfeit, and the refund stays at 600.000000 for the 150.000000 from 2027.")

q(1, "In 2034, the last year of the power plant agreement, the buyer takes 105000.000000 of make-up from an aggregate of 357000.000000 opened in 2033. The fixture states 'forfeit' at the end of the term. What does the engine return?",
 "252000.000000 forfeited when the term ends",
 ["252000.000000 refunded at the 2034 take-or-pay price, since an entry that is still inside its period is repaid",
  "252000.000000 kept open to the end of 2036, the end of the 2033 entry's own period",
  "357000.000000 forfeited, because make-up is not drawn in a final year"],
 "The engine's reasons read \"make-up of 105000 taken from the make-up aggregate 357000\" and \"the delivery period ends with make-up of 252000 unrecovered; the buyer forfeits it\". The end-of-term rule is the stated term 'forfeit', so there is no refund. The contract ends in 2034 whatever the entry's own period says. Make-up is drawn in the last year like any other: 105000.000000 of it was taken.")

q(2, "The power plant's 2033 deficiency opens make-up to the end of 2036 though the agreement ends in 2034. Which engine behaviour settles the part of that entry still open when the term ends?",
 "The stated end-of-term rule, which here forfeits it",
 ["The make-up period, which keeps the entry open after the term until 2036, the last year of the period",
  "A refusal, since a make-up period that runs past the last contract year is an input the engine does not accept",
  "The model agreement's term extension"],
 "An entry's period can run past the term; when the delivery period ends, the stated rule acts on what is still open, and the power plant states forfeit, so 252000.000000 is forfeited in 2034. No year after the term exists in the ledger, so the entry cannot stay open. The engine accepts the case and reports the forfeit. Extending the term is not one of the rules the engine accepts: makeUp.endOfTerm is 'forfeit' or 'refund'.")

q(0, "Over 2027 to 2034 the power plant pays for 1045800.000000 of deficiency. How does the engine's ledger account for all of it by the end of the term?",
 "583800.000000 taken as make-up, 210000.000000 expired and 252000.000000 forfeited",
 ["688800.000000 taken as make-up and 357000.000000 forfeited, each year's deficiency closed as a single block of gas",
  "1045800.000000 taken as make-up, since every paid quantity is recovered before the term ends",
  "583800.000000 taken as make-up and the rest refunded at the take-or-pay price of 2034 when the term ends"],
 "The totals read makeUpTaken 583800.000000, makeUpExpired 210000.000000 and endOfTermQuantity 252000.000000, which sum to the 1045800.000000 paid. Entries are drawn and expired in parts, so neither deficiency closes as one block: 268800.000000 of the 2028 entry was taken in 2031 and 210000.000000 of it expired. Not every paid quantity is recovered. The power plant states forfeit, so nothing is refunded.")

q(3, "A learner types the end-of-term rule as \"extend\", hoping to carry open make-up past the last contract year. What does the engine return?",
 "A refusal naming makeUp.endOfTerm, which must be \"forfeit\" or \"refund\"",
 ["A ledger that keeps open entries alive",
  "A ledger that forfeits the open make-up, since forfeit is what the engine applies to any rule it does not know",
  "A ledger with a refund at the last year's price"],
 "The engine's message reads \"makeUp.endOfTerm must be one of \"forfeit\", \"refund\"; got \"extend\"\". The model agreement prints a third alternative that extends the term, and the engine does not model it, so it refuses the input by name. It never substitutes forfeit or refund for a rule it cannot read, since every end-of-term figure depends on the stated rule.")

q(1, "A learner types a make-up period of 1.5 years. What does the engine return, in its own words?",
 "makeUp.periodYears must be an integer at or above 0; got 1.5",
 ["A ledger with the period rounded up to 2 years",
  "A ledger with the period cut to 1 year",
  "makeUp.periodYears must be an integer at or above 1; got 1.5, since a period below 1 year is refused"],
 "The engine refuses the period by name, and its message is \"makeUp.periodYears must be an integer at or above 0; got 1.5\". It never rounds or truncates a stated term, since the last year of every entry depends on it. A period of 0 years is accepted and means no make-up right, so the refusal's floor is 0; the message about a floor of 1 belongs to the carry-forward period, a different term.")

emit(Q, '/root/cat-wip-gsa/banks/ec8i_m02.json', expect_n=15)
finish()
