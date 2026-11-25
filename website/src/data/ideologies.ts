// Researched ideology database (kept separate from application logic).
//
// Method: four research rounds — (1) major ideological families and their history
// (Wikipedia "Left–right political spectrum" / "List of political ideologies", LibreTexts/OpenStax,
// Britannica "third way"); (2) ideologies belonging to each category via Wikipedia category articles
// (far-right, far-left, centre-left, centrism) and party-family literature (Klaus von Beyme, Cas Mudde);
// (3) verification of definitions and disputed placements; (4) review for distinctness (synonyms are stored
// as `aliases`, not as separate entries) and coverage of all eight categories.
//
// IMPORTANT: placing an ideology on a one-dimensional spectrum is always approximate. Entries carrying a
// `note` are those where scholars place the ideology differently depending on time, country or definition.

import type { CategoryId, Ideology, Source } from "@/lib/types";

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  color: string;
  /** rough left(-100) to right(+100) score, used to order parties by ideology */
  lr: number;
  blurb: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: "far-right", label: "Far Right", color: "#7f1d1d", lr: 90, blurb: "Ultranationalist, authoritarian, exclusivist or reactionary currents to the right of the mainstream right." },
  { id: "right", label: "Right-Wing", color: "#b91c1c", lr: 60, blurb: "Emphasis on tradition, hierarchy, order, nation or free markets and property rights." },
  { id: "center-right", label: "Center-Right", color: "#ea580c", lr: 30, blurb: "Moderate conservative, Christian-democratic and market-liberal currents that accept the welfare state in some form." },
  { id: "center", label: "Center", color: "#ca8a04", lr: 0, blurb: "Moderate, pragmatic and broadly liberal-democratic positions between left and right." },
  { id: "center-left", label: "Center-Left", color: "#0d9488", lr: -30, blurb: "Reformist left: mixed economy, welfare state, social liberalism and environmental policy." },
  { id: "left", label: "Left-Wing", color: "#2563eb", lr: -60, blurb: "Egalitarian, socialist and anti-capitalist traditions that mostly pursue change through democracy or movements." },
  { id: "far-left", label: "Far Left", color: "#7c2d12", lr: -90, blurb: "Revolutionary or radical anti-capitalist currents: communism, revolutionary socialism and left anarchism." },
  { id: "third-way", label: "Third Way", color: "#7c3aed", lr: 0, blurb: "Ideologies that explicitly claim to transcend, combine or sit outside the left–right axis." },
  { id: "unclassified", label: "Custom / Unclassified", color: "#64748b", lr: 0, blurb: "User-defined positions that do not fit a conventional category." },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryInfo>;

const S = {
  spectrum: { title: "Wikipedia — Left–right political spectrum", url: "https://en.wikipedia.org/wiki/Left%E2%80%93right_political_spectrum" },
  list: { title: "Wikipedia — List of political ideologies", url: "https://en.wikipedia.org/wiki/List_of_political_ideologies" },
  farRight: { title: "Wikipedia — Far-right politics", url: "https://en.wikipedia.org/wiki/Far-right_politics" },
  farLeft: { title: "Wikipedia — Far-left politics", url: "https://en.wikipedia.org/wiki/Far-left_politics" },
  centreLeft: { title: "Wikipedia — Centre-left politics", url: "https://en.wikipedia.org/wiki/Centre-left_politics" },
  centrism: { title: "Wikipedia — Centrism", url: "https://en.wikipedia.org/wiki/Centrism" },
  communism: { title: "Wikipedia — Communism", url: "https://en.wikipedia.org/wiki/Communism" },
  thirdWay: { title: "Britannica — Third way", url: "https://www.britannica.com/topic/third-way" },
  libretexts: { title: "OpenStax/LibreTexts — Political Ideologies", url: "https://human.libretexts.org/Bookshelves/Philosophy/Introduction_to_Philosophy/Introduction_to_Philosophy_(OpenStax)/11:_Political_Philosophy/11.04:_Political_Ideologies" },
};

const CATEGORY_SOURCES: Record<CategoryId, Source[]> = {
  "far-right": [S.farRight, S.spectrum],
  right: [S.spectrum, S.list],
  "center-right": [S.spectrum, S.list],
  center: [S.centrism, S.libretexts],
  "center-left": [S.centreLeft, S.spectrum],
  left: [S.list, S.farLeft],
  "far-left": [S.farLeft, S.communism],
  "third-way": [S.thirdWay, S.list],
  unclassified: [],
};

// [name, aliases(|), description, economic, social, related(|), classification note (marks as disputed)]
type Row = [string, string, string, string, string, string, string?];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const slugify = slug;

const FAR_RIGHT: Row[] = [
  ["Fascism", "Italian Fascism", "Revolutionary ultranationalist, authoritarian ideology built on a one-party state, militarism, a leader cult and the subordination of the individual to the nation.", "Corporatist, state-directed capitalism", "Totalitarian, hierarchical, anti-liberal", "Nazism|Falangism|Corporatism|Ultranationalism", "Some scholars debate whether fascism is a right-wing phenomenon or a distinct 'revolutionary' third position."],
  ["Nazism", "National Socialism", "German variant of fascism centred on racial ideology, antisemitism, territorial expansion and the Führerprinzip.", "State-directed capitalism, autarky", "Racial hierarchy, totalitarian", "Fascism|Neo-Nazism-style movements|Strasserism"],
  ["Clerical Fascism", "Clero-fascism|Religious fascism", "Fusion of fascist politics with religious (often Catholic or Orthodox) identity, doctrine and institutions.", "Corporatist", "Religious-nationalist, authoritarian", "Fascism|Integralism|Francoism"],
  ["Falangism", "Spanish Falange", "Spanish fascist-inspired movement stressing Catholic traditionalism, Hispanic imperial nationalism and national-syndicalist economics.", "National-syndicalist corporatism", "Catholic, authoritarian, nationalist", "Fascism|Francoism|Corporatism"],
  ["Francoism", "Franquismo", "Authoritarian ideology of Franco's Spain combining nationalism, National Catholicism, anti-communism and a military-led state.", "Autarky then technocratic liberalisation", "National-Catholic, authoritarian", "Falangism|Clerical Fascism|Reactionary Conservatism"],
  ["Ultranationalism", "Extreme nationalism|Chauvinism", "Nationalism that places the nation's supremacy above all other interests and often favours expansionism or purity.", "Varies; often protectionist", "Exclusionary, authoritarian", "Integral Nationalism|Ethnonationalism|Fascism"],
  ["Integral Nationalism", "Action Française tradition", "Doctrine holding the nation as an organic whole whose interests override individual rights; associated with Charles Maurras.", "Corporatist, anti-capitalist-liberal", "Traditionalist, authoritarian", "Ultranationalism|Reactionary Conservatism"],
  ["Ethnonationalism", "Ethnic nationalism", "Nationalism defining the nation by common descent or ethnicity rather than by shared citizenship.", "Varies; welfare chauvinism common", "Exclusionary, nativist", "Nativism|White Nationalism|Ultranationalism", "Ethnic nationalism ranges from mainstream cultural movements to extremist forms; placement here reflects its exclusivist variants."],
  ["White Nationalism", "White separatism", "Ethnonationalism advocating a white national identity or ethnostate; closely tied to white supremacist ideas.", "Varies", "Racial exclusion", "Ethnonationalism|Nazism|Nativism"],
  ["Strasserism", "Left-wing Nazism (disputed term)", "Nazi dissident current of the Strasser brothers favouring anti-capitalist, 'national-socialist' economics within a völkisch framework.", "Anti-capitalist, nationalised industry", "Racial-nationalist", "Nazism|Third Positionism-style ideas", "Describes itself as anti-capitalist, but scholars classify it as far-right because of its ultranationalist and racial core."],
  ["Reactionary Conservatism", "Reactionism|Ultraconservatism", "Seeks to restore an earlier social order, rejecting modern liberal and democratic reforms.", "Traditional/agrarian elites favoured", "Hierarchical, anti-egalitarian", "Neoreaction|Integralism|Traditionalist Conservatism"],
  ["Neoreaction", "NRx|Dark Enlightenment", "Online intellectual movement rejecting egalitarianism and democracy in favour of neo-monarchical or corporate-style authority.", "Techno-capitalist / neo-cameralist", "Anti-democratic, hierarchical", "Reactionary Conservatism|Monarchism|Anarcho-Capitalism"],
  ["Integralism", "Catholic Integralism", "Holds that political power should be subordinate to religious (usually Catholic) authority and the common good as defined by the Church.", "Distributist or corporatist leanings", "Confessional state, traditionalist", "Clerical Fascism|Christian Right|Distributism"],
  ["Hindutva", "Hindu nationalism", "Hindu nationalist ideology defining Indian identity through Hindu culture and heritage.", "Mixed; nationalist-developmental", "Cultural-religious majoritarian", "Ethnonationalism|Religious conservatism", "Placed between right-wing and far-right by different scholars depending on the movement considered."],
  ["Nativism", "Anti-immigration nationalism", "Policy stance favouring the interests of established inhabitants over immigrants; a core far-right element per Cas Mudde.", "Welfare chauvinism", "Restrictionist, exclusionary", "Ethnonationalism|Right-Wing Populism", "Nativism is also a feature of some radical-right populist parties that stay within democratic norms."],
];

const RIGHT: Row[] = [
  ["Conservatism", "Burkean conservatism", "Preference for established institutions, gradual change and social continuity, rooted in Edmund Burke's critique of the French Revolution.", "Generally pro-market, property rights", "Tradition, order, community", "Traditionalist Conservatism|Liberal Conservatism|One-Nation Conservatism"],
  ["Traditionalist Conservatism", "Traditionalism|Throne and altar", "Stresses natural law, hierarchy, religion and inherited customs as the basis of social order.", "Often agrarian / paternalist", "Hierarchical, religious", "Conservatism|Reactionary Conservatism"],
  ["Paleoconservatism", "Old Right", "American conservatism prioritising tradition, nationalism, non-interventionism and scepticism of immigration and free trade.", "Protectionist-leaning", "Cultural traditionalist", "National Conservatism|Neoconservatism"],
  ["Neoconservatism", "Neocon", "Combines conservative social views with assertive foreign policy and democratic promotion abroad.", "Market-oriented", "Moral traditionalism, interventionism", "Paleoconservatism|Liberal Conservatism"],
  ["National Conservatism", "Nat-con", "Conservatism emphasising national sovereignty, cultural cohesion and a strong state serving the national community.", "Economic nationalism", "Culturally traditional, sovereigntist", "Paleoconservatism|Right-Wing Populism"],
  ["Social Conservatism", "Moral conservatism", "Defends traditional family, religion and moral norms through public policy.", "Variable", "Traditional morality", "Christian Right|Conservatism"],
  ["Fiscal Conservatism", "Economic conservatism", "Advocates low taxation, restrained public spending and balanced budgets.", "Low taxes, small deficits", "Not defined", "Neoliberalism|Right-Libertarianism"],
  ["Christian Right", "Religious Right", "Movement applying conservative Christian values to politics, especially on family, education and bioethics.", "Often pro-market", "Religious-moral conservatism", "Social Conservatism|Integralism"],
  ["Right-Wing Populism", "National populism|Radical right populism", "Pits 'the people' against elites, combining nativism, authoritarianism and anti-establishment appeals.", "Welfare chauvinism, variable", "Nativist, law-and-order", "Nativism|National Conservatism|Centrist Populism", "Some scholars place populist radical-right parties in the far right, others in the radical right inside democracy."],
  ["Neoliberalism", "Market fundamentalism (pejorative)", "Promotes deregulation, privatisation, free trade and limited state economic intervention.", "Free markets, privatisation", "Mostly neutral", "Economic Liberalism|Thatcherism|Fiscal Conservatism", "Often used as a critical label; self-described adherents usually say 'market liberal'."],
  ["Thatcherism", "Reaganism (US analogue)", "British conservative programme of Margaret Thatcher: monetarism, privatisation, trade-union limits and a strong state on order.", "Monetarist, privatising", "Moral conservative, nationalist", "Neoliberalism|Conservatism"],
  ["Right-Libertarianism", "Propertarianism|Libertarian capitalism", "Combines strong individual liberty with robust private property and free-market capitalism.", "Laissez-faire", "Civil-libertarian", "Minarchism|Anarcho-Capitalism|Objectivism", "Libertarianism's left–right placement is disputed; it is libertarian on social issues but right-wing on economics."],
  ["Minarchism", "Night-watchman state", "Limits the state to protecting rights, enforcing contracts and providing defence (Nozick's minimal state).", "Laissez-faire", "Civil-libertarian", "Right-Libertarianism|Classical Liberalism"],
  ["Anarcho-Capitalism", "Free-market anarchism|Market anarchism", "Rejects the state and proposes private provision of law and security in a fully voluntary market society.", "Pure market, private property", "Individualist, stateless", "Right-Libertarianism|Minarchism|Individualist Anarchism", "Rejects the state yet is usually classed as right-wing by economics; some compasses label it far-right on the economic axis."],
  ["Objectivism", "Randian philosophy", "Ayn Rand's philosophy of rational self-interest, individual rights and laissez-faire capitalism.", "Laissez-faire", "Individualist, secular", "Right-Libertarianism|Minarchism"],
  ["Monarchism", "Royalism|Legitimism", "Advocates monarchy as head of state or sovereign; positions range from constitutional to absolutist.", "Variable", "Hierarchical, traditional", "Reactionary Conservatism|Traditionalist Conservatism", "Constitutional monarchism is compatible with many ideologies; classification here is approximate."],
  ["Authoritarian Conservatism", "Conservative authoritarianism", "Defends strong executive authority and social order over pluralism, often in the name of stability and tradition.", "Pro-business, state-aligned", "Order, hierarchy, limited pluralism", "Traditionalist Conservatism|Francoism"],
  ["Islamism", "Political Islam", "Movements seeking to organise state and society along Islamic principles; strands range from democratic to militant.", "Mixed; often market-friendly with zakat/welfare", "Religious-conservative", "Religious fundamentalism|Muslim Democracy|Islamic Socialism", "Classification is approximate: Islamism is a religious-political family, and strands range from far-right-like to reformist and even left-leaning."],
];

const CENTER_RIGHT: Row[] = [
  ["Liberal Conservatism", "Conservative liberalism", "Blends market-liberal economics and individual liberty with conservative attachment to institutions and moderate social change.", "Free markets with safety net", "Moderately conservative", "Conservatism|Classical Liberalism|One-Nation Conservatism"],
  ["One-Nation Conservatism", "Tory paternalism|Tory democracy", "Paternalist conservatism stressing social cohesion, noblesse oblige and welfare to bridge class divides (Disraeli).", "Mixed economy, welfare", "Moderate traditional", "Conservatism|Social Market Economy"],
  ["Christian Democracy", "Christian-democratic", "Applies Christian (esp. Catholic) social teaching: subsidiarity, solidarity, family and a social market economy.", "Social market economy", "Moderately conservative, pro-family", "Social Market Economy|Muslim Democracy|Christian Left", "Christian democratic parties often sit between centre-right and centre; placement varies by country."],
  ["Gaullism", "Neo-Gaullism", "French tradition of national independence, a strong presidency, state-led economic planning and grandeur.", "Dirigiste mixed economy", "National-conservative, republican", "Conservatism|Civic Nationalism"],
  ["Classical Liberalism", "Old liberalism", "Individual liberty, rule of law, limited government, free markets and free trade (Locke, Smith, Mill).", "Free market, free trade", "Civil liberties, tolerance", "Economic Liberalism|Minarchism|Liberalism"],
  ["Economic Liberalism", "Market liberalism", "Supports private property, competitive markets and limited state intervention.", "Market-based", "Neutral", "Classical Liberalism|Neoliberalism"],
  ["Ordoliberalism", "Freiburg school", "German school favouring strong rules ensuring competition, price stability and a state that guards the market order.", "Rule-bound competitive markets", "Liberal-conservative", "Social Market Economy|Christian Democracy"],
  ["Social Market Economy", "Soziale Marktwirtschaft", "Free market combined with social insurance and fair-competition policy; foundation of post-war West Germany.", "Market + welfare", "Moderate", "Ordoliberalism|Christian Democracy"],
  ["Compassionate Conservatism", "Big-tent conservatism", "Conservatism using government and faith-based groups to address poverty and social problems.", "Market-friendly with targeted aid", "Moderate-conservative, faith-friendly", "Liberal Conservatism|Christian Democracy"],
  ["Fusionism", "Conservative fusionism", "US synthesis of libertarian economics, traditional social values and anti-communism (Frank Meyer, National Review).", "Free market", "Traditional values", "Conservatism|Right-Libertarianism|Neoconservatism"],
  ["Civic Nationalism", "Liberal nationalism", "National identity based on shared citizenship, institutions and values rather than ethnicity.", "Varies", "Inclusive-patriotic", "Gaullism|Liberalism|Ethnonationalism"],
  ["Green Conservatism", "Conservative environmentalism", "Protects nature through conservative lenses: stewardship, property rights, market tools and tradition.", "Market-based environmental policy", "Conservation, localism", "Conservatism|Environmentalism"],
  ["Muslim Democracy", "Islamic democracy", "Muslim-identity parties operating within democratic politics, analogous to Christian democracy.", "Market-friendly, social solidarity", "Religiously conservative, pluralist-electoral", "Christian Democracy|Islamism", "Classification is debated; some analysts treat these parties as conservative-democrats, others as Islamist."],
];

const CENTER: Row[] = [
  ["Centrism", "Moderate politics|Middle way", "Range of moderate positions between left and right, favouring incremental reform and pragmatic compromise.", "Mixed economy", "Moderate", "Radical Centrism|Liberalism|Pragmatism"],
  ["Radical Centrism", "Radical middle", "Rejects the left–right dichotomy and ideology in favour of innovative, evidence-based reform from the centre.", "Market + targeted reform", "Pragmatic, reformist", "Centrism|Third Way|Pragmatism"],
  ["Liberalism", "Liberal democracy (tradition)", "Broad tradition defending individual rights, consent of the governed, pluralism and the rule of law.", "Market economy, variable regulation", "Liberty, tolerance", "Classical Liberalism|Social Liberalism|Constitutionalism", "Liberalism spans centre-right (classical) to centre-left (social liberalism); it is placed at the centre as the umbrella tradition."],
  ["Civic Republicanism", "Classical republicanism", "Freedom as non-domination and civic virtue; stresses active citizenship, anti-corruption and mixed constitution.", "Property widely dispersed", "Civic participation", "Liberalism|Communitarianism"],
  ["Agrarianism", "Agrarian politics", "Values rural society, small farmers and land-based life; parties often centrist or centre-right.", "Farm/cooperative economy, protection", "Rural, localist", "Localism|Distributism|Green Conservatism", "Agrarian parties range from centre to centre-right and, historically, left-leaning peasant movements."],
  ["Secular Humanism", "Humanism", "Ethics grounded in reason and human welfare without religious authority; supports secular government.", "Not defined", "Secular, rights-based", "Liberalism|Cosmopolitanism"],
  ["Cosmopolitanism", "Global citizenship politics", "Holds that all people belong to a single moral community, supporting international law and open borders of ideas.", "Open trade, global institutions", "Universalist", "Liberal Internationalism|Secular Humanism"],
  ["Liberal Internationalism", "Wilsonianism", "Advocates international institutions, collective security, trade and human rights to keep peace.", "Free trade, multilateral", "Rights-promoting", "Cosmopolitanism|Federalism"],
  ["Federalism", "European federalism", "Favours dividing sovereignty between central and regional authorities, or pooling it supranationally.", "Fiscal federalism", "Pluralist", "Regionalism|Liberal Internationalism"],
  ["Pragmatism", "Political pragmatism|Technocentrism", "Policy judged by practical results rather than ideology; evidence-based governance.", "Whatever works", "Whatever works", "Centrism|Technocracy|Radical Centrism"],
  ["Constitutionalism", "Rule-of-law politics", "Government bound by constitutional limits, separation of powers and protected rights.", "Neutral", "Rights and procedure", "Liberalism|Classical Liberalism"],
  ["Regionalism", "Regionalist politics", "Seeks greater autonomy or recognition for a region without necessarily demanding independence.", "Regional development", "Local identity", "Federalism|Localism"],
  ["Localism", "Subsidiarity politics", "Prefers decisions and services at the lowest practical level of government and community.", "Local economy", "Community-based", "Regionalism|Communitarianism|Agrarianism"],
  ["Centrist Populism", "Anti-establishment centrism", "Critiques political elites independent of left–right issues, often promising clean government and competence.", "Mixed, pragmatic", "Anti-corruption", "Right-Wing Populism|Left-Wing Populism|Pragmatism"],
];

const CENTER_LEFT: Row[] = [
  ["Social Democracy", "Democratic reformism", "Pursues social justice within a capitalist democracy through a welfare state, unions and regulation.", "Mixed economy, high welfare", "Progressive, egalitarian", "Democratic Socialism|Labourism|Revisionist Socialism"],
  ["Social Liberalism", "Modern liberalism|New liberalism", "Liberalism supporting state action to expand real freedom through education, health and social protection.", "Regulated markets, welfare", "Liberal, pluralist", "Egalitarian Liberalism|Modern American Liberalism|Liberalism"],
  ["Progressivism", "Progressive politics", "Advocates reform and social progress through government, science and expanded rights.", "Regulation, progressive taxation", "Socially liberal", "Social Liberalism|Social Democracy"],
  ["Modern American Liberalism", "New Deal liberalism", "US liberalism combining civil rights, regulated capitalism and a social safety net.", "Regulated capitalism", "Civil-rights liberal", "Social Liberalism|Progressivism"],
  ["Labourism", "Labour movement politics", "Politics of the trade-union-based labour movement seeking workers' representation within parliament.", "Pro-union, welfare", "Working-class solidarity", "Social Democracy|Fabianism"],
  ["Fabianism", "Fabian socialism", "Gradualist British socialism pursuing reform through research, education and parliamentary politics.", "Gradual collectivism", "Reformist", "Social Democracy|Labourism|Revisionist Socialism"],
  ["Keynesianism", "Keynesian economics", "Macroeconomic school supporting active government demand management to stabilise the economy.", "Counter-cyclical state spending", "Not defined", "Social Democracy|Welfare liberalism"],
  ["Environmentalism", "Green movement", "Prioritises protection of the natural environment and sustainability within policy-making.", "Regulation, green investment", "Ecological, participatory", "Eco-Socialism|Green Conservatism|Degrowth"],
  ["Liberal Feminism", "Equality feminism", "Seeks gender equality through legal and political reform within liberal democracy.", "Equal pay, work-family policy", "Equal rights", "Social Liberalism|Socialist Feminism"],
  ["Multiculturalism", "Cultural pluralism", "Promotes the recognition and accommodation of diverse cultural and ethnic groups in one society.", "Not defined", "Pluralist, minority rights", "Social Liberalism|Cosmopolitanism"],
  ["Egalitarian Liberalism", "Rawlsian liberalism", "Justice as fairness: equal basic liberties and inequalities only if they benefit the least advantaged (John Rawls).", "Redistribution within markets", "Liberal, egalitarian", "Social Liberalism|Social Democracy"],
  ["Revisionist Socialism", "Evolutionary socialism|Bernsteinism", "Eduard Bernstein's reformist revision of Marxism: socialism through democratic evolution, not revolution.", "Gradual socialisation, welfare", "Democratic", "Social Democracy|Fabianism|Democratic Socialism"],
  ["Liberal Socialism", "Social-liberal socialism", "Seeks to combine liberal rights and market elements with socialist equality aims.", "Mixed, cooperative sector", "Liberal-democratic", "Social Liberalism|Market Socialism|Democratic Socialism"],
  ["Christian Left", "Social Gospel politics", "Applies Christian ethics to justice, poverty and peace, leaning toward egalitarian and welfare policy.", "Welfare, social justice", "Faith-based progressive", "Christian Socialism|Christian Democracy|Liberation Theology"],
];

const LEFT: Row[] = [
  ["Democratic Socialism", "Democratic collectivism", "Seeks to replace capitalism with social ownership, achieved democratically rather than by revolution.", "Social ownership, planning", "Democratic, egalitarian", "Social Democracy|Revisionist Socialism|Market Socialism", "Historically close to social democracy; modern usage often means radical-left within democracy, so placement between centre-left and left is approximate."],
  ["Socialism", "Socialist politics", "Broad family advocating social or collective ownership and democratic control of the economy.", "Social ownership", "Egalitarian, solidarity", "Democratic Socialism|Communism|Market Socialism"],
  ["Market Socialism", "Cooperative market economy", "Social or cooperative ownership of firms operating in market competition.", "Worker-owned firms in markets", "Egalitarian", "Cooperativism|Mutualism|Liberal Socialism"],
  ["Libertarian Socialism", "Left-libertarianism|Socialist libertarianism", "Opposes both capitalism and the authoritarian state; favours worker self-management and voluntary association.", "Workers' councils, commons", "Anti-authoritarian", "Anarcho-Syndicalism|Council Communism|Mutualism", "Wikipedia places libertarian socialism between left and far-left; classification varies by strand."],
  ["Eco-Socialism", "Green socialism|Ecosocialism", "Merges socialist critique of capitalism with ecological limits and sustainability.", "Social ownership, ecological planning", "Ecological, egalitarian", "Environmentalism|Social Ecology|Degrowth"],
  ["Christian Socialism", "Religious socialism", "Draws on Christian teaching to argue for economic equality, cooperative and common ownership.", "Cooperative / public ownership", "Faith-based egalitarian", "Christian Left|Liberation Theology"],
  ["Islamic Socialism", "Arab-Islamic socialism", "Interprets Islamic principles of justice and zakat as foundations for socialist economics.", "State/zakat-based redistribution", "Religious egalitarian", "Islamism|Nasserism|Arab socialism"],
  ["African Socialism", "Ujamaa", "Post-colonial socialisms (Nyerere, Senghor, Nkrumah) grounded in communal traditions and national development.", "State and cooperative development", "Communal, anti-colonial", "Pan-Africanism|Left-Wing Nationalism"],
  ["Cooperativism", "Cooperative movement", "Promotes cooperatively owned enterprises and mutual aid as the basis of economy.", "Co-op ownership", "Solidarity, participation", "Market Socialism|Mutualism"],
  ["Mutualism", "Proudhonian mutualism", "Proudhon's system of reciprocal exchange, mutual credit and worker-controlled production.", "Mutual credit, possession", "Federalist, anti-state", "Cooperativism|Individualist Anarchism|Market Socialism"],
  ["Guild Socialism", "Guild economy", "British movement for workers' control through democratic industrial guilds within a pluralist state.", "Guild-run industry", "Pluralist", "Syndicalism-style ideas|Mutualism|Market Socialism"],
  ["Left-Wing Populism", "Democratic populism|Social populism", "Mobilises 'the people' against economic and political elites, combining redistribution with anti-establishment rhetoric.", "Redistribution, anti-austerity", "Inclusive-popular", "Democratic Socialism|Centrist Populism|Bolivarianism"],
  ["Eurocommunism", "Reformist communism", "Western European communist current that accepted pluralist democracy and rejected Soviet control.", "Mixed, social ownership", "Democratic, pluralist", "Democratic Socialism|Marxism"],
  ["Bolivarianism", "Chavismo|21st-century socialism", "Latin American movement inspired by Simón Bolívar, combining socialism, anti-imperialism and popular participation.", "Nationalised resources, social missions", "Populist, anti-imperialist", "Left-Wing Populism|Left-Wing Nationalism|Socialism"],
  ["Social Ecology", "Libertarian municipalism (Bookchin)", "Murray Bookchin's view that ecological crises stem from hierarchy; proposes confederated democratic municipalities.", "Communal / municipal economy", "Directly democratic", "Eco-Socialism|Libertarian Socialism|Anarcho-Communism"],
  ["Socialist Feminism", "Marxist feminism", "Analyses women's oppression through both patriarchy and capitalism.", "Anti-capitalist, care economy", "Gender equality", "Liberal Feminism|Socialism"],
  ["Nasserism", "Arab socialism", "Pan-Arab nationalist-socialist ideology of Gamal Abdel Nasser: state-led development, non-alignment.", "State-led economy", "Secular nationalist", "Ba'athism|Pan-Africanism|Islamic Socialism"],
  ["Liberation Theology", "Theology of liberation", "Christian theology interpreting the Gospel through the struggle of the poor against structural injustice.", "Redistribution, base communities", "Poor-centred, communitarian", "Christian Socialism|Christian Left"],
  ["Left-Wing Nationalism", "Socialist patriotism|Anti-colonial nationalism", "Nationalism of liberation and self-determination combined with social equality aims.", "Social development, nationalisation", "Anti-imperialist", "African Socialism|Bolivarianism|Pan-Africanism"],
  ["Pan-Africanism", "African unity movement", "Movement for solidarity and political unity among Africans and the diaspora.", "Collective development", "Anti-colonial, solidarity", "African Socialism|Left-Wing Nationalism"],
  ["Degrowth", "Post-growth politics", "Argues for planned reduction of production and consumption to stay within ecological limits while improving wellbeing.", "Post-growth, sufficiency", "Ecological, egalitarian", "Eco-Socialism|Environmentalism", "Sometimes classified as a third-way/ecologist position outside left–right."],
];

const FAR_LEFT: Row[] = [
  ["Communism", "Stateless communism", "Aim of a classless, moneyless, stateless society based on common ownership of the means of production.", "Common ownership, abolition of private property", "Egalitarian, collectivist", "Marxism|Marxism–Leninism|Anarcho-Communism"],
  ["Marxism", "Scientific socialism", "Karl Marx and Friedrich Engels' analysis of class struggle, historical materialism and capitalism's contradictions.", "Abolish capitalism, socialise production", "Class-based egalitarian", "Leninism|Luxemburgism|Council Communism"],
  ["Leninism", "Vanguardism", "Lenin's theory of a disciplined vanguard party leading proletarian revolution and a transitional state.", "State control of the economy", "Authoritarian-democratic-centralist", "Marxism–Leninism|Trotskyism|Marxism"],
  ["Marxism–Leninism", "Soviet communism", "Official ideology of 20th-century communist states: vanguard party, democratic centralism and central planning.", "Command economy", "One-party, authoritarian", "Stalinism|Maoism|Leninism"],
  ["Stalinism", "Stalin's USSR doctrine", "Marxism–Leninism as practised under Stalin: socialism in one country, forced industrialisation and personalised party rule.", "Central planning, collectivisation", "Totalitarian", "Marxism–Leninism|Hoxhaism|Maoism"],
  ["Trotskyism", "Permanent revolution", "Marxist-Leninist tendency favouring international revolution and criticising bureaucratic degeneration in the USSR.", "Planned, workers' democracy", "Internationalist, revolutionary", "Leninism|Marxism|Left Communism"],
  ["Maoism", "Mao Zedong Thought", "Marxism–Leninism adapted to China: peasant-based revolution, protracted people's war and continuous class struggle.", "Collectivised rural-led economy", "Mass-line, authoritarian", "Marxism–Leninism|Stalinism"],
  ["Hoxhaism", "Anti-revisionist Marxism–Leninism", "Enver Hoxha's strictly Stalinist, anti-revisionist line rejecting Soviet reform and Maoism.", "Strict central planning, autarky", "Authoritarian, atheist state", "Stalinism|Marxism–Leninism"],
  ["Juche", "Kimilsungism", "North Korean state ideology of self-reliance combining Marxist-Leninist forms with hereditary leadership and nationalism.", "Self-reliant state economy", "Nationalist, personalist", "Marxism–Leninism|Stalinism", "Officially socialist but widely described as ultranationalist; its far-left label is disputed."],
  ["Luxemburgism", "Rosa Luxemburg's Marxism", "Revolutionary Marxism stressing mass spontaneity, democracy within socialism and opposition to bureaucratic vanguardism.", "Socialised production", "Democratic-revolutionary", "Marxism|Council Communism|Left Communism"],
  ["Council Communism", "Workers' council communism", "Libertarian Marxist current in which workers' councils, not parties or states, run society.", "Worker-council control", "Anti-vanguard, democratic", "Left Communism|Libertarian Socialism|Luxemburgism"],
  ["Left Communism", "Ultra-leftism", "Communist left critical of Bolshevik party-state practice, parliamentarism and unions.", "Abolition of wage labour", "Internationalist, anti-parliamentary", "Council Communism|Trotskyism"],
  ["Autonomism", "Autonomist Marxism|Autonomia", "Marxist current emphasising workers' self-organisation outside parties and unions.", "Commons, anti-work tendencies", "Movement-based, anti-authoritarian", "Council Communism|Libertarian Socialism"],
  ["Anarcho-Communism", "Anarchist communism", "Abolition of state, private property and capitalism in favour of voluntary communes and 'from each according to ability, to each according to need' (Kropotkin).", "Common ownership, free distribution", "Anti-state, egalitarian", "Anarcho-Syndicalism|Communism|Social Ecology"],
  ["Anarcho-Syndicalism", "Revolutionary syndicalism", "Organises revolutionary trade unions to abolish capitalism and the state via general strike.", "Union-run industry", "Anti-state, federalist", "Anarcho-Communism|Libertarian Socialism"],
  ["Insurrectionary Anarchism", "Anarchist insurrectionism", "Emphasises permanent informal direct action and attack against state and capital rather than mass organisation.", "Anti-capitalist, gift/commons", "Anti-organisational, direct action", "Anarcho-Communism|Autonomism"],
  ["Green Anarchism", "Eco-anarchism", "Anarchism focused on ecological problems, decentralisation and ending human domination of nature.", "Small-scale, commons", "Ecological, anti-hierarchical", "Anarcho-Primitivism|Social Ecology|Eco-Socialism"],
  ["Revolutionary Socialism", "Revolutionary leftism", "Holds that socialism requires the overthrow of the capitalist state rather than reform.", "Social ownership", "Class-based, revolutionary", "Marxism|Leninism|Trotskyism"],
];

const THIRD_WAY: Row[] = [
  ["Third Way", "New Labour politics|Clintonism|Die Neue Mitte", "1990s centrist project (Giddens, Blair, Clinton, Schröder) combining market economics with social-democratic goals: equal opportunity, responsibility and public–private partnership.", "Market economy plus investment in human capital", "Socially liberal, rights with responsibilities", "Radical Centrism|Social Democracy|Neoliberalism", "Britannica notes it can be read as modernised social democracy or as 'beyond left and right'; it is also described as centre-left or centrist."],
  ["Distributism", "Distributist economics", "Economic doctrine from Catholic social teaching (Chesterton, Belloc) favouring widespread ownership of productive property, neither capitalism nor socialism.", "Broadly distributed small property, guilds", "Traditionalist-communitarian", "Integralism|Agrarianism|Cooperativism"],
  ["Corporatism", "Corporativism", "Organises society through representative functional groups (labour, business, professions) that negotiate under state supervision.", "Tripartite bargaining", "Hierarchical-organic", "Fascism|Christian Democracy|Distributism", "Appears in fascist, authoritarian and democratic (neo-corporatist) forms, hence placed outside the spectrum."],
  ["Technocracy", "Rule by experts", "Policy and government led by technical experts rather than elected generalists or ideology.", "Evidence-based management", "Expert-led", "Pragmatism|Radical Centrism"],
  ["Communitarianism", "Civic communitarianism", "Emphasises community, shared values and social obligations as counterweights to pure individualism.", "Mixed, community-minded", "Community-oriented, often morally conservative", "Civic Republicanism|Localism|Distributism"],
  ["Georgism", "Geoism|Single tax", "Henry George's doctrine that land value belongs equally to all, funded by a land-value tax.", "Land-value tax, free markets elsewhere", "Liberal, egalitarian", "Classical Liberalism|Mutualism"],
  ["Pirate Politics", "Pirate Party ideology", "Focuses on civil liberties online, copyright and patent reform, privacy and direct democracy.", "Open knowledge, mixed", "Libertarian, transparency", "Technocracy|Liberalism"],
  ["Anarcho-Primitivism", "Primitivism", "Critique of civilisation and technology; advocates return to non-industrial, foraging life.", "Subsistence, gift economy", "Anti-civilisation, anti-hierarchical", "Green Anarchism|Degrowth", "Anarcho-primitivism is anti-state but defies left–right axes; sometimes classed far-left."],
  ["Individualist Anarchism", "Egoist anarchism", "Anarchist currents emphasising individual sovereignty, voluntary exchange and rejection of authority.", "Free exchange, possession", "Radical individual liberty", "Mutualism|Anarcho-Capitalism|Insurrectionary Anarchism", "Includes both left-leaning (Tucker, Stirner) and market-oriented strands."],
  ["Transhumanism", "Techno-progressivism (related)", "Political advocacy for using technology to enhance human capacities and extend life.", "Tech-driven growth, varies", "Morphological freedom", "Technocracy|Liberalism"],
  ["Social Credit", "Douglas social credit", "Economic doctrine by C. H. Douglas proposing dividends and price adjustments to distribute purchasing power.", "Monetary reform, national dividend", "Populist", "Distributism|Georgism"],
  ["Ba'athism", "Arab Ba'ath", "Pan-Arab secular nationalist movement mixing Arab unity, socialism and one-party rule.", "State-led, mixed", "Secular, nationalist, authoritarian", "Nasserism|Fascism-like tendencies|Pan-Arabism", "Self-described as socialist but authoritarian-nationalist; often treated as syncretic."],
  ["Peronism", "Justicialismo", "Argentine movement of Juan Perón: national sovereignty, social justice and labour-state alliance.", "State-led, pro-labour with markets", "Nationalist, populist", "Corporatism|Left-Wing Populism|Right-Wing Populism", "Peronism hosts left and right wings; it self-defines as a 'third position'."],
  ["Kemalism", "Atatürkism", "Founding ideology of Turkey: republicanism, secularism, nationalism, populism, statism and reformism.", "Statist developmentalism", "Secular, modernising, nationalist", "Civic Nationalism|Pragmatism"],
  ["Populism", "Anti-elitism", "Thin-centred ideology dividing society into 'the pure people' versus 'the corrupt elite' (Mudde); attaches to left, right or centre.", "Variable", "Anti-establishment", "Right-Wing Populism|Left-Wing Populism|Centrist Populism", "Scholars treat populism as a thin ideology that attaches to others, not a left–right position."],
  ["Syncretic Politics", "Eclectic politics", "Positions that deliberately mix elements from across the left–right spectrum.", "Mixed", "Mixed", "Third Way|Radical Centrism"],
  ["Radical Democracy", "Deliberative democracy", "Deepens democracy through participation, deliberation and citizens' assemblies beyond electoral representation.", "Participatory", "Participatory, pluralist", "Libertarian Socialism|Civic Republicanism"],
];

const GROUPS: [CategoryId, Row[]][] = [
  ["far-right", FAR_RIGHT],
  ["right", RIGHT],
  ["center-right", CENTER_RIGHT],
  ["center", CENTER],
  ["center-left", CENTER_LEFT],
  ["left", LEFT],
  ["far-left", FAR_LEFT],
  ["third-way", THIRD_WAY],
];

/** Optional historical context for key ideologies. */
const HISTORY: Record<string, string> = {
  Conservatism: "Emerged as a reaction to the French Revolution (1789); Edmund Burke's Reflections (1790) is its founding text.",
  Fascism: "Founded by Mussolini in Italy (1919–1922) in the wake of World War I; spread across interwar Europe.",
  Nazism: "Emerged in Weimar Germany in the 1920s and ruled Germany 1933–1945.",
  "Classical Liberalism": "Developed from the 17th–19th centuries: Locke, Montesquieu, Adam Smith and J. S. Mill.",
  "Social Democracy": "Grew from the late-19th-century split between revolutionary and reformist Marxism; shaped the post-war welfare states.",
  "Christian Democracy": "Developed from Catholic social teaching (Rerum Novarum, 1891) and dominated post-war Western Europe.",
  Marxism: "Formulated by Marx and Engels in the mid-19th century (Communist Manifesto, 1848).",
  Leninism: "Developed by Lenin around the 1903 party split and the 1917 Russian Revolution.",
  Trotskyism: "Arose in the 1920s as opposition to Stalin's rise; the Fourth International was founded in 1938.",
  Maoism: "Developed during the Chinese Revolution (1927–1949).",
  "Anarcho-Communism": "Formulated in the 1870s–80s by Kropotkin and others; major role in the Spanish Civil War.",
  "Third Way": "Used historically for many projects; after 1990 associated with Giddens, Blair, Clinton and Schröder.",
  Neoliberalism: "Revived in the 1970s–80s through the Chicago and Austrian schools and the Thatcher and Reagan governments.",
  "Radical Centrism": "Modern term for centrism that rejects left–right framing, popularised from the 1990s.",
  Keynesianism: "Arose from John Maynard Keynes' General Theory (1936) amid the Great Depression.",
  Distributism: "Developed in the early 20th century by Chesterton and Belloc from Rerum Novarum.",
  Peronism: "Founded by Juan Perón in Argentina in the 1940s.",
  Kemalism: "Established by Mustafa Kemal Atatürk after 1923 as the Turkish republic's founding ideology.",
  Georgism: "Based on Henry George's Progress and Poverty (1879).",
  Fabianism: "Founded in 1884 in London; influenced the British Labour Party.",
};

export const BUILTIN_IDEOLOGIES: Ideology[] = GROUPS.flatMap(([category, rows]) =>
  rows.map(([name, aliases, description, economic, social, related, note]): Ideology => ({
    id: slug(name),
    name,
    category,
    aliases: aliases ? aliases.split("|").filter(Boolean) : [],
    description,
    economic,
    social,
    related: related ? related.split("|").filter(Boolean) : [],
    history: HISTORY[name],
    sources: [
      { title: `Wikipedia — ${name} (search)`, url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}` },
      ...CATEGORY_SOURCES[category],
    ],
    disputed: note ? true : undefined,
    note,
  })),
);

export const BUILTIN_MAP: Record<string, Ideology> = Object.fromEntries(
  BUILTIN_IDEOLOGIES.map((i) => [i.id, i]),
);

export function ideologyScore(i: Ideology | undefined | null): number {
  if (!i) return 0;
  return CATEGORY_MAP[i.category]?.lr ?? 0;
}
