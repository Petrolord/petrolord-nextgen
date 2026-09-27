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

# SC5 Associate m06, Nigerian Content in Execution. 15 questions.
# Lessons: The content Act and the Board; First consideration in practice; Nigerians employed and trained on the job; Plans and reports a contract carries; Preparing for the Associate exam.
# Topics: T01, T10.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# FILLED AT THE BANK STAGE (Associate bank writer).

q(3, "EKC-03 is a synthetic camp catering contract with CF-C (synthetic). CF-C's manager writes that Nigerian content is Ekene's business as operator, so CF-C need not supply the content information its contract asks for. Which provision of the Nigerian Oil and Gas Industry Content Development Act 2010 (the content Act) answers this first?",
 "Section 2, which names contractors and subcontractors among those who must treat Nigerian content as an important element of project execution.",
 ["Section 106, which defines Nigerian content so widely that every company paid by an operator counts as an operator itself under the content Act.",
  "Section 7, which requires CF-C to submit its own Nigerian Content Plan to the Board before each monthly service.",
  "Section 35, which requires CF-C to employ only Nigerians in every grade of its catering team."],
 "The content Act, s.2, names regulatory authorities, operators, contractors, subcontractors, alliance partners and other entities involved in any project in the industry as bound to consider Nigerian content as an important element of project execution. So CF-C is bound as well as Ekene. Section 106 is a definition and makes nobody an operator, s.7 places the plan duty on the operator, and s.35 covers junior and intermediate cadres only.",
 ['P100'])

q(1, "An operator, contractor or sub-contractor carries out a project contrary to the content Act. What does the content Act, s.68, make them liable to on conviction?",
 "A fine of five per cent of the project sum for each project, or cancellation of the project.",
 ["A fine of one per cent of every contract, deducted at source by the operator and paid into the Fund.",
  "A fine set by the Bureau of Public Procurement, of up to 15% of the value of the contract concerned.",
  "A written warning only, since the content Act creates no offence of its own."],
 "The content Act, s.68, says an operator, contractor or sub-contractor who carries out any project contrary to its provisions commits an offence and is liable upon conviction to a fine of five per cent of the project sum for each project in which the offence is committed, or cancellation of the project. The one per cent in s.104(2) is a deduction into the Fund, which is no penalty, and 15% is the ceiling on a mobilisation fee in the Public Procurement Act 2007, s.35(1).",
 ['P133'])

q(2, "How does the content Act, s.106, define Nigerian content?",
 "The quantum of composite value added to or created in the Nigerian economy through the deliberate use of Nigerian human and material resources and services.",
 ["The share of a contract's value paid to companies with a registered office in Nigeria.",
  "The number of Nigerian citizens on a project's payroll on the day of award.",
  "The percentage of a project's steel that is bought from Nigerian mills."],
 "Section 106 defines Nigerian content as the quantum of composite value added to or created in the Nigerian economy by a systematic development of capacity and capabilities through the deliberate utilisation of Nigerian human, material resources and services in the Nigerian oil and gas industry. A registered office, a headcount on one day or a single material each captures only a sliver of that value added.",
 ['P135'])

q(0, "What does the content Act, s.62, give the Board to do with the Nigerian Content Performance Reports that operators file?",
 "Undertake regular assessment and verification of them.",
 ["Publish each report unread, with no checking of the figures inside.",
  "Return them to the operators' contractors to be rewritten each year.",
  "Forward them to the Bureau, which alone may verify content figures."],
 "The content Act, s.62, provides that the Board shall undertake regular assessment and verification of the Nigerian Content Performance Report filed by all operators, and s.70(k) adds the Board's function of making auditing procedures and conducting regular audits. The Bureau of Public Procurement has no role in content reports, and reports are verified, which rules out publishing them unread.",
 ['P129'])

q(1, "EKC-05 is a synthetic flowline replacement: FW-E (synthetic) works under a lump sum with a Nigerian content plan covering fabrication and labour. FW-E proposes to fabricate and weld a set of spool pieces at its parent company's yard outside Nigeria, because it would deliver sooner. What should Ekene's reply rest on?",
 "The content Act, s.53, which requires all fabrication and welding to be done in the country.",
 ["The contract's lump sum, which lets FW-E choose any yard so long as the price does not change.",
  "The content Act, s.50, which allows offshore work once the National Insurance Commission agrees.",
  "The UK Sourcing Playbook, which lets a supplier move work abroad to protect the schedule."],
 "The content Act, s.53, provides that all operators, project promoters, contractors and any other entity engaged in the industry shall carry out all fabrication and welding activities in the country. The reply cites it with the contract's own content plan and asks for an in-country plan. Section 50 governs placing insurance risk offshore, a lump sum price does not override the content Act, and UK guidance does not govern an Ekene contract.",
 ['P125'])

q(0, "A supplier on a synthetic Ekene contract plans to place part of its insurance cover with an underwriter abroad. Under the content Act, s.50, what is needed first?",
 "The written approval of the National Insurance Commission.",
 ["The approval of the Bureau, given within 30 days of the request.",
  "Nothing, since insurance is outside the content Act's reach.",
  "A letter from the supplier's broker saying the price is lower."],
 "The content Act, s.50, provides that no insurance risk in the Nigerian oil and gas industry shall be placed offshore without the written approval of the National Insurance Commission, which shall ensure that Nigerian local capacity has been fully exhausted. The Bureau has no role here, a cheaper foreign price is not a ground, and insurance is squarely inside the content Act.",
 ['P122'])

q(3, "A trainee asks what minimum Nigerian content percentages apply to the items on EKC-04, the synthetic TB-D casing frame agreement. What does the content Act, s.11(3), say, as this course teaches it?",
 "Operators, alliance partners and contractors comply with the minimums in the schedule to the content Act, which is read in the content Act itself.",
 ["There are no minimums, since the content Act leaves content levels to each supplier's choice.",
  "The minimums are set by each operator's contract manager at the kick-off meeting.",
  "The minimums are 50% for every item, as the content Act applies one level across the board."],
 "The content Act, s.11(3), provides that all operators, alliance partners and contractors shall comply with the minimum Nigerian content for particular project items, services or product specifications set out in the schedule to the content Act. The schedule's minimums are read in the content Act itself, and this course states none of them. A contract manager does not set them, and no single level across all items appears in s.11(3).",
 ['P106'])

q(2, "For the work programme a Nigerian Content Plan covers, what does the content Act, s.10(1)(a), give first consideration to?",
 "Services provided from within Nigeria and goods manufactured in Nigeria.",
 ["The lowest priced goods and services on offer, whatever the country they come from.",
  "Goods from any member of the operator's own corporate group, wherever it is based.",
  "Services from suppliers registered on the UK continental shelf."],
 "The content Act, s.10(1)(a), provides that first consideration shall be given to services provided from within Nigeria and to goods manufactured in Nigeria, and s.10(1)(b) gives Nigerians first consideration for training and employment. Price alone, corporate group membership and a UK registration are not what s.10(1) names.",
 ['P105'])

q(1, "EKC-02 is a synthetic vessel charter with MV-B (synthetic); its crew complement names positions for Nigerian seafarers and trainees. This month one trainee position is empty and a named Nigerian position is filled by a foreign seafarer. Which provision should the note to MV-B cite with the charter?",
 "The content Act, s.28(1): Nigerians get first consideration for employment and training.",
 ["The content Act, s.32, which reserves five per cent of all crew positions for expatriates.",
  "The content Act, s.60, which requires MV-B to fill each position within sixty days.",
  "The Public Procurement Act 2007, s.16(28), which covers the skill of every crew member."],
 "The content Act, s.28(1), provides that Nigerians shall be given the first consideration for employment and training in any project executed by any operator or project promoter in the industry, and the charter's crew complement carries that duty to MV-B. Section 32 concerns management positions retained as expatriate positions, s.60 is the operator's annual report, and s.16(28) of the 2007 Act is a warranty rule for federal procurement.",
 ['P112'])

q(3, "An MV-B (synthetic) crew list on EKC-02, the synthetic vessel charter, shows a foreign national in a junior deck rating that the company designates as junior cadre. Which provision speaks to this?",
 "The content Act, s.35: only Nigerians in junior and intermediate cadres.",
 ["The content Act, s.32, which allows up to five per cent of any grade to be held by expatriates.",
  "The content Act, s.34, which applies a labour clause to every charter whatever its budget.",
  "The UK Procurement Act 2023, s.52, which sets crew standards for vessels over £5 million."],
 "The content Act, s.35, provides that all operators and companies operating in the industry shall employ only Nigerians in their junior and intermediate cadre or any corresponding grades designated by the operator or company. Section 32 concerns management positions, s.34 applies to projects or contracts whose total budget exceeds $100 million (USD), and the UK Act sets KPIs for UK public contracts with nothing to say on crews.",
 ['P119'])

q(0, "MV-B (synthetic) says no qualified Nigerian seafarer was available for a trainee position on EKC-02, the synthetic vessel charter. Under the content Act, s.30, what does the operator have to ensure where Nigerians are not employed for lack of training?",
 "That every reasonable effort is made within a reasonable time to supply that training, locally or elsewhere.",
 ["That the position is filled permanently by a foreign seafarer, since training takes too long to be reasonable.",
  "That the Board pays for the training out of the Fund.",
  "That the charter is ended and let to another owner."],
 "The content Act, s.30, provides that where Nigerians are not employed because of their lack of training, the operator shall ensure, to the satisfaction of the Board, that every reasonable effort is made within a reasonable time to supply such training locally or elsewhere. So the manager asks MV-B what training is under way. A permanent foreign hire, a Board-funded course or ending the charter are not what s.30 provides.",
 ['P114'])

q(2, "Ekene must report on employment and training for its projects. Under the content Act, s.29, how often does the operator report this to the Board, and against what?",
 "Quarterly, against the Employment and Training Plan in its Nigerian Content Plan.",
 ["Annually, against a target the supplier sets for itself at the start of the year.",
  "Monthly, against a headcount limit set by the Bureau of Public Procurement.",
  "Only at the end of a project, against the contract's final account."],
 "The content Act, s.29, requires every plan to carry an Employment and Training Plan covering hiring and training needs of the operator and its major contractors, skill shortages, project training and forecast spend, and the operator reports to the Board quarterly against it, including new hires, their place of residence at hiring and their employment status. The Bureau has no role here, and the supplier does not set the target.",
 ['P113'])

q(0, "Before Ekene carries out a new project in the Nigerian oil and gas industry, what does the content Act, s.7, require of Ekene as operator?",
 "Submitting a Nigerian Content Plan to the Board showing compliance with the content Act.",
 ["Registering each of its suppliers with the Bureau of Public Procurement before any work starts.",
  "Paying the Board a deposit against the five per cent fine that s.68 could later impose on it.",
  "Publishing its KPIs under the UK Procurement Act 2023."],
 "The content Act, s.7, provides that before carrying out any project in the industry an operator shall submit a Nigerian Content Plan to the Board demonstrating compliance with the Nigerian content requirements of the content Act. The contract's own content plan, where it has one, carries that plan down to the supplier's work. The other options name bodies and duties that s.7 does not.",
 ['P103'])

q(1, "Ekene files its annual Nigerian Content Performance Report. What deadline does the content Act, s.60, set?",
 "Within sixty days of the beginning of each year.",
 ["Within thirty days of the end of each quarter, like the contract listing.",
  "Within twelve months of the last contract in the year being awarded.",
  "At any time the Board asks, with no fixed date at all."],
 "The content Act, s.60, says that within sixty days of the beginning of each year, each operator shall submit to the Board its annual Nigerian Content Performance Report covering all its projects and activities for the year under review. The thirty day window belongs to the quarterly contract listing under s.24(1), and s.60 does fix a date.",
 ['P127'])

q(2, "Under the content Act, s.24(1), what does Ekene submit to the Board within 30 days at the end of each quarter?",
 "A listing of the contracts, subcontracts and purchase orders above $1,000,000 (USD) awarded in the previous quarter.",
 ["A copy of every invoice paid in the quarter, whatever its value.",
  "The annual Nigerian Content Performance Report for the year before.",
  "A list of every supplier whose KPIs were missed during the quarter."],
 "The content Act, s.24(1), requires the operator to submit to the Board, within 30 days at the end of each quarter, a listing of all contracts, subcontracts and purchase orders exceeding $1,000,000 (USD), or such other limit as the Board may determine, awarded in the previous quarter. The annual report falls under s.60, and the content Act asks for no quarterly invoice copies or KPI lists.",
 ['P109'])

emit(Q, '/root/cat-wip-contracts/banks/sc5b_m06.json', expect_n=15)
finish()
