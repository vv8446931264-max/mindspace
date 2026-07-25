import type { ExamContext } from "@/types";

/**
 * "What happens next" content (ROADMAP-v2 P2.2).
 *
 * Why this file exists: in the Karnataka SSLC results-day helpline data, the
 * largest single category of calls was informational - 203 of 532, larger than
 * emotional at 191. People rang to ask how re-evaluation works, what a grade
 * means, and what options were left. In the hours after a result,
 * "I do not know what my options are" is an acute state, and small-town
 * students widely and wrongly believe that missing NEET leaves only expensive
 * private colleges.
 *
 * Tone rules for every string in this file:
 * - Factual and procedural. Describe processes, not feelings.
 * - No affirmations, no encouragement, no "you can do it". This cohort
 *   explicitly resents toxic positivity.
 * - Short sentences, Grade 6-8 reading level.
 * - Never state a deadline as fact unless it was verified. A wrong claim about
 *   a counselling deadline can cost someone a seat.
 *
 * Accuracy: every item carries `verified`. `true` means the claim was
 * corroborated during research. `false` means it is a general pattern that has
 * exceptions and must be checked. Rules that recently changed carry `caution`.
 * Nothing here lists fees or exact deadlines - those change every cycle and
 * belong on the official page linked in `source`.
 */

/** How a pathway relates to the result the student just received. */
export type PathwayCategory =
  | "recheck_result"
  | "retake_same_exam"
  | "remaining_rounds"
  | "same_field_other_route"
  | "adjacent_field"
  | "restart_qualification";

/** One concrete option, with a factual description of how it works. */
export type Pathway = {
  /** Stable slug. Safe to persist. */
  readonly id: string;
  readonly examContext: ExamContext;
  readonly category: PathwayCategory;
  /** Short name of the option. */
  readonly title: string;
  /** How it actually works. Procedural, 1-4 short sentences. */
  readonly description: string;
  /** Who this applies to, so a student can skip what is not theirs. */
  readonly whoItIsFor: string;
  /** Whether the claim was corroborated during research. */
  readonly verified: boolean;
  /** Official page, where one exists. */
  readonly source?: string;
  /** A rule that changed, or a limit on how far the claim generalises. */
  readonly caution?: string;
};

/** Pathways of one category, with a plain heading for the group. */
export type PathwayGroup = {
  readonly category: PathwayCategory;
  readonly heading: string;
  readonly items: readonly Pathway[];
};

/** Plain-language heading for each category. No jargon, no exclamation marks. */
export const PATHWAY_CATEGORY_HEADINGS: Readonly<
  Record<PathwayCategory, string>
> = Object.freeze({
  recheck_result: "Checking the result itself",
  retake_same_exam: "Taking the same exam again",
  remaining_rounds: "Rounds that are still open",
  same_field_other_route: "Same field, a different route",
  adjacent_field: "Related fields",
  restart_qualification: "If Class 10 or Class 12 is not cleared",
});

/** Order groups are returned in: nearest-term action first. */
const CATEGORY_ORDER: readonly PathwayCategory[] = [
  "recheck_result",
  "remaining_rounds",
  "same_field_other_route",
  "adjacent_field",
  "retake_same_exam",
  "restart_qualification",
];

const PATHWAYS: readonly Pathway[] = Object.freeze([
  // ---------------------------------------------------------------- JEE ----
  {
    id: "jee-answer-key-challenge",
    examContext: "JEE",
    category: "recheck_result",
    title: "Answer key challenge",
    description:
      "NTA puts out a provisional answer key and your recorded responses before the result. There is a short window to challenge an answer, with a fee per question that is refunded if your challenge is accepted. Once the result is out, NTA does not re-check or re-total JEE Main scores.",
    whoItIsFor: "Anyone who thinks a question was marked wrongly.",
    verified: true,
    source: "https://jeemain.nta.nic.in/",
  },
  {
    id: "jee-adv-response-sheet",
    examContext: "JEE",
    category: "recheck_result",
    title: "JEE Advanced response sheet and answer key",
    description:
      "The organising IIT releases your response sheet and the answer key with a feedback window before the result. After the result there is no re-evaluation.",
    whoItIsFor: "JEE Advanced candidates.",
    verified: true,
    source: "https://jeeadv.ac.in/",
  },
  {
    id: "jee-josaa-later-rounds",
    examContext: "JEE",
    category: "remaining_rounds",
    title: "Later JoSAA rounds",
    description:
      "JoSAA runs several rounds. A seat you hold can change in a later round if you choose float or slide, because candidates above you leave for other seats. Round 1 is not the final answer. You must respond in every round or you drop out of the process.",
    whoItIsFor: "Anyone in JoSAA counselling.",
    verified: true,
    source: "https://josaa.nic.in/",
  },
  {
    id: "jee-csab-special",
    examContext: "JEE",
    category: "remaining_rounds",
    title: "CSAB special rounds",
    description:
      "After JoSAA ends, CSAB runs special rounds for NIT, IIIT and GFTI seats that are still empty. You have to register again from scratch - your JoSAA choices do not carry over. Seats here are often in newer NITs, less crowded branches, or GFTIs.",
    whoItIsFor:
      "JEE Main qualified candidates with no seat, or an unwanted seat, after JoSAA.",
    verified: true,
    source: "https://csab.nic.in/csab-special/",
  },
  {
    id: "jee-state-counselling",
    examContext: "JEE",
    category: "same_field_other_route",
    title: "State engineering counselling",
    description:
      "Most states run their own engineering counselling with a home-state quota. Several states fill a share of seats on JEE Main rank instead of a state entrance test. Registration is separate from JoSAA and usually opens in July or August.",
    whoItIsFor: "Anyone with a JEE Main rank and a state domicile.",
    verified: true,
    caution:
      "Which seats accept JEE Main rank, and the domicile rules, differ by state. Check your own state's counselling authority.",
  },
  {
    id: "jee-state-cets",
    examContext: "JEE",
    category: "same_field_other_route",
    title: "State entrance exams",
    description:
      "States run their own engineering entrance exams - for example MHT CET, KCET, WBJEE, AP EAPCET, TS EAMCET, KEAM. They have their own dates, usually in April and May, and their own counselling. Competition is limited to that state.",
    whoItIsFor: "Students who can meet a state's domicile rules.",
    verified: true,
  },
  {
    id: "jee-private-national-exams",
    examContext: "JEE",
    category: "same_field_other_route",
    title: "Other national engineering entrances",
    description:
      "BITSAT, VITEEE, SRMJEEE, COMEDK and similar exams run on their own calendars and are not linked to JEE. Several hold a second session or a later round after JEE results are out.",
    whoItIsFor: "Anyone still looking for a BTech seat this year.",
    verified: false,
    caution:
      "Dates and eligibility change every year. Check each exam's own site before assuming a session is still open.",
  },
  {
    id: "jee-bsc-cuet",
    examContext: "JEE",
    category: "adjacent_field",
    title: "BSc through CUET UG",
    description:
      "Central universities admit to BSc programmes in Physics, Mathematics, Computer Science, Statistics and similar subjects using CUET UG scores. Each university runs its own admission rounds. There is no single national counselling.",
    whoItIsFor: "Students who want a science degree rather than engineering.",
    verified: true,
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "jee-diploma-lateral-entry",
    examContext: "JEE",
    category: "adjacent_field",
    title: "Diploma, then lateral entry",
    description:
      "A three-year polytechnic diploma can be followed by lateral entry into the second year of a BTech programme. States run their own lateral entry admissions.",
    whoItIsFor:
      "Students who want an engineering degree over a longer route, or need to start earning sooner.",
    verified: false,
    caution:
      "Lateral entry rules, and how many seats are set aside for it, are set state by state. Confirm with your state technical education board.",
  },
  {
    id: "jee-main-attempts",
    examContext: "JEE",
    category: "retake_same_exam",
    title: "How many JEE attempts you have left",
    description:
      "JEE Main can be taken in three consecutive years, with two sessions a year - up to six attempts. There is no upper age limit. JEE Advanced allows a maximum of two attempts in two consecutive years.",
    whoItIsFor: "Anyone deciding whether to repeat a year.",
    verified: true,
    source: "https://jeemain.nta.nic.in/",
  },

  // --------------------------------------------------------------- NEET ----
  {
    id: "neet-answer-key-challenge",
    examContext: "NEET",
    category: "recheck_result",
    title: "Answer key and OMR challenge",
    description:
      "NTA releases your recorded responses and a provisional answer key with a short challenge window, and charges a fee per question that is refunded if the challenge is accepted. This window is the only way to dispute your marks. NTA does not re-check, re-total or re-evaluate NEET answer sheets after the result.",
    whoItIsFor: "Anyone whose score does not match their own calculation.",
    verified: true,
    source: "https://neet.nta.nic.in/",
    caution:
      "The challenge window closes days after the key is published and is not reopened.",
  },
  {
    id: "neet-state-quota",
    examContext: "NEET",
    category: "remaining_rounds",
    title: "State quota is 85 percent of the seats",
    description:
      "Only 15 percent of government MBBS and BDS seats go through the central All India Quota that MCC runs. The other 85 percent are filled by your own state's counselling authority, using the same NEET score. State counselling needs a separate registration, and the cut-off is often lower than the All India Quota cut-off.",
    whoItIsFor:
      "Every NEET qualified candidate who meets their state's domicile rules.",
    verified: true,
    caution:
      "Domicile and eligibility rules differ by state. Check your own state's counselling authority.",
  },
  {
    id: "neet-mcc-aiq",
    examContext: "NEET",
    category: "remaining_rounds",
    title: "All India Quota counselling",
    description:
      "MCC runs counselling for the 15 percent All India Quota with no domicile restriction, so a student from one state can get a seat in another. Registration on mcc.nic.in is compulsory and separate from the exam - qualifying does not register you.",
    whoItIsFor: "Every NEET qualified candidate.",
    verified: true,
    source: "https://mcc.nic.in/ug-medical-counselling/",
  },
  {
    id: "neet-deemed-universities",
    examContext: "NEET",
    category: "remaining_rounds",
    title: "Deemed universities",
    description:
      "Deemed universities fill 100 percent of their seats through MCC counselling, not through state counselling, and there is no state quota in them. You apply for them inside the same MCC process.",
    whoItIsFor: "Candidates considering private medical colleges.",
    verified: true,
    source: "https://mcc.nic.in/ug-medical-counselling/",
    caution: "Deemed university fees are substantially higher than government college fees.",
  },
  {
    id: "neet-mop-up-stray",
    examContext: "NEET",
    category: "remaining_rounds",
    title: "Mop-up and stray vacancy rounds",
    description:
      "After Rounds 1 and 2, seats still empty go to a mop-up round, then to a stray vacancy round. Cut-offs in these rounds are usually lower because fewer candidates are left. Candidates who did not get a seat earlier can register for the mop-up round.",
    whoItIsFor: "Anyone without a seat after the first two rounds.",
    verified: true,
    source: "https://mcc.nic.in/ug-medical-counselling/",
  },
  {
    id: "neet-ayush-aaccc",
    examContext: "NEET",
    category: "same_field_other_route",
    title: "AYUSH courses using the same NEET score",
    description:
      "BAMS, BHMS, BUMS and BSMS admissions use your NEET UG score. AACCC runs central counselling for the 15 percent All India Quota in government and government-aided AYUSH colleges, and for 100 percent of seats in deemed universities and national institutes. States run counselling for the rest.",
    whoItIsFor: "NEET qualified candidates who did not get an MBBS or BDS seat.",
    verified: true,
    source: "https://aaccc.gov.in/ug-counselling/",
  },
  {
    id: "neet-veterinary",
    examContext: "NEET",
    category: "same_field_other_route",
    title: "Veterinary science (BVSc and AH)",
    description:
      "The Veterinary Council of India runs counselling for the 15 percent All India Quota in veterinary colleges, using your NEET UG score. The remaining 85 percent is handled by state authorities. It is a separate registration from MCC.",
    whoItIsFor: "NEET qualified candidates open to veterinary medicine.",
    verified: true,
    source: "https://vci.admissions.nic.in/",
  },
  {
    id: "neet-bsc-nursing",
    examContext: "NEET",
    category: "same_field_other_route",
    title: "BSc Nursing",
    description:
      "BSc Nursing is a four-year degree leading to registration as a nurse. Government nursing colleges cost far less than private medical colleges. Some states now require NEET UG for BSc Nursing admission - Tamil Nadu from 2025-26 and Andhra Pradesh from 2026-27 - while other states admit on a state entrance test or Class 12 marks.",
    whoItIsFor:
      "Students who want to work in healthcare and are not going to get an MBBS seat.",
    verified: true,
    caution:
      "Whether NEET is required depends on your state and on the college. Check your state nursing council, and check that the college is recognised by the Indian Nursing Council before paying anything.",
  },
  {
    id: "neet-allied-health",
    examContext: "NEET",
    category: "adjacent_field",
    title: "Allied and healthcare courses",
    description:
      "Allied and healthcare degrees include medical laboratory technology, radiology and imaging technology, optometry, physiotherapy and others. They are three to four year degrees with defined clinical roles.",
    whoItIsFor: "Students who want clinical work without an MBBS seat.",
    verified: true,
    source: "https://aaccc.gov.in/",
    caution:
      "This changed recently. NCAHP has said NEET is a basic eligibility requirement for admission to allied and healthcare undergraduate courses from the 2026-27 academic year, under the curricula it has notified. Older advice that these courses need no NEET score is out of date for some courses. Check the requirement for the specific course before applying.",
  },
  {
    id: "neet-bsc-life-sciences",
    examContext: "NEET",
    category: "adjacent_field",
    title: "BSc in life sciences",
    description:
      "Biotechnology, microbiology, biochemistry, zoology and botany are admitted through CUET UG at central universities, and through their own tests or Class 12 marks at state universities. These are normal degree routes into research, laboratory work and teaching.",
    whoItIsFor: "Students who want to stay in biology without a clinical degree.",
    verified: true,
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "neet-attempts",
    examContext: "NEET",
    category: "retake_same_exam",
    title: "How many NEET attempts you have left",
    description:
      "There is no limit on the number of NEET UG attempts and no upper age limit. The attempt cap was removed in 2018. NTA has told a parliamentary committee that an age limit and attempt cap are under consideration, but neither is in force.",
    whoItIsFor: "Anyone deciding whether to repeat a year.",
    verified: true,
    source: "https://neet.nta.nic.in/",
    caution: "Check the information bulletin each year in case the rule changes.",
  },

  // --------------------------------------------------------------- CUET ----
  {
    id: "cuet-answer-key-challenge",
    examContext: "CUET",
    category: "recheck_result",
    title: "Answer key challenge",
    description:
      "NTA publishes a provisional answer key with a short challenge window before the final key and the result. There is a fee per question, refunded if the challenge is accepted. After the result there is no re-evaluation.",
    whoItIsFor: "Anyone who thinks a question was marked wrongly.",
    verified: true,
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "cuet-no-central-counselling",
    examContext: "CUET",
    category: "remaining_rounds",
    title: "There is no single CUET counselling",
    description:
      "CUET is one exam but not one admission process. Each participating university runs its own registration, merit list, rounds and fee payment on its own dates. Missing one university's window does not affect another's.",
    whoItIsFor: "Everyone with a CUET score.",
    verified: true,
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "cuet-later-allocation-rounds",
    examContext: "CUET",
    category: "remaining_rounds",
    title: "Later allocation and spot rounds",
    description:
      "Universities that use a common seat allocation system, such as Delhi University's CSAS, release several allocation lists. Cut-offs usually drop between rounds as students accept seats elsewhere. Seats still empty at the end go to spot rounds.",
    whoItIsFor: "Anyone who missed out in the first allocation list.",
    verified: true,
    source: "https://ugadmission.uod.ac.in/",
  },
  {
    id: "cuet-more-universities",
    examContext: "CUET",
    category: "same_field_other_route",
    title: "Other universities that accept the same score",
    description:
      "CUET UG is accepted by all central universities and by many state and private universities. A score that misses one university's cut-off can still be enough at another.",
    whoItIsFor: "Anyone with a CUET score and no seat yet.",
    verified: true,
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "cuet-non-cuet-admissions",
    examContext: "CUET",
    category: "adjacent_field",
    title: "Universities that do not use CUET",
    description:
      "Many state universities and colleges still admit on Class 12 marks or their own entrance test, on a calendar that runs later than CUET. Open universities such as IGNOU admit through the year.",
    whoItIsFor: "Students without a workable CUET score.",
    verified: false,
    caution:
      "Admission rules differ by state and university. Check the specific university's admission page.",
  },
  {
    id: "cuet-retake",
    examContext: "CUET",
    category: "retake_same_exam",
    title: "Taking CUET again",
    description:
      "CUET UG is held once a year and there is no limit on how many times you can appear. A gap year is a normal route, though a year of coaching is not the only way to use one.",
    whoItIsFor: "Students considering a repeat year.",
    verified: true,
    source: "https://cuet.nta.nic.in/",
  },

  // -------------------------------------------------------------- Board ----
  {
    id: "board-cbse-photocopy-and-reevaluation",
    examContext: "Board",
    category: "recheck_result",
    title: "CBSE photocopy, verification and re-evaluation",
    description:
      "CBSE now asks you to get a scanned photocopy of your evaluated answer book first, and then decide whether to apply for verification of marks or re-evaluation. It is all online through the CBSE rechecking portal. Marks can go up, stay the same, or go down, and the revised result is final.",
    whoItIsFor: "Students whose marks do not match what they expected.",
    verified: true,
    source: "https://cbseit.in/cbse/web/rchk/",
    caution:
      "The windows open within days of the result and are short. Exact dates and fees are announced with the result each year - read the circular on cbse.gov.in rather than relying on last year's numbers.",
  },
  {
    id: "board-other-boards-recheck",
    examContext: "Board",
    category: "recheck_result",
    title: "Rechecking at other boards",
    description:
      "CISCE and every state board run their own verification and re-evaluation process with their own forms, fees and deadlines. The process exists at all of them; the rules are not the same as CBSE's.",
    whoItIsFor: "ICSE, ISC and state board students.",
    verified: false,
    source: "https://cisce.org/",
    caution: "Check your own board's website for its process and dates.",
  },
  {
    id: "board-cbse-compartment",
    examContext: "Board",
    category: "retake_same_exam",
    title: "Compartment and supplementary exam",
    description:
      "A compartment result is not a failed year. CBSE holds a supplementary exam a few weeks after the main result, and passing it gives you the same certificate in the same academic year. You apply through your school, and the application window closes well before the exam.",
    whoItIsFor: "Students placed in the compartment category.",
    verified: true,
    source: "https://www.cbse.gov.in/",
    caution:
      "The number of subjects you may carry into the compartment exam is set by CBSE and has changed between years. Read the current year's circular.",
  },
  {
    id: "board-cbse-class-10-two-phases",
    examContext: "Board",
    category: "retake_same_exam",
    title: "CBSE Class 10 runs in two phases",
    description:
      "From 2026, CBSE conducts Class 10 board exams in two phases in the same year, with results for each. This means a second attempt inside the same academic year rather than a wait of twelve months.",
    whoItIsFor: "CBSE Class 10 students.",
    verified: true,
    source: "https://www.cbse.gov.in/",
    caution:
      "This is a new system. Check the current circular for which subjects and which students it applies to.",
  },
  {
    id: "board-improvement-exam",
    examContext: "Board",
    category: "retake_same_exam",
    title: "Improvement exam",
    description:
      "Boards allow a pass candidate to reappear in subjects to improve marks. The better score is the one that stands. It does not cancel the pass you already have.",
    whoItIsFor: "Students who passed but need higher marks for a course.",
    verified: false,
    source: "https://www.cbse.gov.in/",
    caution:
      "Which subjects, how many, and how many chances differ by board and by year.",
  },
  {
    id: "board-nios-stream-2",
    examContext: "Board",
    category: "restart_qualification",
    title: "NIOS Stream 2 admission",
    description:
      "NIOS Stream 2 is for students who did not clear, or got a compartment in, Class 10 or Class 12 from any recognised board. You register with NIOS and sit the public examination in September or October of the same year. You only reappear in the subjects you did not clear, and you can change a subject you found impossible. Subjects already passed transfer across.",
    whoItIsFor: "Students who did not clear the board exam this year.",
    verified: true,
    source: "https://www.nios.ac.in/",
    caution:
      "Stream 2 has an admission deadline of its own, usually in June. Check nios.ac.in for the current window.",
  },
  {
    id: "board-nios-on-demand",
    examContext: "Board",
    category: "restart_qualification",
    title: "NIOS on-demand examination",
    description:
      "NIOS runs an on-demand examination for registered learners. You book a subject when you are ready instead of waiting for the next exam session.",
    whoItIsFor: "NIOS learners who want to finish a subject sooner.",
    verified: true,
    source: "https://www.nios.ac.in/",
  },
  {
    id: "board-iti-polytechnic",
    examContext: "Board",
    category: "adjacent_field",
    title: "ITI and polytechnic",
    description:
      "ITI trade courses and three-year polytechnic diplomas admit after Class 10 and lead to a trade certificate or a diploma. A diploma can later be used for lateral entry into the second year of a degree.",
    whoItIsFor:
      "Students who want a qualification that leads to work sooner, or a longer route to a degree.",
    verified: false,
    caution:
      "Admission and lateral entry rules are set state by state. Check your state technical education board.",
  },

  // ---------------------------------------------------------------- CAT ----
  {
    id: "cat-shortlists-are-separate",
    examContext: "CAT",
    category: "remaining_rounds",
    title: "The CAT result is not the shortlist",
    description:
      "Each IIM publishes its own shortlist and decides its own weighting of CAT score, Class 10 and 12 marks, graduation marks, work experience and diversity. A percentile that misses one IIM can clear another. Shortlists come out over several weeks after the result.",
    whoItIsFor: "Everyone waiting after a CAT result.",
    verified: true,
    source: "https://iimcat.ac.in/",
  },
  {
    id: "cat-waitlist-movement",
    examContext: "CAT",
    category: "remaining_rounds",
    title: "Waitlists move",
    description:
      "Converted candidates hold offers at several schools and then release the ones they do not take. Waitlists move through the admission season, sometimes until the course starts.",
    whoItIsFor: "Candidates holding a waitlist number.",
    verified: false,
    caution:
      "How far a waitlist moves varies by school and year. No school guarantees movement.",
  },
  {
    id: "cat-other-mba-exams",
    examContext: "CAT",
    category: "same_field_other_route",
    title: "Other MBA entrance exams in the same cycle",
    description:
      "XAT, NMAT, SNAP, CMAT, MAT and ATMA run on their own dates, several of them after CAT. NMAT and some others allow more than one attempt in a season. They feed the same admission year, so a weak CAT score does not close the cycle.",
    whoItIsFor: "Candidates whose CAT percentile is below their target.",
    verified: true,
  },
  {
    id: "cat-non-iim-schools",
    examContext: "CAT",
    category: "same_field_other_route",
    title: "Schools outside the IIMs that take CAT",
    description:
      "Many management institutes, including departments at IITs and central universities, admit on a CAT score. Their cut-offs are usually lower than the older IIMs.",
    whoItIsFor: "Candidates with a valid CAT score and no IIM call.",
    verified: true,
    source: "https://iimcat.ac.in/",
  },
  {
    id: "cat-retake",
    examContext: "CAT",
    category: "retake_same_exam",
    title: "Taking CAT again",
    description:
      "There is no limit on CAT attempts. The exam is held once a year, usually in November, and the score is used for the admission cycle that follows.",
    whoItIsFor: "Candidates considering another cycle.",
    verified: true,
    source: "https://iimcat.ac.in/",
  },
  {
    id: "cat-work-then-apply",
    examContext: "CAT",
    category: "adjacent_field",
    title: "Working first",
    description:
      "Several schools weight work experience in their shortlist. Two or three years of work can raise a profile that a score alone did not carry.",
    whoItIsFor: "Candidates applying straight out of college.",
    verified: false,
    caution:
      "How much weight work experience carries differs by school. Check each school's published criteria.",
  },

  // --------------------------------------------------------------- GATE ----
  {
    id: "gate-score-validity",
    examContext: "GATE",
    category: "remaining_rounds",
    title: "A GATE score is valid for three years",
    description:
      "The GATE scorecard is valid for three years for MTech and PhD admission and for fellowships. That means a current-year admission round can use a score from any of the last three GATE exams.",
    whoItIsFor: "Anyone holding a GATE score from the last three years.",
    verified: true,
    caution:
      "PSU recruitment is different. Most PSU notifications name the specific GATE year they accept, and it is often the current year only. Read each notification.",
  },
  {
    id: "gate-coap-ccmt",
    examContext: "GATE",
    category: "remaining_rounds",
    title: "COAP and CCMT are separate counsellings",
    description:
      "IIT MTech offers are made through COAP. NIT, IIIT and centrally funded institute seats are filled through CCMT. They are separate portals with separate registrations and separate rounds, and CCMT runs later rounds after the first allotment.",
    whoItIsFor: "Anyone applying for MTech admission.",
    verified: true,
    source: "https://ccmt.admissions.nic.in/",
  },
  {
    id: "gate-direct-institute-admission",
    examContext: "GATE",
    category: "same_field_other_route",
    title: "Institutes that admit outside COAP and CCMT",
    description:
      "IISc, some IITs for specific programmes, state universities and research institutes run their own MTech, MS by research and PhD admissions on their own calendars, often with an interview.",
    whoItIsFor: "Candidates outside the main counselling rounds.",
    verified: false,
    caution:
      "Each institute publishes its own schedule. Check the department page, not a single aggregator.",
  },
  {
    id: "gate-psu-recruitment",
    examContext: "GATE",
    category: "adjacent_field",
    title: "PSU recruitment through GATE",
    description:
      "Public sector companies recruit engineers using GATE scores through their own notifications, with their own cut-offs, and often an interview stage. These are jobs, not admissions, and run on a separate calendar from counselling.",
    whoItIsFor: "Candidates who want to work rather than study further.",
    verified: true,
    caution:
      "Each PSU sets which GATE year it accepts and which papers it recruits from. Read the notification.",
  },
  {
    id: "gate-retake",
    examContext: "GATE",
    category: "retake_same_exam",
    title: "Taking GATE again",
    description:
      "There is no limit on GATE attempts and no age limit. The exam is held once a year, in February.",
    whoItIsFor: "Candidates considering another attempt.",
    verified: true,
  },

  // --------------------------------------------------------------- UPSC ----
  {
    id: "upsc-attempts-left",
    examContext: "UPSC",
    category: "retake_same_exam",
    title: "How many attempts you have left",
    description:
      "For the Civil Services Examination the limits are six attempts up to age 32 for General and EWS, nine attempts up to age 35 for OBC, and unlimited attempts up to age 37 for SC and ST. Candidates with benchmark disabilities get further relaxation. Only appearing in Prelims counts as an attempt.",
    whoItIsFor: "Anyone deciding whether to attempt again.",
    verified: true,
    source: "https://upsc.gov.in/",
    caution:
      "Check the current year's notification. Eligibility rules are restated every cycle.",
  },
  {
    id: "upsc-prelims-marks-do-not-carry",
    examContext: "UPSC",
    category: "recheck_result",
    title: "Prelims marks do not carry forward",
    description:
      "Prelims is a screening stage. Its marks are not added to the final ranking - only Mains and the interview count. UPSC publishes the Prelims cut-off after the whole cycle ends, so a near-miss is only confirmed months later.",
    whoItIsFor: "Candidates who did not clear Prelims.",
    verified: true,
    source: "https://upsc.gov.in/",
  },
  {
    id: "upsc-state-psc",
    examContext: "UPSC",
    category: "same_field_other_route",
    title: "State public service commissions",
    description:
      "BPSC, UPPSC, MPPSC, RPSC and the other state commissions recruit for state administrative posts. Most have no limit on attempts, only an upper age limit, which is usually higher than UPSC's. The syllabus overlaps heavily with UPSC Prelims and Mains, so preparation carries over.",
    whoItIsFor: "Candidates out of UPSC attempts, or wanting a parallel option.",
    verified: true,
    caution:
      "Age limits, attempt rules and syllabus differ by state. Check the specific commission's notification.",
  },
  {
    id: "upsc-other-central-exams",
    examContext: "UPSC",
    category: "adjacent_field",
    title: "Other central recruitment exams",
    description:
      "SSC CGL, RBI Grade B, IBPS and SBI banking exams, RRB railway exams and UPSC's own specialist exams such as CAPF and IFS run on separate calendars with their own eligibility. Several draw on the same general studies preparation.",
    whoItIsFor: "Candidates who want a government post on a shorter timeline.",
    verified: false,
    caution:
      "Eligibility and age limits are exam-specific. Check each notification.",
  },
  {
    id: "upsc-optional-and-strategy-review",
    examContext: "UPSC",
    category: "remaining_rounds",
    title: "Getting your marks and reviewing them",
    description:
      "UPSC publishes marksheets for non-recommended candidates after the final result. That sheet shows which paper actually cost you the rank, which is more useful than guessing.",
    whoItIsFor: "Candidates who reached Mains or the interview.",
    verified: false,
    source: "https://upsc.gov.in/",
    caution:
      "The marksheet is released some weeks after the final result and stays up for a limited period.",
  },

  // -------------------------------------------------------------- Other ----
  {
    id: "other-ask-for-the-recheck-window",
    examContext: "Other",
    category: "recheck_result",
    title: "Find the rechecking window first",
    description:
      "Almost every board and exam body has a process to verify marks or re-check an answer sheet. The window is usually short and opens within days of the result. Look for it on the official site before doing anything else, because it is the option that expires first.",
    whoItIsFor: "Anyone who has just received a result.",
    verified: false,
    caution:
      "Rules and deadlines differ by body. Use the official website, not a forwarded message.",
  },
  {
    id: "other-first-list-is-not-the-last",
    examContext: "Other",
    category: "remaining_rounds",
    title: "The first list is not the last list",
    description:
      "Most admission processes run several rounds. Candidates leave for other seats between rounds, so cut-offs usually fall. You normally have to respond in each round to stay in the process.",
    whoItIsFor: "Anyone who missed a first merit list or allotment.",
    verified: false,
    caution:
      "How many rounds run, and how far cut-offs fall, differs by exam. Check the counselling schedule for your own exam.",
  },
  {
    id: "other-state-route-exists",
    examContext: "Other",
    category: "same_field_other_route",
    title: "There is usually a state route",
    description:
      "Alongside most national exams there is a state-level exam or quota for the same courses, with fewer applicants and its own dates. It needs a separate registration and usually a domicile document.",
    whoItIsFor: "Anyone who missed a national cut-off.",
    verified: false,
    caution: "Check your own state's admission authority for the rules.",
  },
  {
    id: "other-open-university",
    examContext: "Other",
    category: "adjacent_field",
    title: "Open universities and distance degrees",
    description:
      "IGNOU and state open universities admit in cycles through the year and award recognised degrees. They are a way to hold a degree course while preparing for something else.",
    whoItIsFor:
      "Students who need to be enrolled somewhere while they work out the next step.",
    verified: false,
    caution:
      "Check that the programme is recognised by UGC before paying any fee.",
  },
  {
    id: "other-read-the-official-notification",
    examContext: "Other",
    category: "remaining_rounds",
    title: "Read the official notification",
    description:
      "Coaching groups, forwarded messages and result-aggregator sites often carry dates that are wrong or out of date. The conducting body's own site is the only reliable source for a deadline.",
    whoItIsFor: "Anyone acting on a deadline.",
    verified: false,
    caution:
      "This is general advice, not a rule about any one exam. Find the conducting body's own website and read the notification there.",
  },
]);

/**
 * "What happens next" options for one exam context, grouped by category.
 *
 * Groups come back in a fixed order, nearest-term action first, and empty
 * groups are omitted. Every {@link ExamContext} returns at least one group.
 *
 * Check `item.verified` before presenting an item as fact, and surface
 * `item.caution` alongside the description whenever it is set - several of
 * these rules changed recently.
 *
 * @param examContext - The exam the student is preparing for.
 */
export function getPathways(examContext: ExamContext): PathwayGroup[] {
  const forContext = PATHWAYS.filter((p) => p.examContext === examContext);

  return CATEGORY_ORDER.map((category) => ({
    category,
    heading: PATHWAY_CATEGORY_HEADINGS[category],
    items: forContext.filter((p) => p.category === category),
  })).filter((group) => group.items.length > 0);
}

/**
 * Flat list of every pathway for one exam context, in category order.
 *
 * @param examContext - The exam the student is preparing for.
 */
export function getPathwayItems(examContext: ExamContext): Pathway[] {
  return getPathways(examContext).flatMap((group) => [...group.items]);
}

/**
 * Look up a single pathway by its stable id.
 *
 * @param id - The `Pathway["id"]` slug.
 * @returns The pathway, or `null` if no pathway has that id.
 */
export function getPathwayById(id: string): Pathway | null {
  return PATHWAYS.find((p) => p.id === id) ?? null;
}
