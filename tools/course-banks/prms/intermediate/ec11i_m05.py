import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Professional m05, Entitlement and the Reporting Basis.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture or a stated golden input, and every
# key was re-run through the vendored engine by the writer's witness
# (scratch/bank-intermediate). No capstone name, input or value appears.

q(0, "EKN-1 carries a 70.000000 percent working interest and a 15.000000 percent royalty stated as a royalty interest. On the working-interest basis, what 2P in BOE does the engine report?",
 "13211487.916667 BOE",
 ["18873554.166667 BOE, the whole project at 100 percent",
  "11229764.729167 BOE, with the royalty interest taken out",
  "19825024.800000 BOE, the 3P on the same basis"],
 "On the working-interest basis the engine scales the gross quantities by the stated 70.000000 percent through the canonical applyJV of cashflow.ts, giving a 2P of 13211487.916667 BOE (golden input econ-ekene-working-interest). 18873554.166667 is the gross 2P. 11229764.729167 is the net-entitlement 2P, which also removes the royalty interest. 19825024.800000 is the 3P on the working-interest basis.")

q(2, "Read the net-entitlement start of the Ekene Main waterflood, royalty stated as an interest in production. Which cumulative 2P oil figure does it print?",
 "9908615.920000 barrels",
 ["11657195.200000 barrels, the working-interest share with nothing more removed",
  "16653136.000000 barrels, the best case to its limit at 100 percent",
  "4618647.040000 barrels, the Probable (P2) oil on this basis"],
 "Net entitlement takes the working-interest share and removes the royalty interest, and the engine's line reads \"net entitlement: 70% working interest less the 15% royalty interest (PRMS 3.3.1.1)\"; the 2P oil is 9908615.920000. 11657195.200000 is the working-interest 2P oil, before the royalty comes out. 16653136.000000 is the gross 2P oil. 4618647.040000 is the increment above the 1P, and the question asks for the cumulative 2P.")

q(1, "The same EKN-1 royalty is restated as a production tax, still on the net-entitlement basis. What 2P in BOE comes back, and how does it compare?",
 "13211487.916667, exactly the working-interest figure",
 ["11229764.729167, since the 15.000000 percent still leaves the volumes",
  "18873554.166667, the gross figure",
  "Half-way between the two"],
 "A production tax is paid in money, so no volume is deducted (PRMS 3.3.1.2), and the net entitlement then prints the same figures as the working interest: 13211487.916667 BOE, checked equal exactly (golden inputs econ-ekene-production-tax and econ-ekene-working-interest). 11229764.729167 is the royalty-interest reading. The working interest of 70.000000 percent still applies, so the gross figure is out of reach, and the engine splits no volume in half.")

q(3, "Which net entitlement line does the engine print when the EKN-1 royalty is stated as a production tax?",
 "net entitlement: 70% working interest; the 15% payment is a production tax, so no volume is deducted (PRMS 3.3.1.2)",
 ["net entitlement: 70% working interest less the 15% royalty interest (PRMS 3.3.1.1)",
  "net entitlement: the 70% working interest less 15 points of production tax",
  "net entitlement: 100% of the gross, since a production tax is paid by the buyer"],
 "The engine names the form it applies. With a production tax it takes out no volume and says so, citing PRMS 3.3.1.2. The line with \"less the 15% royalty interest\" is printed for the royalty-interest form. The engine subtracts no percentage points from the working interest, and a production tax leaves the working interest of 70 percent in place.")

q(2, "On EKN-1, the royalty form changes from royalty interest to production tax. What happens to the best case's undiscounted net cash flow at 100 percent?",
 "Nothing: it is 382377266.937500 under both forms",
 ["It rises, as no volume is charged",
  "It falls, since the tax is charged on top of the royalty",
  "No figure at all: it is refused until the rate is restated"],
 "The form changes the volumes and leaves the money alone: the royalty is paid at the same 15.000000 percent either way, and the canonical cash flow charges it the same way, so the best case is 382377266.937500 under both forms and every economic limit stays. No second charge is made, and the form is a stated word that needs no restated rate.")

q(0, "The EKN-1 2P on the net-entitlement basis is 9908615.920000 barrels of oil and 7926892.855000 Mscf of gas, with 6.000000 Mscf per BOE stated. What 2P in BOE does the engine report?",
 "11229764.729167",
 ["9908615.920000, the oil alone, since BOE is supplementary",
  "13211487.916667, the gas added at one Mscf per barrel",
  "7926892.855000, the gas alone in its own unit"],
 "BOE counts a barrel of oil as one and converts the gas at the stated factor, so the 2P is the oil plus the gas over 6, which the engine returns as 11229764.729167. Supplementary does not mean the gas is left out. 13211487.916667 is the working-interest 2P in BOE, a different basis. The gas alone in Mscf is no BOE figure.")

q(3, "Why does the engine call its BOE figures supplementary and cite PRMS 3.2.9.3?",
 "The factor is a heating-value convention that says nothing about price",
 ["BOE is the unit in which the Reserves categories are first decided",
  "The gas is valued at the oil price once it is converted to BOE",
  "BOE figures are reported only when the gas is sold under contract"],
 "A barrel of oil and six Mscf of gas rarely sell for the same money, so the BOE is given beside the oil and the gas in their own units, with its factor stated. The cash flow prices each product at its own stated price. The engine uses BOE to check that the three cases stay in order, and it reports BOE on every call whatever the gas contract.")

q(1, "The Mscf per BOE control is set to 0. Which message does the engine return?",
 "Refused on mscfPerBoe, with 0 printed back",
 ["The oil alone in BOE",
  "mscfPerBoe must be a finite number above 0; got nothing",
  "An unknown-key refusal"],
 "A factor of 0 would divide by nothing, so it is refused with the value printed as given, 0. The message ending \"got nothing\" belongs to a factor left out altogether. The engine never drops the gas silently, and mscfPerBoe is an accepted key of economicLimit.")

q(2, "The EKN-1 best case returns 382377266.937500 undiscounted at 100 percent. What does the engine report at the stated 70.000000 percent working interest?",
 "267664086.856250",
 ["382377266.937500, since cash is reported at 100 percent only",
  "223054374.878798, the best case NPV at the working interest",
  "318649106.969712, the best NPV at 100 percent at the stated rate"],
 "The engine runs the cash flow once at 100 percent and scales the undiscounted net cash flow and the NPV by the stated working interest through applyJV, so the best case is 267664086.856250 at 70.000000 percent. The engine reports both the 100 percent and the share columns. 223054374.878798 and 318649106.969712 are NPVs at 10.000000 percent, at the share and at 100 percent.")

q(0, "Why does the engine scale the cash by the working interest alone, with no royalty taken out a second time?",
 "The canonical ledger already charges the royalty before tax",
 ["The royalty applies to volumes alone and stays out of every cash flow",
  "The royalty is charged only when the form is a production tax",
  "Net entitlement is a gross basis, so no share is taken"],
 "The royalty is already in the cash flow: the canonical ledger charges it as a cost of production before any tax, whichever form is stated. Net entitlement takes the royalty out of the volumes for reporting, and scaling the cash by the net entitlement share would charge the royalty holder's share twice. The ledger charges it under both forms, and net entitlement is a share basis.")

q(1, "Why are the economic limits and verdicts of EKN-1 the same on the gross, working-interest and net-entitlement bases?",
 "The cash flow and the test run at 100 percent before any scaling",
 ["One stored limit is copied to each basis",
  "The limits move with the basis, and they only look alike at 70 percent",
  "Each basis is tested at its own share, and all three happen to pass"],
 "The economic test and the canonical economic limit of each case are run on the whole project, and the basis is applied only to the kept quantities afterwards, so the low, best and high limits stay at 2033, 2037 and 2040 on every basis. A project either pays or does not, and the company's share of it does not change that.")

q(3, "A working interest of 0 is stated. What does the engine return?",
 "It refuses workingInterestPct, which must lie above 0 and at most 100",
 ["Zero Reserves on every basis, with the project still tested at 100 percent",
  "The gross figures, since a working interest of 0 reads as not stated",
  "workingInterestPct must be stated; got nothing"],
 "The engine's message reads \"workingInterestPct must be a number above 0 and at most 100; got 0\". A company holding no share of the project has nothing of it to report. A refusal returns no figures, and 0 is a stated value, which the engine reads as stated; a working interest left out draws the same refusal ending \"got nothing\".")

q(0, "A box states reportingBasis as \"net\". What is refused, and how?",
 "reportingBasis, which must be one of \"gross\", \"working-interest\", \"net-entitlement\"",
 ["Nothing: \"net\" is read as net entitlement and the figures are printed",
  "royalty.form, which must change to production-tax for a net basis",
  "workingInterestPct, which a net basis needs stated as 100"],
 "The basis is stated with the words the engine reads, and anything else is refused, verbatim: \"reportingBasis must be one of \"gross\", \"working-interest\", \"net-entitlement\"; got \"net\"\". The engine maps no near-match onto an accepted word. The royalty form and the working interest are separate stated inputs that the basis does not constrain.")

q(2, "A royalty of 100 percent is stated. Which field does the engine refuse?",
 "royalty.ratePct, which must be from 0 to below 100",
 ["royalty.form, which must become production-tax at 100",
  "workingInterestPct, which must fall to 0 with the royalty",
  "None: every figure reads 0.000000"],
 "The rate is stated as a percent from 0 up to, but short of, 100, and the engine refuses 100 with the message \"royalty.ratePct must be a number from 0 to below 100; got 100\". A full royalty would hand every barrel to the royalty holder. The form is a separate stated word and the working interest a separate stated percent, and neither is touched. A refused call prints no figures.")

q(1, "On the working-interest basis, the working interest is set to 100 and nothing else moves. What 2P oil does the engine report?",
 "16653136.000000, the gross figure",
 ["11657195.200000, still the 70.000000 percent share",
  "9908615.920000, since the royalty interest still comes out",
  "18252916.000000"],
 "At 100 percent the working-interest scaling takes nothing away, so the working-interest basis equals the gross: 16653136.000000 barrels, the best case to its economic limit. 11657195.200000 is the 70 percent share. The royalty interest comes out only on the net-entitlement basis. The technical best case is the forecast before the licence and limit cuts.")

emit(Q, '/root/cat-wip-prms/banks/ec11i_m05.json', expect_n=15)
finish()
