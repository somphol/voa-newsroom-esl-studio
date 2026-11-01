/* ==========================================================================
   VOA Newsroom: 500 Words ESL Studio
   Vanilla JavaScript — SRS engine, live VOA RSS matching, five activities,
   speech synthesis, speech recognition, and portable progress files.
   ========================================================================== */

"use strict";

const RAW_WORDS = [
  ["sanction", "WP", "ˈsæŋkʃən", "sanc|tion", "An official penalty imposed on a country to force a change in policy."],
  ["diplomacy", "WP", "dɪˈploʊməsi", "di|plo|ma|cy", "The work of managing relations between countries through negotiation."],
  ["treaty", "WP", "ˈtriti", "trea|ty", "A formal written agreement between two or more countries."],
  ["summit", "WP", "ˈsəmɪt", "sum|mit", "A high-level meeting between heads of state or senior leaders."],
  ["coalition", "WP", "ˌkoʊəˈlɪʃən", "co|a|li|tion", "A temporary alliance of parties or nations working toward a shared goal."],
  ["ceasefire", "WP", "ˈsisˈfaɪər", "cease|fire", "An agreement to stop fighting, usually for a limited time."],
  ["sovereignty", "WP", "ˈsɑvrənti", "sov|er|eign|ty", "A nation's right to govern itself without outside interference."],
  ["referendum", "WP", "ˌrɛfərˈɛndəm", "ref|er|en|dum", "A direct vote in which citizens decide a specific public question."],
  ["parliament", "WP", "ˈpɑrləmɛnt", "par|lia|ment", "A national legislature whose members make and debate laws."],
  ["legislation", "WP", "ˌlɛʤəsˈleɪʃən", "leg|is|la|tion", "A proposed or enacted law, or the process of making laws."],
  ["embassy", "WP", "ˈɛmbəsi", "em|bas|sy", "A diplomatic office that represents one country in another."],
  ["ambassador", "WP", "æmˈbæsədər", "am|bas|sa|dor", "A senior diplomat who represents a country abroad."],
  ["negotiation", "WP", "nɪˌgoʊʃiˈeɪʃən", "ne|go|ti|a|tion", "Discussion aimed at reaching an agreement between opposing sides."],
  ["alliance", "WP", "əˈlaɪəns", "al|li|ance", "A formal partnership between countries or groups for mutual support."],
  ["insurgency", "WP", "ˌɪnˈsərʤənsi", "in|sur|gen|cy", "An armed rebellion against an established government or authority."],
  ["militant", "WP", "ˈmɪlətənt", "mil|i|tant", "A person or group willing to use force to achieve political aims."],
  ["humanitarian", "WP", "ˌjuˌmænəˈtɛriən", "hu|man|i|tar|i|an", "Concerned with reducing human suffering, especially during a crisis."],
  ["refugee", "WP", "ˈrɛfjuʤi", "ref|u|gee", "A person forced to flee their country because of war or persecution."],
  ["asylum", "WP", "əˈsaɪləm", "a|sy|lum", "Protection given by a country to someone fleeing danger abroad."],
  ["border", "WP", "ˈbɔrdər", "bor|der", "A line that separates two countries or political regions."],
  ["territory", "WP", "ˈtɛrɪˌtɔri", "ter|ri|to|ry", "An area of land controlled by a country or government."],
  ["annex", "WP", "ˈæˌnɛks", "an|nex", "To take control of another region and add it to one's own territory."],
  ["occupation", "WP", "ˌɑkjəˈpeɪʃən", "oc|cu|pa|tion", "The military control of a place by a foreign force."],
  ["resolution", "WP", "ˌrɛzəˈluʃən", "res|o|lu|tion", "A formal statement or decision adopted by a governing body."],
  ["veto", "WP", "ˈviˌtoʊ", "ve|to", "The power to reject a proposed law or decision."],
  ["ballot", "WP", "ˈbælət", "bal|lot", "A paper or system used to cast a vote in an election."],
  ["campaign", "WP", "kæmˈpeɪn", "cam|paign", "An organized effort to win support for a candidate or cause."],
  ["candidate", "WP", "ˈkænədɪt", "can|di|date", "A person competing for an elected office or position."],
  ["electorate", "WP", "ɪˈlɛktərət", "e|lec|tor|ate", "All the people who are eligible to vote in an election."],
  ["constituency", "WP", "kənˈstɪʧuənsi", "con|stitu|en|cy", "The group of voters represented by a particular official."],
  ["policy", "WP", "ˈpɑləsi", "pol|i|cy", "A plan or set of principles adopted by a government or organization."],
  ["reform", "WP", "rɪˈfɔrm", "re|form", "A change designed to improve a system, law, or institution."],
  ["corruption", "WP", "kərˈəpʃən", "cor|rup|tion", "The abuse of power for private gain, often through bribery."],
  ["transparency", "WP", "trænˈspɛrənsi", "trans|par|en|cy", "The practice of making government actions open to public scrutiny."],
  ["accountability", "WP", "əˈkaʊntəˌbɪlɪti", "ac|count|a|bil|i|ty", "The obligation of officials to answer for their decisions and actions."],
  ["governance", "WP", "ˈgəvərnəns", "gov|er|nance", "The way a country or organization is managed and controlled."],
  ["democracy", "WP", "dɪˈmɑkrəsi", "de|moc|ra|cy", "A system in which citizens choose their leaders through elections."],
  ["autocracy", "WP", "ɔˈtɑkrəsi", "au|toc|ra|cy", "A system in which one person holds unchecked political power."],
  ["dictatorship", "WP", "dɪkˈteɪtərˌʃɪp", "dic|ta|tor|ship", "A government ruled by a leader with absolute authority."],
  ["monarchy", "WP", "ˈmɑnɑrki", "mon|ar|chy", "A system in which a king or queen holds inherited power."],
  ["republic", "WP", "riˈpəblɪk", "re|pub|lic", "A state in which leaders are elected and power is shared by law."],
  ["federation", "WP", "ˌfɛdərˈeɪʃən", "fed|er|a|tion", "A union of states or regions under a central government."],
  ["constitution", "WP", "ˌkɑnstəˈtuʃən", "con|sti|tu|tion", "The fundamental law that defines a country's political system."],
  ["amendment", "WP", "əˈmɛndmənt", "a|mend|ment", "A formal change made to a constitution or law."],
  ["judiciary", "WP", "ʤuˈdɪʃiˌɛri", "ju|di|cia|ry", "The branch of government that interprets laws and decides cases."],
  ["tribunal", "WP", "trəˈbjunəl", "tri|bu|nal", "A court or official body set up to judge particular cases."],
  ["verdict", "WP", "ˈvərdɪkt", "ver|dict", "The decision reached by a jury or judge in a trial."],
  ["prosecution", "WP", "ˌprɑsəˈkjuʃən", "pros|e|cu|tion", "The legal process of charging and trying someone for a crime."],
  ["indictment", "WP", "ˌɪnˈdaɪtmənt", "in|dict|ment", "A formal accusation that a person has committed a serious crime."],
  ["impeachment", "WP", "ˌɪmˈpiʧmənt", "im|peach|ment", "The process of charging a public official with misconduct."],
  ["coup", "WP", "ku", "coup", "A sudden, often violent seizure of power by a small group."],
  ["uprising", "WP", "ˈəˌpraɪzɪŋ", "up|ris|ing", "A spontaneous protest or rebellion against authority."],
  ["protest", "WP", "ˈproʊˌtɛst", "pro|test", "A public expression of objection to a policy or action."],
  ["riot", "WP", "raɪət", "ri|ot", "A violent public disturbance involving a crowd."],
  ["curfew", "WP", "ˈkərfju", "cur|few", "A rule requiring people to stay indoors during certain hours."],
  ["martial", "WP", "ˈmɑrʃəl", "mar|tial", "Relating to the military or to military law and control."],
  ["insurrection", "WP", "ˌɪnsərˈɛkʃən", "in|sur|rec|tion", "A violent attempt to overthrow an established government."],
  ["rebellion", "WP", "rɪˈbɛljən", "re|bel|lion", "An organized resistance against a government or ruler."],
  ["radical", "WP", "ˈrædɪkəl", "rad|i|cal", "Favoring extreme or fundamental political change."],
  ["extremist", "WP", "ɪkˈstrimɪst", "ex|trem|ist", "A person who holds or promotes extreme political views."],
  ["terrorism", "WP", "ˈtɛrəˌrɪzəm", "ter|ror|ism", "The use of violence against civilians to achieve political aims."],
  ["hostage", "WP", "ˈhɑstɪʤ", "hos|tage", "A person held captive to force others to meet demands."],
  ["ransom", "WP", "ˈrænsəm", "ran|som", "Money demanded in exchange for releasing a captive."],
  ["espionage", "WP", "ˈɛspiənɑʤ", "es|pi|onage", "The secret gathering of information, often for a foreign government."],
  ["surveillance", "WP", "sərˈveɪləns", "sur|veil|lance", "The close monitoring of people, places, or communications."],
  ["censorship", "WP", "ˈsɛnsərˌʃɪp", "cen|sor|ship", "The suppression of speech, news, or art deemed unacceptable."],
  ["propaganda", "WP", "ˌprɑpəˈgændə", "pro|pa|gan|da", "Information spread to promote a particular political cause or view."],
  ["disinformation", "WP", "dɪˌzɪnfərˈmeɪʃən", "dis|in|for|ma|tion", "False information deliberately spread to deceive people."],
  ["bilateral", "WP", "baɪˈlætərəl", "bi|lat|er|al", "Involving two countries or two parties."],
  ["multilateral", "WP", "ˌməltɪˈlætərəl", "mul|ti|lat|er|al", "Involving three or more countries or parties."],
  ["unilateral", "WP", "ˌjunəˈlætərəl", "u|ni|lat|er|al", "Done by one country or party without the agreement of others."],
  ["mediator", "WP", "ˈmidiˌeɪtər", "me|di|a|tor", "A neutral person who helps opposing sides reach an agreement."],
  ["envoy", "WP", "ˈɛnvɔɪ", "en|voy", "A diplomat sent to represent a government on a special mission."],
  ["delegation", "WP", "ˌdɛləˈgeɪʃən", "del|e|ga|tion", "A group of people chosen to represent an organization or country."],
  ["communique", "WP", "kəmˌjunəˈkeɪ", "com|mu|nique", "An official public statement issued after a diplomatic meeting."],
  ["armistice", "WP", "ˈɑrməstəs", "ar|mi|stice", "An agreement to end fighting while a peace treaty is negotiated."],
  ["truce", "WP", "trus", "truce", "A temporary stop to fighting agreed by opposing sides."],
  ["aggression", "WP", "əˈgrɛʃən", "ag|gres|sion", "An unprovoked attack or hostile act against another country."],
  ["retaliation", "WP", "riˌtæliˈeɪʃən", "re|tal|i|a|tion", "A harmful action taken in response to an attack or insult."],
  ["deterrence", "WP", "dɪˈtərəns", "de|ter|rence", "The strategy of preventing attack by threatening a strong response."],
  ["disarmament", "WP", "dɪˈsɑrməmənt", "dis|ar|ma|ment", "The reduction or elimination of a country's weapons."],
  ["proliferation", "WP", "ˌproʊlɪfərˈeɪʃən", "pro|lif|er|a|tion", "The rapid spread or increase of weapons, especially nuclear ones."],
  ["nuclear", "WP", "ˈnukliər", "nu|cle|ar", "Relating to atomic energy or weapons that use atomic reactions."],
  ["warhead", "WP", "ˈwɔˌrhɛd", "war|head", "The explosive or nuclear part of a missile or bomb."],
  ["missile", "WP", "ˈmɪsəl", "mis|sile", "A weapon that is launched through the air toward a target."],
  ["drone", "WP", "droʊn", "drone", "An unmanned aircraft controlled remotely or by software."],
  ["airstrike", "WP", "ˈɛrˌstraɪk", "air|strike", "An attack carried out by aircraft against a target on the ground."],
  ["blockade", "WP", "ˌblɑˈkeɪd", "block|ade", "The closing of a port or road to prevent goods or people passing."],
  ["siege", "WP", "siʤ", "siege", "A military operation that surrounds a place to force its surrender."],
  ["offensive", "WP", "əˈfɛnsɪv", "of|fen|sive", "A planned military attack or campaign against an enemy."],
  ["defensive", "WP", "dɪˈfɛnsɪv", "de|fen|sive", "Intended to protect against attack rather than start one."],
  ["casualty", "WP", "ˈkæʒəwəlti", "ca|su|al|ty", "A person killed or injured in a war or accident."],
  ["civilian", "WP", "səˈvɪljən", "ci|vil|ian", "A person who is not a member of the armed forces."],
  ["combatant", "WP", "kəmˈbætənt", "com|bat|ant", "A person who takes part in fighting during an armed conflict."],
  ["veteran", "WP", "ˈvɛtərən", "vet|er|an", "A person who has served in the armed forces, often in wartime."],
  ["deployment", "WP", "dɪˈplɔɪmənt", "de|ploy|ment", "The movement of troops or equipment into position for action."],
  ["withdrawal", "WP", "wɪθˈdrɔəl", "with|draw|al", "The removal of troops or forces from an area of conflict."],
  ["reconnaissance", "WP", "riˈkɑnəsəns", "re|con|nais|sance", "The exploration of an area to gather military information."],
  ["intelligence", "WP", "ˌɪnˈtɛləʤəns", "in|tel|li|gence", "Information gathered about an enemy or a security threat."],
  ["sabotage", "WP", "ˈsæbəˌtɑʒ", "sab|o|tage", "Deliberate damage to equipment or operations to weaken an enemy."],
  ["regime", "WP", "rəˈʒim", "re|gime", "A government, especially one that is authoritarian or unpopular."],
  ["opposition", "WP", "ˌɑpəˈzɪʃən", "op|po|si|tion", "The political parties or groups that challenge the government."],
  ["incumbent", "WP", "ˌɪnˈkəmbənt", "in|cum|bent", "The current holder of a political office or position."],
  ["mandate", "WP", "ˈmænˌdeɪt", "man|date", "The authority given to a government by voters or a constitution."],
  ["statute", "WP", "ˈstæʧut", "stat|ute", "A written law passed by a legislative body."],
  ["decree", "WP", "dɪˈkri", "de|cree", "An official order issued by a leader or government."],
  ["charter", "WP", "ˈʧɑrtər", "char|ter", "A formal document that sets out the rules of an organization or city."],
  ["accord", "WP", "əˈkɔrd", "ac|cord", "A formal agreement between countries or groups."],
  ["protocol", "WP", "ˈproʊtəˌkɔl", "pro|to|col", "A set of rules or an official agreement between parties."],
  ["convention", "WP", "kənˈvɛnʃən", "con|ven|tion", "A formal agreement or a large meeting of a political group."],
  ["ratification", "WP", "ˌrætəfəˈkeɪʃən", "rat|i|fi|ca|tion", "The formal approval of an agreement or treaty."],
  ["jurisdiction", "WP", "ˌʤʊrɪsˈdɪkʃən", "ju|ris|dic|tion", "The legal authority of a court or government over an area."],
  ["extradition", "WP", "ˌɛkstrəˈdɪʃən", "ex|tra|di|tion", "The transfer of a suspected criminal from one country to another."],
  ["immunity", "WP", "ˌɪmˈjunɪti", "im|mu|ni|ty", "Legal protection from prosecution or punishment."],
  ["pardon", "WP", "ˈpɑrdən", "par|don", "An official act that forgives a crime and cancels punishment."],
  ["clemency", "WP", "ˈklɛmənsi", "clem|en|cy", "Mercy shown by a leader in reducing or forgiving a punishment."],
  ["detention", "WP", "dɪˈtɛnʃən", "de|ten|tion", "The state of being held in custody by authorities."],
  ["interrogation", "WP", "ˌɪnˌtɛrəˈgeɪʃən", "in|ter|ro|ga|tion", "The process of questioning someone intensively, often in custody."],
  ["torture", "WP", "ˈtɔrʧər", "tor|ture", "The deliberate infliction of severe pain to punish or extract information."],
  ["embargo", "WP", "ɛmˈbɑrgoʊ", "em|bar|go", "A government order that restricts trade with another country."],
  ["autonomy", "WP", "əˈtɑnəmi", "au|ton|o|my", "The right or condition of self-government for a region or group."],
  ["secession", "WP", "sɪˈsɛʃən", "se|ces|sion", "The act of withdrawing from a political union or country."],
  ["apartheid", "WP", "əˈpɑrˌtaɪt", "a|part|heid", "A former system of racial segregation and discrimination in South Africa."],
  ["discrimination", "WP", "dɪˌskrɪməˈneɪʃən", "dis|crim|i|na|tion", "Unfair treatment of people based on race, gender, religion, or other traits."],
  ["citizenship", "WP", "ˈsɪtɪzənˌʃɪp", "cit|i|zen|ship", "The legal status of belonging to a country with its rights and duties."],
  ["inflation", "BE", "ˌɪnˈfleɪʃən", "in|fla|tion", "A general rise in prices that reduces the buying power of money."],
  ["recession", "BE", "ˌriˈsɛʃən", "re|ces|sion", "A period of declining economic activity and rising unemployment."],
  ["depression", "BE", "dɪˈprɛʃən", "de|pres|sion", "A severe, long-lasting economic downturn with high unemployment."],
  ["deflation", "BE", "dɪˈfleɪʃən", "de|fla|tion", "A general fall in prices, often linked to weak demand."],
  ["stagflation", "BE", "stægˈfleɪʃən", "stag|fla|tion", "An economy with high inflation, slow growth, and high unemployment."],
  ["GDP", "BE", "ˌdʒiː.diːˈpiː", "GDP", "The total value of goods and services produced by a country in a year."],
  ["tariff", "BE", "ˈtɛrəf", "tar|iff", "A tax on goods imported from another country."],
  ["subsidy", "BE", "ˈsəbsɪdi", "sub|si|dy", "Government money given to lower costs or support an industry."],
  ["deficit", "BE", "ˈdɛfəsət", "def|i|cit", "The amount by which spending exceeds income in a period."],
  ["surplus", "BE", "ˈsərpləs", "sur|plus", "The amount by which income exceeds spending."],
  ["debt", "BE", "dɛt", "debt", "Money owed by a person, company, or government."],
  ["bond", "BE", "bɑnd", "bond", "A loan to a government or company that pays interest."],
  ["stock", "BE", "stɑk", "stock", "A share of ownership in a company."],
  ["share", "BE", "ʃɛr", "share", "A unit of ownership in a company or fund."],
  ["dividend", "BE", "ˈdɪvɪˌdɛnd", "div|i|dend", "A payment made to shareholders from a company's profits."],
  ["investor", "BE", "ˌɪnˈvɛstər", "in|vestor", "A person or group that puts money into assets to earn returns."],
  ["portfolio", "BE", "pɔrtˈfoʊliˌoʊ", "port|fo|li|o", "A collection of investments held by a person or fund."],
  ["asset", "BE", "ˈæˌsɛt", "as|set", "Something valuable that a person or company owns."],
  ["liability", "BE", "ˌlaɪəˈbɪlɪti", "li|a|bil|i|ty", "A debt or obligation that must be paid."],
  ["liquidity", "BE", "lɪkˈwɪdɪti", "liq|uid|i|ty", "The ease with which an asset can be turned into cash."],
  ["capital", "BE", "ˈkæpɪtəl", "cap|i|tal", "Money used to start or expand a business or investment."],
  ["revenue", "BE", "ˈrɛvəˌnu", "rev|e|nue", "The money a company or government receives from its activities."],
  ["profit", "BE", "ˈprɑfɪt", "prof|it", "The money left after costs are subtracted from revenue."],
  ["loss", "BE", "lɔs", "loss", "The amount by which costs exceed revenue."],
  ["bankruptcy", "BE", "ˈbæŋkrəptsi", "bank|rupt|cy", "A legal process for a person or company that cannot pay its debts."],
  ["merger", "BE", "ˈmərʤər", "merg|er", "The joining of two companies into a single business."],
  ["acquisition", "BE", "ˌækwəˈzɪʃən", "ac|qui|si|tion", "The purchase of one company by another."],
  ["monopoly", "BE", "məˈnɑpəli", "mo|nop|o|ly", "A market controlled by a single seller with little competition."],
  ["oligopoly", "BE", "ˌɑlɪˈgɑpəli", "ol|i|gop|o|ly", "A market dominated by a small number of large sellers."],
  ["competition", "BE", "ˌkɑmpəˈtɪʃən", "com|pe|ti|tion", "The effort of businesses to win customers from one another."],
  ["supply", "BE", "səˈplaɪ", "sup|ply", "The amount of a good or service available for sale."],
  ["demand", "BE", "dɪˈmænd", "de|mand", "The desire and ability of buyers to purchase a good or service."],
  ["commodity", "BE", "kəˈmɑdəti", "com|mod|i|ty", "A raw material or basic good traded in large quantities."],
  ["currency", "BE", "ˈkərənsi", "cur|ren|cy", "The money used in a particular country or economy."],
  ["exchange", "BE", "ɪksˈʧeɪnʤ", "ex|change", "The act of trading one currency or asset for another."],
  ["interest", "BE", "ˈɪntəˌrɛst", "in|ter|est", "The cost of borrowing money, usually a percentage of a loan."],
  ["mortgage", "BE", "ˈmɔrgɪʤ", "mort|gage", "A long-term loan used to buy a home or property."],
  ["loan", "BE", "loʊn", "loan", "Money lent to a person or business that must be repaid."],
  ["credit", "BE", "ˈkrɛdɪt", "cred|it", "The ability to borrow money or buy now and pay later."],
  ["debit", "BE", "ˈdɛbɪt", "deb|it", "A payment taken directly from a bank account."],
  ["budget", "BE", "ˈbəʤɪt", "bud|get", "A plan for how money will be earned and spent."],
  ["audit", "BE", "ˈɔdɪt", "au|dit", "An official examination of financial records."],
  ["tax", "BE", "tæks", "tax", "A required payment to the government on income, goods, or property."],
  ["exemption", "BE", "ɪgˈzɛmpʃən", "ex|emp|tion", "A rule that frees someone from paying a tax or duty."],
  ["quota", "BE", "kˈwoʊtə", "quo|ta", "A fixed limit on the amount of a product that can be imported."],
  ["export", "BE", "ˈɛkspɔrt", "ex|port", "A good or service sold to another country."],
  ["import", "BE", "ˌɪmˈpɔrt", "im|port", "A good or service bought from another country."],
  ["trade", "BE", "treɪd", "trade", "The buying and selling of goods and services."],
  ["logistics", "BE", "ləˈʤɪstɪks", "lo|gis|tics", "The management of moving, storing, and delivering goods."],
  ["manufacturing", "BE", "ˌmænjəˈfækʧərɪŋ", "man|u|fac|tur|ing", "The production of goods in factories using machines and labor."],
  ["industry", "BE", "ˈɪndəstri", "in|dus|try", "A branch of business that produces a particular type of goods."],
  ["agriculture", "BE", "ˈægrɪˌkəlʧər", "ag|ri|cul|ture", "The practice of growing crops and raising animals for food."],
  ["sector", "BE", "ˈsɛktər", "sec|tor", "A part of the economy, such as banking or manufacturing."],
  ["market", "BE", "ˈmɑrkɪt", "mar|ket", "A place or system where buyers and sellers trade."],
  ["retail", "BE", "ˈriˌteɪl", "re|tail", "The sale of goods directly to consumers."],
  ["wholesale", "BE", "ˈhoʊlˌseɪl", "whole|sale", "The sale of goods in large quantities to retailers."],
  ["consumer", "BE", "kənˈsumər", "con|sum|er", "A person who buys and uses goods or services."],
  ["producer", "BE", "prəˈdusər", "pro|duc|er", "A person or company that makes or grows goods."],
  ["unemployment", "BE", "ˌənɪmˈplɔɪmənt", "un|em|ploy|ment", "The condition of people who want work but cannot find jobs."],
  ["workforce", "BE", "ˈwərkˌfɔrs", "work|force", "All the people who are available to work in a company or country."],
  ["labor", "BE", "ˈleɪbər", "la|bor", "Work, especially physical work, or the people who perform it."],
  ["wage", "BE", "weɪʤ", "wage", "Money paid to a worker, usually by the hour or day."],
  ["salary", "BE", "ˈsæləri", "sal|a|ry", "A fixed amount of money paid to an employee each year or month."],
  ["pension", "BE", "ˈpɛnʃən", "pen|sion", "Regular payments made to a retired person."],
  ["insurance", "BE", "ˌɪnˈʃʊrəns", "in|sur|ance", "A contract that pays for losses in exchange for regular payments."],
  ["premium", "BE", "ˈprimiəm", "pre|mi|um", "The amount paid regularly for an insurance policy."],
  ["deductible", "BE", "dɪˈdəktəbəl", "de|duct|i|ble", "The amount a person must pay before insurance covers a loss."],
  ["equity", "BE", "ˈɛkwəti", "eq|ui|ty", "The value of ownership in a company or property."],
  ["venture", "BE", "ˈvɛnʧər", "ven|ture", "A new business project that involves risk."],
  ["startup", "BE", "ˈstɑrˌtəp", "start|up", "A young company built to grow quickly with a new idea."],
  ["entrepreneur", "BE", "ˌɑntrəprəˈnʊr", "en|tre|pre|neur", "A person who starts and runs a business, taking on risk."],
  ["innovation", "BE", "ˌɪnəˈveɪʃən", "in|no|va|tion", "A new idea, product, or method that improves something."],
  ["productivity", "BE", "ˌproʊdəkˈtɪvɪti", "pro|duc|tiv|i|ty", "The amount of work or output produced per hour or worker."],
  ["efficiency", "BE", "ɪˈfɪʃənsi", "ef|fi|cien|cy", "The ability to produce results with little waste of time or money."],
  ["outsource", "BE", "ˌaʊtˈsɔrs", "out|source", "To hire an outside company or worker to do a job."],
  ["offshore", "BE", "ˈɔfˈʃɔr", "off|shore", "Located or based in another country, often for tax or cost reasons."],
  ["globalization", "BE", "ˌgloʊbəlɪˈzeɪʃən", "glob|al|i|za|tion", "The growing connection of economies and cultures around the world."],
  ["protectionism", "BE", "prəˈtɛkʃəˌnɪzəm", "pro|tec|tion|ism", "The policy of restricting imports to protect domestic industries."],
  ["deregulation", "BE", "diˌrɛgjəˈleɪʃən", "de|reg|u|la|tion", "The removal of government rules from an industry."],
  ["privatization", "BE", "ˈpraɪvətəˈzeɪʃən", "pri|va|ti|za|tion", "The sale of government-owned assets to private companies."],
  ["nationalization", "BE", "ˌnæʃənələˈzeɪʃən", "na|tion|al|i|za|tion", "The takeover of private assets by the government."],
  ["stimulus", "BE", "ˈstɪmjələs", "stim|u|lus", "Government action intended to boost economic growth."],
  ["austerity", "BE", "ˌɔˈstɛrɪti", "aus|ter|i|ty", "Strict government spending cuts designed to reduce debt."],
  ["fiscal", "BE", "ˈfɪskəl", "fis|cal", "Relating to government taxes, spending, and budgets."],
  ["monetary", "BE", "ˈmɑnəˌtɛri", "mon|e|tar|y", "Relating to money, interest rates, and a country's central bank."],
  ["reserve", "BE", "rɪˈzərv", "re|serve", "Money or assets kept by a bank or government for future use."],
  ["savings", "BE", "ˈseɪvɪŋz", "sav|ings", "Money set aside rather than spent."],
  ["investment", "BE", "ˌɪnˈvɛstmənt", "in|vest|ment", "Money put into an asset or business to earn a return."],
  ["speculation", "BE", "ˌspɛkjəˈleɪʃən", "spec|u|la|tion", "Risky buying and selling based on expected price changes."],
  ["bubble", "BE", "ˈbəbəl", "bub|ble", "A market condition in which prices rise far above real value."],
  ["crash", "BE", "kræʃ", "crash", "A sudden, severe fall in stock prices or the economy."],
  ["rally", "BE", "ˈræli", "ral|ly", "A sustained rise in prices after a period of decline."],
  ["volatility", "BE", "ˌvɑləˈtɪləti", "vol|a|til|i|ty", "The tendency of prices to change quickly and unpredictably."],
  ["index", "BE", "ˈɪndɛks", "in|dex", "A measure that tracks the performance of a group of stocks."],
  ["benchmark", "BE", "ˈbɛnʧˌmɑrk", "bench|mark", "A standard used to compare the performance of investments."],
  ["futures", "BE", "fˈjuʧərz", "fu|tures", "Contracts to buy or sell an asset at a set price in the future."],
  ["derivative", "BE", "dərˈɪvɪtɪv", "de|riv|a|tive", "A financial contract whose value depends on another asset."],
  ["hedge", "BE", "hɛʤ", "hedge", "An investment made to reduce the risk of price changes."],
  ["scarcity", "BE", "ˈskɛrsɪti", "scar|ci|ty", "A shortage of a resource relative to demand."],
  ["shortage", "BE", "ˈʃɔrtɪʤ", "short|age", "A situation in which demand exceeds available supply."],
  ["inventory", "BE", "ˌɪnvənˈtɔri", "in|ven|to|ry", "The goods a business keeps in stock for sale."],
  ["warehouse", "BE", "ˈwɛˌrhaʊs", "ware|house", "A large building used for storing goods."],
  ["shipment", "BE", "ˈʃɪpmənt", "ship|ment", "A load of goods sent from one place to another."],
  ["freight", "BE", "freɪt", "freight", "Goods transported by truck, ship, train, or plane."],
  ["cargo", "BE", "ˈkɑrˌgoʊ", "car|go", "The goods carried by a ship, aircraft, or vehicle."],
  ["supplier", "BE", "səˈplaɪər", "sup|pli|er", "A company that provides goods or materials to another business."],
  ["vendor", "BE", "ˈvɛndər", "ven|dor", "A person or company that sells goods or services."],
  ["procurement", "BE", "proʊˈkjʊrmənt", "pro|cure|ment", "The process of buying supplies or services for an organization."],
  ["contract", "BE", "ˈkɑnˌtrækt", "con|tract", "A legally binding agreement between parties."],
  ["auction", "BE", "ˈɔkʃən", "auc|tion", "A sale in which buyers bid against each other for an item."],
  ["franchise", "BE", "ˈfrænˌʧaɪz", "fran|chise", "A license to sell a company's products under its brand."],
  ["brand", "BE", "brænd", "brand", "A name, logo, or image that identifies a company's products."],
  ["marketing", "BE", "ˈmɑrkətɪŋ", "mar|ket|ing", "The work of promoting and selling products or services."],
  ["advertising", "BE", "ˈædvərˌtaɪzɪŋ", "ad|ver|tis|ing", "The business of creating messages that persuade people to buy."],
  ["promotion", "BE", "pərˈmoʊʃən", "pro|mo|tion", "A special offer or campaign to increase sales."],
  ["discount", "BE", "ˈdɪskaʊnt", "dis|count", "A reduction in the usual price of something."],
  ["refund", "BE", "ˈriˌfənd", "re|fund", "Money returned to a customer for a product or service."],
  ["warranty", "BE", "ˈwɔrənti", "war|ran|ty", "A promise by a seller to repair or replace a faulty product."],
  ["subscription", "BE", "səbˈskrɪpʃən", "sub|scrip|tion", "A regular payment that gives access to a service or product."],
  ["rent", "BE", "rɛnt", "rent", "Money paid regularly to use a home, land, or equipment."],
  ["lease", "BE", "lis", "lease", "A contract that allows someone to use property for a set period."],
  ["landlord", "BE", "ˈlænˌdlɔrd", "land|lord", "A person who owns property and rents it to others."],
  ["tenant", "BE", "ˈtɛnənt", "ten|ant", "A person who pays rent to live in or use a property."],
  ["infrastructure", "BE", "ˌɪnfrəˈstrəkʧər", "in|fra|struc|ture", "The basic roads, power, water, and transport systems a society needs."],
  ["sustainability", "BE", "səˌsteɪnəˈbɪlɪti", "sus|tain|a|bil|i|ty", "The ability to operate without harming the environment or future resources."],
  ["algorithm", "ST", "ˈælgərˌɪðəm", "al|go|rithm", "A set of steps a computer follows to solve a problem."],
  ["artificial intelligence", "ST", "ˌɑrtəˈfɪʃəl ˌɪnˈtɛləʤəns", "ar|ti|fi|cial|in|tel|li|gence", "Computer systems designed to perform tasks that normally need human intelligence."],
  ["machine learning", "ST", "məˈʃin ˈlərnɪŋ", "ma|chine|learn|ing", "A method that lets computers improve by learning from data."],
  ["neural network", "ST", "ˈnʊrəl ˈnɛtˌwərk", "neu|ral|net|work", "A computing system modeled on the connections in the human brain."],
  ["data", "ST", "ˈdætə", "da|ta", "Facts, numbers, or information collected for analysis."],
  ["database", "ST", "ˈdætəˌbeɪs", "da|ta|base", "An organized collection of information stored for quick access."],
  ["cloud", "ST", "klaʊd", "cloud", "Remote servers that store data and run software over the internet."],
  ["server", "ST", "ˈsərvər", "serv|er", "A computer that provides services or data to other computers."],
  ["software", "ST", "ˈsɔfˌwɛr", "soft|ware", "Programs and instructions that tell a computer what to do."],
  ["hardware", "ST", "ˈhɑrdˌwɛr", "hard|ware", "The physical parts of a computer or electronic device."],
  ["semiconductor", "ST", "ˌsɛmɪkənˈdəktər", "sem|i|con|duc|tor", "A material that conducts electricity under certain conditions, used in chips."],
  ["chip", "ST", "ʧɪp", "chip", "A small electronic circuit that processes or stores information."],
  ["processor", "ST", "ˈprɑˌsɛsər", "pro|ces|sor", "The part of a computer that carries out instructions."],
  ["memory", "ST", "ˈmɛməri", "mem|o|ry", "The part of a computer that stores data for immediate use."],
  ["encryption", "ST", "ɛnˈkrɪpʃən", "en|cryp|tion", "The process of converting information into a secret code."],
  ["cybersecurity", "ST", "ˌsaɪbərsɪˈkjʊrəti", "cy|ber|se|cu|ri|ty", "The protection of computer systems and networks from attack."],
  ["malware", "ST", "ˈmælˌwɛr", "mal|ware", "Software designed to damage or gain unauthorized access to a system."],
  ["virus", "ST", "ˈvaɪrəs", "vi|rus", "A harmful program that copies itself and spreads between computers."],
  ["firewall", "ST", "ˈfaɪrwɑl", "fire|wall", "A security system that blocks unwanted network traffic."],
  ["network", "ST", "ˈnɛtˌwərk", "net|work", "A group of computers connected to share information."],
  ["bandwidth", "ST", "ˈbændwɪdθ", "band|width", "The amount of data a connection can carry in a given time."],
  ["satellite", "ST", "ˈsætəˌlaɪt", "sat|el|lite", "An object that orbits Earth or another body, often for communication."],
  ["orbit", "ST", "ˈɔrbət", "or|bit", "The curved path of an object around a planet or star."],
  ["rocket", "ST", "ˈrɑkət", "rock|et", "A vehicle or engine that moves by expelling gas at high speed."],
  ["spacecraft", "ST", "ˈspeɪˌskræft", "space|craft", "A vehicle designed to travel in space."],
  ["astronaut", "ST", "ˈæstrəˌnɑt", "as|tro|naut", "A person trained to travel and work in space."],
  ["telescope", "ST", "ˈtɛləˌskoʊp", "tel|e|scope", "An instrument that makes distant objects appear larger and clearer."],
  ["galaxy", "ST", "ˈgæləksi", "gal|ax|y", "A huge system of stars, gas, and dust held together by gravity."],
  ["planet", "ST", "ˈplænət", "plan|et", "A large body that orbits a star and has cleared its path."],
  ["asteroid", "ST", "ˈæstərˌɔɪd", "as|ter|oid", "A small rocky body that orbits the sun."],
  ["comet", "ST", "ˈkɑmət", "com|et", "An icy body that releases gas and dust as it approaches the sun."],
  ["gravity", "ST", "ˈgrævɪti", "grav|i|ty", "The force that pulls objects toward one another."],
  ["quantum", "ST", "kˈwɑntəm", "quan|tum", "Relating to the smallest units of energy and matter."],
  ["physics", "ST", "ˈfɪzɪks", "phys|ics", "The science of matter, energy, motion, and forces."],
  ["chemistry", "ST", "ˈkɛmɪstri", "chem|is|try", "The science of substances, their properties, and how they react."],
  ["biology", "ST", "baɪˈɑləʤi", "bi|ol|o|gy", "The science of living things and how they function."],
  ["gene", "ST", "ʤin", "gene", "A unit of heredity that carries instructions for a living thing."],
  ["genome", "ST", "ˈʤiˌnoʊm", "ge|nome", "The complete set of genetic information in an organism."],
  ["DNA", "ST", "ˌdiː.enˈeɪ", "DNA", "The molecule that carries genetic instructions in living cells."],
  ["protein", "ST", "ˈproʊˌtin", "pro|tein", "A molecule made of amino acids that performs many jobs in cells."],
  ["enzyme", "ST", "ˈɛnˌzaɪm", "en|zyme", "A protein that speeds up chemical reactions in living things."],
  ["bacteria", "ST", "bækˈtɪriə", "bac|te|ri|a", "Tiny single-celled organisms, some of which cause disease."],
  ["vaccine", "ST", "ˌvækˈsin", "vac|cine", "A substance that trains the immune system to fight a disease."],
  ["antibody", "ST", "ˈæntɪˌbɑdi", "an|ti|bod|y", "A protein the body makes to fight an infection."],
  ["pandemic", "ST", "pænˈdɛmɪk", "pan|dem|ic", "An outbreak of a disease that spreads across many countries."],
  ["epidemiology", "ST", "ˌɛpəˌdɛmiˈɑləʤi", "ep|i|de|mi|ol|o|gy", "The study of how diseases spread and how to control them."],
  ["diagnosis", "ST", "ˌdaɪəgˈnoʊsəs", "di|ag|no|sis", "The identification of a disease from its signs and tests."],
  ["treatment", "ST", "ˈtritmənt", "treat|ment", "Medical care given to cure or control an illness."],
  ["clinical", "ST", "ˈklɪnɪkəl", "clin|i|cal", "Relating to the observation and treatment of patients."],
  ["trial", "ST", "traɪəl", "tri|al", "A research study that tests a treatment on people."],
  ["placebo", "ST", "pləˈsiboʊ", "pla|ce|bo", "A harmless substance given to compare with a real treatment."],
  ["symptom", "ST", "ˈsɪmptəm", "symp|tom", "A sign of illness experienced by a patient."],
  ["chronic", "ST", "ˈkrɑnɪk", "chron|ic", "Lasting for a long time or recurring frequently."],
  ["infectious", "ST", "ˌɪnˈfɛkʃəs", "in|fec|tious", "Able to spread from one person or organism to another."],
  ["antibiotic", "ST", "ˌæntibaɪˈɑtɪk", "an|tibi|ot|ic", "A medicine that kills or stops the growth of bacteria."],
  ["resistance", "ST", "rɪˈzɪstəns", "re|sis|tance", "The ability of a disease or pest to survive a treatment."],
  ["ecosystem", "ST", "ˈikoʊˌsɪstəm", "e|co|sys|tem", "A community of living things and their environment."],
  ["biodiversity", "ST", "ˌbaɪoʊdaɪˈvərsəti", "bio|di|ver|si|ty", "The variety of plant and animal life in a place."],
  ["climate", "ST", "ˈklaɪmɪt", "cli|mate", "The usual weather patterns of a region over many years."],
  ["carbon", "ST", "ˈkɑrbən", "car|bon", "A chemical element found in all living things and in fossil fuels."],
  ["emission", "ST", "ɪˈmɪʃən", "e|mis|sion", "The release of gas or other substances into the air."],
  ["renewable", "ST", "riˈnuəbəl", "re|new|a|ble", "Able to be replaced naturally and used without running out."],
  ["solar", "ST", "ˈsoʊlər", "so|lar", "Relating to the sun or energy from sunlight."],
  ["wind", "ST", "wɪnd", "wind", "Moving air, often used to generate electricity."],
  ["reactor", "ST", "riˈæktər", "re|ac|tor", "A facility that produces energy from controlled nuclear reactions."],
  ["fusion", "ST", "fˈjuʒən", "fu|sion", "The joining of atomic nuclei, which releases huge amounts of energy."],
  ["fission", "ST", "ˈfɪʃən", "fis|sion", "The splitting of an atomic nucleus, which releases energy."],
  ["energy", "ST", "ˈɛnərʤi", "en|er|gy", "The power to do work, such as electricity or heat."],
  ["battery", "ST", "ˈbætəri", "bat|ter|y", "A device that stores energy and supplies it as electricity."],
  ["grid", "ST", "grɪd", "grid", "A network that delivers electricity to homes and businesses."],
  ["turbine", "ST", "ˈtərbaɪn", "tur|bine", "A machine with blades that spins to generate power."],
  ["conservation", "ST", "ˌkɑnsərˈveɪʃən", "con|ser|va|tion", "The protection and careful use of natural resources."],
  ["pollution", "ST", "pəˈluʃən", "pol|lu|tion", "Harmful substances released into air, water, or land."],
  ["recycle", "ST", "riˈsaɪkəl", "re|cy|cle", "To process used materials so they can be used again."],
  ["sustainable", "ST", "səˈsteɪnəbəl", "sus|tain|a|ble", "Able to continue without damaging the environment."],
  ["drought", "ST", "draʊt", "drought", "A long period with little or no rain."],
  ["flood", "ST", "fləd", "flood", "An overflow of water onto land that is usually dry."],
  ["earthquake", "ST", "ˈərθkˌweɪk", "earth|quake", "A sudden shaking of the ground caused by movement in Earth's crust."],
  ["volcano", "ST", "vɑlˈkeɪnoʊ", "vol|ca|no", "A mountain that can erupt with lava, ash, and gas."],
  ["hurricane", "ST", "ˈhərəˌkeɪnz", "hur|ri|cane", "A powerful tropical storm with strong winds and heavy rain."],
  ["tsunami", "ST", "tsuˈnɑmi", "tsu|na|mi", "A giant ocean wave caused by an underwater earthquake or eruption."],
  ["erosion", "ST", "ɪˈroʊʒən", "e|ro|sion", "The gradual wearing away of soil or rock by wind or water."],
  ["species", "ST", "ˈspiʃiz", "spe|cies", "A group of living things that can reproduce with one another."],
  ["habitat", "ST", "ˈhæbəˌtæt", "hab|i|tat", "The natural home of a plant or animal."],
  ["extinction", "ST", "ɪkˈstɪŋʃən", "ex|tinc|tion", "The complete disappearance of a species from Earth."],
  ["evolution", "ST", "ˌɛvəˈluʃən", "ev|o|lu|tion", "The gradual change of living things over many generations."],
  ["fossil", "ST", "ˈfɑsəl", "fos|sil", "The preserved remains or trace of an ancient plant or animal."],
  ["archaeology", "ST", "ˌɑrkiˈɑləʤi", "ar|chae|ol|o|gy", "The study of past human life through objects and sites."],
  ["anthropology", "ST", "ˌænθrəˈpɑləʤi", "an|thro|pol|o|gy", "The study of human societies, cultures, and development."],
  ["neuroscience", "ST", "nˈjʊroʊˌsaɪəns", "neu|ro|science", "The scientific study of the brain and nervous system."],
  ["psychology", "ST", "saɪˈkɑləʤi", "psy|chol|o|gy", "The study of the mind and human behavior."],
  ["cognition", "ST", "kɑgˈnɪʃən", "cog|ni|tion", "The mental process of thinking, learning, and remembering."],
  ["robot", "ST", "ˈroʊˌbət", "ro|bot", "A machine that can carry out tasks automatically or by remote control."],
  ["robotics", "ST", "ˌroʊˈbɑtɪks", "ro|bot|ics", "The science of designing, building, and operating robots."],
  ["sensor", "ST", "ˈsɛnsər", "sen|sor", "A device that detects changes in light, heat, motion, or other conditions."],
  ["laser", "ST", "ˈleɪzər", "la|ser", "A device that produces a narrow, intense beam of light."],
  ["radar", "ST", "ˈreɪˌdɑr", "ra|dar", "A system that uses radio waves to detect objects and their distance."],
  ["sonar", "ST", "ˈsoʊnɑr", "so|nar", "A system that uses sound waves to detect objects underwater."],
  ["hologram", "ST", "ˈhɔloʊˌgræm", "hol|o|gram", "A three-dimensional image created by light interference."],
  ["virtual", "ST", "ˈvərʧuəl", "vir|tu|al", "Created by computer software rather than existing physically."],
  ["augmented", "ST", "ɑgˈmɛntəd", "aug|ment|ed", "Combining computer images or information with the real world."],
  ["metaverse", "ST", "ˈmɛtəvɜrs", "met|a|verse", "A shared virtual world where people interact online."],
  ["blockchain", "ST", "ˈblɑktʃeɪn", "block|chain", "A shared digital record of transactions that is hard to change."],
  ["cryptocurrency", "ST", "ˈkrɪptoʊˌkɜrənsi", "cryp|to|cur|ren|cy", "A digital currency secured by cryptography and computer networks."],
  ["bitcoin", "ST", "ˈbɪtkɔɪn", "bit|coin", "A decentralized digital currency created in 2009."],
  ["ledger", "ST", "ˈlɛʤər", "ledg|er", "A record book or digital file that tracks financial transactions."],
  ["latency", "ST", "ˈleɪtənsi", "la|ten|cy", "The delay before data begins to move across a network."],
  ["interface", "ST", "ˈɪnərˌfeɪs", "in|ter|face", "The point where a user interacts with a computer or device."],
  ["pixel", "ST", "ˈpɪksəl", "pix|el", "A tiny dot that forms part of a digital image."],
  ["display", "ST", "dɪˈspleɪ", "dis|play", "An electronic screen that shows images, text, or video."],
  ["streaming", "ST", "ˈstrimɪŋ", "stream|ing", "Playing audio or video over the internet as it is received."],
  ["broadband", "ST", "ˈbrɔdˌbænd", "broad|band", "A high-speed internet connection that carries large amounts of data."],
  ["fiber", "ST", "ˈfaɪbər", "fi|ber", "Thin strands of glass used to carry data as pulses of light."],
  ["wireless", "ST", "ˈwaɪrlɪs", "wire|less", "Using radio signals instead of cables to connect devices."],
  ["spectrum", "ST", "ˈspɛktrəm", "spec|trum", "The range of radio frequencies used for communication."],
  ["transistor", "ST", "trænˈzɪstər", "tran|sis|tor", "A tiny electronic switch that is the basis of modern computers."],
  ["circuit", "ST", "ˈsərkət", "cir|cuit", "A path that allows electricity to flow through electronic parts."],
  ["wearable", "ST", "ˈwɛrəbəl", "wear|a|ble", "A device worn on the body that collects or displays information."],
  ["implant", "ST", "ˌɪmˈplænt", "im|plant", "A device placed inside the body for medical or technical purposes."],
  ["biotech", "ST", "ˈbaɪoʊˌtɛk", "bi|o|tech", "Technology that uses living things or biological systems to make products."],
  ["cloning", "ST", "ˈkloʊnɪŋ", "clon|ing", "The process of creating a genetic copy of a living thing."],
  ["mutation", "ST", "mjuˈteɪʃən", "mu|ta|tion", "A change in the genetic material of an organism."],
  ["cell", "ST", "sɛl", "cell", "The smallest basic unit of life."],
  ["tissue", "ST", "ˈtɪʃu", "tis|sue", "A group of similar cells that work together in the body."],
  ["organ", "ST", "ˈɔrgən", "or|gan", "A body part made of tissues that performs a specific function."],
  ["culture", "CU", "ˈkəlʧər", "cul|ture", "The customs, arts, and way of life shared by a group of people."],
  ["heritage", "CU", "ˈhɛrɪtɪʤ", "her|i|tage", "Traditions and objects passed down from earlier generations."],
  ["tradition", "CU", "trəˈdɪʃən", "tra|di|tion", "A custom or belief handed down over many years."],
  ["custom", "CU", "ˈkəstəm", "cus|tom", "A usual way of behaving in a particular society or group."],
  ["ritual", "CU", "ˈrɪʧuəl", "rit|u|al", "A set of actions performed in a fixed order, often for religious reasons."],
  ["ceremony", "CU", "ˈsɛrəˌmoʊni", "cer|e|mo|ny", "A formal event held to mark an important occasion."],
  ["festival", "CU", "ˈfɛstɪvəl", "fes|ti|val", "A public celebration with music, food, or performances."],
  ["carnival", "CU", "ˈkɑrnəvəl", "car|ni|val", "A festive season with parades, music, and public celebrations."],
  ["parade", "CU", "pəreɪd", "pa|rade", "A public procession of people, vehicles, or floats."],
  ["cuisine", "CU", "kwɪˈzin", "cui|sine", "The style of cooking associated with a country or region."],
  ["recipe", "CU", "ˈrɛsəpi", "rec|i|pe", "A set of instructions for preparing a dish."],
  ["ingredient", "CU", "ˌɪnˈgridiənt", "in|gre|di|ent", "One of the foods or substances used to make a dish."],
  ["spice", "CU", "spaɪs", "spice", "A plant substance used to add flavor or heat to food."],
  ["harvest", "CU", "ˈhɑrvəst", "har|vest", "The gathering of crops at the end of a growing season."],
  ["art", "CU", "ɑrt", "art", "Creative work that expresses ideas or feelings through skill and imagination."],
  ["artist", "CU", "ˈɑrtɪst", "art|ist", "A person who creates art, such as paintings, music, or performances."],
  ["painting", "CU", "ˈpeɪnɪŋ", "paint|ing", "A picture made with paint."],
  ["sculpture", "CU", "ˈskəlpʧər", "sculp|ture", "A three-dimensional work of art made from stone, metal, or other material."],
  ["gallery", "CU", "ˈgæləri", "gal|ler|y", "A room or building where art is displayed."],
  ["museum", "CU", "mˈjuziəm", "mu|se|um", "A building where important objects and artworks are kept and shown."],
  ["exhibit", "CU", "ɪgˈzɪbɪt", "ex|hib|it", "A public display of objects or works of art."],
  ["curator", "CU", "ˈkjʊrətər", "cu|ra|tor", "A person who selects and cares for items in a museum or exhibition."],
  ["architecture", "CU", "ˈɑrkəˌtɛkʧər", "ar|chi|tec|ture", "The art and science of designing buildings."],
  ["monument", "CU", "ˈmɑnjəmənt", "mon|u|ment", "A structure built to remember a person or event."],
  ["landmark", "CU", "ˈlændˌmɑrk", "land|mark", "A famous or easily recognized place or building."],
  ["artifact", "CU", "ˈɑrtəˌfækt", "ar|ti|fact", "An object made by people, especially one of historical interest."],
  ["manuscript", "CU", "ˈmænjəˌskrɪpt", "man|u|script", "A handwritten or original copy of a text."],
  ["literature", "CU", "ˈlɪtərəʧər", "lit|er|a|ture", "Written works such as novels, poems, and plays."],
  ["novel", "CU", "ˈnɑvəl", "nov|el", "A long fictional story told in prose."],
  ["poetry", "CU", "ˈpoʊətri", "po|et|ry", "Literary writing that uses rhythm and imagery, often in verse."],
  ["poem", "CU", "poʊəm", "po|em", "A piece of writing arranged in lines, often with rhythm or rhyme."],
  ["prose", "CU", "proʊz", "prose", "Ordinary written language that is not poetry."],
  ["fiction", "CU", "ˈfɪkʃən", "fic|tion", "Writing about imagined people and events."],
  ["nonfiction", "CU", "nɑnˈfɪkʃən", "non|fic|tion", "Writing about real people, events, and facts."],
  ["memoir", "CU", "ˈmɛmˌwɑr", "mem|oir", "A written account of the author's own memories and experiences."],
  ["biography", "CU", "baɪˈɑgrəfi", "bi|og|ra|phy", "The story of a person's life written by someone else."],
  ["autobiography", "CU", "ˌɔtəbaɪˈɑgrəfi", "au|to|bi|og|ra|phy", "The story of a person's life written by that person."],
  ["protagonist", "CU", "proʊˈtægənəst", "pro|tag|o|nist", "The main character in a story."],
  ["antagonist", "CU", "ænˈtægənəst", "an|tag|o|nist", "The character who opposes the protagonist in a story."],
  ["narrative", "CU", "ˈnɛrətɪv", "nar|ra|tive", "A story or account of connected events."],
  ["plot", "CU", "plɑt", "plot", "The sequence of events that make up a story."],
  ["theme", "CU", "θim", "theme", "The central idea or message explored in a work."],
  ["symbolism", "CU", "ˈsɪmbəˌlɪzəm", "sym|bol|ism", "The use of objects or images to represent deeper ideas."],
  ["metaphor", "CU", "ˈmɛtəfɔr", "met|a|phor", "A figure of speech that compares two things without using 'like' or 'as'."],
  ["genre", "CU", "ˈʒɑnrə", "gen|re", "A category of art or literature with a particular style."],
  ["satire", "CU", "ˈsæˌtaɪər", "sat|ire", "The use of humor to criticize people, ideas, or institutions."],
  ["comedy", "CU", "ˈkɑmədi", "com|e|dy", "A humorous work or performance intended to make people laugh."],
  ["tragedy", "CU", "ˈtræʤədi", "trag|e|dy", "A serious drama in which the main character suffers a disastrous end."],
  ["drama", "CU", "ˈdrɑmə", "dra|ma", "A play or story written for performance by actors."],
  ["theater", "CU", "ˈθieɪtər", "the|a|ter", "A building or art form where plays and performances are presented."],
  ["playwright", "CU", "ˈpleɪˌraɪt", "play|wright", "A person who writes plays."],
  ["actor", "CU", "ˈæktər", "ac|tor", "A person who performs a role in a play, film, or show."],
  ["actress", "CU", "ˈæktrəs", "ac|tress", "A female actor who performs in plays, films, or shows."],
  ["director", "CU", "dɪˈrɛktər", "di|rec|tor", "The person who guides the making of a film, play, or show."],
  ["screenplay", "CU", "ˈskrinˌpleɪ", "screen|play", "The written script for a film."],
  ["cinematography", "CU", "ˌsɪnɪməˈtɑgrəfi", "cin|e|mat|og|ra|phy", "The art of photographing and lighting a film."],
  ["documentary", "CU", "ˌdɑkjəˈmɛnəri", "doc|u|men|ta|ry", "A film or program that presents real events and facts."],
  ["animation", "CU", "ˌænəˈmeɪʃən", "an|i|ma|tion", "The technique of making drawings or models appear to move."],
  ["orchestra", "CU", "ˈɔrkəstrə", "or|ches|tra", "A large group of musicians who play classical music together."],
  ["symphony", "CU", "ˈsɪmfəni", "sym|pho|ny", "A long musical work written for an orchestra."],
  ["conductor", "CU", "kənˈdəktər", "con|duc|tor", "A person who leads an orchestra or choir."],
  ["composer", "CU", "kəmˈpoʊzər", "com|pos|er", "A person who writes music."],
  ["melody", "CU", "ˈmɛlədi", "mel|o|dy", "The main tune of a piece of music."],
  ["harmony", "CU", "ˈhɑrməni", "har|mo|ny", "The combination of musical notes played together to create chords."],
  ["rhythm", "CU", "ˈrɪðəm", "rhythm", "The pattern of beats in music or speech."],
  ["tempo", "CU", "ˈtɛmˌpoʊ", "tem|po", "The speed at which a piece of music is played."],
  ["chorus", "CU", "ˈkɔrəs", "cho|rus", "A group of singers, or the repeated part of a song."],
  ["verse", "CU", "vərs", "verse", "A group of lines in a poem or song."],
  ["album", "CU", "ˈælbəm", "al|bum", "A collection of recorded songs released together."],
  ["concert", "CU", "ˈkɑnsərt", "con|cert", "A live performance of music before an audience."],
  ["ballet", "CU", "bæˈleɪ", "bal|let", "A form of dance performed with music and precise movements."],
  ["choreography", "CU", "ˌkɔriˈɑgrəfi", "chore|og|ra|phy", "The art of arranging movements for dancers."],
  ["dancer", "CU", "ˈdænsər", "danc|er", "A person who performs dance."],
  ["opera", "CU", "ˈɑprə", "op|er|a", "A dramatic work in which singers perform with an orchestra."],
  ["jazz", "CU", "ʤæz", "jazz", "A style of music with improvisation and syncopated rhythms."],
  ["blues", "CU", "bluz", "blues", "A style of music with expressive melodies, often about hardship."],
  ["rock", "CU", "rɑk", "rock", "A popular music style with strong beats and electric instruments."],
  ["hip-hop", "CU", "ˈhɪˌphɔp", "hip|hop", "A music and cultural movement featuring rap, DJing, and dance."],
  ["folk", "CU", "foʊk", "folk", "Traditional music or art of ordinary people in a region."],
  ["classical", "CU", "ˈklæsɪkəl", "clas|si|cal", "Relating to serious traditional music written for orchestras and ensembles."],
  ["instrument", "CU", "ˈɪnstrəmənt", "in|stru|ment", "An object used to make music, such as a piano or violin."],
  ["guitar", "CU", "gɪˈtɑr", "gui|tar", "A stringed instrument played by plucking or strumming."],
  ["piano", "CU", "piˈænə", "pi|an|o", "A large keyboard instrument with strings struck by hammers."],
  ["violin", "CU", "vaɪəˈlɪn", "vi|o|lin", "A small stringed instrument played with a bow."],
  ["drum", "CU", "drəm", "drum", "A percussion instrument played by hitting a stretched skin."],
  ["flute", "CU", "flut", "flute", "A long, thin wind instrument played by blowing across a hole."],
  ["trumpet", "CU", "ˈtrəmpət", "trum|pet", "A brass instrument with a bright, powerful sound."],
  ["saxophone", "CU", "ˈsæksəˌfoʊn", "sax|o|phone", "A curved metal wind instrument used in jazz and other music."],
  ["choir", "CU", "kwaɪər", "choir", "A group of people who sing together."],
  ["photography", "CU", "fəˈtɑgrəfi", "pho|tog|ra|phy", "The art of taking and developing photographs."],
  ["portrait", "CU", "ˈpɔrtrət", "por|trait", "A picture of a person, especially one showing the face."],
  ["landscape", "CU", "ˈlænˌskeɪp", "land|scape", "A picture showing a view of natural scenery."],
  ["canvas", "CU", "ˈkænvəs", "can|vas", "A strong cloth used for painting, or a painting on it."],
  ["mural", "CU", "mˈjʊrəl", "mu|ral", "A large painting made directly on a wall."],
  ["graffiti", "CU", "grəˈfiti", "graf|fi|ti", "Writing or drawings painted on public walls, often illegally."],
  ["fashion", "CU", "ˈfæʃən", "fash|ion", "The popular style of clothes, hair, or decoration at a particular time."],
  ["designer", "CU", "dɪˈzaɪnər", "de|sign|er", "A person who plans the look of clothes, objects, or spaces."],
  ["textile", "CU", "ˈtɛkˌstaɪl", "tex|tile", "Cloth or woven material."],
  ["costume", "CU", "ˈkɑstum", "cos|tume", "Clothing worn for a play, festival, or special occasion."],
  ["jewelry", "CU", "ˈʤuəlri", "jew|el|ry", "Decorative objects worn on the body, such as rings and necklaces."],
  ["pottery", "CU", "ˈpɑtəri", "pot|ter|y", "Objects made from clay and hardened by heat."],
  ["ceramic", "CU", "sərˈæmɪk", "ce|ram|ic", "A hard material made by heating clay, or an object made from it."],
  ["craft", "CU", "kræft", "craft", "A skill in making things by hand."],
  ["folklore", "CU", "ˈfoʊˌklɔr", "folk|lore", "The traditional stories and beliefs of a community."],
  ["myth", "CU", "mɪθ", "myth", "A traditional story that explains natural events or beliefs."],
  ["legend", "CU", "ˈlɛʤənd", "leg|end", "A traditional story about heroic or famous people."],
  ["fable", "CU", "ˈfeɪbəl", "fa|ble", "A short story with a moral, often featuring animals."],
  ["proverb", "CU", "ˈprɑvərb", "prov|erb", "A short saying that expresses a common truth."],
  ["dialect", "CU", "ˈdaɪəˌlɛkt", "di|alect", "A form of a language spoken in a particular region or group."],
  ["accent", "CU", "ˈækˌsɛnt", "ac|cent", "The way people pronounce a language, often linked to their region."],
  ["bilingual", "CU", "baɪˈlɪŋgwəl", "bi|lin|gual", "Able to speak two languages fluently."],
  ["translation", "CU", "trænzˈleɪʃən", "trans|la|tion", "The process of changing text from one language into another."],
  ["interpreter", "CU", "ˌɪnˈtərprətər", "in|ter|pre|ter", "A person who translates spoken language in real time."],
  ["calligraphy", "CU", "kəˈlɪgrəfi", "cal|lig|ra|phy", "The art of beautiful handwriting."],
  ["archive", "CU", "ˈɑrˌkaɪv", "ar|chive", "A collection of historical records and documents."],
  ["library", "CU", "ˈlaɪbrɛˌri", "li|brar|y", "A place where books and other materials are kept for reading and borrowing."],
  ["preservation", "CU", "ˌprɛzərˈveɪʃən", "pres|er|va|tion", "The act of protecting something from damage or loss."],
  ["restoration", "CU", "ˌrɛstərˈeɪʃən", "res|to|ra|tion", "The work of repairing something to its original condition."],
  ["excavation", "CU", "ˌɛkskəˈveɪʃən", "ex|ca|va|tion", "The process of digging up a site to find buried objects."],
  ["indigenous", "CU", "ˌɪnˈdɪʤənəs", "in|dig|e|nous", "Belonging to the original people of a place."],
  ["ancestor", "CU", "ˈænˌsɛstər", "an|ces|tor", "A person from whom one is descended, usually long ago."],
  ["descendant", "CU", "dɪˈsɛndənt", "de|scen|dant", "A person who comes from a particular ancestor or group."],
  ["diaspora", "CU", "daɪˈæspərə", "di|as|po|ra", "A community of people living outside their original homeland."],
  ["multicultural", "CU", "ˌməltiˈkəlʧərəl", "mul|ti|cul|tur|al", "Including or relating to several different cultures."],
  ["diversity", "CU", "dɪˈvərsɪti", "di|ver|si|ty", "The presence of many different types of people, ideas, or things."],
];

/* --------------------------------------------------------------------------
   Configuration and metadata
   -------------------------------------------------------------------------- */

const APP_VERSION = "1.0.0";
const STORAGE_KEY = "voa-newsroom.progress.v1";
const FEED_CACHE_KEY = "voa-newsroom.feed.v1";
const FEED_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://learningenglish.voanews.com/api/";
const PAGE_SIZE = 36;
const FEED_TTL_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const CATEGORY_META = {
  WP: {
    label: "World Politics",
    short: "Politics",
    color: "#60a5fa",
    templates: [
      "VOA Explains: The debate over '{word}' in today's global briefing.",
      "World Desk: A closer look at '{word}' and what comes next.",
      "VOA Report: '{word}' takes center stage in a fast-moving story.",
      "Global Update: Officials respond as '{word}' draws attention.",
      "Diplomatic Desk: Why '{word}' is shaping the conversation this week.",
    ],
    examples: [
      "Diplomats said {word} would dominate the next round of talks.",
      "The world desk is following how {word} affects communities.",
    ],
  },
  BE: {
    label: "Business & Economy",
    short: "Business",
    color: "#f4b942",
    templates: [
      "Market Watch: '{word}' dominates today's economic briefing.",
      "VOA Business: A closer look at '{word}' and its impact on households.",
      "Economy Desk: Why '{word}' is on every analyst's radar.",
      "Business Brief: '{word}' takes center stage in a fast-moving market.",
      "Global Trade: What '{word}' means for workers and consumers.",
    ],
    examples: [
      "Markets reacted as {word} shaped the economic outlook.",
      "The business desk is following how {word} affects companies and consumers.",
    ],
  },
  ST: {
    label: "Science & Tech",
    short: "Science",
    color: "#2dd4bf",
    templates: [
      "Science Desk: '{word}' takes center stage in a new research briefing.",
      "VOA Science: A closer look at '{word}' and what it could change.",
      "Lab Report: Why '{word}' is drawing attention from experts.",
      "Tech Watch: '{word}' moves from the lab to the real world.",
      "Innovation Brief: The promise and risk of '{word}'.",
    ],
    examples: [
      "Researchers say {word} could change how we live and work.",
      "The science desk is following how {word} moves from the lab to the real world.",
    ],
  },
  CU: {
    label: "Culture",
    short: "Culture",
    color: "#c084fc",
    templates: [
      "Culture Desk: '{word}' shapes the conversation this week.",
      "VOA Culture: A closer look at '{word}' and its influence.",
      "Arts Report: Why '{word}' is drawing new audiences.",
      "Culture Brief: '{word}' takes center stage in a changing world.",
      "From the Archive: How '{word}' became part of everyday life.",
    ],
    examples: [
      "The story explores how {word} shapes everyday life.",
      "The culture desk put {word} at the center of the conversation.",
    ],
  },
};

const RANKS = [
  { name: "Intern", min: 0, icon: "🎙️", next: "Field Journalist", nextAt: 25 },
  { name: "Field Journalist", min: 25, icon: "📝", next: "Senior Editor", nextAt: 100 },
  { name: "Senior Editor", min: 100, icon: "🗞️", next: "Anchor", nextAt: 250 },
  { name: "Anchor", min: 250, icon: "🌟", next: null, nextAt: null },
];

function lowerFirstWord(text) {
  return /^[A-Z]{2,}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

const WORDS = RAW_WORDS.map((row, index) => {
  const meta = CATEGORY_META[row[1]];
  const word = row[0];
  const definition = row[4];
  const headline = meta.templates[index % meta.templates.length].replace(/\{word\}/g, word);
  const definitionExample = `In this lesson, ${word} means ${lowerFirstWord(definition.replace(/\.$/, ""))}.`;
  const examples = [
    ...meta.examples.map((template) => template.replace(/\{word\}/g, word)),
    definitionExample,
    headline,
  ];
  return {
    id: index + 1,
    word,
    cat: row[1],
    catLabel: meta.label,
    catShort: meta.short,
    color: meta.color,
    ipa: row[2],
    syllables: row[3].split("|").filter(Boolean),
    definition,
    headline,
    examples,
    search: `${word} ${definition} ${meta.label}`.toLowerCase(),
  };
});

const WORD_BY_ID = new Map(WORDS.map((word) => [word.id, word]));

const SpeechRecognitionConstructor =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;
const ttsSupported =
  typeof window.speechSynthesis !== "undefined" &&
  typeof window.SpeechSynthesisUtterance === "function";

/* --------------------------------------------------------------------------
   State
   -------------------------------------------------------------------------- */

function isIsoDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function defaultWordState(now) {
  return {
    status: "New",
    lastReviewed: null,
    reviewCount: 0,
    nextReviewDue: now,
  };
}

function makeState(saved) {
  const now = new Date().toISOString();
  const next = {
    version: 1,
    createdAt: now,
    updatedAt: now,
    words: {},
    streak: { count: 0, best: 0, lastDate: null, history: [] },
    stats: { attempts: 0, correct: 0 },
    settings: { theme: "dark", fontScale: 1 },
  };

  WORDS.forEach((word) => {
    next.words[word.id] = defaultWordState(now);
  });

  if (saved && typeof saved === "object") {
    if (saved.words && typeof saved.words === "object") {
      WORDS.forEach((word) => {
        const src = saved.words[word.id] || saved.words[String(word.id)];
        if (!src || typeof src !== "object") return;
        const count = Number.isFinite(Number(src.reviewCount))
          ? Math.max(0, Math.floor(Number(src.reviewCount)))
          : 0;
        const status = ["New", "Practicing", "Mastered"].includes(src.status)
          ? src.status
          : count >= 6
            ? "Mastered"
            : count > 0
              ? "Practicing"
              : "New";
        next.words[word.id] = {
          status,
          lastReviewed: isIsoDate(src.lastReviewed) ? src.lastReviewed : null,
          reviewCount: count,
          nextReviewDue: isIsoDate(src.nextReviewDue) ? src.nextReviewDue : now,
        };
      });
    }

    if (saved.streak && typeof saved.streak === "object") {
      next.streak = {
        count: Number.isFinite(Number(saved.streak.count))
          ? Math.max(0, Math.floor(Number(saved.streak.count)))
          : 0,
        best: Number.isFinite(Number(saved.streak.best))
          ? Math.max(0, Math.floor(Number(saved.streak.best)))
          : 0,
        lastDate: typeof saved.streak.lastDate === "string" ? saved.streak.lastDate : null,
        history: Array.isArray(saved.streak.history)
          ? saved.streak.history.filter((item) => typeof item === "string").slice(-60)
          : [],
      };
    }

    if (saved.stats && typeof saved.stats === "object") {
      next.stats = {
        attempts: Number.isFinite(Number(saved.stats.attempts))
          ? Math.max(0, Math.floor(Number(saved.stats.attempts)))
          : 0,
        correct: Number.isFinite(Number(saved.stats.correct))
          ? Math.max(0, Math.floor(Number(saved.stats.correct)))
          : 0,
      };
    }

    if (saved.settings && ["dark", "light"].includes(saved.settings.theme)) {
      next.settings.theme = saved.settings.theme;
    }
    if (saved.settings && Number.isFinite(Number(saved.settings.fontScale))) {
      next.settings.fontScale = Math.min(1.4, Math.max(0.8, Number(saved.settings.fontScale)));
    }
  }

  return next;
}

function readSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

let state = makeState(readSavedState());

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast("Your browser could not save progress. Export a progress file to keep it safe.", "error");
  }
}

/* --------------------------------------------------------------------------
   DOM references
   -------------------------------------------------------------------------- */

const $ = (id) => document.getElementById(id);

const els = {
  dueBtn: $("dueBtn"),
  dueCount: $("dueCount"),
  saveBtn: $("saveBtn"),
  loadBtn: $("loadBtn"),
  loadInput: $("loadInput"),
  themeBtn: $("themeBtn"),
  fontDown: $("fontDown"),
  fontUp: $("fontUp"),
  fontLabel: $("fontLabel"),

  rankIcon: $("rankIcon"),
  rankName: $("rankName"),
  rankNext: $("rankNext"),
  progressMastered: $("progressMastered"),
  progressPercent: $("progressPercent"),
  progressBar: $("progressBar"),
  progressFill: $("progressFill"),
  progressNote: $("progressNote"),
  streakCount: $("streakCount"),
  streakUnit: $("streakUnit"),
  streakBest: $("streakBest"),
  reviewedToday: $("reviewedToday"),
  reviewedUnit: $("reviewedUnit"),
  accuracyRate: $("accuracyRate"),
  attemptsTotal: $("attemptsTotal"),
  attemptsUnit: $("attemptsUnit"),

  feedDot: $("feedDot"),
  feedStatusText: $("feedStatusText"),
  tickerTrack: $("tickerTrack"),
  feedRefreshBtn: $("feedRefreshBtn"),

  railAllCount: $("railAllCount"),
  railDueCount: $("railDueCount"),
  railPracticingCount: $("railPracticingCount"),
  railMasteredCount: $("railMasteredCount"),

  viewEyebrow: $("viewEyebrow"),
  viewTitle: $("viewTitle"),
  viewSubtitle: $("viewSubtitle"),
  searchInput: $("searchInput"),
  sortSelect: $("sortSelect"),
  resultCount: $("resultCount"),
  wordGrid: $("wordGrid"),
  emptyState: $("emptyState"),
  resetFiltersBtn: $("resetFiltersBtn"),
  loadMoreWrap: $("loadMoreWrap"),
  loadMoreBtn: $("loadMoreBtn"),

  studioPanel: $("studioPanel"),
  studioBackdrop: $("studioBackdrop"),
  studioEmpty: $("studioEmpty"),
  studioBody: $("studioBody"),
  studioStatus: $("studioStatus"),
  studioWord: $("studioWord"),
  studioIPA: $("studioIPA"),
  studioDefinition: $("studioDefinition"),
  studioCategory: $("studioCategory"),
  srsReviewCount: $("srsReviewCount"),
  srsLevel: $("srsLevel"),
  srsDue: $("srsDue"),
  studioExampleText: $("studioExampleText"),
  studioExampleRefresh: $("studioExampleRefresh"),
  studioExamplePractice: $("studioExamplePractice"),
  closeStudio: $("closeStudio"),

  readLiveCard: $("readLiveCard"),
  readBadge: $("readBadge"),
  readSource: $("readSource"),
  readHeadline: $("readHeadline"),
  readLink: $("readLink"),
  readRecordBtn: $("readRecordBtn"),
  readStopBtn: $("readStopBtn"),
  readPlayBtn: $("readPlayBtn"),
  readRefreshBtn: $("readRefreshBtn"),
  readStatus: $("readStatus"),
  readTranscript: $("readTranscript"),
  readTranscriptText: $("readTranscriptText"),
  readAccuracy: $("readAccuracy"),
  readAccuracyText: $("readAccuracyText"),
  readAccuracyFill: $("readAccuracyFill"),
  readManualBtn: $("readManualBtn"),

  listenStatus: $("listenStatus"),
  listenPlayBtn: $("listenPlayBtn"),
  listenInput: $("listenInput"),
  listenCheckBtn: $("listenCheckBtn"),
  listenFeedback: $("listenFeedback"),
  listenRevealBtn: $("listenRevealBtn"),

  editorHeadline: $("editorHeadline"),
  editorOptions: $("editorOptions"),
  editorInput: $("editorInput"),
  editorCheckBtn: $("editorCheckBtn"),
  editorFeedback: $("editorFeedback"),

  matchTimer: $("matchTimer"),
  matchScore: $("matchScore"),
  matchStartBtn: $("matchStartBtn"),
  matchStatus: $("matchStatus"),
  matchBoard: $("matchBoard"),
  matchWords: $("matchWords"),
  matchDefs: $("matchDefs"),
  matchFeedback: $("matchFeedback"),

  syllableChunks: $("syllableChunks"),
  syllableIPA: $("syllableIPA"),
  syllableStress: $("syllableStress"),
  syllablePlayAll: $("syllablePlayAll"),
  syllableSlow: $("syllableSlow"),
  syllableFeedback: $("syllableFeedback"),

  sentenceBadge: $("sentenceBadge"),
  sentenceText: $("sentenceText"),
  sentenceSource: $("sentenceSource"),
  sentenceRefreshBtn: $("sentenceRefreshBtn"),
  sentencePlayBtn: $("sentencePlayBtn"),
  sentencePracticeBtn: $("sentencePracticeBtn"),
  sentencePractice: $("sentencePractice"),
  sentenceBlank: $("sentenceBlank"),
  sentenceInput: $("sentenceInput"),
  sentenceCheckBtn: $("sentenceCheckBtn"),
  sentenceFeedback: $("sentenceFeedback"),
  sentenceStatus: $("sentenceStatus"),

  toast: $("toast"),
  resetAllBtn: $("resetAllBtn"),
};

const activityTabs = Array.from(document.querySelectorAll(".activity-tab"));
const activityPanels = {
  read: $("panel-read"),
  listen: $("panel-listen"),
  editor: $("panel-editor"),
  match: $("panel-match"),
  syllable: $("panel-syllable"),
  sentence: $("panel-sentence"),
};
const categoryTabs = Array.from(document.querySelectorAll(".cat-tab"));
const railViewLinks = Array.from(document.querySelectorAll(".rail-link[data-view]"));
const railBeatLinks = Array.from(document.querySelectorAll(".rail-link[data-category]"));
const speedButtons = Array.from(document.querySelectorAll(".speed-btn"));

/* --------------------------------------------------------------------------
   UI state
   -------------------------------------------------------------------------- */

const ui = {
  view: "all",
  category: "ALL",
  search: "",
  sort: "az",
  page: 1,
  selectedId: null,
  activity: "read",
  feed: [],
  feedState: "idle",
  feedFetchedAt: 0,
  liveMatches: new Map(),
  listenRate: 0.8,
  listenSolved: false,
  listenWordId: null,
  listenAttempts: 0,
  editorSolved: false,
  editorWordId: null,
  editorAttempts: 0,
  editorOptions: [],
  sentenceIndex: 0,
  sentenceWordId: null,
  sentenceSolved: false,
  sentenceAttempts: 0,
  readEvaluated: false,
  readSolved: false,
  readIndex: 0,
  webExamples: new Map(),
  readFetching: false,
  readFetchToken: 0,
  recognizing: false,
  recognition: null,
  match: {
    wordId: null,
    active: false,
    timeLeft: 60,
    score: 0,
    round: 1,
    pairs: [],
    wordOrder: [],
    defOrder: [],
    matched: new Set(),
    selected: null,
    seen: new Set(),
    timer: null,
  },
  toastTimer: null,
  searchTimer: null,
  speechToken: 0,
  lastFocused: null,
};

/* --------------------------------------------------------------------------
   Small utilities
   -------------------------------------------------------------------------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isToday(value) {
  return Boolean(value) && dateKey(new Date(value)) === dateKey(new Date());
}

function formatDate(value) {
  if (!value) return "VOA Learning English";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "VOA Learning English";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

function similarity(a, b) {
  if (!a || !b) return 0;
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : Math.max(0, 1 - levenshtein(a, b) / max);
}

/* --------------------------------------------------------------------------
   SRS engine
   -------------------------------------------------------------------------- */

function isMastered(wordState) {
  return wordState.reviewCount >= 6;
}

function isDue(wordState) {
  if (!wordState.nextReviewDue) return true;
  const time = Date.parse(wordState.nextReviewDue);
  return !Number.isFinite(time) || time <= Date.now();
}

function intervalDays(reviewCount) {
  if (reviewCount <= 1) return 1;
  if (reviewCount <= 3) return 3;
  if (reviewCount <= 5) return 7;
  return 30;
}

function levelLabel(wordState) {
  if (wordState.reviewCount >= 6) return "L4 · 30d";
  if (wordState.reviewCount >= 4) return "L3 · 7d";
  if (wordState.reviewCount >= 2) return "L2 · 3d";
  if (wordState.reviewCount >= 1) return "L1 · 1d";
  return "New";
}

function statusFor(wordState) {
  if (wordState.reviewCount > 0 && isDue(wordState)) {
    return { key: "due", label: "🔔 Due", cls: "is-due" };
  }
  if (wordState.reviewCount >= 6) {
    return { key: "mastered", label: "🟢 Mastered", cls: "is-mastered" };
  }
  if (wordState.reviewCount > 0) {
    return { key: "practicing", label: "🟡 Practicing", cls: "is-practicing" };
  }
  return { key: "new", label: "🔴 New", cls: "is-new" };
}

function dueLabel(wordState) {
  if (!wordState.nextReviewDue) return "Ready now";
  const time = Date.parse(wordState.nextReviewDue);
  if (!Number.isFinite(time) || time <= Date.now()) {
    return wordState.reviewCount > 0 ? "Due now" : "Ready to start";
  }
  const days = Math.ceil((time - Date.now()) / DAY_MS);
  if (days <= 1) return "Due tomorrow";
  return `Due in ${days}d`;
}

function getMasteredCount() {
  return WORDS.reduce((total, word) => total + (isMastered(state.words[word.id]) ? 1 : 0), 0);
}

function getDueWords() {
  return WORDS.filter((word) => isDue(state.words[word.id]));
}

function getRank(mastered) {
  for (let i = RANKS.length - 1; i >= 0; i -= 1) {
    if (mastered >= RANKS[i].min) return RANKS[i];
  }
  return RANKS[0];
}

function updateStreak(now) {
  const today = dateKey(now);
  if (!today) return;
  const streak = state.streak;
  if (streak.lastDate === today) return;
  const yesterday = dateKey(new Date(now.getTime() - DAY_MS));
  streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
  streak.lastDate = today;
  streak.best = Math.max(streak.best, streak.count);
  streak.history = [...(streak.history || []), today].slice(-60);
}

function recordMiss(wordId) {
  const wordState = state.words[wordId];
  if (!wordState) return;
  const now = new Date().toISOString();
  wordState.lastReviewed = now;
  wordState.nextReviewDue = now;
  state.stats.attempts += 1;
  state.updatedAt = now;
  saveState();
  renderHUD();
  renderRailCounts();
  renderGrid();
  renderStudioMeta();
}

function touchWord(wordId) {
  const wordState = state.words[wordId];
  if (!wordState) return;
  wordState.lastReviewed = new Date().toISOString();
  state.updatedAt = wordState.lastReviewed;
  saveState();
  renderHUD();
  renderStudioMeta();
}

function completeWord(wordId, activity, correct = true) {
  const wordState = state.words[wordId];
  if (!wordState) return { leveledUp: false, rankUp: false };
  const now = new Date();
  const beforeMastered = getMasteredCount();
  const beforeRank = getRank(beforeMastered);
  const wasMastered = isMastered(wordState);

  wordState.lastReviewed = now.toISOString();
  state.stats.attempts += 1;

  if (correct) {
    wordState.reviewCount += 1;
    wordState.status = wordState.reviewCount >= 6 ? "Mastered" : "Practicing";
    wordState.nextReviewDue = new Date(
      now.getTime() + intervalDays(wordState.reviewCount) * DAY_MS,
    ).toISOString();
    state.stats.correct += 1;
    updateStreak(now);
  } else {
    wordState.nextReviewDue = now.toISOString();
  }

  state.updatedAt = now.toISOString();
  saveState();
  renderHUD();
  renderRailCounts();
  renderGrid();
  renderStudioMeta();

  const afterMastered = getMasteredCount();
  const afterRank = getRank(afterMastered);
  const leveledUp = correct && !wasMastered && isMastered(wordState);
  const rankUp = afterRank.name !== beforeRank.name;

  if (leveledUp) {
    showToast(`Mastered: “${WORD_BY_ID.get(wordId).word}” — next review in 30 days.`, "success", 4200);
  }
  if (rankUp) {
    showToast(`Promotion! You are now a ${afterRank.name}. ${afterRank.icon}`, "success", 5200);
  }

  return { leveledUp, rankUp };
}

/* --------------------------------------------------------------------------
   HUD and navigation rendering
   -------------------------------------------------------------------------- */

function renderHUD() {
  const mastered = getMasteredCount();
  const percent = Math.round((mastered / WORDS.length) * 100);
  const rank = getRank(mastered);
  const due = getDueWords().length;
  const reviewedToday = WORDS.filter((word) => isToday(state.words[word.id].lastReviewed)).length;
  const attempts = state.stats.attempts;
  const correct = state.stats.correct;

  els.rankIcon.textContent = rank.icon;
  els.rankName.textContent = rank.name;
  els.rankNext.textContent = rank.next
    ? `${Math.max(0, rank.nextAt - mastered)} mastered words to ${rank.next}`
    : "Anchor desk unlocked — keep filing.";

  els.progressMastered.textContent = String(mastered);
  els.progressPercent.textContent = `${percent}%`;
  els.progressFill.style.width = `${percent}%`;
  els.progressBar.setAttribute("aria-valuenow", String(mastered));
  els.progressNote.textContent =
    mastered === 0
      ? "Your first byline is one review away."
      : mastered >= 500
        ? "All 500 words mastered. The newsroom is yours."
        : `${500 - mastered} words left to reach the anchor desk.`;

  els.streakCount.textContent = String(state.streak.count);
  els.streakUnit.textContent = state.streak.count === 1 ? "day" : "days";
  els.streakBest.textContent = String(state.streak.best);
  els.reviewedToday.textContent = String(reviewedToday);
  els.reviewedUnit.textContent = reviewedToday === 1 ? "word" : "words";
  els.accuracyRate.textContent = attempts > 0 ? `${Math.round((correct / attempts) * 100)}%` : "—";
  els.attemptsTotal.textContent = String(attempts);
  els.attemptsUnit.textContent = attempts === 1 ? "attempt" : "attempts";

  els.dueCount.textContent = String(due);
  els.railDueCount.textContent = String(due);
  els.dueBtn.classList.toggle("has-due", due > 0);
}

function renderRailCounts() {
  const due = getDueWords().length;
  const mastered = getMasteredCount();
  const practicing = WORDS.filter((word) => {
    const wordState = state.words[word.id];
    return wordState.reviewCount > 0 && !isMastered(wordState);
  }).length;

  els.railAllCount.textContent = String(WORDS.length);
  els.railDueCount.textContent = String(due);
  els.railPracticingCount.textContent = String(practicing);
  els.railMasteredCount.textContent = String(mastered);

  Object.keys(CATEGORY_META).forEach((key) => {
    const count = WORDS.filter((word) => word.cat === key).length;
    const node = $(`count-${key}`);
    if (node) node.textContent = String(count);
  });
}

function updateViewLabels() {
  const cat = ui.category === "ALL" ? null : CATEGORY_META[ui.category];
  let eyebrow = "ASSIGNMENT DESK";
  let title = cat ? cat.label : "All 500 Words";
  let subtitle = cat
    ? `Open a ${cat.label} word card and choose one of five newsroom activities.`
    : "Choose a beat, open a word card, and start filing reports.";

  if (ui.view === "due") {
    eyebrow = "SRS QUEUE";
    title = "Due Today";
    subtitle = cat
      ? `Words from ${cat.label} whose next review timestamp is at or before now.`
      : "Words whose SRS timestamp is at or before now — including new words waiting for a first byline.";
  } else if (ui.view === "mastered") {
    eyebrow = "MASTERED ARCHIVE";
    title = "Mastered";
    subtitle = cat
      ? `Mastered words from ${cat.label}. Keep them warm with a 30-day review.`
      : "Six or more successful reviews. These words are ready for the anchor desk.";
  } else if (ui.view === "practicing") {
    eyebrow = "IN THE FIELD";
    title = "Practicing";
    subtitle = cat
      ? `Words from ${cat.label} that are building their review streak.`
      : "Words with at least one successful review but fewer than six.";
  }

  els.viewEyebrow.textContent = eyebrow;
  els.viewTitle.textContent = title;
  els.viewSubtitle.textContent = subtitle;

  categoryTabs.forEach((tab) => {
    const active = tab.dataset.cat === ui.category;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  railViewLinks.forEach((link) => {
    const active =
      link.dataset.view === ui.view &&
      (ui.view !== "all" || ui.category === "ALL");
    link.classList.toggle("is-active", active);
  });
  railBeatLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      ui.view === "all" && ui.category !== "ALL" && link.dataset.category === ui.category,
    );
  });
}

function setView(view) {
  ui.view = ["all", "due", "mastered", "practicing"].includes(view) ? view : "all";
  ui.page = 1;
  updateViewLabels();
  renderGrid();
}

function setCategory(category, options = {}) {
  ui.category = category === "ALL" || CATEGORY_META[category] ? category : "ALL";
  if (options.keepView !== true) ui.view = "all";
  ui.page = 1;
  updateViewLabels();
  renderGrid();
}

function resetFilters() {
  ui.view = "all";
  ui.category = "ALL";
  ui.search = "";
  ui.sort = "az";
  ui.page = 1;
  els.searchInput.value = "";
  els.sortSelect.value = "az";
  updateViewLabels();
  renderGrid();
}

/* --------------------------------------------------------------------------
   Word grid
   -------------------------------------------------------------------------- */

function getFilteredWords() {
  let list = WORDS.slice();

  if (ui.view === "due") {
    list = list.filter((word) => isDue(state.words[word.id]));
  } else if (ui.view === "mastered") {
    list = list.filter((word) => isMastered(state.words[word.id]));
  } else if (ui.view === "practicing") {
    list = list.filter((word) => {
      const wordState = state.words[word.id];
      return wordState.reviewCount > 0 && !isMastered(wordState);
    });
  }

  if (ui.category !== "ALL") {
    list = list.filter((word) => word.cat === ui.category);
  }

  const query = ui.search.trim().toLowerCase();
  if (query) {
    list = list.filter((word) => word.search.includes(query));
  }

  const byWord = (a, b) => a.word.localeCompare(b.word);
  if (ui.sort === "za") {
    list.sort((a, b) => byWord(b, a));
  } else if (ui.sort === "due") {
    list.sort((a, b) => {
      const aState = state.words[a.id];
      const bState = state.words[b.id];
      const aDue = isDue(aState) ? 0 : 1;
      const bDue = isDue(bState) ? 0 : 1;
      if (aDue !== bDue) return aDue - bDue;
      const aTime = Date.parse(aState.nextReviewDue) || 0;
      const bTime = Date.parse(bState.nextReviewDue) || 0;
      return aTime - bTime || byWord(a, b);
    });
  } else if (ui.sort === "new") {
    list.sort((a, b) => state.words[a.id].reviewCount - state.words[b.id].reviewCount || byWord(a, b));
  } else if (ui.sort === "reviewed") {
    list.sort((a, b) => state.words[b.id].reviewCount - state.words[a.id].reviewCount || byWord(a, b));
  } else {
    list.sort(byWord);
  }

  return list;
}

function wordCardHTML(word) {
  const wordState = state.words[word.id];
  const status = statusFor(wordState);
  const due = isDue(wordState);
  const selected = ui.selectedId === word.id;

  return `
    <button class="word-card${selected ? " is-selected" : ""}" type="button"
      data-word-id="${word.id}" style="--beat-color:${word.color}"
      aria-label="Open ${escapeHtml(word.word)} in the word studio">
      <span class="word-card-top">
        <span class="word-beat"><i aria-hidden="true"></i>${escapeHtml(word.catShort)}</span>
        <span class="word-status ${status.cls}">${status.label}</span>
      </span>
      <span class="word-term">${escapeHtml(word.word)}</span>
      <span class="word-ipa">/${escapeHtml(word.ipa)}/</span>
      <span class="word-def">${escapeHtml(word.definition)}</span>
      <span class="word-card-foot">
        <span><strong>${wordState.reviewCount}</strong> review${wordState.reviewCount === 1 ? "" : "s"}</span>
        <span class="${due ? "word-due" : ""}">${dueLabel(wordState)}</span>
      </span>
    </button>`;
}

function renderGrid() {
  const list = getFilteredWords();
  const shown = list.slice(0, ui.page * PAGE_SIZE);

  els.wordGrid.innerHTML = shown.map(wordCardHTML).join("");
  els.wordGrid.hidden = list.length === 0;
  els.emptyState.hidden = list.length !== 0;
  els.loadMoreWrap.hidden = list.length === 0 || shown.length >= list.length;

  if (shown.length < list.length) {
    els.loadMoreBtn.textContent = `Load more words (${list.length - shown.length} left)`;
  }

  const viewLabel =
    ui.view === "due"
      ? "due"
      : ui.view === "mastered"
        ? "mastered"
        : ui.view === "practicing"
          ? "practicing"
          : "";
  els.resultCount.textContent =
    list.length === 0
      ? "No words match this desk"
      : `Showing ${shown.length} of ${list.length} ${viewLabel ? `${viewLabel} ` : ""}word${list.length === 1 ? "" : "s"}`;
}

/* --------------------------------------------------------------------------
   Studio shell
   -------------------------------------------------------------------------- */

function selectedWord() {
  return ui.selectedId ? WORD_BY_ID.get(ui.selectedId) : null;
}

function renderStudioMeta() {
  const word = selectedWord();
  if (!word) return;
  const wordState = state.words[word.id];
  const status = statusFor(wordState);
  const live = ui.liveMatches.get(word.id);

  els.studioStatus.textContent = status.label;
  els.studioStatus.className = `status-pill ${status.cls}`;
  els.studioWord.textContent = word.word;
  els.studioIPA.textContent = `/${word.ipa}/`;
  els.studioDefinition.textContent = word.definition;
  els.studioCategory.textContent = live
    ? `${word.catLabel} · 🔴 Live VOA match available`
    : `${word.catLabel} · embedded newsroom template`;

  els.srsReviewCount.textContent = String(wordState.reviewCount);
  els.srsLevel.textContent = levelLabel(wordState);
  els.srsDue.textContent = dueLabel(wordState);
  renderStudioExample();
}

function renderStudio() {
  const word = selectedWord();
  if (!word) {
    els.studioEmpty.hidden = false;
    els.studioBody.hidden = true;
    return;
  }

  els.studioEmpty.hidden = true;
  els.studioBody.hidden = false;
  renderStudioMeta();
  renderActivityPanel(ui.activity);
}

function openStudioModal() {
  ui.lastFocused = document.activeElement;
  els.studioPanel.classList.add("is-open");
  els.studioPanel.setAttribute("aria-hidden", "false");
  els.studioBackdrop.classList.add("is-open");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    if (els.studioPanel.classList.contains("is-open")) els.closeStudio.focus();
  }, 40);
}

function closeStudioModal() {
  els.studioPanel.classList.remove("is-open");
  els.studioPanel.setAttribute("aria-hidden", "true");
  els.studioBackdrop.classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

function selectWord(wordId) {
  const word = WORD_BY_ID.get(wordId);
  if (!word) return;

  stopRecognition();
  stopSpeech();
  stopMatch();

  ui.selectedId = wordId;
  ui.activity = "read";
  ui.readEvaluated = false;
  ui.readSolved = false;
  ui.readIndex = 0;
  ui.readFetching = false;
  ui.readFetchToken += 1;
  ui.listenSolved = false;
  ui.listenWordId = null;
  ui.listenAttempts = 0;
  ui.editorSolved = false;
  ui.editorWordId = null;
  ui.editorAttempts = 0;
  ui.sentenceIndex = 0;
  ui.sentenceWordId = null;
  ui.sentenceSolved = false;
  ui.sentenceAttempts = 0;
  ui.match.wordId = null;

  resetReadUI();
  renderGrid();
  renderStudio();
  openStudioModal();
}

function closeStudio() {
  const returnId = ui.selectedId;
  stopRecognition();
  stopSpeech();
  stopMatch();
  ui.readFetchToken += 1;
  ui.readFetching = false;
  ui.selectedId = null;
  els.studioEmpty.hidden = false;
  els.studioBody.hidden = true;
  renderGrid();
  closeStudioModal();
  setTimeout(() => {
    const card = els.wordGrid.querySelector(`.word-card[data-word-id="${returnId}"]`);
    if (card) {
      card.focus();
    } else if (ui.lastFocused && document.contains(ui.lastFocused)) {
      ui.lastFocused.focus();
    } else {
      els.searchInput.focus();
    }
    ui.lastFocused = null;
  }, 30);
}

function trapStudioFocus(event) {
  const focusables = Array.from(
    els.studioPanel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hidden && element.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setActivity(activity) {
  if (!activityPanels[activity]) return;
  if (ui.activity !== activity) {
    stopRecognition();
    stopSpeech();
    if (ui.activity === "match") stopMatch();
  }
  ui.activity = activity;
  renderActivityPanel(activity);
}

function renderActivityPanel(activity) {
  Object.entries(activityPanels).forEach(([name, panel]) => {
    const active = name === activity;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });

  activityTabs.forEach((tab) => {
    const active = tab.dataset.activity === activity;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  if (activity === "read") renderReadPanel();
  if (activity === "listen") renderListenPanel();
  if (activity === "editor") renderEditorPanel();
  if (activity === "match") renderMatchPanel();
  if (activity === "syllable") renderSyllablePanel();
  if (activity === "sentence") renderSentencePanel();
}

/* --------------------------------------------------------------------------
   Live VOA feed
   -------------------------------------------------------------------------- */

function cleanFeedText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

function safeVoaUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol !== "https:") return "";
    if (!/(^|\.)voanews\.com$/i.test(url.hostname)) return "";
    return url.href;
  } catch (error) {
    return "";
  }
}

function matchesWord(text, word) {
  if (!text) return false;
  let pattern = escapeRegExp(word);
  if (/y$/i.test(word)) {
    pattern = `${pattern.slice(0, -1)}(?:y|ies)`;
  }
  pattern += "(?:s|es|ed|ing)?";
  try {
    return new RegExp(`\\b${pattern}\\b`, "i").test(text);
  } catch (error) {
    return false;
  }
}

function recomputeLiveMatches() {
  ui.liveMatches.clear();
  if (!ui.feed.length) return;
  WORDS.forEach((word) => {
    const hit = ui.feed.find(
      (item) => matchesWord(item.title, word.word) || matchesWord(item.description, word.word),
    );
    if (hit) ui.liveMatches.set(word.id, hit);
  });
}

function setFeedState(feedState, message) {
  ui.feedState = feedState;
  els.feedDot.className = "live-dot";
  if (feedState === "live") els.feedDot.classList.add("is-live");
  if (feedState === "offline") els.feedDot.classList.add("is-offline");
  els.feedStatusText.textContent =
    message ||
    (feedState === "live"
      ? "Live VOA feed"
      : feedState === "loading"
        ? "Connecting to VOA…"
        : "VOA archive mode");
}

function applyFeed(items, options = {}) {
  ui.feed = items;
  ui.feedFetchedAt = Date.now();
  recomputeLiveMatches();
  renderTicker();
  setFeedState("live");
  if (ui.selectedId) {
    renderReadPanel();
    renderStudioMeta();
  }
  if (options.cache) {
    try {
      sessionStorage.setItem(
        FEED_CACHE_KEY,
        JSON.stringify({ at: ui.feedFetchedAt, items: ui.feed }),
      );
    } catch (error) {
      /* sessionStorage may be unavailable in private mode. */
    }
  }
}

function readFeedCache() {
  try {
    const raw = sessionStorage.getItem(FEED_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items) || !parsed.at) return null;
    if (Date.now() - parsed.at > FEED_TTL_MS) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

async function loadFeed(force = false) {
  if (!force) {
    const cached = readFeedCache();
    if (cached) {
      ui.feed = cached.items;
      ui.feedFetchedAt = cached.at;
      recomputeLiveMatches();
      renderTicker();
      setFeedState("live", "Live VOA feed · cached");
      if (ui.selectedId) {
        renderReadPanel();
        renderStudioMeta();
      }
      return;
    }
  }

  setFeedState("loading");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(FEED_URL, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
    const data = await response.json();
    if (data.status !== "ok" || !Array.isArray(data.items)) {
      throw new Error("Feed returned an unexpected payload");
    }

    const items = data.items
      .slice(0, 30)
      .map((item) => ({
        title: cleanFeedText(item.title),
        description: cleanFeedText(item.description || item.content || ""),
        link: safeVoaUrl(item.link),
        pubDate: item.pubDate || "",
      }))
      .filter((item) => item.title);

    if (!items.length) throw new Error("Feed was empty");
    applyFeed(items, { cache: true });
    renderTicker();
  } catch (error) {
    clearTimeout(timeout);
    if (ui.feed.length) {
      setFeedState("offline", "Live feed offline · cached headlines");
      renderTicker();
    } else {
      setFeedState("offline", "Live feed offline · archive mode");
      els.tickerTrack.innerHTML =
        '<span class="ticker-placeholder">Live VOA headlines are unavailable right now. The newsroom template archive is still open.</span>';
    }
    if (ui.selectedId) renderReadPanel();
  }
}

function tickerItemHTML(item) {
  const title = escapeHtml(item.title);
  if (item.link) {
    return `<a class="ticker-item" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" title="${title}">${title}</a>`;
  }
  return `<span class="ticker-item" title="${title}">${title}</span>`;
}

function renderTicker() {
  if (!ui.feed.length) return;
  const items = ui.feed.slice(0, 12);
  const html = items.map(tickerItemHTML).join("");
  els.tickerTrack.innerHTML = html + html;
}

function highlightWord(text, word) {
  const escaped = escapeHtml(text);
  let pattern = escapeRegExp(word);
  if (/y$/i.test(word)) {
    pattern = `${pattern.slice(0, -1)}(?:y|ies)`;
  }
  pattern += "(?:s|es|ed|ing)?";
  try {
    return escaped.replace(new RegExp(`\\b(${pattern})\\b`, "gi"), "<mark>$1</mark>");
  } catch (error) {
    return escaped;
  }
}

/* --------------------------------------------------------------------------
   Read-aloud example sources
   -------------------------------------------------------------------------- */

const READ_BADGES = {
  live: "🔴 LIVE VOA NEWS",
  web: "🌐 WEB EXAMPLE",
  local: "📝 EXAMPLE SENTENCE",
  headline: "📰 NEWSROOM TEMPLATE",
};

function getLiveMatchesForWord(word) {
  return ui.feed.filter(
    (item) => matchesWord(item.title, word.word) || matchesWord(item.description, word.word),
  );
}

async function fetchJsonWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDictionaryExamples(word) {
  const data = await fetchJsonWithTimeout(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.word)}`,
  );
  if (!Array.isArray(data)) return [];
  const examples = [];
  data.forEach((entry) => {
    (entry.meanings || []).forEach((meaning) => {
      (meaning.definitions || []).forEach((definition) => {
        if (definition.example) {
          examples.push({ text: definition.example, source: "Free Dictionary API" });
        }
      });
    });
  });
  return examples;
}

async function fetchWiktionaryExamples(word) {
  const data = await fetchJsonWithTimeout(
    `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word.word)}`,
  );
  if (!data || typeof data !== "object") return [];
  const examples = [];
  const entries = data.en || [];
  if (!Array.isArray(entries)) return [];
  entries.forEach((entry) => {
    (entry.definitions || []).forEach((definition) => {
      (definition.examples || []).forEach((html) => {
        const text = cleanFeedText(html);
        if (text) {
          examples.push({
            text,
            source: "Wiktionary",
            link: `https://en.wiktionary.org/wiki/${encodeURIComponent(word.word)}`,
          });
        }
      });
    });
  });
  return examples;
}

async function fetchWikipediaExamples(word) {
  const title = word.word.replace(/\s+/g, "_");
  const data = await fetchJsonWithTimeout(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  );
  if (!data || !data.extract) return [];
  const sentences = data.extract.match(/[^.!?]+[.!?]+/g) || [data.extract];
  return sentences.map((sentence) => ({
    text: sentence,
    source: "Wikipedia",
    link: data.content_urls?.desktop?.page || "",
  }));
}

async function fetchWebExamples(word) {
  const [dictionary, wiktionary, wikipedia] = await Promise.allSettled([
    fetchDictionaryExamples(word),
    fetchWiktionaryExamples(word),
    fetchWikipediaExamples(word),
  ]);
  const combined = [];
  if (dictionary.status === "fulfilled") combined.push(...dictionary.value);
  if (wiktionary.status === "fulfilled") combined.push(...wiktionary.value);
  if (wikipedia.status === "fulfilled") combined.push(...wikipedia.value);

  const seen = new Set();
  return combined
    .map((item) => ({ ...item, text: item.text.replace(/\s+/g, " ").trim() }))
    .filter((item) => {
      const key = normalize(item.text);
      const wordCount = item.text.split(/\s+/).filter(Boolean).length;
      if (!key || seen.has(key) || item.text.length < 24 || item.text.length > 280) return false;
      if (wordCount < 4 || !matchesWord(item.text, word.word)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

function getReadCandidates(word) {
  const candidates = [];
  const seen = new Set();
  const add = (text, kind, source, link = "") => {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    const key = normalize(clean);
    if (!clean || !key || seen.has(key)) return;
    seen.add(key);
    candidates.push({ text: clean, kind, source, link });
  };

  getLiveMatchesForWord(word).forEach((item) => {
    add(item.title, "live", `VOA Learning English · ${formatDate(item.pubDate)}`, item.link);
  });

  (ui.webExamples.get(word.id) || []).forEach((item) => {
    add(item.text, "web", item.source, item.link || "");
  });

  word.examples.forEach((example, index) => {
    const isHeadline = index === word.examples.length - 1;
    add(
      example,
      isHeadline ? "headline" : "local",
      isHeadline
        ? "VOA Newsroom archive · embedded headline"
        : `VOA Newsroom · example ${index + 1} of ${word.examples.length}`,
    );
  });

  return candidates;
}

function currentReadCandidate() {
  const word = selectedWord();
  if (!word) return null;
  const candidates = getReadCandidates(word);
  if (!candidates.length) return null;
  return candidates[ui.readIndex % candidates.length];
}

async function refreshReadExample() {
  const word = selectedWord();
  if (!word || ui.readFetching) return;

  const token = ++ui.readFetchToken;
  const before = currentReadCandidate();
  const wasWeb = before?.kind === "web";
  ui.readFetching = true;
  els.readRefreshBtn.disabled = true;
  els.readRefreshBtn.textContent = "🔎 Searching…";
  els.readStatus.textContent = "Searching VOA, the dictionary, and Wikipedia for another example…";
  els.readStatus.className = "status-line";

  try {
    if (!ui.webExamples.has(word.id)) {
      const fetched = await fetchWebExamples(word);
      if (token !== ui.readFetchToken) return;
      ui.webExamples.set(word.id, fetched);
    }
    const candidates = getReadCandidates(word);
    if (!wasWeb && (ui.webExamples.get(word.id) || []).length) {
      const firstWeb = candidates.findIndex((candidate) => candidate.kind === "web");
      ui.readIndex = firstWeb >= 0 ? firstWeb : (ui.readIndex + 1) % candidates.length;
    } else {
      ui.readIndex = (ui.readIndex + 1) % candidates.length;
    }
    renderReadPanel();
    const candidate = currentReadCandidate();
    els.readStatus.textContent =
      candidate?.kind === "web"
        ? `Fresh example loaded from ${candidate.source}.`
        : candidate?.kind === "live"
          ? "Fresh VOA headline loaded."
          : "Another newsroom example loaded.";
    els.readStatus.className = "status-line is-success";
  } catch (error) {
    if (token !== ui.readFetchToken) return;
    const candidates = getReadCandidates(word);
    ui.readIndex = (ui.readIndex + 1) % Math.max(1, candidates.length);
    renderReadPanel();
    els.readStatus.textContent =
      "Web examples are unavailable right now. Another newsroom example is loaded.";
    els.readStatus.className = "status-line";
  } finally {
    if (token === ui.readFetchToken) {
      ui.readFetching = false;
      els.readRefreshBtn.disabled = false;
      els.readRefreshBtn.textContent = "🔄 New sentence";
    }
  }
}

/* --------------------------------------------------------------------------
   Desk 01 — Anchor Read-Aloud
   -------------------------------------------------------------------------- */

function resetReadUI() {
  els.readTranscript.hidden = true;
  els.readTranscriptText.textContent = "";
  els.readAccuracy.hidden = true;
  els.readAccuracyText.textContent = "0%";
  els.readAccuracyFill.style.width = "0%";
  els.readStatus.textContent = "Microphone ready when you are.";
  els.readStatus.className = "status-line";
  els.readStopBtn.hidden = true;
  els.readRecordBtn.hidden = false;
  els.readManualBtn.hidden = true;
  els.readManualBtn.textContent = "Microphone unavailable? Mark this report as practiced";
  els.readRefreshBtn.disabled = false;
  els.readRefreshBtn.textContent = "🔄 New sentence";
}

function renderReadPanel() {
  const word = selectedWord();
  if (!word) return;
  const candidate = currentReadCandidate();
  if (!candidate) return;
  const isLive = candidate.kind === "live";

  els.readBadge.textContent = READ_BADGES[candidate.kind] || READ_BADGES.local;
  els.readBadge.classList.toggle("is-live", isLive);
  els.readBadge.classList.toggle("is-web", candidate.kind === "web");
  els.readLiveCard.classList.toggle("is-live", isLive);
  els.readSource.textContent = candidate.source;
  els.readHeadline.innerHTML = highlightWord(candidate.text, word.word);

  if (candidate.link) {
    els.readLink.href = candidate.link;
    els.readLink.textContent =
      candidate.kind === "live" ? "Read the full story on VOA →" : "Read more at the source →";
    els.readLink.hidden = false;
  } else {
    els.readLink.hidden = true;
    els.readLink.removeAttribute("href");
  }
}

function stopRecognition() {
  if (ui.recognition) {
    try {
      ui.recognition.abort();
    } catch (error) {
      /* Recognition may already be stopped. */
    }
  }
  ui.recognition = null;
  ui.recognizing = false;
  els.readStopBtn.hidden = true;
  els.readRecordBtn.hidden = false;
}

function startRecognition() {
  const word = selectedWord();
  if (!word) return;

  if (!SpeechRecognitionConstructor) {
    els.readStatus.textContent =
      "This browser does not expose the Web Speech recognition API. Use the practice fallback below.";
    els.readStatus.className = "status-line is-error";
    els.readManualBtn.hidden = false;
    return;
  }

  if (ui.recognizing) {
    stopRecognition();
    return;
  }

  stopSpeech();
  ui.readEvaluated = false;
  let finalTranscript = "";
  const recognition = new SpeechRecognitionConstructor();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  ui.recognition = recognition;
  ui.recognizing = true;
  els.readRecordBtn.hidden = true;
  els.readStopBtn.hidden = false;
  els.readTranscript.hidden = false;
  els.readTranscriptText.textContent = "Listening…";
  els.readStatus.textContent = "On air. Read the headline clearly.";
  els.readStatus.className = "status-line";

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += `${transcript} `;
      } else {
        interim += transcript;
      }
    }
    if (interim) els.readTranscriptText.textContent = interim;
    if (finalTranscript.trim()) {
      els.readTranscriptText.textContent = finalTranscript.trim();
      if (!ui.readEvaluated) {
        ui.readEvaluated = true;
        evaluateRead(finalTranscript.trim(), word);
      }
    }
  };

  recognition.onerror = (event) => {
    ui.recognizing = false;
    els.readStopBtn.hidden = true;
    els.readRecordBtn.hidden = false;
    if (event.error === "aborted") return;
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      els.readStatus.textContent =
        "Microphone permission was blocked. Allow microphone access or use the practice fallback.";
      els.readManualBtn.hidden = false;
    } else if (event.error === "no-speech") {
      els.readStatus.textContent = "No speech detected. Try again a little closer to the microphone.";
    } else {
      els.readStatus.textContent = `Microphone error: ${event.error}. Try again or use the practice fallback.`;
    }
    els.readStatus.className = "status-line is-error";
  };

  recognition.onend = () => {
    ui.recognizing = false;
    els.readStopBtn.hidden = true;
    els.readRecordBtn.hidden = false;
    if (!ui.readEvaluated && finalTranscript.trim()) {
      ui.readEvaluated = true;
      evaluateRead(finalTranscript.trim(), word);
    } else if (!ui.readEvaluated) {
      els.readStatus.textContent = "No speech detected. Press Report Live and read the headline again.";
      els.readStatus.className = "status-line is-error";
    }
  };

  try {
    recognition.start();
  } catch (error) {
    ui.recognizing = false;
    els.readRecordBtn.hidden = false;
    els.readStopBtn.hidden = true;
    els.readStatus.textContent = "The microphone could not start. Try again in a moment.";
    els.readStatus.className = "status-line is-error";
  }
}

function evaluateRead(transcript, word) {
  const heard = normalize(transcript);
  const target = normalize(word.word);
  let accuracy = 0;

  if (heard.includes(target)) {
    accuracy = 100;
  } else {
    const tokens = heard.split(" ").filter(Boolean);
    for (const token of tokens) {
      accuracy = Math.max(accuracy, similarity(token, target));
    }
    if (word.word.includes(" ")) {
      const targetParts = target.split(" ");
      for (let i = 0; i <= tokens.length - targetParts.length; i += 1) {
        accuracy = Math.max(
          accuracy,
          similarity(tokens.slice(i, i + targetParts.length).join(" "), target),
        );
      }
    }
    accuracy = Math.round(accuracy * 100);
  }

  els.readTranscript.hidden = false;
  els.readTranscriptText.textContent = transcript;
  els.readAccuracy.hidden = false;
  els.readAccuracyText.textContent = `${accuracy}%`;
  els.readAccuracyFill.style.width = `${Math.min(100, accuracy)}%`;

  if (accuracy >= 72) {
    els.readStatus.textContent = ui.readSolved
      ? `Practice pass: “${word.word}” again. This report is already in the SRS file.`
      : `Filed! We heard “${word.word}” clearly. SRS timestamp updated.`;
    els.readStatus.className = "status-line is-success";
    els.readManualBtn.hidden = true;
    if (!ui.readSolved) {
      ui.readSolved = true;
      completeWord(word.id, "read", true);
    }
  } else if (!ui.readSolved) {
    els.readStatus.textContent =
      accuracy > 0
        ? `Close. We heard a ${accuracy}% match — slow down and stress the target word.`
        : "We could not match the target word. Try again, a little slower.";
    els.readStatus.className = "status-line is-error";
    els.readManualBtn.hidden = false;
    els.readManualBtn.textContent = "Microphone trouble? Mark this report as practiced";
    recordMiss(word.id);
  } else {
    els.readStatus.textContent = "Practice pass recorded. This word is already in the SRS file.";
    els.readStatus.className = "status-line";
  }
}

/* --------------------------------------------------------------------------
   Speech synthesis
   -------------------------------------------------------------------------- */

let cachedVoices = [];

function refreshVoices() {
  if (!ttsSupported) return;
  cachedVoices = window.speechSynthesis.getVoices();
}

if (ttsSupported) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function pickVoice() {
  if (!cachedVoices.length) refreshVoices();
  const english = cachedVoices.filter((voice) => /^en([-_]|$)/i.test(voice.lang));
  if (!english.length) return null;
  const preferred = english.find((voice) =>
    /samantha|alex|aria|jenny|google us english|microsoft.*english/i.test(voice.name),
  );
  return preferred || english.find((voice) => /^en[-_]US/i.test(voice.lang)) || english[0];
}

function stopSpeech() {
  ui.speechToken += 1;
  if (ttsSupported) window.speechSynthesis.cancel();
}

function speakText(text, rate = 0.9) {
  if (!ttsSupported || !text) return Promise.resolve(false);
  stopSpeech();
  const token = ui.speechToken;
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = Math.max(0.4, Math.min(1.4, rate));
    utterance.pitch = 1;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      clearTimeout(fallback);
      resolve(ok && token === ui.speechToken);
    };
    const fallback = setTimeout(() => finish(false), Math.max(4000, text.length * 180));
    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);
    window.speechSynthesis.speak(utterance);
  });
}

async function speakParts(parts, rate = 0.7) {
  for (const part of parts) {
    if (!part) continue;
    const ok = await speakText(part, rate);
    if (!ok) return false;
    await delay(180);
  }
  return true;
}

function playHeadline() {
  const word = selectedWord();
  if (!word) return;
  const candidate = currentReadCandidate();
  if (!candidate) return;
  touchWord(word.id);
  speakText(candidate.text.replace(/[“”"']/g, ""), 0.9);
}

/* --------------------------------------------------------------------------
   Desk 02 — Listening Desk
   -------------------------------------------------------------------------- */

function renderListenPanel() {
  const word = selectedWord();
  if (!word) return;
  if (ui.listenWordId !== word.id) {
    ui.listenWordId = word.id;
    ui.listenSolved = false;
    ui.listenAttempts = 0;
    els.listenInput.value = "";
    els.listenFeedback.hidden = true;
    els.listenStatus.textContent = "Choose a speed, then press play. You can replay as often as you need.";
  }
  speedButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.rate) === ui.listenRate);
  });
  if (!ttsSupported) {
    els.listenStatus.textContent = "Speech synthesis is not available in this browser. Try Chrome, Edge, or Safari.";
    els.listenStatus.className = "listen-status is-error";
  }
}

async function playListenWord() {
  const word = selectedWord();
  if (!word) return;
  if (!ttsSupported) {
    els.listenStatus.textContent = "Speech synthesis is not available in this browser.";
    els.listenStatus.className = "listen-status is-error";
    return;
  }
  els.listenPlayBtn.classList.add("is-playing");
  els.listenStatus.textContent = `Playing at ${ui.listenRate}× — listen for the word.`;
  els.listenStatus.className = "listen-status";
  touchWord(word.id);
  await speakText(word.word, ui.listenRate);
  els.listenPlayBtn.classList.remove("is-playing");
  els.listenStatus.textContent = "Now type the word you heard.";
}

function checkListenAnswer() {
  const word = selectedWord();
  if (!word) return;
  const guess = normalize(els.listenInput.value);
  if (!guess) {
    els.listenFeedback.hidden = false;
    els.listenFeedback.className = "feedback is-wrong";
    els.listenFeedback.textContent = "Type the word first — the newsroom is listening.";
    return;
  }

  if (guess === normalize(word.word)) {
    els.listenFeedback.hidden = false;
    els.listenFeedback.className = "feedback is-correct";
    els.listenFeedback.textContent = `Correct: “${word.word}”. The SRS desk has your timestamp.`;
    els.listenStatus.textContent = "Dictation filed. Replay the word or move to another desk.";
    els.listenStatus.className = "listen-status is-success";
    if (!ui.listenSolved) {
      ui.listenSolved = true;
      completeWord(word.id, "listen", true);
    }
    return;
  }

  ui.listenAttempts += 1;
  els.listenFeedback.hidden = false;
  els.listenFeedback.className = "feedback is-wrong";
  const hint =
    ui.listenAttempts >= 2
      ? ` Hint: it starts with “${word.word.slice(0, 1).toUpperCase()}” and has ${word.word.replace(/\s/g, "").length} letters.`
      : "";
  els.listenFeedback.textContent = `Not quite.${hint} Replay the audio and try again.`;
  els.listenStatus.textContent = "Keep listening — the answer is in the audio.";
  els.listenStatus.className = "listen-status is-error";
  recordMiss(word.id);
}

function revealListenAnswer() {
  const word = selectedWord();
  if (!word) return;
  els.listenInput.value = word.word;
  els.listenFeedback.hidden = false;
  els.listenFeedback.className = "feedback";
  els.listenFeedback.textContent = `The word is “${word.word}”. ${word.definition}`;
  els.listenStatus.textContent = "Answer revealed. Replay it once more, then try the desk again.";
  els.listenStatus.className = "listen-status";
}

/* --------------------------------------------------------------------------
   Desk 03 — Copy Editor
   -------------------------------------------------------------------------- */

function blankHeadline(text, word) {
  const escaped = escapeHtml(text);
  let pattern = escapeRegExp(word);
  if (/y$/i.test(word)) pattern = `${pattern.slice(0, -1)}(?:y|ies)`;
  pattern += "(?:s|es|ed|ing)?";
  try {
    const regex = new RegExp(`\\b(${pattern})\\b`, "i");
    if (regex.test(escaped)) {
      return escaped.replace(regex, '<span class="blank" aria-label="missing word">____</span>');
    }
  } catch (error) {
    /* Fall through to the generic template. */
  }
  return `VOA Newsroom: The word <span class="blank" aria-label="missing word">____</span> is at the center of today's story.`;
}

function renderEditorPanel() {
  const word = selectedWord();
  if (!word) return;

  if (ui.editorWordId !== word.id) {
    ui.editorWordId = word.id;
    ui.editorSolved = false;
    ui.editorAttempts = 0;
    const pool = shuffle(WORDS.filter((item) => item.cat === word.cat && item.id !== word.id)).slice(0, 3);
    ui.editorOptions = shuffle([word, ...pool]);
    els.editorInput.value = "";
    els.editorFeedback.hidden = true;
  }

  els.editorHeadline.innerHTML = blankHeadline(word.headline, word.word);
  els.editorInput.disabled = false;
  els.editorCheckBtn.disabled = false;
  els.editorOptions.innerHTML = ui.editorOptions
    .map(
      (option) =>
        `<button class="option-btn" type="button" data-editor-word="${escapeHtml(option.word)}">${escapeHtml(option.word)}</button>`,
    )
    .join("");

  if (ui.editorSolved) markEditorSolved(word);
}

function markEditorSolved(word) {
  ui.editorSolved = true;
  const blank = els.editorHeadline.querySelector(".blank");
  if (blank) {
    blank.outerHTML = `<mark>${escapeHtml(word.word)}</mark>`;
  }
  els.editorOptions.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = true;
    if (button.dataset.editorWord === word.word) button.classList.add("is-correct");
  });
  els.editorInput.disabled = true;
  els.editorCheckBtn.disabled = true;
  els.editorFeedback.hidden = false;
  els.editorFeedback.className = "feedback is-correct";
  els.editorFeedback.textContent = `Filed. “${word.word}” completes the headline. SRS timestamp updated.`;
}

function checkEditorAnswer(answer, sourceButton) {
  const word = selectedWord();
  if (!word || ui.editorSolved) return;
  const guess = normalize(answer);
  if (!guess) {
    els.editorFeedback.hidden = false;
    els.editorFeedback.className = "feedback is-wrong";
    els.editorFeedback.textContent = "Choose an option or type the missing word.";
    return;
  }

  if (guess === normalize(word.word)) {
    markEditorSolved(word);
    completeWord(word.id, "editor", true);
    return;
  }

  ui.editorAttempts += 1;
  if (sourceButton) {
    sourceButton.classList.add("is-wrong");
    sourceButton.disabled = true;
  }
  els.editorFeedback.hidden = false;
  els.editorFeedback.className = "feedback is-wrong";
  els.editorFeedback.textContent =
    ui.editorAttempts >= 2
      ? `Not that word. Hint: ${word.definition}`
      : "That does not fit this headline. Read the sentence again and try another word.";
  recordMiss(word.id);
}

/* --------------------------------------------------------------------------
   Desk 04 — Speed Match Ticker
   -------------------------------------------------------------------------- */

function stopMatch() {
  if (ui.match.timer) {
    clearInterval(ui.match.timer);
    ui.match.timer = null;
  }
  ui.match.active = false;
}

function resetMatchState() {
  stopMatch();
  ui.match = {
    wordId: ui.selectedId,
    active: false,
    timeLeft: 60,
    score: 0,
    round: 1,
    pairs: [],
    wordOrder: [],
    defOrder: [],
    matched: new Set(),
    selected: null,
    seen: new Set(),
    timer: null,
  };
}

function buildMatchBoard(includeSelected, recordSeen = true) {
  const selected = selectedWord();
  let pool = WORDS.filter((word) => !ui.match.seen.has(word.id) && word.id !== selected?.id);
  if (pool.length < 4) {
    ui.match.seen = new Set();
    pool = WORDS.filter((word) => word.id !== selected?.id);
  }
  pool = shuffle(pool);
  const picks = [];
  if (includeSelected && selected) picks.push(selected);
  for (const word of pool) {
    if (picks.length >= 5) break;
    if (!picks.some((item) => item.id === word.id)) picks.push(word);
  }
  if (picks.length < 5) {
    for (const word of WORDS) {
      if (picks.length >= 5) break;
      if (!picks.some((item) => item.id === word.id)) picks.push(word);
    }
  }
  if (recordSeen) picks.forEach((word) => ui.match.seen.add(word.id));

  ui.match.pairs = picks;
  ui.match.wordOrder = shuffle(picks);
  ui.match.defOrder = shuffle(picks);
  ui.match.matched = new Set();
  ui.match.selected = null;
}

function renderMatchPanel() {
  const word = selectedWord();
  if (!word) return;
  if (ui.match.wordId !== word.id || !ui.match.pairs.length) {
    resetMatchState();
    buildMatchBoard(true, false);
  }
  renderMatchBoard();
}

function renderMatchBoard() {
  const match = ui.match;
  els.matchTimer.textContent = String(Math.max(0, match.timeLeft));
  els.matchScore.textContent = String(match.score);
  els.matchStartBtn.textContent = match.active ? "Restart 60s ticker" : match.score > 0 ? "Play again" : "Start 60s ticker";
  els.matchBoard.classList.toggle("is-idle", !match.active);
  els.matchTimer.parentElement.classList.toggle("is-low", match.active && match.timeLeft <= 10);

  if (!match.pairs.length) {
    els.matchWords.innerHTML = "";
    els.matchDefs.innerHTML = "";
    return;
  }

  els.matchWords.innerHTML = match.wordOrder
    .map((word) => {
      const matched = match.matched.has(word.id);
      const selected = match.selected === word.id;
      return `<button class="match-word${matched ? " is-matched" : ""}${selected ? " is-selected" : ""}"
        type="button" data-match-word="${word.id}" ${matched ? "disabled" : ""}>${escapeHtml(word.word)}</button>`;
    })
    .join("");

  els.matchDefs.innerHTML = match.defOrder
    .map((word) => {
      const matched = match.matched.has(word.id);
      return `<button class="match-def${matched ? " is-matched" : ""}"
        type="button" data-match-def="${word.id}" ${matched ? "disabled" : ""}>${escapeHtml(word.definition)}</button>`;
    })
    .join("");

  if (match.active) {
    const remaining = 5 - match.matched.size;
    els.matchStatus.textContent = `Board ${match.round} · ${remaining} pair${remaining === 1 ? "" : "s"} left · ${match.timeLeft}s on the clock.`;
  }
}

function startMatch() {
  stopMatch();
  ui.match.active = true;
  ui.match.timeLeft = 60;
  ui.match.score = 0;
  ui.match.round = 1;
  ui.match.seen = new Set();
  buildMatchBoard(true, true);
  renderMatchBoard();
  els.matchFeedback.hidden = true;
  els.matchStatus.textContent = "Ticker running. Match a word to its definition — five pairs per board.";
  els.matchTimer.parentElement.classList.remove("is-low");

  ui.match.timer = setInterval(() => {
    ui.match.timeLeft -= 1;
    if (ui.match.timeLeft <= 0) {
      ui.match.timeLeft = 0;
      endMatch();
    } else {
      renderMatchBoard();
    }
  }, 1000);
}

function endMatch() {
  const match = ui.match;
  const score = match.score;
  const round = match.round;
  stopMatch();
  match.active = false;
  match.selected = null;
  renderMatchBoard();
  els.matchStatus.textContent = `Time. You matched ${score} pair${score === 1 ? "" : "s"} across ${round} board${round === 1 ? "" : "s"}.`;
  els.matchFeedback.hidden = false;
  els.matchFeedback.className = "feedback";
  els.matchFeedback.textContent =
    score > 0
      ? "Every correct pair updated its SRS timestamp. Start another ticker when you are ready."
      : "No pairs filed this round. Start the ticker again and match the word to its meaning.";
}

function handleMatchWord(wordId) {
  if (!ui.match.active || ui.match.matched.has(wordId)) return;
  ui.match.selected = ui.match.selected === wordId ? null : wordId;
  renderMatchBoard();
}

function handleMatchDefinition(wordId) {
  if (!ui.match.active || !ui.match.selected || ui.match.matched.has(wordId)) return;
  const selectedId = ui.match.selected;

  if (selectedId === wordId) {
    ui.match.matched.add(wordId);
    ui.match.score += 1;
    ui.match.selected = null;
    els.matchFeedback.hidden = true;
    completeWord(wordId, "match", true);
    renderMatchBoard();

    if (ui.match.matched.size === 5) {
      if (ui.match.timeLeft > 0) {
        els.matchStatus.textContent = "Board cleared. Next board loading…";
        setTimeout(() => {
          if (!ui.match.active) return;
          ui.match.round += 1;
          buildMatchBoard(false, true);
          renderMatchBoard();
        }, 700);
      } else {
        endMatch();
      }
    }
    return;
  }

  const wordButton = els.matchWords.querySelector(`[data-match-word="${selectedId}"]`);
  const defButton = els.matchDefs.querySelector(`[data-match-def="${wordId}"]`);
  wordButton?.classList.add("is-wrong");
  defButton?.classList.add("is-wrong");
  ui.match.timeLeft = Math.max(1, ui.match.timeLeft - 2);
  recordMiss(selectedId);
  els.matchFeedback.hidden = false;
  els.matchFeedback.className = "feedback is-wrong";
  els.matchFeedback.textContent = "Mismatch — two seconds off the clock. Try another definition.";
  setTimeout(() => {
    ui.match.selected = null;
    renderMatchBoard();
  }, 320);
}

/* --------------------------------------------------------------------------
   Desk 05 — Syllable & Phonetic Explorer
   -------------------------------------------------------------------------- */

function stressIndex(word) {
  const chunks = word.syllables;
  if (!chunks.length) return 0;
  const mark = word.ipa.indexOf("ˈ");
  if (mark < 0) return 0;
  const ratio = mark / Math.max(1, word.ipa.length);
  return Math.max(0, Math.min(chunks.length - 1, Math.round(ratio * chunks.length)));
}

function renderSyllablePanel() {
  const word = selectedWord();
  if (!word) return;
  const stress = stressIndex(word);
  els.syllableChunks.innerHTML = word.syllables
    .map(
      (chunk, index) =>
        `<button class="syllable-chunk${index === stress ? " is-stressed" : ""}" type="button"
          data-syllable="${index}" aria-label="Play syllable ${index + 1}: ${escapeHtml(chunk)}">${escapeHtml(chunk)}</button>`,
    )
    .join("");
  els.syllableIPA.textContent = `/${word.ipa}/`;
  els.syllableStress.textContent = `Primary stress: syllable ${stress + 1} of ${word.syllables.length}`;
  els.syllableFeedback.hidden = true;
}

async function playSyllable(index) {
  const word = selectedWord();
  if (!word || !word.syllables[index]) return;
  touchWord(word.id);
  const chunk = els.syllableChunks.querySelector(`[data-syllable="${index}"]`);
  chunk?.classList.add("is-playing");
  els.syllableFeedback.hidden = false;
  els.syllableFeedback.className = "feedback";
  els.syllableFeedback.textContent = `Syllable ${index + 1}: “${word.syllables[index]}” — listen for the stress.`;
  await speakText(word.syllables[index], 0.68);
  chunk?.classList.remove("is-playing");
}

async function playAllSyllables(slow = false) {
  const word = selectedWord();
  if (!word) return;
  touchWord(word.id);
  els.syllableFeedback.hidden = false;
  els.syllableFeedback.className = "feedback";
  els.syllableFeedback.textContent = slow
    ? "Stress coach: the gold chunk is the strongest beat. Listen, then repeat."
    : "Playing each syllable, then the whole word.";
  const stress = stressIndex(word);
  const chunks = word.syllables;
  const parts = [];
  chunks.forEach((chunk, index) => {
    parts.push(chunk);
    if (slow && index === stress) parts.push(chunk);
  });
  parts.push(word.word);
  await speakParts(parts, slow ? 0.56 : 0.7);
  els.syllableFeedback.textContent = slow
    ? `Stress pattern: syllable ${stress + 1} of ${chunks.length}. Tap the gold chunk to hear it again.`
    : "Listen once more, then say the word with the same rhythm.";
}

/* --------------------------------------------------------------------------
   Desk 06 — Sentence Practice
   -------------------------------------------------------------------------- */

function currentSentence() {
  const word = selectedWord();
  if (!word || !word.examples.length) return "";
  return word.examples[ui.sentenceIndex % word.examples.length];
}

function renderStudioExample() {
  const word = selectedWord();
  if (!word) return;
  if (ui.sentenceWordId !== word.id) {
    ui.sentenceWordId = word.id;
    ui.sentenceIndex = 0;
    ui.sentenceSolved = false;
    ui.sentenceAttempts = 0;
  }
  const sentence = currentSentence();
  els.studioExampleText.innerHTML = highlightWord(sentence, word.word);
}

function renderSentenceCard() {
  const word = selectedWord();
  if (!word) return;
  const sentence = currentSentence();
  const index = ui.sentenceIndex % word.examples.length;
  const contextCount = word.examples.length - 2;
  els.sentenceBadge.textContent = `EXAMPLE ${index + 1} OF ${word.examples.length}`;
  els.sentenceText.innerHTML = highlightWord(sentence, word.word);
  els.sentenceSource.textContent =
    index < contextCount
      ? "VOA Newsroom · context example"
      : index === contextCount
        ? "VOA Newsroom · definition example"
        : "VOA Newsroom · headline example";
  renderStudioExample();
}

function resetSentencePractice() {
  els.sentencePractice.hidden = true;
  els.sentenceInput.value = "";
  els.sentenceInput.disabled = false;
  els.sentenceCheckBtn.disabled = false;
  els.sentenceFeedback.hidden = true;
  els.sentenceStatus.textContent = "Pick a sentence, then listen or fill in the missing word.";
  els.sentenceStatus.className = "status-line";
}

function renderSentencePanel() {
  const word = selectedWord();
  if (!word) return;
  if (ui.sentenceWordId !== word.id) {
    ui.sentenceWordId = word.id;
    ui.sentenceIndex = 0;
    ui.sentenceSolved = false;
    ui.sentenceAttempts = 0;
    resetSentencePractice();
  }
  renderSentenceCard();
}

function refreshSentence() {
  const word = selectedWord();
  if (!word) return;
  ui.sentenceIndex = (ui.sentenceIndex + 1) % word.examples.length;
  ui.sentenceAttempts = 0;
  resetSentencePractice();
  renderSentenceCard();
  els.sentenceStatus.textContent = "New example loaded. Listen closely, then try the blank.";
}

function openSentencePractice() {
  const word = selectedWord();
  if (!word) return;
  const sentence = currentSentence();
  els.sentencePractice.hidden = false;
  els.sentenceBlank.innerHTML = blankHeadline(sentence, word.word);
  els.sentenceInput.value = "";
  els.sentenceInput.disabled = ui.sentenceSolved;
  els.sentenceCheckBtn.disabled = ui.sentenceSolved;
  els.sentenceFeedback.hidden = !ui.sentenceSolved;
  if (ui.sentenceSolved) {
    els.sentenceFeedback.className = "feedback is-correct";
    els.sentenceFeedback.textContent = "This sentence is already filed. Refresh for another example.";
  }
  setTimeout(() => {
    if (!ui.sentenceSolved) els.sentenceInput.focus();
  }, 30);
}

function checkSentenceAnswer() {
  const word = selectedWord();
  if (!word || !currentSentence()) return;
  if (ui.sentenceSolved) {
    els.sentenceFeedback.hidden = false;
    els.sentenceFeedback.className = "feedback";
    els.sentenceFeedback.textContent = "Already filed — refresh for a fresh sentence.";
    return;
  }
  const guess = normalize(els.sentenceInput.value);
  if (!guess) {
    els.sentenceFeedback.hidden = false;
    els.sentenceFeedback.className = "feedback is-wrong";
    els.sentenceFeedback.textContent = "Type the missing word first.";
    return;
  }
  if (guess === normalize(word.word)) {
    ui.sentenceSolved = true;
    els.sentencePractice.hidden = false;
    els.sentenceBlank.innerHTML = blankHeadline(currentSentence(), word.word);
    const blank = els.sentenceBlank.querySelector(".blank");
    if (blank) blank.outerHTML = `<mark>${escapeHtml(word.word)}</mark>`;
    els.sentenceInput.disabled = true;
    els.sentenceCheckBtn.disabled = true;
    els.sentenceFeedback.hidden = false;
    els.sentenceFeedback.className = "feedback is-correct";
    els.sentenceFeedback.textContent = `Filed. “${word.word}” completes the sentence. SRS timestamp updated.`;
    els.sentenceStatus.textContent = "Sentence filed. Refresh for another example or return to the word desk.";
    els.sentenceStatus.className = "status-line is-success";
    completeWord(word.id, "sentence", true);
    return;
  }

  ui.sentenceAttempts += 1;
  els.sentenceFeedback.hidden = false;
  els.sentenceFeedback.className = "feedback is-wrong";
  els.sentenceFeedback.textContent =
    ui.sentenceAttempts >= 2
      ? `Not quite. Hint: ${word.definition}`
      : "That word does not fit. Read the sentence again and try once more.";
  els.sentenceStatus.textContent = "Keep going — the sentence is still waiting for its missing word.";
  els.sentenceStatus.className = "status-line is-error";
  recordMiss(word.id);
}

function playSentence() {
  const word = selectedWord();
  if (!word) return;
  const sentence = currentSentence();
  touchWord(word.id);
  els.sentenceStatus.textContent = "Playing the sentence at a study pace.";
  els.sentenceStatus.className = "status-line";
  speakText(sentence.replace(/[“”"']/g, ""), 0.85);
}

/* --------------------------------------------------------------------------
   Progress export / import
   -------------------------------------------------------------------------- */

function saveProgressFile() {
  try {
    const payload = {
      app: "VOA Newsroom: 500 Words ESL Studio",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "voa_learning_progress.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
    showToast("Progress file saved as voa_learning_progress.txt.", "success");
  } catch (error) {
    showToast("Could not create the progress file.", "error");
  }
}

async function importProgressFile(file) {
  if (!file) return;
  try {
    const text =
      typeof file.text === "function"
        ? await file.text()
        : await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(new Error("Could not read that progress file."));
            reader.readAsText(file);
          });
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new Error("This file is not valid JSON progress data.");
    }
    const incoming = parsed && parsed.state ? parsed.state : parsed;
    if (!incoming || typeof incoming !== "object" || !incoming.words) {
      throw new Error("This file does not contain VOA Newsroom word progress.");
    }

    let imported = 0;
    WORDS.forEach((word) => {
      const src = incoming.words[word.id] || incoming.words[String(word.id)];
      if (src && typeof src === "object") imported += 1;
    });
    if (!imported) throw new Error("No recognized words were found in this file.");

    state = makeState(incoming);
    state.updatedAt = new Date().toISOString();
    saveState();
    applyTheme(state.settings.theme);
    applyFontScale(state.settings.fontScale || 1);
    renderHUD();
    renderRailCounts();
    updateViewLabels();
    renderGrid();
    if (ui.selectedId) renderStudio();
    showToast(`Loaded progress for ${imported} words from ${file.name}.`, "success", 4200);
  } catch (error) {
    showToast(error.message || "Could not load that progress file.", "error", 5000);
  } finally {
    els.loadInput.value = "";
  }
}

function resetAllProgress() {
  const confirmed = window.confirm(
    "Reset every word, streak, and accuracy record in this browser? Export a progress file first if you want a backup.",
  );
  if (!confirmed) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    /* Ignore storage errors. */
  }
  state = makeState(null);
  applyTheme(state.settings.theme);
  applyFontScale(state.settings.fontScale || 1);
  ui.selectedId = null;
  ui.readFetchToken += 1;
  ui.readFetching = false;
  els.studioEmpty.hidden = false;
  els.studioBody.hidden = true;
  closeStudioModal();
  renderHUD();
  renderRailCounts();
  updateViewLabels();
  renderGrid();
  showToast("All progress reset. A clean newsroom awaits.", "success");
}

/* --------------------------------------------------------------------------
   Theme, toast, and small UI helpers
   -------------------------------------------------------------------------- */

function applyTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  state.settings.theme = next;
  els.themeBtn.textContent = next === "light" ? "☀" : "◐";
  els.themeBtn.setAttribute("aria-label", next === "light" ? "Switch to dark theme" : "Switch to light theme");
}

function toggleTheme() {
  const next = state.settings.theme === "light" ? "dark" : "light";
  applyTheme(next);
  saveState();
}

function clampFontScale(value) {
  return Math.min(1.4, Math.max(0.8, Math.round(Number(value) * 100) / 100));
}

function applyFontScale(scale) {
  const next = clampFontScale(Number.isFinite(Number(scale)) ? scale : 1);
  state.settings.fontScale = next;
  document.documentElement.style.setProperty("--font-scale", String(next));
  els.fontLabel.textContent = `${Math.round(next * 100)}%`;
  els.fontDown.disabled = next <= 0.8;
  els.fontUp.disabled = next >= 1.4;
}

function changeFontScale(delta) {
  applyFontScale((state.settings.fontScale || 1) + delta);
  saveState();
}

function showToast(message, type = "info", duration = 3200) {
  if (!els.toast) return;
  clearTimeout(ui.toastTimer);
  els.toast.textContent = message;
  els.toast.className = `toast is-visible${type === "success" ? " is-success" : ""}${type === "error" ? " is-error" : ""}`;
  ui.toastTimer = setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, duration);
}

/* --------------------------------------------------------------------------
   Event wiring
   -------------------------------------------------------------------------- */

function wireEvents() {
  els.dueBtn.addEventListener("click", () => setView("due"));
  els.saveBtn.addEventListener("click", saveProgressFile);
  els.loadBtn.addEventListener("click", () => els.loadInput.click());
  els.loadInput.addEventListener("change", (event) => {
    importProgressFile(event.target.files?.[0]);
  });
  els.themeBtn.addEventListener("click", toggleTheme);
  els.fontDown.addEventListener("click", () => changeFontScale(-0.1));
  els.fontUp.addEventListener("click", () => changeFontScale(0.1));
  els.feedRefreshBtn.addEventListener("click", () => loadFeed(true));
  els.resetAllBtn.addEventListener("click", resetAllProgress);

  railViewLinks.forEach((link) => {
    link.addEventListener("click", () => setView(link.dataset.view));
  });
  railBeatLinks.forEach((link) => {
    link.addEventListener("click", () => setCategory(link.dataset.category));
  });
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => setCategory(tab.dataset.cat));
  });

  els.searchInput.addEventListener("input", () => {
    clearTimeout(ui.searchTimer);
    ui.searchTimer = setTimeout(() => {
      ui.search = els.searchInput.value;
      ui.page = 1;
      renderGrid();
    }, 120);
  });
  els.sortSelect.addEventListener("change", () => {
    ui.sort = els.sortSelect.value;
    ui.page = 1;
    renderGrid();
  });
  els.loadMoreBtn.addEventListener("click", () => {
    ui.page += 1;
    renderGrid();
  });
  els.resetFiltersBtn.addEventListener("click", resetFilters);

  els.wordGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".word-card");
    if (!card) return;
    selectWord(Number(card.dataset.wordId));
  });

  els.closeStudio.addEventListener("click", closeStudio);
  els.studioBackdrop.addEventListener("click", closeStudio);

  activityTabs.forEach((tab) => {
    tab.addEventListener("click", () => setActivity(tab.dataset.activity));
  });

  els.readRecordBtn.addEventListener("click", startRecognition);
  els.readStopBtn.addEventListener("click", stopRecognition);
  els.readPlayBtn.addEventListener("click", playHeadline);
  els.readRefreshBtn.addEventListener("click", refreshReadExample);
  els.readManualBtn.addEventListener("click", () => {
    const word = selectedWord();
    if (!word) return;
    if (!ui.readSolved) {
      ui.readSolved = true;
      completeWord(word.id, "read", true);
    }
    els.readStatus.textContent = "Practice marked. The SRS desk recorded your review.";
    els.readStatus.className = "status-line is-success";
    els.readManualBtn.hidden = true;
  });

  speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      ui.listenRate = Number(button.dataset.rate);
      speedButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      els.listenStatus.textContent = `Playback speed set to ${ui.listenRate}×. Press play.`;
      els.listenStatus.className = "listen-status";
    });
  });
  els.listenPlayBtn.addEventListener("click", playListenWord);
  els.listenCheckBtn.addEventListener("click", checkListenAnswer);
  els.listenRevealBtn.addEventListener("click", revealListenAnswer);
  els.listenInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkListenAnswer();
  });

  els.editorCheckBtn.addEventListener("click", () => checkEditorAnswer(els.editorInput.value, null));
  els.editorInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkEditorAnswer(els.editorInput.value, null);
  });
  els.editorOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-editor-word]");
    if (!button || button.disabled) return;
    checkEditorAnswer(button.dataset.editorWord, button);
  });

  els.matchStartBtn.addEventListener("click", startMatch);
  els.matchWords.addEventListener("click", (event) => {
    const button = event.target.closest("[data-match-word]");
    if (!button) return;
    handleMatchWord(Number(button.dataset.matchWord));
  });
  els.matchDefs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-match-def]");
    if (!button) return;
    handleMatchDefinition(Number(button.dataset.matchDef));
  });

  els.syllableChunks.addEventListener("click", (event) => {
    const button = event.target.closest("[data-syllable]");
    if (!button) return;
    playSyllable(Number(button.dataset.syllable));
  });
  els.syllablePlayAll.addEventListener("click", () => playAllSyllables(false));
  els.syllableSlow.addEventListener("click", () => playAllSyllables(true));

  els.sentenceRefreshBtn.addEventListener("click", refreshSentence);
  els.studioExampleRefresh.addEventListener("click", refreshSentence);
  els.studioExamplePractice.addEventListener("click", () => {
    setActivity("sentence");
    openSentencePractice();
  });
  els.sentencePlayBtn.addEventListener("click", playSentence);
  els.sentencePracticeBtn.addEventListener("click", openSentencePractice);
  els.sentenceCheckBtn.addEventListener("click", checkSentenceAnswer);
  els.sentenceInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkSentenceAnswer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && els.studioPanel.classList.contains("is-open")) {
      trapStudioFocus(event);
    }
    if (event.key === "Escape") {
      if (ui.recognizing) {
        stopRecognition();
      } else if (ui.selectedId) {
        closeStudio();
      }
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const active = document.activeElement;
      if (!active || !active.classList.contains("activity-tab")) return;
      event.preventDefault();
      const current = activityTabs.indexOf(active);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (current + direction + activityTabs.length) % activityTabs.length;
      activityTabs[next].focus();
      setActivity(activityTabs[next].dataset.activity);
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      state = makeState(JSON.parse(event.newValue));
      applyTheme(state.settings.theme);
      applyFontScale(state.settings.fontScale || 1);
      renderHUD();
      renderRailCounts();
      renderGrid();
      if (ui.selectedId) renderStudio();
    } catch (error) {
      /* Ignore malformed cross-tab updates. */
    }
  });
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

function init() {
  applyTheme(state.settings.theme);
  applyFontScale(state.settings.fontScale || 1);
  wireEvents();
  renderHUD();
  renderRailCounts();
  updateViewLabels();
  renderGrid();
  renderTicker();
  setFeedState("loading");
  setTimeout(() => loadFeed(false), 700);
}

init();
