import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "Subsea tie-in slips carries a probability of 4 and an impact of 5. What score and band does the register give it?",
 "A score of 20 and a band of Critical, the score being probability times impact and 20 and above being Critical.",
 ["A score of 9 and a band of Medium, the two ranks added rather than multiplied.",
  "A score of 20 and a band of High, a threshold value belonging to the band beneath it, so that Critical begins only once a score passes 20 rather than reaching it.",
  "A score of 108.0000 and a band of Critical, the factor of 0.600000 applied to the cost impact."],
 "The thresholds are 20 and above Critical, 12 and above High, 6 and above Medium and below that Low, and 20 is the boundary value that belongs to the higher band.")

q(0, "Hull yard delay scores 12, exactly on a threshold. Which band does it read, and what rule decides that?",
 "High, because a score landing on a threshold goes up rather than down, and 12 and above is High.",
 ["Medium, because a threshold opens the band above it only once a score clears it.",
  "High, because the register assigns the higher of the two neighbouring bands whenever a row's source is Fabrication, where a schedule slip carries a consequence beyond its own score.",
  "Medium, because the band is read from the probability of 3 and the impact of 4 separately, and the lower of the two ranks decides which side of the threshold the row falls."],
 "A published case pins the thresholds exactly at 20, 12 and 6 and returns a consolidated score of 68 at Critical 2, High 1, Medium 1 and Low 1 with a health of 46.")

q(3, "Subsea tie-in slips holds an impact of 5 against a cost impact of 180.0000 million USD, while Reservoir underperformance holds an impact of 4 against 300.0000. Is one of those rows wrong?",
 "No: impact is a rank of severity across schedule, cost, reputation and safety at once, and cost impact is a separate column in currency.",
 ["Yes: an impact rank is the cost impact placed on the 1 to 5 scale, so the row carrying 300.0000 million USD cannot rank below the row carrying 180.0000 million USD.",
  "Yes: the ranks are right and the money is reversed between the two rows.",
  "No: impact ranks the money alone, and a subsurface risk is discounted where a schedule risk is not."],
 "The larger money sits on the smaller impact rank and that is allowed, since impact is a rank and not a currency.")

q(1, "What does a probability of 4 on the register mean?",
 "The fourth step of a five step scale, which becomes a likelihood only when exposure is priced, through a factor table where 4 keys 0.60.",
 ["A four in five chance of the risk landing, which the factor table then rounds down to 0.60.",
  "A 40 percent chance, the five steps standing for 20 percent each, which the table turns into 0.60.",
  "A 4 percent chance, which is why the table's factors sit so far above the step numbers."],
 "A 4 is not 4 percent and not 40 percent, and the factor table is nowhere near the step numbers: 1 gives 0.05, 2 gives 0.20, 3 gives 0.40, 4 gives 0.60 and 5 gives 0.85.")

q(2, "The register counts Critical 1, High 1, Medium 1, Low 1 and Unscored 1, and the HSE matrix over the same rows counts critical 1, high 1, medium 1, low 1 and a total of 5. Why do the two agree?",
 "There is one scale in the studio and both surfaces read the same three thresholds.",
 ["The HSE matrix is built from the register's own band column rather than from the scores, so it copies whatever banding the register has already applied to each row.",
  "The matrix rescores every row on its own thresholds and the two happen to land together on this register, since no row here sits close enough to a boundary for the scales to part.",
  "The matrix counts only the rows whose source is a safety discipline, and on this register each of the five sources contributes exactly one row, so the two counts match by construction."],
 "Before the repairs made ahead of this course several surfaces carried their own thresholds, and a disagreement between two surfaces is now a bug rather than a matter of interpretation.")

q(0, "Host government approval carries an impact of 5, a cost impact of 400.0000 million USD and no probability. What does the register report for it?",
 "A band of Unscored, which is not a fifth band but what is reported when no probability means no score could be formed and no threshold applied.",
 ["A band of Low, since a row with no probability scores below every threshold the studio holds.",
  "A band of Critical, since the impact of 5 is the top of the scale and its 400.0000 the largest money.",
  "No row at all in the band counts, since a risk that cannot be scored is held back from the register until somebody puts a probability on it."],
 "The count reads Critical 1, High 1, Medium 1, Low 1, Unscored 1, five labels over five rows, and Unscored is the label for a row waiting on a number.")

q(3, "The register's consolidated score is 44. Which figures add to it?",
 "20 plus 12 plus 8 plus 4, the four scored rows and nothing else.",
 ["20 plus 12 plus 8 plus 4 plus the impact of 5 that the unscored row carries, since a row with an impact still has something to contribute to the total.",
  "The four band weights of Critical, High, Medium and Low taken in order, which is also the ladder that puts portfolio health at 58 on this register.",
  "The cost impacts of the four scored rows scaled by their probability factors, which is the same arithmetic that gives a risk exposure of 269.0000 million USD."],
 "The unscored row forms no score, so it adds nothing to the 44 and is reported separately as unscored risks 1.")

q(1, "Take the unscored row out of the register altogether. What happens to a portfolio health of 58?",
 "It still reads 58, because health averages the bands of the scored rows and never saw that row.",
 ["It falls, because health is an average over every row in the register and removing the row that carried the largest cost impact of 400.0000 million USD leaves a worse average behind.",
  "It rises, because the row was being carried in the Low band and a Low row lifts an average built from Critical, High, Medium and Low rows.",
  "It cannot be read, because health needs every row to carry a probability."],
 "Health reads 58 with the row present and 58 with it absent, and the band count changes only from Unscored 1 to Unscored 0.")

q(2, "The register's Critical row holds a cost impact of 180.0000 million USD against a probability of 4. How much of the risk exposure does that row make up?",
 "108.0000 million USD, the factor of 0.600000 applied to its 180.0000, and the largest single contribution to the 269.0000.",
 ["180.0000 million USD in full, since exposure adds up the cost impacts of every row that carries a probability and leaves out only the row that has none.",
  "60.0000 million USD, the factor of 0.200000 on the register's biggest cost impact of 300.0000.",
  "400.0000 million USD, the largest cost impact, the table being keyed on impact here."],
 "The five factors are 0.05, 0.20, 0.40, 0.60 and 0.85, and a probability of 4 keys 0.600000, so 0.600000 times 180.0000 is 108.0000 million USD.")

q(0, "Host government approval carries a cost impact of 400.0000 million USD, the largest in the register. What does it add to the exposure of 269.0000 million USD?",
 "0.0000, because its probability is missing, so no factor can be keyed and its money never enters the expected value at all.",
 ["A factor of 0.85 applied to its 400.0000, because a row with no probability is priced at the top of the table on the impact of 5 that it does carry.",
  "400.0000, because an unpriced risk is carried at face value until somebody scores it, which is what keeps the largest money in the register visible.",
  "5.0000, the missing probability keying the bottom of the table at 0.05."],
 "The single largest number in the register sits outside the single number that claims to summarise the register's money.")

q(1, "The register's five cost impacts are 180.0000, 240.0000, 300.0000, 25.0000 and 400.0000 million USD. What do they add to, and how does that sit beside the exposure?",
 "1145.0000 million USD, which is every risk landing in full, while the exposure of 269.0000 is probability weighted and well below it.",
 ["1145.0000 million USD, which is the worst case the exposure of 269.0000 million USD is the expected half of, the two being the upper and lower bounds of one distribution.",
  "269.0000 million USD, the cost impacts added once the unscored row's 400.0000 is left out.",
  "1145.0000 million USD, which the register reports as its exposure when no factor can be keyed."],
 "Exposure is neither a worst case nor a floor, because nothing here is a distribution: 269.0000 million USD is an expected value and no single risk costs its expected value.")

q(3, "A published register returns a consolidated score of 43 with an exposure of 0.0000, and another with every risk Critical returns a consolidated 75, a health of 0 and an exposure of 2.5500. What do the two cases show?",
 "Exposure reads the cost impacts somebody typed, and health does not read them at all.",
 ["Exposure and health are two views of one quantity, so a register that prices at almost nothing has to come back healthy once its cost impact column is filled in.",
  "An exposure of 0.0000 is the register's way of refusing to price a set of rows it cannot band, which is why the health of 43 and the health of 0 differ so widely.",
  "A register can only be compared with another of the same size, so the consolidated scores of 43 and 75 are the readings to use and the money should be left out."],
 "A register can be as unhealthy as the scale allows and still price at almost nothing, and an exposure of 0.0000 usually means the cost impact column is empty rather than that the register is safe.")

q(0, "Three published registers carry consolidated scores of 6, 9 and 10 and every one of them returns a portfolio health of 80. What does that show about health?",
 "It reads the band of each scored risk and averages, so one Medium risk gives 80 whether its score is 6, 9 or 10 and the consolidated score is not an input.",
 ["It is 100 less a penalty on the consolidated score, flat across the range from 6 to 10.",
  "It is driven by the count of rows rather than by their bands, and all three of those registers hold the same number of rows as one another.",
  "It rounds to the nearest 10, so consolidated scores of 6, 9 and 10 all report as 80 while a consolidated 12 drops a full band to 50."],
 "Consolidated scores of 12 and 24 both return 50 in the same ladder, which is the same point made twice: health reads bands and the consolidated score adds scores up.")

q(2, "A register of three Critical risks returns a portfolio health of 0. One Critical risk beside one Low risk returns 50. What is the difference between those two registers?",
 "A row was added and nothing was mitigated, health being an average that rises when a register grows in its lower bands.",
 ["The Critical rows were mitigated down a band, which is what lifts the average from the floor of 0 and is why the consolidated score falls from 75 to 24.",
  "Health follows the consolidated score, so 75 reads 0 and 24 reads 50, and any register scoring between those two lands between those two healths.",
  "The three Critical register prices at 2.5500 million USD, too little to support a health reading."],
 "Comparing the health of two registers is only meaningful when they hold a comparable number of rows: a published five row register at Critical 1, High 2, Medium 1 and Low 1 reads 56 against this register's four scored rows at 58.")

q(1, "A published register whose single Medium risk carries a fractional probability returns a consolidated score of 10 and an exposure of 0.0000. Why does the money read zero when the score does not?",
 "The multiplication accepts the fraction and forms a score, but the factor table has no entry for it, so no factor can be keyed and nothing is priced.",
 ["The row is held as unscored for pricing, the way a row with no probability at all is held.",
  "A fractional probability rounds down a step for banding and down to zero for pricing.",
  "Exposure is reported only when every row carries a probability inside the range 1 to 5."],
 "The multiplication is more forgiving than the scale: a probability typed as text still keys the table and returns an exposure of 4.0000, and a fraction matches nothing.")

emit(Q, '/root/ec-wip-fdp/banks/ec6i_m05.json')
finish()
