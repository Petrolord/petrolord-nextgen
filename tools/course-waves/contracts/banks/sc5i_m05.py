import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
TRACE=[]
def q(k,p,c,ds,e,src):
    # k the key's index (0 to 3), p the prompt, c the correct option, ds the
    # three distractors, e the explanation, src the PACK.md passage ids (P001
    # style) the key rests on: at least one, read by gate_source_trace.py and
    # never printed to a learner.
    Q.append((k,p,c,ds,e)); TRACE.append(list(src))

# SC5 Professional m05, Nigerian Content Obligations in Depth. 15 questions.
# Lessons: The Nigerian content plan; Employment and expatriate positions; Training and capacity building; Performance reports and monitoring.
# Topics: T10.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# ---- questions (Professional bank writer) ----
q(1,
  "Ekene (synthetic) plans a new well intervention project in the Nigerian oil and gas industry. Under the content Act, s.7, when does the operator submit its Nigerian Content Plan to the Board?",
  "In the bidding for any licence, permit or interest, and before carrying out any project",
  ["Within sixty days of the beginning of the year after the project is completed on the Ekene site",
   "Only when the Board asks for one after a monitoring visit to the project's site office",
   "At the first quarterly review of the main contract, once the contractor has mobilised"],
  "The content Act (Act No. 2 of 2010), s.7, requires an operator, in the bidding for any licence, permit or interest and before carrying out any project, to submit a Nigerian Content Plan to the Board demonstrating compliance. Sixty days from the start of each year is the annual performance report under s.60. The plan does not wait for a Board request or a contract review, because it comes before the work.",
  ['P103'])

q(0,
  "The Board (NCDMB) holds a public review of Ekene's (synthetic) Nigerian Content Plan for a new project. Under the content Act, ss.8 and 9, what follows?",
  "If satisfied, the Board issues a Certificate of Authorization, and a public review ends with the certificate issued or denied within 30 days from its start",
  ["The Bureau of Public Procurement issues a no objection certificate within sixty days of receiving the plan",
   "The plan is approved automatically if the Board has not objected by the end of the project's first quarter",
   "The Board registers the plan on the Joint Qualification System, which serves as the project's approval"],
  "Under the content Act, ss.8 and 9, the Board reviews the plan and, if satisfied, issues a Certificate of Authorization for the project; where it runs a public review, the review is completed and the certificate issued or denied within 30 days from the start of the review. The Bureau has no role under the content Act, no deemed approval is provided, and the Joint Qualification System is a registration and pre-qualification system.",
  ['P104'])

q(3,
  "Reviewing the Nigerian content plan inside EKC-05 (synthetic), the contract manager checks it carries the two first considerations the content Act, s.10(1), requires. Which is one of them?",
  "First consideration for services provided from within Nigeria and goods manufactured in Nigeria",
  ["First consideration for the lowest priced bid, whatever the country of origin of its goods or services",
   "First consideration for suppliers already holding a contract with the same operator elsewhere",
   "First consideration for any company whose parent is listed on the Nigerian Exchange"],
  "The content Act, s.10(1), requires that (a) first consideration be given to services provided from within Nigeria and to goods manufactured in Nigeria, and (b) Nigerians be given first consideration for training and employment in the work programme. Lowest price, an existing relationship with the operator and a parent's listing are not first considerations the section sets.",
  ['P105'])

q(2,
  "FW-E (synthetic) proposes to have the EKC-05 spool pieces fabricated and welded at its parent company's yard outside Nigeria to save time. What does the content Act, s.53, provide?",
  "All fabrication and welding activities are to be carried out in the country",
  ["Fabrication may go abroad whenever the project programme would otherwise slip",
   "Welding abroad is allowed if the Board is told within 30 days after it is done",
   "The rule covers operators only, so a contractor may weld where it likes"],
  "The content Act, s.53, provides that all operators, project promoters, contractors and any other entity engaged in the Nigerian oil and gas industry shall carry out all fabrication and welding activities in the country. It gives no exception for programme pressure and no after-the-event notice route, and it names contractors expressly. The contract manager declines the proposal and asks for a schedule with fabrication in Nigeria.",
  ['P125'])

q(0,
  "EKC-02 (synthetic) states a crew complement with named positions for Nigerian seafarers. MV-B's Nigerian second officer resigns and MV-B proposes an expatriate officer from its own fleet. Which provision should the contract manager's reply cite first?",
  "The content Act, s.28(1): Nigerians are given first consideration for employment and training",
  ["The content Act, s.32: up to five per cent of any vessel crew may be expatriate without any approval",
   "The UK Procurement Act 2023, s.52: crew positions count among the KPIs of any public contract abroad",
   "The content Act, s.60: crew changes are reported in the annual report and need nothing more from MV-B"],
  "The content Act, s.28(1), gives Nigerians first consideration for employment and training in any project executed by an operator in the Nigerian oil and gas industry, and the charter's named positions carry that into the contract. Section 32 concerns management positions retained by an operator with the Board's approval and says nothing of crew, the UK Act does not bind Ekene, and s.60 is the annual report, which does not settle a staffing change.",
  ['P112'])

q(2,
  "A contractor on an Ekene contract (synthetic) proposes to bring in foreign staff for its junior cadre on a busy campaign. Under the content Act, s.35, what is the rule for junior and intermediate cadre?",
  "Only Nigerians are employed in the junior and intermediate cadre or corresponding grades",
  ["Foreign staff may fill up to half of the junior cadre for a campaign lasting under a year",
   "The rule binds operators alone, so a contractor may staff its junior cadre however it chooses",
   "Foreign staff may be used where the contract's labour clause is silent on junior grades"],
  "The content Act, s.35, requires all operators and companies operating in the Nigerian oil and gas industry to employ only Nigerians in their junior and intermediate cadre or corresponding grades. It sets no share for foreign staff, it covers companies operating in the industry and so reaches contractors, and a contract's silence cannot override the content Act.",
  ['P119'])

q(1,
  "A synthetic Ekene project contract has a total budget above $100 million (USD). Under the content Act, s.34, what must it contain, and who sets the percentage?",
  "A Labour Clause mandating a minimum percentage of Nigerian labour in specific cadres, as the Board stipulates",
  ["A Labour Clause setting fifty per cent Nigerian labour in all cadres, as the content Act itself prints it",
   "A Labour Clause setting a percentage the operator and contractor agree between them at contract award",
   "A Labour Clause only if the project is offshore, with its percentage set by the Ministry of Labour"],
  "The content Act, s.34, requires all projects or contracts whose total budget exceeds $100 million (USD) to contain a Labour Clause mandating a minimum percentage of Nigerian labour in specific cadres as the Board may stipulate. The content Act prints no percentage, so none is taught here; fifty per cent is the equipment ownership figure of s.41(2). The parties do not set it themselves, and the section is not limited to offshore work or given to a ministry.",
  ['P118'])

q(3,
  "An expatriate engineer holds a position on a synthetic Ekene project. Under the content Act, s.31(1), what does the operator's succession plan provide?",
  "A Nigerian understudies the incumbent for at most four years, after which the post is Nigerianised",
  ["A Nigerian understudies the incumbent until the expatriate chooses to leave the Nigerian project",
   "The expatriate stays in post for the life of the project, and a Nigerian is trained for the next one",
   "The post is Nigerianised at once, and the expatriate is kept on as an adviser for a further agreed period"],
  "The content Act, s.31(1), requires the operator to submit a succession plan for any position not held by Nigerians, providing for Nigerians to understudy each incumbent expatriate for a maximum of four years, after which the position becomes Nigerianised. It is not open-ended, it does not wait for the next project, and it does not Nigerianise the post at once.",
  ['P115'])

q(3,
  "The synthetic Ekene operator is reviewing expatriate positions across one of its operations. Under the content Act, s.32, what may it retain as expatriate positions?",
  "A maximum of five per cent of management positions, as the Board may approve",
  ["A maximum of ten per cent of all positions, without any Board approval at all",
   "Any number of management posts, provided each has a four-year succession plan",
   "A maximum of fifty per cent of technical positions, as the contractor decides"],
  "The content Act, s.32, lets an operator or project promoter retain a maximum of five per cent of management positions, as may be approved by the Board, as expatriate positions to take care of investor interests. Ten per cent is the Nigerian bank account figure of s.52(3)(f), fifty per cent is the equipment figure of s.41(2), and a succession plan under s.31 does not lift the ceiling.",
  ['P116'])

q(1,
  "A contractor on an Ekene contract (synthetic) needs an expatriate specialist and asks Ekene to apply straight to the Ministry of Internal Affairs for quota. Under the content Act, s.33(1), what comes first?",
  "An application to the Board, and its approval, before any expatriate quota application to the Ministry",
  ["An application to the Ministry first, with the Board simply told afterward in the operator's next annual report",
   "A notice to the Bureau of Public Procurement, since expatriate hiring is a procurement matter",
   "Nothing further, since the contractor's own quota covers every specialist it chooses to bring"],
  "The content Act, s.33(1), requires operators to apply to, and receive the approval of, the Board before making any application for expatriate quota to the Ministry of Internal Affairs or any other agency or ministry of the Federal Government. The order is Board first. The Bureau has no role here, and the contractor's proposal is read against ss.31 to 33 by the operator before any answer.",
  ['P117'])

q(0,
  "IM-F (synthetic) brings a specialist from abroad for every gas analyser calibration on EKC-06, saying no Nigerian technician in its team is qualified, and has no training plan for the task. Under the content Act, s.30, what does the shortage trigger?",
  "A duty on the operator to ensure every reasonable effort is made within a reasonable time to supply the training",
  ["A permanent exemption for the calibration task, since the lack of trained Nigerians has been shown",
   "An automatic fine on IM-F of five per cent of the contract sum for each visit made from abroad",
   "Nothing, since training duties arise only on contracts whose budget exceeds $100 million (USD)"],
  "The content Act, s.30, provides that where Nigerians are not employed because of their lack of training, the operator shall ensure, to the satisfaction of the Board, that every reasonable effort is made within a reasonable time to supply such training locally or elsewhere. A shortage is not an exemption, s.68's fine follows conviction for an offence and is not applied per visit, and $100 million is the labour clause threshold of s.34.",
  ['P114'])

q(2,
  "The synthetic Ekene operator has to report on employment and training under its Nigerian Content Plan. Under the content Act, s.29, how often does it report to the Board against its Employment and Training Plan?",
  "Quarterly, including new hires, their place of residence when hired, and their employment status",
  ["Annually only, in the performance report filed within sixty days of the start of each calendar year",
   "Only when a contractor asks, since training records belong in each contractor's own personnel files",
   "Monthly, in the contractor's service report, which the operator forwards without review"],
  "The content Act, s.29, has every plan carry an Employment and Training Plan and has the operator report to the Board quarterly on employment and training against it, including new hires, their place of residence at hiring, and their employment status. The annual report under s.60 is a separate duty, and the operator reports; a contractor's records feed that report.",
  ['P113'])

q(0,
  "The synthetic Ekene operator is planning its reporting calendar. Under the content Act, s.60, when is the annual Nigerian Content Performance Report due to the Board?",
  "Within sixty days of the beginning of each year",
  ["Within 30 days after the end of each quarter of the year",
   "At the end of each project, whatever the project's length",
   "Within six months of the end of the operator's financial year"],
  "The content Act, s.60, requires each operator to submit its annual Nigerian Content Performance Report, covering all its projects and activities for the year under review, within sixty days of the beginning of each year. Thirty days after each quarter is the s.24(1) listing of contracts awarded, and the section sets neither a per-project date nor a six-month window.",
  ['P127'])

q(3,
  "WS-A's (synthetic) quarterly content report under EKC-01 gives the number of Nigerian staff on the framework but no hours worked. Why is a head count not enough for the operator's annual report under the content Act, s.61?",
  "Section 61 sets out employment as hours or days worked by Nigerian and foreign workers",
  ["Section 61 asks for the names and home addresses of every worker on each of the contracts",
   "Section 61 reports only spend, so the head count is surplus to what the operator needs",
   "Section 61 reports tonnage, so staff numbers are converted into tonnes of materials used"],
  "Under the content Act, s.61, the annual report sets out Nigerian content by category of spend on current and cumulative cost bases, employment achievement as hours or days worked by Nigerian and foreign workers, and procurement as quantity and tonnage of materials. A head count cannot supply hours worked. The section does not ask for names and addresses, it covers more than spend, and tonnage measures materials.",
  ['P128'])

q(1,
  "EKC-01 (synthetic) includes a term obliging WS-A to report Nigerian content information to Ekene. Which provision of the content Act requires the operator to put such a term in place?",
  "Section 65: contractors are contractually bound to report to the operator and, if the Board asks, to the Board",
  ["Section 7: the plan submitted at bidding already obliges every contractor on the project to report to the operator",
   "Section 104(2): the Fund deduction brings with it a duty on each contractor to report its content",
   "Section 35: employing only Nigerians in junior grades is reported by the contractor to the operator"],
  "The content Act, s.65, requires the operator to ensure that its partners, contractors and subcontractors are contractually bound to report Nigerian content information to the operator and, if requested by the Board, directly to the Board. Section 7 is the operator's plan, s.104(2) concerns the one per cent deduction into the Fund, and s.35 sets the junior cadre rule without creating a reporting term.",
  ['P131'])
# ---- end of questions ----

emit(Q, '/root/cat-wip-contracts/banks/sc5i_m05.json', expect_n=15)
finish()
