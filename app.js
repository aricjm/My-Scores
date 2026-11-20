const API_ROOT = "https://site.api.espn.com/apis/site/v2/sports";
const GOLF_CORE_API_ROOT = "https://sports.core.api.espn.com/v2/sports/golf/leagues";
const CENTRAL_TIME_ZONE = "America/Chicago";
const SPORTS = {
  NCAAF: { path: "football/college-football", label: "College Football", periods: 4, periodLabel: "Q", periodMinutes: 15, overtimeMinutes: 15, teamId: "2294" },
  NFL: { path: "football/nfl", label: "NFL", periods: 4, periodLabel: "Q", periodMinutes: 15, overtimeMinutes: 10, teamId: "22" },
  NCAAM: { path: "basketball/mens-college-basketball", label: "Men's College Basketball", periods: 2, periodLabel: "H", periodMinutes: 20, overtimeMinutes: 5, teamId: "2294" },
  NCAAW: { path: "basketball/womens-college-basketball", label: "Women's College Basketball", periods: 4, periodLabel: "Q", periodMinutes: 10, overtimeMinutes: 5, teamId: "2294" },
  NBA: { path: "basketball/nba", label: "NBA", periods: 4, periodLabel: "Q", periodMinutes: 12, overtimeMinutes: 5, teamId: "8" },
  WNBA: { path: "basketball/wnba", label: "WNBA", periods: 4, periodLabel: "Q", periodMinutes: 10, overtimeMinutes: 5, teamId: "5" },
  Golf: { path: "golf/pga", label: "Golf", periods: 4, periodLabel: "R", periodMinutes: null },
};
const GOLF_PLAYER_BET_OPTIONS = [
  ["winner", "Outright Winner"],
  ["top5", "Top 5 (Including Ties)"],
  ["top10", "Top 10 (Including Ties)"],
  ["top20", "Top 20 (Including Ties)"],
  ["top30", "Top 30 (Including Ties)"],
  ["top40", "Top 40 (Including Ties)"],
  ["cut", "To Make The Cut"],
  ["round-score", "Round Score (O/U)"],
  ["round-matchup", "Round Matchup"],
];
const MY_TEAMS = {
  NCAAF: ["iowa"],
  NCAAM: ["iowa"],
  NCAAW: ["iowa"],
  NFL: ["arizona cardinals"],
  NBA: ["detroit pistons"],
  WNBA: ["indiana fever"],
};
const MY_TEAM_SECTION_TITLES = {
  NCAAF: "Iowa Hawkeyes Mens Football",
  NCAAM: "Iowa Hawkeyes Mens Basketball",
  NCAAW: "Iowa Hawkeyes Womens Basketball",
  NFL: "Arizona Cardinals",
  NBA: "Detroit Pistons",
  WNBA: "Indiana Fever",
};
const ALL_TABS = ["NCAAF", "NFL", "NCAAM", "NCAAW", "NBA", "WNBA"];
const GOLF_TOURS = {
  pga: { label: "PGA Tour", apiLeague: "pga" },
  champions: { label: "PGA Tour Champions", apiLeague: "champions-tour" },
  liv: { label: "LIV Golf", apiLeague: "liv" },
  "dp-world": { label: "DP World Tour", apiLeague: "eur" },
  lpga: { label: "LPGA Tour", apiLeague: "lpga" },
};
const scoreboardCache = new Map();
const summaryCache = new Map();
const spreadChartRanges = new Map();
const basketballRosterCache = new Map();
const basketballAverageCache = new Map();
const footballRosterCache = new Map();
const footballAverageCache = new Map();
const footballScheduleCache = new Map();
const footballGameLogCache = new Map();
const footballPositionCache = new Map();
const golfEventCache = new Map();
const golfEarningsCache = new Map();
const golfCourseDetailsCache = new Map();
const golfCourseAssignmentCache = new Map();
const golfEventDataCache = new Map();
const BASKETBALL_STATS_API_ROOT = "https://site.web.api.espn.com/apis/common/v3";
const FOOTBALL_STATS_CATEGORIES = [
  { name: "Passing", key: "passing", columns: ["GP", "C/ATT", "YDS", "AVG", "TD", "INT", "SACKS", "QBR", "RTG"] },
  { name: "Rushing", key: "rushing", columns: ["GP", "CAR", "YDS", "AVG", "TD", "LONG"] },
  { name: "Receiving", key: "receiving", columns: ["GP", "REC", "YDS", "LONG", "TGTS"] },
  { name: "Defense", key: "defensive", columns: ["GP", "TOT", "SACKS", "TFL", "PD", "QB HTS", "TD", "INT", "FR"] },
  { name: "Kicking", key: "kicking", columns: ["GP", "FG", "PCT", "LONG", "XP", "PTS"] },
];
const PICK_STORAGE_KEY = "sideline.game-picks.v1";
const PLAYER_PROP_OPTIONS = [
  ["PTS", "Points"],
  ["3PT", "Threes"],
  ["REB", "Rebounds"],
  ["AST", "Assists"],
  ["PR", "Points + Rebounds"],
  ["PA", "Points + Assists"],
  ["RA", "Rebounds + Assists"],
  ["PRA", "Points + Rebounds + Assists"],
  ["SB", "Steals + Blocks"],
  ["DD", "Double-double"],
  ["TD", "Triple-double"],
  ["BLK", "Blocks"],
  ["STL", "Steals"],
];
const FOOTBALL_PLAYER_PROP_OPTIONS = {
  QB: [["FPY", "Pass Yards"], ["FPTD", "Pass TDs"], ["FPA", "Pass Attempts"], ["FCMP", "Completions"], ["FINT", "Interceptions"], ["FTD", "TD Scorer"]],
  RB: [["FRY", "Rush Yards"], ["FRYREC", "Receiving Yards"], ["FRRY", "Rush + Rec Yards"], ["FRATT", "Rush Attempts"], ["FREC", "Receptions"], ["FTD", "TD Scorer"]],
  HB: [["FRY", "Rush Yards"], ["FRYREC", "Receiving Yards"], ["FRRY", "Rush + Rec Yards"], ["FRATT", "Rush Attempts"], ["FREC", "Receptions"], ["FTD", "TD Scorer"]],
  FB: [["FRY", "Rush Yards"], ["FRYREC", "Receiving Yards"], ["FRRY", "Rush + Rec Yards"], ["FRATT", "Rush Attempts"], ["FREC", "Receptions"], ["FTD", "TD Scorer"]],
  WR: [["FRYREC", "Receiving Yards"], ["FREC", "Receptions"], ["FTD", "TD Scorer"]],
  TE: [["FRYREC", "Receiving Yards"], ["FREC", "Receptions"], ["FTD", "TD Scorer"]],
  DE: [["FTOT", "Total Tackles"]],
  DT: [["FTOT", "Total Tackles"]],
  LB: [["FTOT", "Total Tackles"]],
  S: [["FTOT", "Total Tackles"]],
  CB: [["FTOT", "Total Tackles"]],
  K: [["FFGM", "FG Made"], ["FKPTS", "Kicking Pts"], ["FPATM", "PAT Made"], ["FFGYDS", "FG Yards"]],
  PK: [["FFGM", "FG Made"], ["FKPTS", "Kicking Pts"], ["FPATM", "PAT Made"], ["FFGYDS", "FG Yards"]],
};
let pickStorageError = "";
const ALLOWED_TV_CHANNELS = new Set([
  "abc",
  "acc network",
  "btn",
  "cbs",
  "cbssn",
  "cw",
  "espn",
  "espn2",
  "espnu",
  "fox",
  "fs1",
  "trutv",
  "nbc",
  "sec network",
  "tnt",
  "usa net",
  "prime video",
]);
const TV_CHANNEL_ALIASES = new Map([
  ["the cw", "cw"],
  ["cbs sports network", "cbssn"],
  ["fox sports 1", "fs1"],
  ["fox sports one", "fs1"],
  ["usa network", "usa net"],
  ["amazon prime video", "prime video"],
]);

const elements = {
  scoreList: document.querySelector("#score-list"),
  gameCount: document.querySelector("#game-count"),
  sectionHeading: document.querySelector(".section-heading"),
  sectionKicker: document.querySelector("#section-kicker"),
  sectionTitle: document.querySelector("#section-title"),
  dateLabel: document.querySelector("#date-label"),
  refreshButton: document.querySelector("#refresh-button"),
  pullIndicator: document.querySelector("#pull-indicator"),
  pullIndicatorLabel: document.querySelector("#pull-indicator-label"),
  myTeamFilters: document.querySelector("#my-team-filters"),
  golfTourFilters: document.querySelector("#golf-tour-filters"),
  todayViewSwitch: document.querySelector("#today-view-switch"),
};

const state = {
  tab: "My Teams",
  day: "today",
  todayView: "all",
  myTeamsLeague: "All",
  golfTour: "pga",
  refreshSequence: 0,
  picks: loadSavedPicks(),
  pickStorageError,
};

function loadSavedPicks() {
  try {
    const saved = window.localStorage.getItem(PICK_STORAGE_KEY);
    if (!saved) return {};
    const picks = JSON.parse(saved);
    if (!picks || typeof picks !== "object" || Array.isArray(picks)) throw new Error("Saved picks have an invalid format.");
    return picks;
  } catch (error) {
    pickStorageError = `Saved picks could not be loaded: ${error.message}`;
    return {};
  }
}

function savePicks() {
  try {
    window.localStorage.setItem(PICK_STORAGE_KEY, JSON.stringify(state.picks));
    state.pickStorageError = "";
  } catch (error) {
    state.pickStorageError = `Picks could not be saved on this device: ${error.message}`;
  }
}

function getGamePickKey(card) {
  return `${card.dataset.sport}:${card.dataset.eventId}`;
}

function getGamePicks(card) {
  const key = getGamePickKey(card);
  if (!state.picks[key] || typeof state.picks[key] !== "object" || Array.isArray(state.picks[key])) {
    state.picks[key] = { players: [], markets: [] };
  }
  if (!Array.isArray(state.picks[key].players)) state.picks[key].players = [];
  if (!Array.isArray(state.picks[key].markets)) state.picks[key].markets = [];
  return state.picks[key];
}

function persistAndRenderPicks(card) {
  savePicks();
  renderMyPicks(card);
}

function getCentralDate(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + offsetDays));
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
}

function formatCentralDateTime(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.weekday}, ${parts.month} ${parts.day}, ${parts.hour}:${parts.minute} ${parts.dayPeriod} ${parts.timeZoneName}`;
}

function getCentralDateKey(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}${values.month}${values.day}`;
}

function getScoreboardDateKey(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}${values.month}${values.day}`;
}

function getScheduleSeason(sportKey, dateKey) {
  const year = Number(dateKey.slice(0, 4));
  const month = Number(dateKey.slice(4, 6));
  if (sportKey === "NBA" || sportKey === "NCAAM" || sportKey === "NCAAW") {
    return month < 7 ? year : year + 1;
  }
  if (sportKey === "NFL" || sportKey === "NCAAF") {
    return month < 3 ? year - 1 : year;
  }
  return year;
}

function getSelectedDate() {
  return getCentralDate(state.day === "yesterday" ? -1 : 0);
}

function addCalendarDays(date, days) {
  const parsed = new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(4, 6)) - 1, Number(date.slice(6, 8)) + days));
  return `${parsed.getUTCFullYear()}${String(parsed.getUTCMonth() + 1).padStart(2, "0")}${String(parsed.getUTCDate()).padStart(2, "0")}`;
}

function getNFLSlateStart(daySelection) {
  const today = getCentralDate();
  const weekday = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(4, 6)) - 1, Number(today.slice(6, 8)))).getUTCDay();
  const daysUntilThursday = (4 - weekday + 7) % 7;
  const daysSinceThursday = (weekday - 4 + 7) % 7;
  const thisSlateStart = weekday === 2 || weekday === 3
    ? addCalendarDays(today, daysUntilThursday)
    : addCalendarDays(today, -daysSinceThursday);
  return daySelection === "yesterday" ? addCalendarDays(thisSlateStart, -7) : thisSlateStart;
}

function getNFLSlateDates(daySelection) {
  const start = getNFLSlateStart(daySelection);
  return Array.from({ length: 5 }, (_, index) => addCalendarDays(start, index));
}

function getGolfWeekBounds(daySelection) {
  const today = getCentralDate();
  const weekday = new Date(Date.UTC(
    Number(today.slice(0, 4)),
    Number(today.slice(4, 6)) - 1,
    Number(today.slice(6, 8)),
  )).getUTCDay();
  const daysSinceMonday = (weekday + 6) % 7;
  const start = addCalendarDays(today, -daysSinceMonday - (daySelection === "yesterday" ? 7 : 0));
  return { start, end: addCalendarDays(start, 6) };
}

function formatGolfTournamentDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function formatGolfTournamentDates(event) {
  const start = event.date?.slice(0, 10);
  const end = event.endDate?.slice(0, 10) || start;
  if (!start) return "Tournament dates unavailable";
  if (start === end) return formatGolfTournamentDate(start);
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  if (startYear === endYear && startMonth === endMonth) {
    const monthName = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short" })
      .format(new Date(Date.UTC(startYear, startMonth - 1, 1)));
    return `${monthName} ${startDay}–${endDay}, ${startYear}`;
  }
  return `${formatGolfTournamentDate(start)} – ${formatGolfTournamentDate(end)}`;
}

function formatCalendarDate(date) {
  const parsed = new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(4, 6)) - 1, Number(date.slice(6, 8))));
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" }).format(parsed);
}

function formatNFLSlateLabel() {
  const dates = getNFLSlateDates(state.day);
  const prefix = state.day === "yesterday" ? "PREVIOUS NFL WEEK" : "NFL WEEK";
  return `${prefix} · ${formatCalendarDate(dates[0])}–${formatCalendarDate(dates[dates.length - 1])}`.toUpperCase();
}

function formatSelectedDate() {
  const date = getSelectedDate();
  const parsed = new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(4, 6)) - 1, Number(date.slice(6, 8))));
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" }).format(parsed);
}

function formatDayHeading(dateKey) {
  const date = new Date(Date.UTC(Number(dateKey.slice(0, 4)), Number(dateKey.slice(4, 6)) - 1, Number(dateKey.slice(6, 8))));
  const currentYear = Number(getCentralDate().slice(0, 4));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getUTCFullYear() === currentYear ? undefined : "numeric",
  }).format(date);
}

function cleanText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function hasRecordedStatValues(values) {
  return (values ?? []).some((value) => {
    const text = String(value ?? "").trim();
    if (!text || ["--", "—", "-"].includes(text)) return false;
    const clock = text.match(/^(\d+):(\d{1,2})$/);
    if (clock) return Number(clock[1]) > 0 || Number(clock[2]) > 0;
    const ratio = text.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);
    if (ratio) return Number(ratio[1]) !== 0 || Number(ratio[2]) !== 0;
    const number = Number(text.replaceAll(",", ""));
    return Number.isFinite(number) && number !== 0;
  });
}

function getCompetition(event) {
  return event.competitions?.[0] ?? {};
}

function getCompetitors(event) {
  const competitors = getCompetition(event).competitors ?? [];
  return {
    home: competitors.find((team) => team.homeAway === "home") ?? competitors[0] ?? {},
    away: competitors.find((team) => team.homeAway === "away") ?? competitors[1] ?? {},
  };
}

function getTeamDisplayOrder(summary, sportKey) {
  const competitors = summary.header?.competitions?.[0]?.competitors ?? [];
  const preferredTeamId = MY_TEAMS[sportKey]?.length ? String(SPORTS[sportKey]?.teamId ?? "") : "";
  const hasPreferredTeam = competitors.some((competitor) =>
    String(competitor.id ?? competitor.team?.id ?? "") === preferredTeamId);
  return new Map(competitors.map((competitor, index) => {
    const teamId = String(competitor.id ?? competitor.team?.id ?? "");
    const defaultOrder = competitor.homeAway === "home" ? 0 : competitor.homeAway === "away" ? 1 : index;
    return [teamId, hasPreferredTeam && teamId === preferredTeamId ? 0 : defaultOrder + (hasPreferredTeam ? 1 : 0)];
  }));
}

function isMyTeamEvent(event, tab) {
  const wanted = MY_TEAMS[tab] ?? [];
  const teams = getCompetitors(event);
  const names = [teams.home, teams.away].map((team) => [
    team.team?.displayName,
    team.team?.name,
    team.team?.abbreviation,
  ].filter(Boolean).join(" ").toLowerCase());
  return wanted.some((term) => names.some((name) => name.includes(term)));
}

function formatGameTime(event) {
  const date = new Date(event.date);
  if (Number.isNaN(date.getTime())) return "Time TBD";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function getStatus(event) {
  const status = event.status?.type ?? getCompetition(event).status?.type ?? {};
  const completed = Boolean(status.completed);
  const inProgress = Boolean(status.id === "2" || status.state === "in");
  return {
    label: status.shortDetail || status.detail || "Scheduled",
    className: completed ? "final" : inProgress ? "live" : "",
    isLive: inProgress,
    completed,
  };
}

function getLiveGameClock(event, sportKey) {
  const competitionStatus = getCompetition(event).status ?? {};
  const eventStatus = event.status ?? {};
  const period = Number(competitionStatus.period ?? eventStatus.period);
  const clock = competitionStatus.displayClock ?? eventStatus.displayClock;
  const sport = SPORTS[sportKey];
  const periodLabel = Number.isInteger(period) && period > 0
    ? period <= (sport?.periods ?? 4)
      ? `${sport?.periodLabel ?? "P"}${period}`
      : sport?.periodLabel === "Q"
        ? `${period - (sport.periods ?? 4)}OT`
        : `${period}${sport?.periodLabel ?? "P"}`
    : "";
  const clockLabel = clock != null && String(clock).trim() ? String(clock).trim() : "Clock unavailable";
  return [periodLabel, clockLabel].filter(Boolean).join(" · ");
}

function renderLiveGameIndicator(event, sportKey) {
  return `<span class="game-live-indicator" role="status"><span class="game-live-light" aria-hidden="true"></span><span class="game-live-label">LIVE</span><span class="game-live-clock">${cleanText(getLiveGameClock(event, sportKey))}</span></span>`;
}

function getOdds(event, oddsOverride) {
  const competition = getCompetition(event);
  const odds = oddsOverride ?? competition.odds?.[0] ?? event.odds?.[0] ?? {};
  return {
    spread: odds.details || odds.spread != null ? (odds.details || `Spread ${odds.spread}`) : "",
    total: odds.overUnder != null ? String(odds.overUnder) : "",
  };
}

function getStructuredBettingLines(event, oddsOverride) {
  const competition = getCompetition(event);
  const odds = oddsOverride ?? competition.odds?.[0] ?? event.odds?.[0] ?? {};
  const competitors = competition.competitors ?? [];
  const home = competitors.find((team) => team.homeAway === "home") ?? competitors[0] ?? {};
  const away = competitors.find((team) => team.homeAway === "away") ?? competitors[1] ?? {};
  const rawSpread = Number(odds.spread);
  let homeSpread = null;
  let awaySpread = null;
  const favoriteLine = String(odds.details ?? "").match(/^([A-Z0-9]+)\s+([+-]?\d+(?:\.\d+)?)/i);
  if (favoriteLine) {
    const favoredTeam = competitors.find((team) =>
      team.team?.abbreviation?.toLowerCase() === favoriteLine[1].toLowerCase());
    if (favoredTeam) {
      const line = Number(favoriteLine[2]);
      if (favoredTeam.homeAway === "home") {
        homeSpread = line;
        awaySpread = -line;
      } else {
        awaySpread = line;
        homeSpread = -line;
      }
    }
  }
  if (homeSpread == null && Number.isFinite(rawSpread)) {
    const homeFavorite = odds.homeTeamOdds?.favorite;
    const awayFavorite = odds.awayTeamOdds?.favorite;
    if (homeFavorite || awayFavorite) {
      homeSpread = homeFavorite ? -Math.abs(rawSpread) : Math.abs(rawSpread);
      awaySpread = -homeSpread;
    } else {
      homeSpread = rawSpread;
      awaySpread = -rawSpread;
    }
  }
  return {
    homeId: String(home.id ?? home.team?.id ?? ""),
    homeName: home.team?.displayName || home.team?.shortDisplayName || "Home",
    awayId: String(away.id ?? away.team?.id ?? ""),
    awayName: away.team?.displayName || away.team?.shortDisplayName || "Away",
    homeSpread: Number.isFinite(homeSpread) ? String(homeSpread) : "",
    awaySpread: Number.isFinite(awaySpread) ? String(awaySpread) : "",
    total: odds.overUnder != null && Number.isFinite(Number(odds.overUnder)) ? String(odds.overUnder) : "",
  };
}

function updateCardBettingData(card, event, oddsOverride) {
  const lines = getStructuredBettingLines(event, oddsOverride);
  Object.entries(lines).forEach(([key, value]) => { card.dataset[key] = value; });
}

function getBroadcastNames(event) {
  const competition = getCompetition(event);
  const rawBroadcasts = [
    competition.broadcasts,
    competition.geoBroadcasts,
    event.broadcasts,
  ].filter(Boolean);
  const broadcasts = rawBroadcasts.flatMap((broadcast) => Array.isArray(broadcast) ? broadcast : [broadcast]);
  const names = broadcasts.flatMap((broadcast) => [
    ...(Array.isArray(broadcast.names) ? broadcast.names : []),
    broadcast.media?.shortName,
    broadcast.shortName,
    broadcast.name,
  ]);
  return [...new Set(names.filter(Boolean).map((name) => String(name).trim()))];
}

function getBroadcast(event) {
  return getBroadcastNames(event).join(", ");
}

function isAllowedTVGame(event) {
  return getBroadcastNames(event).some((broadcastName) => {
    const normalized = broadcastName.toLowerCase().replace(/\s+/g, " ").trim();
    const channel = TV_CHANNEL_ALIASES.get(normalized) || normalized;
    return ALLOWED_TV_CHANNELS.has(channel);
  });
}

function teamLogo(team) {
  return team.team?.logos?.[0]?.href || team.team?.logo || "";
}

function formatScoreValue(value) {
  if (value && typeof value === "object") {
    return value.displayValue ?? value.value ?? value.score ?? "—";
  }
  return value ?? "—";
}

function getPeriodScores(team) {
  return new Map((team.linescores ?? []).map((period, index) => [
    Number(period.period) || index + 1,
    formatScoreValue(period.displayValue ?? period.value ?? period.score),
  ]));
}

function getPeriodColumns(teams, sportKey) {
  const sport = SPORTS[sportKey];
  const highestPeriod = Math.max(
    sport.periods,
    ...teams.flatMap((team) => (team.linescores ?? []).map((period, index) => Number(period.period) || index + 1)),
  );
  return Array.from({ length: highestPeriod }, (_, index) => {
    const period = index + 1;
    if (period <= sport.periods) return sport.periodLabel === "R" ? `R${period}` : `${period}${sport.periodLabel}`;
    return period === sport.periods + 1 ? "OT" : `${period - sport.periods}OT`;
  });
}

function renderScoreRow(team, periodColumns, isAway, periodScoresLoading = false) {
  const name = team.team?.shortDisplayName || team.team?.displayName || "TBD";
  const scores = getPeriodScores(team);
  const logo = teamLogo(team);
  const logoMarkup = logo ? `<img class="team-logo" src="${cleanText(logo)}" alt="" loading="lazy">` : "";
  const periods = periodColumns.map((_, index) => `<td>${cleanText(scores.get(index + 1) ?? (periodScoresLoading ? "…" : "—"))}</td>`).join("");
  const total = formatScoreValue(team.score);
  return `<tr class="score-row ${isAway ? "away" : "home"}">
    <th scope="row"><span class="score-team">${logoMarkup}<span>${cleanText(name)}</span></span></th>
    ${periods}<td class="score-total">${cleanText(total)}</td>
  </tr>`;
}

function renderScoreTable(event, sportKey, periodScoresLoading = false) {
  const { home, away } = getCompetitors(event);
  const periodColumns = getPeriodColumns([away, home], sportKey);
  return `<table class="score-table" aria-label="${cleanText(`${SPORTS[sportKey].label} scoreboard`)}">
    <thead><tr><th scope="col">TEAM</th>${periodColumns.map((period) => `<th scope="col">${cleanText(period)}</th>`).join("")}<th scope="col" class="score-total">T</th></tr></thead>
    <tbody>${renderScoreRow(away, periodColumns, true, periodScoresLoading)}${renderScoreRow(home, periodColumns, false, periodScoresLoading)}</tbody>
  </table>`;
}

function renderEvent(event, sportKey, oddsLoading = false, oddsOverride, periodScoresLoading = false) {
  const status = getStatus(event);
  const odds = getOdds(event, oddsOverride);
  const broadcast = getBroadcast(event);
  const id = `${sportKey}-${event.id}`;
  const eventTime = new Date(event.date).getTime();
  const isUpcoming = !status.completed && !status.isLive && Number.isFinite(eventTime) && eventTime > Date.now();
  const eventDateKey = getCentralDateKey(event.date) || getCentralDate();
  const season = getScheduleSeason(sportKey, eventDateKey);
  const lines = getStructuredBettingLines(event, oddsOverride);
  const competitionStatus = getCompetition(event).status ?? {};
  const eventStatus = event.status ?? {};
  const showStats = sportKey !== "Golf";
  return `<article class="game-card" data-event-id="${cleanText(event.id)}" data-sport="${cleanText(sportKey)}" data-upcoming="${isUpcoming}" data-event-start="${eventTime}" data-season="${season}" data-completed="${status.completed}" data-live="${status.isLive}" data-game-period="${cleanText(competitionStatus.period ?? eventStatus.period ?? "")}" data-game-clock="${cleanText(competitionStatus.displayClock ?? eventStatus.displayClock ?? "")}" data-home-id="${cleanText(lines.homeId)}" data-home-name="${cleanText(lines.homeName)}" data-away-id="${cleanText(lines.awayId)}" data-away-name="${cleanText(lines.awayName)}" data-home-spread="${cleanText(lines.homeSpread)}" data-away-spread="${cleanText(lines.awaySpread)}" data-total="${cleanText(lines.total)}">
    <div class="game-topline">
      <div class="game-schedule">
        ${status.isLive
          ? renderLiveGameIndicator(event, sportKey)
          : `<span class="game-status ${status.className}">${cleanText(formatGameTime(event))}</span>`}
        <span class="game-time">${cleanText(sportKey)}</span>
      </div>
      <span class="game-broadcast"><span class="meta-label">TV</span> ${cleanText(broadcast || "Not listed")}</span>
    </div>
    <div class="score-table-wrap">
      ${renderScoreTable(event, sportKey, periodScoresLoading)}
    </div>
    ${state.day === "today" ? `<div class="betting-lines">
      <span class="meta-item"><span class="meta-label">Spread</span><span class="meta-value" data-odds-field="spread">${cleanText(odds.spread || (oddsLoading ? "Loading…" : "Not available"))}</span></span>
      <span class="meta-item"><span class="meta-label">O/U</span><span class="meta-value" data-odds-field="total">${cleanText(odds.total || (oddsLoading ? "Loading…" : "Not available"))}</span></span>
      <div class="my-pick-actions">
        <button type="button" class="my-pick-add" data-pick-action="add-spread">+ Spread</button>
        <button type="button" class="my-pick-add" data-pick-action="add-total">+ O/U</button>
      </div>
    </div>` : ""}
    <section class="my-picks" aria-label="My Picks" data-my-picks hidden>
      <div class="my-picks-heading"><h3>My Picks</h3></div>
      <div class="my-picks-content"></div>
    </section>
    ${showStats ? `<details class="game-details" data-details-id="${cleanText(id)}">
      <summary>Game &amp; player stats</summary>
      <div class="details-content"><div class="stats-loading"><span class="loader"></span>Loading game stats…</div></div>
    </details>` : ""}
  </article>`;
}

async function fetchScoreboard(sportKey, date) {
  const sport = SPORTS[sportKey];
  const groupFilter = ["NCAAM", "NCAAW"].includes(sportKey) ? "&groups=50" : "";
  const response = await fetch(`${API_ROOT}/${sport.path}/scoreboard?dates=${date}${groupFilter}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${sport.label} scoreboard returned HTTP ${response.status}`);
  return response.json();
}

function fetchGolfEventMetadata(tourKey, eventId) {
  const tour = GOLF_TOURS[tourKey];
  if (!tour?.apiLeague) throw new Error(`${tour?.label ?? "This tour"} is not available in ESPN's public golf API.`);
  const key = `${tourKey}:${eventId}`;
  if (!golfEventCache.has(key)) {
    const request = fetch(`${GOLF_CORE_API_ROOT}/${encodeURIComponent(tour.apiLeague)}/events/${encodeURIComponent(eventId)}?lang=en&region=us`, {
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (!response.ok) throw new Error(`Golf tournament details returned HTTP ${response.status}`);
      return response.json();
    });
    golfEventCache.set(key, request);
    request.catch(() => golfEventCache.delete(key));
  }
  return golfEventCache.get(key);
}

async function fetchGolfScoreboard(dateRange) {
  const tour = GOLF_TOURS[state.golfTour];
  if (!tour?.apiLeague) throw new Error(`${tour?.label ?? "This tour"} is not available in ESPN's public golf API.`);
  const response = await fetch(`${API_ROOT}/golf/${encodeURIComponent(tour.apiLeague)}/scoreboard?dates=${encodeURIComponent(dateRange)}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${tour.label} leaderboard returned HTTP ${response.status}`);
  return response.json();
}

function getGolfRounds(competitor) {
  return (competitor.linescores ?? [])
    .filter((round) => {
      const period = Number(round.period);
      if (!Number.isInteger(period) || period < 1 || period > 4) return false;
      return hasRecordedStatValues([
        round.value,
        round.displayValue,
        ...(round.linescores ?? []).map((hole) => hole.value),
      ]);
    })
    .sort((left, right) => Number(left.period) - Number(right.period));
}

function formatGolfScore(value) {
  const text = String(value ?? "").trim();
  return text && !["--", "—", "-"].includes(text) ? text : "—";
}

function formatGolfMoney(value, displayValue) {
  if (displayValue && displayValue !== "-") return displayValue;
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)
    : "—";
}

function getGolfHoleScoreClass(hole) {
  const score = Number(hole?.value);
  const par = Number(hole?.par);
  if (Number.isFinite(score) && Number.isFinite(par)) {
    const difference = score - par;
    if (difference <= -2) return "eagle";
    if (difference === -1) return "birdie";
    if (difference === 1) return "bogey";
    if (difference === 2) return "double-bogey";
  }
  const type = String(hole?.scoreType?.name ?? hole?.scoreType?.displayName ?? "")
    .toLowerCase().replaceAll("_", " ").replaceAll("-", " ").trim();
  if (type.includes("eagle") || type.includes("albatross")) return "eagle";
  if (type.includes("birdie")) return "birdie";
  if (type.includes("double bogey")) return "double-bogey";
  if (type.includes("bogey")) return "bogey";
  return "";
}

function renderGolfScorecard(round, course) {
  const holes = new Map((course?.holes ?? []).map((hole) => [Number(hole.number), {
    period: Number(hole.number),
    par: hole.shotsToPar,
  }]));
  for (const hole of round.linescores ?? []) {
    const number = Number(hole.period);
    holes.set(number, { ...holes.get(number), ...hole, par: hole.par ?? holes.get(number)?.par });
  }
  const numbers = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);
  const holeCell = (hole, field) => {
    const value = hole?.[field];
    return value == null || value === "" ? "—" : cleanText(value);
  };
  const holeCells = (holeNumbers, field) => holeNumbers.map((number) =>
    `<td>${holeCell(holes.get(number), field)}</td>`).join("");
  const sumField = (holeNumbers, field) => {
    const values = holeNumbers
      .map((number) => holes.get(number)?.[field])
      .filter((value) => value != null && value !== "" && Number.isFinite(Number(value)))
      .map(Number);
    return values.length ? values.reduce((total, value) => total + value, 0) : "—";
  };
  const front = numbers(1, 9);
  const back = numbers(10, 18);
  const scoreCells = (holeNumbers) => holeNumbers.map((number) => {
    const hole = holes.get(number);
    const scoreClass = getGolfHoleScoreClass(hole);
    return `<td><span class="golf-hole-score${scoreClass ? ` ${cleanText(scoreClass)}` : ""}">${holeCell(hole, "value")}</span></td>`;
  }).join("");
  const renderHalf = (title, holeNumbers, subtotal) => `<table class="golf-scorecard-table">
    <thead><tr><th scope="col">${title}</th>${holeNumbers.map((number) => `<th scope="col">${number}</th>`).join("")}<th scope="col">${subtotal}</th></tr></thead>
    <tbody>
      <tr><th scope="row">PAR</th>${holeCells(holeNumbers, "par")}<td>${sumField(holeNumbers, "par")}</td></tr>
      <tr><th scope="row">SCORE</th>${scoreCells(holeNumbers)}<td>${sumField(holeNumbers, "value")}</td></tr>
    </tbody>
  </table>`;
  return `<div class="golf-scorecard-scroll">
    ${renderHalf("FRONT", front, "OUT")}
    ${renderHalf("BACK", back, "IN")}
  </div>`;
}

function getGolfCourseDetails(metadata) {
  const courses = (metadata?.courses ?? []).map((course) => {
    const par = Number(course.shotsToPar)
      || (Number(course.parIn) + Number(course.parOut))
      || (course.holes ?? []).reduce((total, hole) => total + (Number(hole.shotsToPar) || 0), 0);
    const address = course.address ?? {};
    const location = [address.city, address.state, address.country && address.country !== "USA" ? address.country : ""]
      .filter(Boolean).join(", ");
    const yardage = Number(course.totalYards);
    return {
      id: course.id,
      name: course.name || course.fullName || "Course details unavailable",
      par: par || null,
      yardage: Number.isFinite(yardage) && yardage > 0 ? yardage : null,
      location,
      holes: course.holes ?? [],
    };
  });
  return {
    courses,
    location: [...new Set(courses.map((course) => course.location).filter(Boolean))].join(" · "),
  };
}

function getGolfPickKey(tourKey, eventId) {
  return `Golf:${tourKey}:${eventId}`;
}

function getGolfPicks(tourKey, eventId) {
  const key = getGolfPickKey(tourKey, eventId);
  if (!state.picks[key] || typeof state.picks[key] !== "object" || Array.isArray(state.picks[key])) {
    state.picks[key] = { players: [], markets: [] };
  }
  if (!Array.isArray(state.picks[key].players)) state.picks[key].players = [];
  if (!Array.isArray(state.picks[key].markets)) state.picks[key].markets = [];
  return state.picks[key];
}

function getGolfCompetitor(event, playerId) {
  return (event.competitions?.[0]?.competitors ?? [])
    .find((competitor) => String(competitor.id ?? competitor.athlete?.id ?? "") === String(playerId));
}

function getGolfPosition(event, competitor) {
  const position = Number(competitor?.order);
  if (!Number.isFinite(position)) return null;
  const tied = (event.competitions?.[0]?.competitors ?? [])
    .filter((player) => Number(player.order) === position).length > 1;
  return { value: position, label: `${tied ? "T" : ""}${position}` };
}

function parseGolfScoreValue(value) {
  const text = String(value ?? "").trim().toUpperCase();
  if (text === "E" || text === "EVEN") return 0;
  const match = text.match(/^[+-]?\d+$/);
  return match ? Number(text) : null;
}

function getGolfTournamentScore(competitor) {
  return parseGolfScoreValue(competitor?.score);
}

function formatGolfStrokeDifference(strokes, reference) {
  const amount = Math.abs(strokes);
  const quantity = `${amount} ${amount === 1 ? "stroke" : "strokes"}`;
  if (strokes === 0) return `Even with ${reference}`;
  return strokes < 0 ? `${quantity} ahead of ${reference}` : `${quantity} behind ${reference}`;
}

function getGolfProjectedCutLine(event) {
  const visited = new Set();
  const findLine = (value, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 5 || visited.has(value)) return null;
    visited.add(value);
    for (const [key, entry] of Object.entries(value)) {
      if (/(projected.?cut|cut.?line)/i.test(key)) {
        const candidates = [entry, entry?.value, entry?.displayValue, entry?.shortDisplayName];
        for (const candidate of candidates) {
          const parsed = parseGolfScoreValue(candidate);
          if (parsed != null) return { score: parsed, estimated: false };
          const text = String(candidate ?? "");
          const match = text.match(/(?:cut(?:\s+line)?|projected\s+cut)\s*:?\s*([+-]?\d+|E|EVEN)\b/i);
          if (match) {
            const score = parseGolfScoreValue(match[1]);
            if (score != null) return { score, estimated: false };
          }
        }
      }
      if (entry && typeof entry === "object") {
        const result = findLine(entry, depth + 1);
        if (result) return result;
      }
    }
    return null;
  };
  const reportedLine = findLine(event);
  if (reportedLine) return reportedLine;

  const players = event.competitions?.[0]?.competitors ?? [];
  const playersThroughCut = players.filter((player) =>
    getGolfRounds(player).some((round) => Number(round.period) >= 3)
    || /\b(made|passed|qualified)\s+cut\b/i.test([
      player.status?.displayValue,
      player.status?.detail,
      player.status?.type?.description,
    ].filter(Boolean).join(" ").replace(/[_-]+/g, " ")));
  if (!playersThroughCut.length) return null;
  const cutPosition = Math.max(...playersThroughCut.map((player) => Number(player.order)).filter(Number.isFinite));
  const cutPlayer = playersThroughCut.find((player) => Number(player.order) === cutPosition);
  const score = getGolfTournamentScore(cutPlayer);
  return score == null ? null : { score, estimated: true };
}

function getGolfRoundScore(round) {
  return parseGolfScoreValue(round?.displayValue) ?? parseGolfScoreValue(round?.value);
}

function formatGolfRoundScore(round) {
  const displayValue = formatGolfScore(round?.displayValue);
  return displayValue !== "—" ? displayValue : formatGolfScore(round?.value);
}

function getGolfHolesThrough(round, competitor) {
  if (!round) return 0;
  const holeScores = (round.linescores ?? []).filter((hole) => {
    const display = String(hole.displayValue ?? "").trim();
    const score = Number(hole.value);
    return (Number.isFinite(score) && score > 0) || /^\d+$/.test(display);
  }).length;
  if (holeScores) return holeScores;
  for (const value of [round.holesPlayed, round.thru, round.displayThru, competitor?.status?.holesPlayed]) {
    const holes = Number(value);
    if (Number.isInteger(holes) && holes >= 0 && holes <= 18) return holes;
  }
  const statusText = String(competitor?.status?.displayValue ?? competitor?.status?.detail ?? "");
  const statusMatch = statusText.match(/\bthru(?:\s+hole)?\s*(\d{1,2})\b/i);
  return statusMatch ? Math.min(18, Number(statusMatch[1])) : 0;
}

function getGolfCutResult(event, competitor) {
  const rounds = getGolfRounds(competitor);
  if (rounds.some((round) => Number(round.period) >= 3)) return true;
  const status = [
    competitor.status?.displayValue,
    competitor.status?.detail,
    competitor.status?.type?.name,
    competitor.status?.type?.description,
  ].filter(Boolean).join(" ").toLowerCase().replace(/[_-]+/g, " ");
  if (/\b(made|passed|qualified)\s+cut\b/.test(status)) return true;
  if (/\b(missed cut|mc|cut|wd|withdrawn|dq|disqualified)\b/.test(status)) return false;
  const completed = Boolean(event.status?.type?.completed || event.competitions?.[0]?.status?.type?.completed);
  return completed ? false : null;
}

function renderGolfPickProgress(event, pick, competitor, opponent) {
  const completed = Boolean(event.status?.type?.completed || event.competitions?.[0]?.status?.type?.completed);
  const rounds = getGolfRounds(competitor);
  if (pick.market === "round-score") {
    const round = rounds.find((entry) => Number(entry.period) === Number(pick.round));
    const current = getGolfRoundScore(round);
    const line = parseGolfScoreValue(pick.line);
    const progress = current == null ? "Round score not started" : `Current ${formatGolfRoundScore(round)}`;
    if (line == null) {
      return `<div class="golf-round-score-graph"><span class="golf-pick-progress-note">${progress} · Set a line</span><div class="golf-score-graph-track" aria-hidden="true"><span class="golf-score-graph-current" style="left:50%"></span></div></div>`;
    }
    const baseline = current ?? line;
    const range = Math.max(3, Math.abs(baseline - line) + 2);
    const minimum = Math.min(baseline, line) - range;
    const maximum = Math.max(baseline, line) + range;
    const position = (score) => Math.max(4, Math.min(96, (score - minimum) / (maximum - minimum) * 100));
    const linePosition = position(line);
    const currentPosition = current == null ? null : position(current);
    const selectedDirection = pick.direction === "under" ? "under" : "over";
    const reached = current != null && (selectedDirection === "over" ? current > line : current < line);
    const outcome = current == null ? "Round not started" : current === line ? "On the line" : reached
      ? selectedDirection === "over" ? "Over the line" : "Under the line"
      : selectedDirection === "over" ? "Below the line" : "Above the line";
    const roundComplete = isGolfRoundComplete(event, competitor, pick.round);
    const finalResult = roundComplete && current != null
      ? current === line ? "Push" : reached ? "Won" : "Lost"
      : outcome;
    const currentLabel = current == null ? "—" : formatGolfRoundScore(round);
    return `<div class="golf-round-score-graph">
      <div class="golf-score-graph-labels"><span>Current ${cleanText(currentLabel)}</span><span>Line ${cleanText(formatGolfScore(pick.line))} · ${selectedDirection.toUpperCase()}</span></div>
      <div class="golf-score-graph-track" role="img" aria-label="Round score ${cleanText(currentLabel)}, line ${cleanText(formatGolfScore(pick.line))}, ${selectedDirection}">
        <span class="golf-score-graph-zone ${selectedDirection}" style="left:${linePosition}%;width:${selectedDirection === "over" ? 100 - linePosition : linePosition}%"></span>
        <span class="golf-score-graph-line" style="left:${linePosition}%"></span>
        ${currentPosition == null ? "" : `<span class="golf-score-graph-current${reached ? " is-target" : ""}" style="left:${currentPosition}%"></span>`}
      </div>
      <span class="golf-pick-progress-note">${cleanText(finalResult)}</span>
    </div>`;
  }
  if (pick.market === "round-matchup") {
    const round = rounds.find((entry) => Number(entry.period) === Number(pick.round));
    const opponentRound = opponent && getGolfRounds(opponent)
      .find((entry) => Number(entry.period) === Number(pick.round));
    const playerName = pick.name || competitor.athlete?.displayName || "Player";
    const opponentName = opponent?.athlete?.displayName || opponent?.athlete?.fullName || "Opponent";
    const playerScore = getGolfRoundScore(round);
    const opponentScore = getGolfRoundScore(opponentRound);
    const matchupPlayer = (name, score, playerRound, player) => `<div class="golf-matchup-score">
      <span class="golf-matchup-player">${cleanText(name)}</span>
      <strong>${cleanText(formatGolfRoundScore(playerRound))}</strong>
      <span>${getGolfHolesThrough(playerRound, player)} holes through</span>
      ${score == null ? `<span class="golf-matchup-note">Score not available</span>` : ""}
    </div>`;
    return `<div class="golf-matchup-progress">${matchupPlayer(playerName, playerScore, round, competitor)}${matchupPlayer(opponentName, opponentScore, opponentRound, opponent)}</div>`;
  }
  if (pick.market === "cut") {
    const madeCut = getGolfCutResult(event, competitor);
    const position = getGolfPosition(event, competitor);
    const cutLine = getGolfProjectedCutLine(event);
    const score = getGolfTournamentScore(competitor);
    let status;
    if (madeCut === false && completed) status = "Missed cut";
    else if (madeCut === true) status = "Covering cut";
    else if (score != null && cutLine) {
      const gap = score - cutLine.score;
      status = gap <= 0 ? "Covering cut" : formatGolfStrokeDifference(gap, "cut line");
    } else status = "Cut not determined";
    const cutLabel = cutLine
      ? `Projected cut: ${cutLine.score > 0 ? "+" : ""}${cutLine.score === 0 ? "E" : cutLine.score}${cutLine.estimated ? " (est.)" : ""}`
      : "Projected cut: unavailable";
    return `<div class="golf-placement-progress"><strong>${cleanText(position?.label ?? "—")}</strong><span>${cleanText(status)}</span><span>${cleanText(cutLabel)}</span></div>`;
  }
  const target = pick.market === "winner" ? 1 : Number(pick.market.slice(3));
  const position = getGolfPosition(event, competitor);
  if (!position) {
    return `<div class="golf-placement-progress"><strong>Position unavailable</strong></div>`;
  }
  const cutoffPlayer = (event.competitions?.[0]?.competitors ?? [])
    .filter((player) => Number(player.order) <= target)
    .sort((left, right) => Number(right.order) - Number(left.order))[0];
  const cutoffScore = getGolfTournamentScore(cutoffPlayer);
  const playerScore = getGolfTournamentScore(competitor);
  const qualifies = position.value <= target;
  const placeStatus = qualifies
    ? completed ? "Finished in position" : "Covering"
    : `${position.value - target} ${position.value - target === 1 ? "position" : "positions"} outside Top ${target}`;
  const strokeStatus = cutoffScore == null || playerScore == null
    ? "Stroke gap unavailable"
    : formatGolfStrokeDifference(playerScore - cutoffScore, pick.market === "winner" ? "the lead" : `the Top ${target} line`);
  const result = completed && !qualifies ? " · Missed" : "";
  return `<div class="golf-placement-progress"><strong>${cleanText(position.label)} · ${cleanText(placeStatus)}${cleanText(result)}</strong><span>${cleanText(strokeStatus)}</span></div>`;
}

function isGolfRoundComplete(event, competitor, period) {
  if (event.status?.type?.completed || event.competitions?.[0]?.status?.type?.completed) return true;
  const rounds = getGolfRounds(competitor);
  if (rounds.some((round) => Number(round.period) > Number(period))) return true;
  const status = competitor?.status ?? {};
  const type = status.type ?? {};
  return Number(status.period) > Number(period)
    || Boolean(type.completed)
    || /\b(post|final|complete)\b/.test(String(type.state ?? type.name ?? "").toLowerCase().replace(/[_-]+/g, " "));
}

function renderGolfPickRow(event, pick) {
  const competitor = getGolfCompetitor(event, pick.id);
  if (!competitor) return "";
  const options = GOLF_PLAYER_BET_OPTIONS.map(([value, label]) =>
    `<option value="${value}"${pick.market === value ? " selected" : ""}>${cleanText(label)}</option>`).join("");
  const round = Number(pick.round) || 1;
  const rounds = [1, 2, 3, 4].map((value) =>
    `<option value="${value}"${round === value ? " selected" : ""}>R${value}</option>`).join("");
  const opponentOptions = (event.competitions?.[0]?.competitors ?? [])
    .filter((item) => String(item.id ?? item.athlete?.id ?? "") !== String(pick.id))
    .map((item) => {
      const id = String(item.id ?? item.athlete?.id ?? "");
      const name = item.athlete?.displayName || item.athlete?.fullName || "Player";
      return `<option value="${cleanText(id)}"${String(pick.opponentId) === id ? " selected" : ""}>${cleanText(name)}</option>`;
    }).join("");
  const opponent = getGolfCompetitor(event, pick.opponentId);
  const currentRound = getGolfRounds(competitor).find((item) => Number(item.period) === round);
  const scoreBet = pick.market === "round-score";
  const matchupBet = pick.market === "round-matchup";
  const position = getGolfPosition(event, competitor);
  const now = scoreBet
    ? formatGolfRoundScore(currentRound)
    : matchupBet ? "—" : position?.label ?? "—";
  const controls = scoreBet
    ? `<select data-golf-pick-field="round" data-player-id="${cleanText(pick.id)}" aria-label="Round for ${cleanText(pick.name)}">${rounds}</select>`
    : matchupBet
      ? `<span class="golf-pick-round-opponent"><select data-golf-pick-field="round" data-player-id="${cleanText(pick.id)}" aria-label="Round for ${cleanText(pick.name)}">${rounds}</select><select data-golf-pick-field="opponent" data-player-id="${cleanText(pick.id)}" aria-label="Matchup opponent for ${cleanText(pick.name)}">${opponentOptions}</select></span>`
      : "—";
  const side = scoreBet
    ? `<select data-golf-pick-field="direction" data-player-id="${cleanText(pick.id)}" aria-label="Over or under for ${cleanText(pick.name)}"><option value="over"${pick.direction !== "under" ? " selected" : ""}>Over</option><option value="under"${pick.direction === "under" ? " selected" : ""}>Under</option></select>`
    : "—";
  const line = scoreBet
    ? `<input type="number" step="0.5" inputmode="decimal" value="${cleanText(pick.line ?? "")}" data-golf-pick-field="line" data-player-id="${cleanText(pick.id)}" aria-label="Round score line for ${cleanText(pick.name)}">`
    : "—";
  return `<tr>
    <th scope="row"><span class="pick-player-heading">${cleanText(pick.name)}<span class="pick-row-actions">${renderPickLockButton(pick, false, true)}<button type="button" class="pick-remove" data-golf-pick-action="remove-player" data-player-id="${cleanText(pick.id)}" aria-label="Remove ${cleanText(pick.name)} from My Picks">×</button></span></span></th>
    <td><select data-golf-pick-field="market" data-player-id="${cleanText(pick.id)}" aria-label="Bet type for ${cleanText(pick.name)}">${options}</select></td>
    <td>${controls}</td><td>${side}</td><td>${line}</td><td>${cleanText(now)}</td>
    <td class="pick-progress-cell">${renderGolfPickProgress(event, pick, competitor, opponent)}</td>
  </tr>`;
}

function getGolfPickSummary(event, pick) {
  const label = GOLF_PLAYER_BET_OPTIONS.find(([value]) => value === pick.market)?.[1] ?? pick.market;
  if (pick.market === "round-score") {
    const side = pick.direction === "under" ? "Under" : "Over";
    return `R${Number(pick.round) || 1} ${side} ${formatGolfScore(pick.line)} score`;
  }
  if (pick.market === "round-matchup") {
    const opponent = getGolfCompetitor(event, pick.opponentId);
    const opponentName = opponent?.athlete?.displayName || opponent?.athlete?.fullName || "opponent";
    return `R${Number(pick.round) || 1} vs ${opponentName}`;
  }
  return label;
}

function renderLockedGolfPick(event, pick) {
  const competitor = getGolfCompetitor(event, pick.id);
  if (!competitor) return "";
  const opponent = getGolfCompetitor(event, pick.opponentId);
  return `<article class="locked-player-pick">
    <div class="locked-player-pick-heading">
      <strong>${cleanText(pick.name)}</strong>
      <span class="locked-player-pick-actions">
        ${renderPickLockButton(pick, true, true)}
        <button type="button" class="pick-remove" data-golf-pick-action="remove-player" data-player-id="${cleanText(pick.id)}" aria-label="Remove ${cleanText(pick.name)} from My Picks">×</button>
      </span>
    </div>
    <div class="locked-player-pick-market">${cleanText(getGolfPickSummary(event, pick))}</div>
    <div class="locked-player-pick-progress">${renderGolfPickProgress(event, pick, competitor, opponent)}</div>
  </article>`;
}

function renderGolfMyPicks(event, tourKey) {
  const picks = getGolfPicks(tourKey, event.id);
  const lockedPicks = picks.players.filter((pick) => pick.locked);
  const unlockedPicks = picks.players.filter((pick) => !pick.locked);
  const rows = unlockedPicks.map((pick) => renderGolfPickRow(event, pick)).join("");
  const table = rows ? `<div class="my-picks-table-wrap"><table class="my-picks-table golf-my-picks-table">
    <thead><tr><th scope="col">PLAYER</th><th scope="col">BET</th><th scope="col">ROUND / OPPONENT</th><th scope="col">SIDE</th><th scope="col">LINE</th><th scope="col">NOW</th><th scope="col">PROGRESS</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>` : "";
  const lockedCards = lockedPicks.length
    ? `<div class="locked-player-picks">${lockedPicks.map((pick) => renderLockedGolfPick(event, pick)).join("")}</div>`
    : "";
  const error = state.pickStorageError ? `<p class="my-picks-error">${cleanText(state.pickStorageError)}</p>` : "";
  const refreshError = `<p class="my-picks-error" data-golf-pick-refresh-error hidden></p>`;
  return `<section class="my-picks golf-my-picks" data-golf-my-picks${picks.players.length ? "" : " hidden"}>
    <div class="my-picks-heading"><h3>My Picks</h3></div>
    <div class="my-picks-content">${lockedCards}${table}${error}${refreshError}</div>
  </section>`;
}

function renderGolfTournament(event, metadata, metadataError = "", tourLabel = "Golf", tourKey = "pga") {
  golfEventDataCache.set(getGolfPickKey(tourKey, event.id), event);
  const competition = event.competitions?.[0] ?? {};
  const competitors = [...(competition.competitors ?? [])].sort((left, right) =>
    (Number(left.order) || Number.MAX_SAFE_INTEGER) - (Number(right.order) || Number.MAX_SAFE_INTEGER));
  const positionCounts = new Map();
  for (const competitor of competitors) {
    const position = Number(competitor.order);
    if (Number.isFinite(position)) positionCounts.set(position, (positionCounts.get(position) ?? 0) + 1);
  }
  const completed = Boolean(event.status?.type?.completed || competition.status?.type?.completed);
  const courseDetails = getGolfCourseDetails(metadata);
  golfCourseDetailsCache.set(`${tourKey}:${event.id}`, courseDetails);
  const courses = courseDetails.courses.length
    ? courseDetails.courses.map((course) => `<li><strong>${cleanText(course.name)}</strong><span>${course.par ? `Par ${course.par}` : "Par unavailable"}${course.yardage ? ` · ${course.yardage.toLocaleString("en-US")} yards` : ""}</span></li>`).join("")
    : `<li><strong>Course details unavailable</strong></li>`;
  const headers = ["POS", "PLAYER", "SCORE", "R1", "R2", "R3", "R4", "TOT", ...(completed ? ["EARNINGS"] : []), "SCORECARD"];
  const headerCells = headers.map((header) => `<th scope="col">${header}</th>`).join("");
  const playerRows = competitors.map((competitor) => {
    const rounds = getGolfRounds(competitor);
    if (!completed && event.status?.type?.state === "pre" && !rounds.length) {
      rounds.push({ period: 1, value: null, displayValue: "—", linescores: [] });
    }
    const selectedRound = rounds[rounds.length - 1];
    const roundTotal = rounds.reduce((total, round) => total + (Number(round.value) || 0), 0);
    const playerId = String(competitor.id ?? competitor.athlete?.id ?? "");
    const order = Number(competitor.order);
    const position = Number.isFinite(order)
      ? `${positionCounts.get(order) > 1 ? "T" : ""}${order}`
      : "—";
    const name = competitor.athlete?.displayName || competitor.athlete?.fullName || "Player";
    const isPicked = Boolean(state.picks[getGolfPickKey(tourKey, event.id)]?.players?.some((pick) => String(pick.id) === playerId));
    const roundScores = [1, 2, 3, 4].map((period) => {
      const round = rounds.find((entry) => Number(entry.period) === period);
      return `<td>${cleanText(formatGolfScore(round?.displayValue))}</td>`;
    }).join("");
    const roundControls = rounds.map((round) => {
      const period = Number(round.period);
      const selected = period === Number(selectedRound?.period);
      return `<button type="button" class="golf-round-button${selected ? " selected" : ""}" data-golf-action="round" data-round="${period}" aria-pressed="${selected}">R${period}</button>`;
    }).join("");
    const roundTotals = rounds.map((round) => {
      const period = Number(round.period);
      const selected = period === Number(selectedRound?.period);
      const score = formatGolfScore(round.displayValue);
      const strokes = round.value != null && round.value !== "" && Number.isFinite(Number(round.value))
        ? ` (${Number(round.value)})`
        : "";
      return `<span class="golf-round-total" data-round-total="${period}"${selected ? "" : " hidden"}>Round ${period} Total: ${cleanText(score)}${strokes}</span>`;
    }).join("");
    const scorecards = rounds.map((round) => {
      const selected = Number(round.period) === Number(selectedRound?.period);
      const course = courseDetails.courses.find((item) => String(item.id) === String(round.courseId))
        ?? courseDetails.courses[0];
      return `<div class="golf-scorecard" data-scorecard-round="${Number(round.period)}" data-round-data="${cleanText(JSON.stringify(round))}"${selected ? "" : " hidden"}>${renderGolfScorecard(round, course)}</div>`;
    }).join("");
    return `<tbody class="golf-player-group${isPicked ? " is-starred" : ""}" data-golf-player-id="${cleanText(playerId)}">
      <tr class="golf-player-row">
        <td>${cleanText(position)}</td>
        <th scope="row"><span class="player-pick-cell">${cleanText(name)}<button type="button" class="player-star-button golf-player-star${isPicked ? " is-picked" : ""}" data-golf-pick-action="toggle-player" data-player-id="${cleanText(playerId)}" data-player-name="${cleanText(name)}" aria-label="${isPicked ? "Remove" : "Add"} ${cleanText(name)} ${isPicked ? "from" : "to"} My Picks" aria-pressed="${isPicked}">${isPicked ? "★" : "☆"}</button></span></th>
        <td class="golf-score-value">${cleanText(formatGolfScore(competitor.score))}</td>
        ${roundScores}<td>${roundTotal || "—"}</td>
        ${completed ? `<td data-golf-earning-player-id="${cleanText(playerId)}">Loading…</td>` : ""}
        <td><button type="button" class="golf-player-toggle" data-golf-action="toggle-player" data-golf-player-id="${cleanText(playerId)}" aria-label="Show scorecard for ${cleanText(name)}" aria-expanded="false">+</button></td>
      </tr>
      <tr class="golf-player-details-row" hidden><td colspan="${headers.length}">
        ${rounds.length
          ? `<div class="golf-round-toolbar"><div class="golf-round-controls" role="group" aria-label="Scorecard round for ${cleanText(name)}">${roundControls}</div><div class="golf-round-totals">${roundTotals}</div></div>${scorecards}`
          : `<p class="golf-no-scorecard">Hole-by-hole scores will appear when available.</p>`}
      </td></tr>
    </tbody>`;
  }).join("");
  const purse = formatGolfMoney(metadata?.purse, metadata?.displayPurse);
  const eventStatus = event.status?.type?.description || competition.status?.type?.description || "";
  return `<article class="golf-tournament" data-golf-event-id="${cleanText(event.id)}" data-golf-tour-key="${cleanText(tourKey)}">
    <header class="golf-tournament-header">
      <div><p class="golf-tournament-eyebrow">${cleanText(eventStatus || (completed ? "Final" : tourLabel))}</p><h3>${cleanText(event.name || "Golf Tournament")}</h3></div>
    </header>
    <div class="golf-tournament-info">
      <div class="golf-info-item"><span>DATES</span><strong>${cleanText(formatGolfTournamentDates(event))}</strong></div>
      <div class="golf-info-item"><span>COURSE</span><ul>${courses}</ul></div>
      <div class="golf-info-item"><span>LOCATION</span><strong>${cleanText(courseDetails.location || "Location unavailable")}</strong></div>
      <div class="golf-info-item"><span>PURSE</span><strong>${cleanText(purse)}</strong></div>
    </div>
    ${renderGolfMyPicks(event, tourKey)}
    ${metadataError ? `<p class="golf-data-note error">${cleanText(`Tournament details could not be loaded: ${metadataError}`)}</p>` : ""}
    <div class="golf-leaderboard-scroll">
      <table class="golf-leaderboard">
        <thead><tr>${headerCells}</tr></thead>
        ${playerRows || `<tbody><tr><td class="golf-empty-cell" colspan="${headers.length}">Leaderboard is not available yet.</td></tr></tbody>`}
      </table>
    </div>
    ${completed ? `<p class="golf-data-note" data-golf-earnings-note hidden></p>` : ""}
  </article>`;
}

function fetchGolfTournamentEarnings(event, tourKey) {
  const eventId = String(event.id);
  const tour = GOLF_TOURS[tourKey];
  if (!tour?.apiLeague) throw new Error(`${tour?.label ?? "This tour"} is not available in ESPN's public golf API.`);
  const cacheKey = `${tourKey}:${eventId}`;
  if (!golfEarningsCache.has(cacheKey)) {
    const competitors = event.competitions?.[0]?.competitors ?? [];
    const earnings = new Map();
    let failures = 0;
    let nextIndex = 0;
    const workerCount = Math.min(10, competitors.length);
    const request = Promise.all(Array.from({ length: workerCount }, async () => {
      while (nextIndex < competitors.length) {
        const competitor = competitors[nextIndex];
        nextIndex += 1;
        const playerId = String(competitor.id ?? competitor.athlete?.id ?? "");
        if (!playerId) continue;
        try {
          const url = `${GOLF_CORE_API_ROOT}/${encodeURIComponent(tour.apiLeague)}/events/${encodeURIComponent(eventId)}/competitions/${encodeURIComponent(eventId)}/competitors/${encodeURIComponent(playerId)}/statistics/0?lang=en&region=us`;
          const response = await fetch(url, { headers: { Accept: "application/json" } });
          if (!response.ok) throw new Error(`Player earnings returned HTTP ${response.status}`);
          const data = await response.json();
          const stats = (data.splits?.categories ?? []).flatMap((category) => category.stats ?? []);
          const amount = stats.find((stat) => stat.name === "officialAmount")
            ?? stats.find((stat) => stat.name === "amount" || stat.abbreviation === "EARNINGS");
          earnings.set(playerId, amount ? formatGolfMoney(amount.value, amount.displayValue) : "—");
        } catch {
          failures += 1;
          earnings.set(playerId, "—");
        }
      }
    })).then(() => ({ earnings, failures }));
    golfEarningsCache.set(cacheKey, request);
    request.catch(() => golfEarningsCache.delete(cacheKey));
  }
  return golfEarningsCache.get(cacheKey);
}

function loadGolfTournamentEarnings(event, tourKey) {
  fetchGolfTournamentEarnings(event, tourKey).then(({ earnings, failures }) => {
    const tournament = elements.scoreList.querySelector(`[data-golf-event-id="${cleanText(event.id)}"]`);
    if (!tournament) return;
    for (const cell of tournament.querySelectorAll("[data-golf-earning-player-id]")) {
      cell.textContent = earnings.get(cell.dataset.golfEarningPlayerId) ?? "—";
    }
    const note = tournament.querySelector("[data-golf-earnings-note]");
    if (note && failures) {
      note.hidden = false;
      note.textContent = `Earnings could not be loaded for ${failures} player${failures === 1 ? "" : "s"}.`;
    }
  }).catch((error) => {
    const tournament = elements.scoreList.querySelector(`[data-golf-event-id="${cleanText(event.id)}"]`);
    const note = tournament?.querySelector("[data-golf-earnings-note]");
    if (note) {
      note.hidden = false;
      note.textContent = `Earnings could not be loaded: ${error.message}`;
      note.classList.add("error");
    }
  });
}

function bindGolfLeaderboardInteractions() {
  elements.scoreList.querySelectorAll('[data-golf-action="toggle-player"]').forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".golf-player-group");
      const detailsRow = group?.querySelector(".golf-player-details-row");
      if (!detailsRow) return;
      detailsRow.hidden = !detailsRow.hidden;
      const expanded = !detailsRow.hidden;
      button.setAttribute("aria-expanded", String(expanded));
      button.setAttribute("aria-label", `${expanded ? "Hide" : "Show"} scorecard for ${group.querySelector(".golf-player-row th").textContent}`);
      if (expanded && button.dataset.courseLookup !== "loaded") {
        loadGolfPlayerCourseAssignments(button).catch((error) => {
          button.dataset.courseLookup = "";
          const detailsCell = detailsRow.querySelector("td");
          detailsCell?.insertAdjacentHTML("beforeend", `<p class="golf-data-note error">${cleanText(`Player course details could not be loaded: ${error.message}`)}</p>`);
        });
      }
    });
  });
  elements.scoreList.querySelectorAll('[data-golf-action="round"]').forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".golf-player-group");
      const detailsRow = button.closest(".golf-player-details-row");
      if (!group || !detailsRow) return;
      const round = button.dataset.round;
      detailsRow.querySelectorAll(".golf-round-button").forEach((roundButton) => {
        const selected = roundButton === button;
        roundButton.classList.toggle("selected", selected);
        roundButton.setAttribute("aria-pressed", String(selected));
      });
      detailsRow.querySelectorAll(".golf-scorecard").forEach((scorecard) => {
        scorecard.hidden = scorecard.dataset.scorecardRound !== round;
      });
      detailsRow.querySelectorAll(".golf-round-total").forEach((total) => {
        total.hidden = total.dataset.roundTotal !== round;
      });
    });
  });
}

function updateGolfMyPicks(tournament, event) {
  const section = tournament.querySelector("[data-golf-my-picks]");
  if (!section) return;
  section.outerHTML = renderGolfMyPicks(event, tournament.dataset.golfTourKey);
}

function updateGolfLeaderboardRows(tournament, event) {
  const competitors = event.competitions?.[0]?.competitors ?? [];
  const positionCounts = new Map();
  for (const competitor of competitors) {
    const position = Number(competitor.order);
    if (Number.isFinite(position)) positionCounts.set(position, (positionCounts.get(position) ?? 0) + 1);
  }
  for (const competitor of competitors) {
    const playerId = String(competitor.id ?? competitor.athlete?.id ?? "");
    const group = [...tournament.querySelectorAll(".golf-player-group")]
      .find((item) => item.dataset.golfPlayerId === playerId);
    if (!group) continue;
    const cells = group.querySelectorAll(".golf-player-row td");
    const order = Number(competitor.order);
    cells[0].textContent = Number.isFinite(order)
      ? `${positionCounts.get(order) > 1 ? "T" : ""}${order}`
      : "—";
    cells[1].textContent = formatGolfScore(competitor.score);
    const rounds = getGolfRounds(competitor);
    for (let period = 1; period <= 4; period += 1) {
      const round = rounds.find((entry) => Number(entry.period) === period);
      cells[period + 1].textContent = formatGolfScore(round?.displayValue);
    }
    const total = rounds.reduce((sum, round) => sum + (Number(round.value) || 0), 0);
    cells[6].textContent = rounds.length ? String(total) : "—";
  }
}

function handleGolfPickAction(event) {
  const button = event.target.closest("[data-golf-pick-action]");
  const tournament = button?.closest(".golf-tournament");
  if (!button || !tournament) return;
  const eventId = tournament.dataset.golfEventId;
  const tourKey = tournament.dataset.golfTourKey;
  const picks = getGolfPicks(tourKey, eventId);
  const playerId = button.dataset.playerId;
  const existingIndex = picks.players.findIndex((pick) => String(pick.id) === playerId);
  if (button.dataset.golfPickAction === "toggle-player" && existingIndex < 0) {
    const golfEvent = golfEventDataCache.get(getGolfPickKey(tourKey, eventId));
    const opponent = (golfEvent?.competitions?.[0]?.competitors ?? [])
      .find((competitor) => String(competitor.id ?? competitor.athlete?.id ?? "") !== playerId);
    picks.players.push({
      id: playerId,
      name: button.dataset.playerName,
      market: "winner",
      round: 1,
      direction: "over",
      line: "",
      opponentId: opponent ? String(opponent.id ?? opponent.athlete?.id ?? "") : "",
    });
  } else if (button.dataset.golfPickAction === "toggle-lock-player") {
    if (existingIndex < 0) return;
    picks.players[existingIndex].locked = !picks.players[existingIndex].locked;
  } else if (button.dataset.golfPickAction === "remove-player") {
    const pick = picks.players[existingIndex];
    if (pick?.locked && !window.confirm(`Are you sure you want to delete ${pick.name} from My Picks?`)) return;
    if (existingIndex >= 0) picks.players.splice(existingIndex, 1);
  } else if (button.dataset.golfPickAction === "toggle-player") {
    if (existingIndex >= 0) picks.players.splice(existingIndex, 1);
  } else {
    return;
  }
  savePicks();
  tournament.querySelectorAll(".golf-player-star").forEach((star) => {
    if (star.dataset.playerId !== playerId) return;
    const isPicked = picks.players.some((pick) => String(pick.id) === playerId);
    star.closest(".golf-player-group")?.classList.toggle("is-starred", isPicked);
    star.classList.toggle("is-picked", isPicked);
    star.textContent = isPicked ? "★" : "☆";
    star.setAttribute("aria-pressed", String(isPicked));
    star.setAttribute("aria-label", `${isPicked ? "Remove" : "Add"} ${star.dataset.playerName} ${isPicked ? "from" : "to"} My Picks`);
  });
  const golfEvent = golfEventDataCache.get(getGolfPickKey(tourKey, eventId));
  if (golfEvent) updateGolfMyPicks(tournament, golfEvent);
}

function updateGolfPickFromField(tournament, field) {
  const tourKey = tournament.dataset.golfTourKey;
  const eventId = tournament.dataset.golfEventId;
  const playerId = field.dataset.playerId;
  const pick = getGolfPicks(tourKey, eventId).players.find((item) => String(item.id) === playerId);
  if (!pick) return;
  switch (field.dataset.golfPickField) {
    case "market":
      if (!GOLF_PLAYER_BET_OPTIONS.some(([value]) => value === field.value)) return;
      pick.market = field.value;
      break;
    case "round": {
      const round = Number(field.value);
      if (Number.isInteger(round) && round >= 1 && round <= 4) pick.round = round;
      break;
    }
    case "direction":
      pick.direction = field.value === "under" ? "under" : "over";
      break;
    case "line":
      pick.line = field.value;
      break;
    case "opponent":
      if (field.value !== playerId) pick.opponentId = field.value;
      break;
    default:
      return;
  }
  savePicks();
  const golfEvent = golfEventDataCache.get(getGolfPickKey(tourKey, eventId));
  if (golfEvent) updateGolfMyPicks(tournament, golfEvent);
}

async function refreshGolfPickProgress() {
  const tournaments = [...elements.scoreList.querySelectorAll(".golf-tournament")].filter((tournament) => {
    const key = getGolfPickKey(tournament.dataset.golfTourKey, tournament.dataset.golfEventId);
    const golfEvent = golfEventDataCache.get(key);
    const hasPicks = Boolean(state.picks[key]?.players?.length);
    const started = Number.isFinite(Date.parse(golfEvent?.date)) && Date.parse(golfEvent.date) <= Date.now();
    const completed = Boolean(golfEvent?.status?.type?.completed || golfEvent?.competitions?.[0]?.status?.type?.completed);
    return hasPicks && started && !completed;
  });
  if (!tournaments.length) return;
  try {
    const { start, end } = getGolfWeekBounds(state.day);
    const scoreboard = await fetchGolfScoreboard(`${start}-${end}`);
    for (const tournament of tournaments) {
      const eventId = tournament.dataset.golfEventId;
      const updatedEvent = (scoreboard.events ?? []).find((item) => String(item.id) === String(eventId));
      if (!updatedEvent) {
        const errorElement = tournament.querySelector("[data-golf-pick-refresh-error]");
        if (errorElement) {
          errorElement.hidden = false;
          errorElement.textContent = "Could not refresh Golf pick progress: the latest event data was not returned.";
        }
        continue;
      }
      const key = getGolfPickKey(tournament.dataset.golfTourKey, eventId);
      golfEventDataCache.set(key, updatedEvent);
      updateGolfLeaderboardRows(tournament, updatedEvent);
      updateGolfMyPicks(tournament, updatedEvent);
    }
  } catch (error) {
    for (const tournament of tournaments) {
      const errorElement = tournament.querySelector("[data-golf-pick-refresh-error]");
      if (errorElement) {
        errorElement.hidden = false;
        errorElement.textContent = `Could not refresh Golf pick progress: ${error.message}`;
      }
    }
  }
}

function fetchGolfPlayerCourseAssignments(tourKey, eventId, playerId) {
  const key = `${tourKey}:${eventId}:${playerId}`;
  if (!golfCourseAssignmentCache.has(key)) {
    const tour = GOLF_TOURS[tourKey];
    if (!tour?.apiLeague) throw new Error(`${tour?.label ?? "This tour"} is not available in ESPN's public golf API.`);
    const request = fetch(`${GOLF_CORE_API_ROOT}/${encodeURIComponent(tour.apiLeague)}/events/${encodeURIComponent(eventId)}/competitions/${encodeURIComponent(eventId)}/competitors/${encodeURIComponent(playerId)}/linescores?lang=en&region=us`, {
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (!response.ok) throw new Error(`Player course assignments returned HTTP ${response.status}`);
      return response.json();
    }).then((data) => new Map((data.items ?? []).map((round) => [
      Number(round.period),
      String(round.courseId ?? ""),
    ])));
    golfCourseAssignmentCache.set(key, request);
    request.catch(() => golfCourseAssignmentCache.delete(key));
  }
  return golfCourseAssignmentCache.get(key);
}

async function loadGolfPlayerCourseAssignments(button) {
  const tournament = button.closest(".golf-tournament");
  const detailsRow = button.closest(".golf-player-group")?.querySelector(".golf-player-details-row");
  const tourKey = tournament?.dataset.golfTourKey;
  const eventId = tournament?.dataset.golfEventId;
  const playerId = button.dataset.golfPlayerId;
  if (!tournament || !detailsRow || !tourKey || !eventId || !playerId) return;
  const courses = golfCourseDetailsCache.get(`${tourKey}:${eventId}`)?.courses ?? [];
  if (courses.length < 2) {
    button.dataset.courseLookup = "loaded";
    return;
  }
  const assignments = await fetchGolfPlayerCourseAssignments(tourKey, eventId, playerId);
  const courseById = new Map(courses.map((course) => [String(course.id), course]));
  for (const scorecard of detailsRow.querySelectorAll(".golf-scorecard")) {
    const period = Number(scorecard.dataset.scorecardRound);
    const course = courseById.get(assignments.get(period));
    if (!course) continue;
    const round = JSON.parse(scorecard.dataset.roundData);
    scorecard.innerHTML = renderGolfScorecard(round, course);
  }
  button.dataset.courseLookup = "loaded";
}

async function loadGolfScores(sequence) {
  const { start, end } = getGolfWeekBounds(state.day);
  const tourKey = state.golfTour;
  const tour = GOLF_TOURS[tourKey];
  if (!tour?.apiLeague) {
    elements.gameCount.hidden = true;
    elements.scoreList.innerHTML = `<div class="empty-state"><strong>${cleanText(tour?.label ?? "Golf tour")} leaderboard unavailable</strong><p>ESPN's public golf API does not provide a scoreboard for this tour.</p></div>`;
    return;
  }
  elements.gameCount.hidden = true;
  try {
    const scoreboard = await fetchGolfScoreboard(`${start}-${end}`);
    const events = (scoreboard.events ?? []).filter((event) => {
      const eventDate = event.date?.slice(0, 10).replaceAll("-", "");
      return eventDate && eventDate >= start && eventDate <= end;
    }).sort((left, right) => new Date(left.date) - new Date(right.date));
    if (sequence !== state.refreshSequence) return;
    if (!events.length) {
      elements.gameCount.textContent = "";
      elements.scoreList.innerHTML = `<div class="empty-state"><strong>No tournament this week</strong><p>No ${cleanText(tour.label)} event is scheduled between ${cleanText(formatGolfTournamentDate(`${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}`))} and ${cleanText(formatGolfTournamentDate(`${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}`))}.</p></div>`;
      return;
    }
    const tournamentDetails = await Promise.all(events.map(async (event) => {
      try {
        return { event, metadata: await fetchGolfEventMetadata(tourKey, event.id), error: "" };
      } catch (error) {
        return { event, metadata: null, error: error.message };
      }
    }));
    if (sequence !== state.refreshSequence) return;
    elements.scoreList.innerHTML = tournamentDetails
      .map(({ event, metadata, error }) => renderGolfTournament(event, metadata, error, tour.label, tourKey))
      .join("");
    bindGolfLeaderboardInteractions();
    for (const event of events) {
      if (event.status?.type?.completed || event.competitions?.[0]?.status?.type?.completed) {
        loadGolfTournamentEarnings(event, tourKey);
      }
    }
  } catch (error) {
    if (sequence !== state.refreshSequence) return;
    elements.gameCount.textContent = "";
    elements.scoreList.innerHTML = `<div class="error-state">${cleanText(`Golf leaderboard could not be loaded: ${error.message}`)}</div>`;
  }
}

function fetchOddsScoreboard(sportKey, date) {
  const key = `${sportKey}:${date}`;
  if (!scoreboardCache.has(key)) {
    const request = fetchScoreboard(sportKey, date)
      .then((data) => new Map((data.events ?? []).map((event) => [event.id, event])));
    scoreboardCache.set(key, request);
    request.catch(() => scoreboardCache.delete(key));
  }
  return scoreboardCache.get(key);
}

function updateOddsInCard(game) {
  const card = [...elements.scoreList.querySelectorAll(".game-card")].find((item) =>
    item.dataset.sport === game.sportKey && item.dataset.eventId === game.event.id);
  if (!card) return;
  const odds = getOdds(game.event, game.oddsOverride);
  const spread = card.querySelector('[data-odds-field="spread"]');
  const total = card.querySelector('[data-odds-field="total"]');
  if (spread) spread.textContent = odds.spread || "Not available";
  if (total) total.textContent = odds.total || "Not available";
  updateCardBettingData(card, game.event, game.oddsOverride);
  const picks = getGamePicks(card);
  const spreadPick = picks.markets.find((pick) => pick.type === "spread");
  const totalPick = picks.markets.find((pick) => pick.type === "total");
  if (spreadPick && (spreadPick.line == null || spreadPick.line === "")) {
    spreadPick.line = spreadPick.teamId === card.dataset.awayId ? card.dataset.awaySpread : card.dataset.homeSpread;
  }
  if (totalPick && (totalPick.line == null || totalPick.line === "")) totalPick.line = card.dataset.total;
  if (spreadPick || totalPick) savePicks();
  renderMyPicks(card);
}

async function loadMyTeamOdds(games) {
  const byDate = new Map();
  for (const game of games) {
    const eventDate = getScoreboardDateKey(game.event.date);
    if (!eventDate) continue;
    const key = `${game.sportKey}:${eventDate}`;
    if (!byDate.has(key)) byDate.set(key, { sportKey: game.sportKey, date: eventDate, games: [] });
    byDate.get(key).games.push(game);
  }
  const groups = [...byDate.values()];
  const batchSize = 6;
  for (let index = 0; index < groups.length; index += batchSize) {
    const batch = groups.slice(index, index + batchSize);
    const results = await Promise.allSettled(batch.map(({ sportKey, date }) => fetchOddsScoreboard(sportKey, date)));
    results.forEach((result, resultIndex) => {
      const group = batch[resultIndex];
      if (result.status === "fulfilled") {
        for (const game of group.games) {
          const scoreboardEvent = result.value.get(game.event.id);
          game.oddsOverride = scoreboardEvent ? getCompetition(scoreboardEvent).odds?.[0] ?? scoreboardEvent.odds?.[0] : undefined;
          updateOddsInCard(game);
        }
      } else {
        for (const game of group.games) {
          const card = [...elements.scoreList.querySelectorAll(".game-card")].find((item) =>
            item.dataset.sport === game.sportKey && item.dataset.eventId === game.event.id);
          for (const field of card?.querySelectorAll("[data-odds-field]") ?? []) {
            field.textContent = "Could not load";
            field.title = result.reason.message;
          }
        }
      }
    });
  }
}

async function fetchNFLWeek(daySelection) {
  const dates = getNFLSlateDates(daySelection);
  const dailyResults = await Promise.all(dates.map((date) => fetchScoreboard("NFL", date)));
  const uniqueEvents = new Map();
  dailyResults.forEach((data) => {
    for (const event of data.events ?? []) uniqueEvents.set(event.id, event);
  });
  return [...uniqueEvents.values()].map((event) => ({ event, sportKey: "NFL" }));
}

async function fetchMyTeamSchedule(sportKey, fromDate) {
  const sport = SPORTS[sportKey];
  const season = getScheduleSeason(sportKey, fromDate);
  const response = await fetch(`${API_ROOT}/${sport.path}/teams/${sport.teamId}/schedule?season=${season}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${sport.label} schedule returned HTTP ${response.status}`);
  const data = await response.json();
  return (data.events ?? [])
    .filter((event) => {
      const eventDate = getCentralDateKey(event.date);
      return eventDate && eventDate >= fromDate;
    })
    .map((event) => ({ event, sportKey }));
}

async function fetchMyTeamResults(sportKey, seasonDate) {
  const sport = SPORTS[sportKey];
  const season = getScheduleSeason(sportKey, seasonDate);
  const response = await fetch(`${API_ROOT}/${sport.path}/teams/${sport.teamId}/schedule?season=${season}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${sport.label} schedule returned HTTP ${response.status}`);
  const data = await response.json();
  return (data.events ?? [])
    .filter((event) => getStatus(event).completed)
    .map((event) => ({ event, sportKey }));
}

function renderGamesByDay(games) {
  const groups = new Map();
  for (const game of games) {
    const dateKey = getCentralDateKey(game.event.date);
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey).push(game);
  }
  return [...groups.entries()].map(([dateKey, dayGames]) => `
    <section class="day-group">
      <h3 class="day-heading">${cleanText(formatDayHeading(dateKey))}</h3>
        <div class="day-games">${dayGames.map(({ event, sportKey, oddsLoading, oddsOverride, periodScoresLoading }) => renderEvent(event, sportKey, oddsLoading, oddsOverride, periodScoresLoading)).join("")}</div>
    </section>
  `).join("");
}

function fetchGameSummary(sportKey, eventId, forceRefresh = false) {
    const key = `${sportKey}:${eventId}`;
    if (forceRefresh) summaryCache.delete(key);
    if (!summaryCache.has(key)) {
      const request = fetch(`${API_ROOT}/${SPORTS[sportKey].path}/summary?event=${encodeURIComponent(eventId)}`, { headers: { Accept: "application/json" } })
        .then((response) => {
          if (!response.ok) throw new Error(`Game summary returned HTTP ${response.status}`);
          return response.json();
        });
      summaryCache.set(key, request);
      request.catch(() => summaryCache.delete(key));
    }
    return summaryCache.get(key);
}

function updatePeriodScores(game, summary) {
    const eventCompetitors = getCompetition(game.event).competitors ?? [];
    const summaryCompetitors = summary.header?.competitions?.[0]?.competitors ?? [];
    let updated = false;
    for (const team of eventCompetitors) {
      const summaryTeam = summaryCompetitors.find((candidate) =>
        (team.id && candidate.id === team.id) || candidate.homeAway === team.homeAway);
      if (!summaryTeam?.linescores?.length) continue;
      team.linescores = summaryTeam.linescores;
      if (summaryTeam.score != null) team.score = summaryTeam.score;
      updated = true;
    }
    return updated;
}

function findGameCard(game) {
    return [...elements.scoreList.querySelectorAll(".game-card")].find((card) =>
      card.dataset.sport === game.sportKey && card.dataset.eventId === game.event.id);
}

async function loadMyTeamPeriodScores(games) {
    let nextIndex = 0;
    const workerCount = Math.min(6, games.length);
    const loadNext = async () => {
      while (nextIndex < games.length) {
        const game = games[nextIndex];
        nextIndex += 1;
        try {
          const summary = await fetchGameSummary(game.sportKey, game.event.id);
          const card = findGameCard(game);
          if (!card) continue;
          const scoreTable = card.querySelector(".score-table-wrap");
          if (updatePeriodScores(game, summary)) {
            if (scoreTable) scoreTable.innerHTML = renderScoreTable(game.event, game.sportKey);
          } else if (scoreTable) {
            scoreTable.insertAdjacentHTML("afterend", `<p class="period-score-message">Period scores are not available for this game.</p>`);
          }
        } catch (error) {
          const card = findGameCard(game);
          const scoreTable = card?.querySelector(".score-table-wrap");
          if (scoreTable) {
            scoreTable.insertAdjacentHTML("afterend", `<p class="period-score-message error">${cleanText(`Could not load period scores: ${error.message}`)}</p>`);
          }
        }
      }
    };
    await Promise.all(Array.from({ length: workerCount }, loadNext));
}

function tabsForSelection(tab) {
  if (tab === "My Teams") return state.myTeamsLeague === "All" ? Object.keys(MY_TEAMS) : [state.myTeamsLeague];
  if (tab === "All") return ALL_TABS;
  return [tab];
}

function updateDateSwitchLabels() {
  const labels = state.tab === "My Teams"
    ? ["Past", "Today+"]
    : state.tab === "NFL" || state.tab === "Golf"
      ? ["Last Week", "This Week"]
      : ["Yesterday", "Today"];
  const dateSwitch = document.querySelector(".date-switch");
  dateSwitch.setAttribute("aria-label", state.tab === "NFL" || state.tab === "Golf"
    ? "Choose game week"
    : state.tab === "My Teams" ? "Choose game time range" : "Choose game date");
  dateSwitch.querySelectorAll("button").forEach((button, index) => {
    button.textContent = labels[index];
  });
}

async function loadScores() {
  const sequence = ++state.refreshSequence;
  const date = getSelectedDate();
  const selectedTabs = tabsForSelection(state.tab);
  updateDateSwitchLabels();
  elements.scoreList.innerHTML = `<div class="loading-state"><span class="loader"></span><span>Checking the scoreboard…</span></div>`;
  elements.gameCount.hidden = state.tab === "Golf";
  elements.gameCount.textContent = "";
  const usesNFLSlate = selectedTabs.includes("NFL");
  const selectedDateLabel = `${state.day === "today" ? "TODAY" : "YESTERDAY"} · ${formatSelectedDate().toUpperCase()}`;
  const golfWeek = state.tab === "Golf" ? getGolfWeekBounds(state.day) : null;
  elements.dateLabel.textContent = state.tab === "Golf"
    ? `${state.day === "yesterday" ? "LAST WEEK" : "THIS WEEK"} · ${golfWeek.start}–${golfWeek.end}`
    : state.tab === "My Teams" && state.day === "today"
    ? `TODAY + UPCOMING · ${formatSelectedDate().toUpperCase()}`
    : state.tab === "My Teams" && state.day === "yesterday"
      ? "PREVIOUS FINALS · THIS SEASON"
    : state.tab === "NFL"
      ? formatNFLSlateLabel()
    : usesNFLSlate
      ? `${selectedDateLabel} · NFL: ${formatCalendarDate(getNFLSlateDates(state.day)[0])}–${formatCalendarDate(getNFLSlateDates(state.day)[4])}`.toUpperCase()
      : selectedDateLabel;
  elements.sectionTitle.textContent = state.tab === "My Teams"
    ? state.myTeamsLeague === "All"
      ? "My Teams - All"
      : `My Teams - ${MY_TEAM_SECTION_TITLES[state.myTeamsLeague]}`
    : state.tab === "All" ? "All Sports"
      : state.tab === "Golf" ? `Golf - ${GOLF_TOURS[state.golfTour].label}` : state.tab;
  elements.sectionHeading.classList.toggle("non-my-teams", state.tab !== "My Teams");
  elements.myTeamFilters.hidden = state.tab !== "My Teams";
  elements.golfTourFilters.hidden = state.tab !== "Golf";
  elements.todayViewSwitch.hidden = state.tab === "Golf" || state.day !== "today";
  elements.sectionKicker.textContent = formatCentralDateTime();

  if (state.tab === "Golf") {
    await loadGolfScores(sequence);
    return;
  }

  const results = await Promise.allSettled(selectedTabs.map(async (sportKey) => {
    const events = state.tab === "My Teams" && state.day === "today"
      ? await fetchMyTeamSchedule(sportKey, date)
      : state.tab === "My Teams" && state.day === "yesterday"
        ? await fetchMyTeamResults(sportKey, getCentralDate())
      : sportKey === "NFL"
        ? await fetchNFLWeek(state.day)
        : (await fetchScoreboard(sportKey, date)).events?.map((event) => ({ event, sportKey })) ?? [];
    return state.tab === "My Teams" ? events.filter(({ event }) => isMyTeamEvent(event, sportKey)) : events;
  }));
  if (sequence !== state.refreshSequence) return;

  const games = [];
  const errors = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") games.push(...result.value);
    else errors.push(`${SPORTS[selectedTabs[index]].label}: ${result.reason.message}`);
  });
  if (state.day === "today" && state.todayView === "tv") {
    for (let index = games.length - 1; index >= 0; index -= 1) {
      if (!isAllowedTVGame(games[index].event)) games.splice(index, 1);
    }
  }
  const sortedGames = games.sort((left, right) => {
    if (state.tab === "My Teams") {
      const direction = state.day === "yesterday" ? -1 : 1;
      return direction * (new Date(left.event.date) - new Date(right.event.date));
    }
    if (state.tab === "NFL") {
      const leftFinal = Boolean(left.event.status?.type?.completed);
      const rightFinal = Boolean(right.event.status?.type?.completed);
      if (leftFinal !== rightFinal) return leftFinal ? 1 : -1;
    } else {
      const liveDifference = Number(getStatus(right.event).isLive) - Number(getStatus(left.event).isLive);
      if (liveDifference) return liveDifference;
    }
    return new Date(left.event.date) - new Date(right.event.date);
  });
  elements.gameCount.textContent = `${sortedGames.length} ${sortedGames.length === 1 ? "GAME" : "GAMES"}`;

  if (sortedGames.length) {
    const loadTeamOdds = state.tab === "My Teams" && state.day === "today";
    const loadTeamPeriodScores = state.tab === "My Teams" && state.day === "yesterday";
    if (loadTeamOdds) {
      for (const game of sortedGames) game.oddsLoading = true;
    }
    if (loadTeamPeriodScores) {
      for (const game of sortedGames) game.periodScoresLoading = true;
    }
    elements.scoreList.innerHTML = state.tab === "My Teams"
      ? renderGamesByDay(sortedGames)
      : sortedGames.map(({ event, sportKey }) => renderEvent(event, sportKey)).join("");
    initializeMyPicks();
    refreshLivePicks();
    if (loadTeamOdds) loadMyTeamOdds(sortedGames);
    if (loadTeamPeriodScores) loadMyTeamPeriodScores(sortedGames);
    elements.scoreList.querySelectorAll("details[data-details-id]").forEach((details) => {
      details.addEventListener("toggle", () => {
        if (details.open && details.dataset.loaded !== "true") {
          details.dataset.loaded = "true";
          loadEventDetails(details);
        }
      });
    });
    if (errors.length) {
      elements.scoreList.insertAdjacentHTML("beforeend", `<div class="stats-error">${cleanText(errors.join(" · "))}</div>`);
    }
  } else if (errors.length === selectedTabs.length) {
    elements.scoreList.innerHTML = `<div class="error-state">${cleanText(errors.join(" · "))}</div>`;
  } else {
    const message = state.day === "today" && state.todayView === "tv"
      ? "No games with the selected TV channels are listed for today."
      : state.tab === "My Teams" && state.day === "yesterday"
      ? "No completed games found for your teams this season."
      : state.tab === "My Teams"
        ? "No games for your teams on this date. Check another day or league."
      : "There are no games scheduled for this league on this date.";
    elements.scoreList.innerHTML = `<div class="empty-state"><strong>No games on the board</strong><p>${cleanText(message)}</p></div>`;
    if (errors.length) elements.scoreList.insertAdjacentHTML("beforeend", `<div class="stats-error">${cleanText(errors.join(" · "))}</div>`);
  }
}

function getPlayerStatGroups(summary) {
  const groups = [];
  for (const teamGroup of summary.boxscore?.players ?? []) {
    const teamName = teamGroup.team?.shortDisplayName || teamGroup.team?.displayName || "Team";
    for (const category of teamGroup.statistics ?? []) {
      const athletes = category.athletes ?? [];
      if (!athletes.length) continue;
      groups.push({
        title: `${teamName} · ${category.name || category.displayName || "Players"}`,
        columns: category.labels ?? [],
        rows: athletes.slice(0, 5).map((athlete) => ({
          name: athlete.athlete?.shortName || athlete.athlete?.displayName || "Player",
          values: athlete.stats ?? [],
        })),
      });
    }
  }
  return groups;
}

function getTeamStatGroups(summary) {
  const teamStats = summary.boxscore?.teams ?? [];
  if (!teamStats.length) return [];
  const first = teamStats[0];
  const second = teamStats[1];
  return (first.statistics ?? []).map((stat, index) => ({
    title: stat.label || stat.name || "Team stats",
    columns: [first.team?.abbreviation || "Team", second?.team?.abbreviation || "Opponent"],
    rows: [{
      name: stat.label || stat.name || "Stat",
      values: [stat.displayValue ?? stat.value ?? "—", second?.statistics?.[index]?.displayValue ?? second?.statistics?.[index]?.value ?? "—"],
    }],
  }));
}

function renderStatsTable(group) {
  const columns = group.columns.slice(0, 4);
  return `<section class="stats-block">
    <h3 class="stats-title">${cleanText(group.title)}</h3>
    <table class="stats-table">
      ${columns.length ? `<thead><tr><th></th>${columns.map((column) => `<th>${cleanText(column)}</th>`).join("")}</tr></thead>` : ""}
      <tbody>${group.rows.map((row) => `<tr><td>${cleanText(row.name)}</td>${row.values.slice(0, 4).map((value) => `<td>${cleanText(value)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  </section>`;
}

const BASKETBALL_PLAYER_COLUMNS = ["MIN", "PTS", "FG", "3PT", "FT", "REB", "AST", "TO", "STL", "BLK", "PF", "+/-"];
const BASKETBALL_AVERAGE_COLUMNS = ["GP", "MIN", "PTS", "FG", "3PT", "FT", "REB", "AST", "TO", "STL", "BLK", "PF"];

function getBasketballTeamOrder(summary) {
  const competitors = summary.header?.competitions?.[0]?.competitors ?? [];
  return new Map(competitors.map((competitor, index) => [
    String(competitor.id ?? competitor.team?.id ?? ""),
    competitor.homeAway === "home" ? 0 : competitor.homeAway === "away" ? 1 : index,
  ]));
}

function getBasketballPlayerCategory(teamGroup) {
  return (teamGroup.statistics ?? []).find((category) => category.athletes?.length) ?? teamGroup.statistics?.[0];
}

function getBasketballPlayerDisplayName(athlete) {
  const player = athlete.athlete ?? {};
  const name = player.shortName || player.displayName || "Player";
  const jersey = player.jersey ? ` #${player.jersey}` : "";
  const position = player.position?.abbreviation ? ` ${player.position.abbreviation}` : "";
  return `${name}${jersey}${position}`;
}

function renderPlayerStarButton(gameKey, teamId, teamName, athlete) {
  const player = athlete.athlete ?? athlete;
  const playerId = String(player.id ?? "");
  const position = player.position?.abbreviation ?? "";
  const isPicked = Boolean(state.picks[gameKey]?.players?.some((pick) => pick.id === playerId));
  return `<button type="button" class="player-star-button${isPicked ? " is-picked" : ""}" data-pick-action="toggle-player" data-player-id="${cleanText(playerId)}" data-player-name="${cleanText(getBasketballPlayerDisplayName({ athlete: player }))}" data-player-position="${cleanText(position)}" data-team-id="${cleanText(teamId)}" data-team-name="${cleanText(teamName)}" aria-label="${isPicked ? "Remove" : "Add"} ${cleanText(getBasketballPlayerDisplayName({ athlete: player }))} ${isPicked ? "from" : "to"} My Picks" aria-pressed="${isPicked}">${isPicked ? "★" : "☆"}</button>`;
}

function getPlayerPropOptions(pick) {
  return FOOTBALL_PLAYER_PROP_OPTIONS[pick.position] ?? PLAYER_PROP_OPTIONS;
}

function getDefaultPlayerProp(position) {
  return FOOTBALL_PLAYER_PROP_OPTIONS[position]?.[0]?.[0] ?? "PTS";
}

function isFootballBinaryProp(market) {
  return market === "FTD";
}

function getBasketballStatValues(category, values) {
  return BASKETBALL_PLAYER_COLUMNS.map((column) => {
    const index = category.labels?.indexOf(column) ?? -1;
    return index >= 0 ? values?.[index] ?? "—" : "—";
  });
}

function renderBasketballPlayerRow(category, athlete, teamGroup, gameKey) {
  const statValues = getBasketballStatValues(category, athlete.stats);
  const teamId = String(teamGroup.team?.id ?? "");
  const teamName = teamGroup.team?.displayName || teamGroup.team?.shortDisplayName || "Team";
  return `<tr>
    <td class="stats-player-name"><span class="player-pick-cell">${cleanText(getBasketballPlayerDisplayName(athlete))}${renderPlayerStarButton(gameKey, teamId, teamName, athlete)}</span></td>
    ${statValues.map((value) => `<td>${cleanText(value)}</td>`).join("")}
  </tr>`;
}

function renderBasketballTeamPlayerTable(teamGroup, teamTotals, gameKey) {
  const category = getBasketballPlayerCategory(teamGroup);
  if (!category) return "";
  const recordedAthletes = (category.athletes ?? []).filter((athlete) => hasRecordedStatValues(athlete.stats));
  const starters = recordedAthletes.filter((athlete) => athlete.starter);
  const bench = recordedAthletes.filter((athlete) => !athlete.starter);
  const headerCells = BASKETBALL_PLAYER_COLUMNS.map((column) => `<th scope="col">${cleanText(column)}</th>`).join("");
  const starterRows = starters.map((athlete) => renderBasketballPlayerRow(category, athlete, teamGroup, gameKey)).join("");
  const benchRows = bench.map((athlete) => renderBasketballPlayerRow(category, athlete, teamGroup, gameKey)).join("");
  const teamValues = getBasketballStatValues(category, category.totals);
  const teamRow = `<tr class="stats-team-total"><th scope="row">TEAM</th>${teamValues.map((value) => `<td>${cleanText(value)}</td>`).join("")}</tr>`;
  const teamName = teamGroup.team?.displayName || teamGroup.team?.shortDisplayName || "Team";
  const homeAway = teamTotals.get(String(teamGroup.team?.id ?? "")) === 0 ? "HOME" : "AWAY";
  return `<section class="basketball-player-team">
    <h3 class="basketball-team-heading">${cleanText(homeAway)} · ${cleanText(teamName)}</h3>
    <div class="basketball-stats-scroll">
      <table class="basketball-stats-table">
        <thead><tr><th scope="col">STARTERS</th>${headerCells}</tr></thead>
        <tbody>
          ${starterRows || `<tr><td colspan="${BASKETBALL_PLAYER_COLUMNS.length + 1}" class="stats-empty-cell">Starter stats unavailable.</td></tr>`}
          <tr class="stats-group-heading"><th scope="col">BENCH</th>${headerCells}</tr>
          ${benchRows || `<tr><td colspan="${BASKETBALL_PLAYER_COLUMNS.length + 1}" class="stats-empty-cell">Bench stats unavailable.</td></tr>`}
          ${teamRow}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderBasketballPlayerStats(summary, sportKey, eventId) {
  const teamGroups = [...(summary.boxscore?.players ?? [])];
  if (!teamGroups.length) return "";
  const teamOrder = getBasketballTeamOrder(summary);
  const displayOrder = getTeamDisplayOrder(summary, sportKey);
  teamGroups.sort((left, right) =>
    (displayOrder.get(String(left.team?.id ?? "")) ?? 2) - (displayOrder.get(String(right.team?.id ?? "")) ?? 2));
  const gameKey = `${sportKey}:${eventId}`;
  return teamGroups.map((teamGroup) => renderBasketballTeamPlayerTable(teamGroup, teamOrder, gameKey)).join("");
}

function readScoreFromCard(card, side) {
  const row = card.querySelector(`.score-row.${side} .score-total`);
  const score = Number.parseFloat(row?.textContent);
  return Number.isFinite(score) ? score : null;
}

function getFootballPlayerCurrentValue(summary, pick, teamGroup) {
  const getEntry = (categoryName) => getFootballStatCategory(teamGroup, categoryName)
    ?.athletes?.find((item) => String(item.athlete?.id ?? "") === String(pick.id));
  const getValue = (categoryName, labels) => {
    const category = getFootballStatCategory(teamGroup, categoryName);
    const athlete = getEntry(categoryName);
    return getFootballLabelValue(category, athlete?.stats, labels);
  };
  const number = (value) => {
    const parsed = Number.parseFloat(String(value ?? "").replaceAll(",", ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const countFromRatio = (value) => {
    const ratio = String(value ?? "").match(/^\s*(\d+)\s*\/\s*\d+/);
    return ratio ? Number(ratio[1]) : number(value);
  };
  const passAttempts = () => {
    const attempts = getValue("passing", ["ATT"]);
    if (attempts != null) return number(attempts);
    return number(String(getValue("passing", ["C/ATT"]) ?? "").split("/")[1]);
  };
  const completions = () => {
    const completed = getValue("passing", ["CMP", "COM"]);
    if (completed != null) return number(completed);
    return number(String(getValue("passing", ["C/ATT"]) ?? "").split("/")[0]);
  };
  const rushingYards = () => number(getValue("rushing", ["YDS"]));
  const receivingYards = () => number(getValue("receiving", ["YDS"]));
  const rushingTouchdowns = () => number(getValue("rushing", ["TD"]));
  const receivingTouchdowns = () => number(getValue("receiving", ["TD"]));
  const scoredInPlay = (typePattern) => {
    const athlete = (teamGroup.statistics ?? []).flatMap((category) => category.athletes ?? [])
      .find((item) => String(item.athlete?.id ?? "") === String(pick.id))?.athlete;
    if (!athlete) return false;
    const names = [athlete.displayName, athlete.shortName].filter(Boolean)
      .map((name) => String(name).toLowerCase().replace(/[^a-z0-9]/g, ""));
    return (summary.scoringPlays ?? []).some((play) => {
      if (String(play.team?.id ?? "") !== String(pick.teamId) ||
        !typePattern.test(String(play.type?.text ?? ""))) return false;
      const scorer = String(play.text ?? "").match(/^(.+?)\s+\d+\s+Yd/i)?.[1];
      return scorer != null && names.includes(scorer.toLowerCase().replace(/[^a-z0-9]/g, ""));
    });
  };
  switch (pick.market) {
    case "FPY": return number(getValue("passing", ["YDS"]));
    case "FPTD": return number(getValue("passing", ["TD"]));
    case "FPA": return passAttempts();
    case "FCMP": return completions();
    case "FINT": return number(getValue("passing", ["INT"]));
    case "FRY": return rushingYards();
    case "FRYREC": return receivingYards();
    case "FRRY": return rushingYards() + receivingYards();
    case "FRATT": return number(getValue("rushing", ["CAR"]));
    case "FREC": return number(getValue("receiving", ["REC"]));
    case "FTOT": return number(getValue("defensive", ["TOT"]));
    case "FFGM": return countFromRatio(getValue("kicking", ["FGM", "FG"]));
    case "FKPTS": return number(getValue("kicking", ["PTS"]));
    case "FPATM": return countFromRatio(getValue("kicking", ["XPM", "XP"]));
    case "FFGYDS": {
      if (!Array.isArray(summary.scoringPlays)) return null;
      const athlete = (teamGroup.statistics ?? []).flatMap((category) => category.athletes ?? [])
        .find((item) => String(item.athlete?.id ?? "") === String(pick.id))?.athlete;
      if (!athlete) return 0;
      const playerNames = [athlete.displayName, athlete.shortName].filter(Boolean)
        .map((name) => String(name).toLowerCase().replace(/[^a-z0-9]/g, ""));
      return summary.scoringPlays.reduce((yards, play) => {
        if (String(play.team?.id ?? "") !== String(pick.teamId)) return yards;
        const match = String(play.text ?? "").match(/^(.+?)\s+(\d+)\s+Yd Field Goal\b/i);
        if (!match) return yards;
        const scorer = match[1].toLowerCase().replace(/[^a-z0-9]/g, "");
        return playerNames.includes(scorer) ? yards + Number(match[2]) : yards;
      }, 0);
    }
    case "FTD":
      return pick.position === "QB"
        ? Number(rushingTouchdowns() > 0 || scoredInPlay(/rushing touchdown/i))
        : Number(rushingTouchdowns() + receivingTouchdowns() > 0 || scoredInPlay(/touchdown/i));
    default: return null;
  }
}

function getPlayerCurrentValue(summary, pick) {
  if (!summary) return null;
  const teamGroup = (summary.boxscore?.players ?? []).find((team) =>
    String(team.team?.id ?? "") === String(pick.teamId));
  if (!teamGroup) return null;
  if (FOOTBALL_PLAYER_PROP_OPTIONS[pick.position]) {
    return getFootballPlayerCurrentValue(summary, pick, teamGroup);
  }
  const athlete = (teamGroup?.statistics ?? []).flatMap((category) => category.athletes ?? [])
    .find((item) => String(item.athlete?.id ?? "") === String(pick.id));
  if (!athlete) return null;
  const category = (teamGroup.statistics ?? []).find((item) =>
    (item.athletes ?? []).some((player) => String(player.athlete?.id ?? "") === String(pick.id)));
  if (!category) return null;
  const statValue = (column) => {
    const index = category.labels?.indexOf(column) ?? -1;
    if (index < 0) return 0;
    const value = athlete.stats?.[index];
    if (value == null || value === "" || value === "--") return 0;
    const parsed = Number.parseFloat(String(value).split("-")[0]);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const points = statValue("PTS");
  const rebounds = statValue("REB");
  const assists = statValue("AST");
  switch (pick.market) {
    case "PTS": return points;
    case "3PT": return statValue("3PT");
    case "REB": return rebounds;
    case "AST": return assists;
    case "PR": return points + rebounds;
    case "PA": return points + assists;
    case "RA": return rebounds + assists;
    case "PRA": return points + rebounds + assists;
    case "SB": return statValue("STL") + statValue("BLK");
    case "BLK": return statValue("BLK");
    case "STL": return statValue("STL");
    case "DD":
    case "TD": return ["PTS", "REB", "AST", "BLK", "STL"].filter((column) => statValue(column) >= 10).length;
    default: return null;
  }
}

function formatPickNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatGameClock(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function getElapsedGameSeconds(card) {
  const sport = SPORTS[card.dataset.sport];
  if (!sport?.periodMinutes) return null;
  const period = Number(card.dataset.gamePeriod);
  const hasPeriod = Number.isFinite(period) && period >= 1;
  const overtimePeriods = hasPeriod ? Math.max(0, period - sport.periods) : 0;
  const overtimeMinutes = sport.overtimeMinutes ?? sport.periodMinutes;
  const regulationSeconds = sport.periods * sport.periodMinutes * 60;
  const gameDurationSeconds = regulationSeconds + overtimePeriods * overtimeMinutes * 60;
  if (card.dataset.completed === "true") return gameDurationSeconds;
  if (card.dataset.upcoming === "true") return 0;
  const clockMatch = String(card.dataset.gameClock ?? "").match(/^(\d+):(\d{1,2})(?:\.\d+)?$/);
  if (!clockMatch || !hasPeriod) return null;
  const remainingSeconds = Number(clockMatch[1]) * 60 + Number(clockMatch[2]);
  const elapsedSeconds = period <= sport.periods
    ? ((period - 1) * sport.periodMinutes * 60) + sport.periodMinutes * 60 - remainingSeconds
    : regulationSeconds + (overtimePeriods - 1) * overtimeMinutes * 60 + overtimeMinutes * 60 - remainingSeconds;
  return Math.max(0, Math.min(gameDurationSeconds, elapsedSeconds));
}

function renderGameElapsedProgress(card) {
  const sport = SPORTS[card.dataset.sport];
  if (!sport?.periodMinutes) return "";
  const period = Number(card.dataset.gamePeriod);
  const overtimePeriods = Number.isFinite(period) && period > sport.periods ? period - sport.periods : 0;
  const overtimeMinutes = sport.overtimeMinutes ?? sport.periodMinutes;
  const totalMinutes = sport.periods * sport.periodMinutes + overtimePeriods * overtimeMinutes;
  const totalSeconds = totalMinutes * 60;
  const elapsedSeconds = getElapsedGameSeconds(card);
  if (elapsedSeconds == null) {
    return `<div class="game-elapsed"><span class="game-elapsed-note">Game elapsed time unavailable</span><span class="pick-progress game-elapsed-track"><span class="pick-progress-fill" style="width:0%"></span></span></div>`;
  }
  const percentage = Math.min(100, elapsedSeconds / totalSeconds * 100);
  const label = `${formatGameClock(elapsedSeconds)} of ${totalMinutes} min. of the game elapsed`;
  return `<div class="game-elapsed"><span class="game-elapsed-note">${label}<span>${Number(percentage.toFixed(1))}%</span></span><span class="pick-progress game-elapsed-track"><span class="pick-progress-fill game-elapsed-fill" style="width:${percentage}%"></span></span></div>`;
}

function renderPickProgress({ current, line, direction = "over", isFinal = false, upcoming = false, milestone = 0, milestoneName = "", binary = false, loadingStats = false }) {
  const notStarted = upcoming && (current == null || current === 0);
  if (current == null && loadingStats && !binary && !milestone) {
    const target = Number(line);
    const hasTarget = line != null && line !== "" && Number.isFinite(target);
    const label = hasTarget
      ? `0 / ${formatPickNumber(target)} to ${direction} · Loading live stats...`
      : "Loading live stats...";
    return `<span class="pick-progress-note">${label}</span><span class="pick-progress"><span class="pick-progress-fill" style="width:0%"></span></span>`;
  }
  if (current == null && !upcoming) {
    return `<span class="pick-progress-note">${upcoming ? "Not started" : "Live stats unavailable"}</span>`;
  }
  const progressValue = current ?? 0;
  if (binary) {
    const scored = progressValue > 0;
    const percentage = notStarted ? 0 : scored ? 100 : 0;
    const result = notStarted ? "0% · Not started" : isFinal ? scored ? "TD scored" : "No TD" : scored ? "TD scored" : "No TD yet";
    return `<span class="pick-progress-note">${result}</span><span class="pick-progress"><span class="pick-progress-fill${isFinal && !scored ? " is-missed" : ""}" style="width:${percentage}%"></span></span>`;
  }
  if (milestone) {
    const percentage = notStarted ? 0 : Math.min(100, progressValue / milestone * 100);
    const result = notStarted
      ? `0 of ${milestone} categories`
      : isFinal ? progressValue >= milestone ? milestoneName : `No ${milestoneName.toLowerCase()}` : `${progressValue}/${milestone} categories at 10+`;
    return `<span class="pick-progress-note">${result}</span><span class="pick-progress"><span class="pick-progress-fill${isFinal && current < 2 ? " is-missed" : ""}" style="width:${percentage}%"></span></span>`;
  }
  const target = Number(line);
  if (line == null || line === "" || !Number.isFinite(target)) {
    return notStarted
      ? `<span class="pick-progress-note">0 · Set a line</span><span class="pick-progress"><span class="pick-progress-fill" style="width:0%"></span></span>`
      : `<span class="pick-progress-note">${formatPickNumber(progressValue)} · Set a line</span>`;
  }
  if (notStarted) {
    return `<span class="pick-progress-note">0 of ${formatPickNumber(target)} goal</span><span class="pick-progress"><span class="pick-progress-fill" style="width:0%"></span></span>`;
  }
  const percentage = target > 0
    ? direction === "under" ? Math.max(0, 100 - progressValue / target * 100) : Math.min(100, progressValue / target * 100)
    : direction === "under" ? 0 : progressValue > 0 ? 100 : 0;
  const met = direction === "under" ? progressValue < target : progressValue > target;
  const tied = progressValue === target;
  const status = isFinal
    ? met ? "Won" : tied ? "Push" : "Lost"
    : direction === "under"
      ? met ? `${formatPickNumber(target - progressValue)} below line` : "Line passed"
      : met ? "Line passed" : `${formatPickNumber(progressValue)} / ${formatPickNumber(target)} to over`;
  const missed = direction === "under" ? progressValue >= target : progressValue <= target;
  return `<span class="pick-progress-note">${status}</span><span class="pick-progress"><span class="pick-progress-fill${isFinal && !met && !tied || !isFinal && missed ? " is-missed" : ""}" style="width:${percentage}%"></span></span>`;
}

function isBasketballPickCard(card) {
  return ["NBA", "NCAAM", "NCAAW", "WNBA"].includes(card.dataset.sport);
}

function isFootballPickCard(card) {
  return ["NFL", "NCAAF"].includes(card.dataset.sport);
}

function supportsPlayerPickLock(card) {
  return isBasketballPickCard(card) || isFootballPickCard(card);
}

function renderGamePickProgress(card, progress) {
  return supportsPlayerPickLock(card)
    ? `<div class="game-pick-progress-stack">${progress}${renderGameElapsedProgress(card)}</div>`
    : progress;
}

function renderPickLockButton(pick, locked, golf = false, marketType = "") {
  const action = locked ? "Unlock" : "Lock";
  const actionAttribute = golf ? "data-golf-pick-action" : "data-pick-action";
  const actionName = marketType ? "toggle-lock-market" : "toggle-lock-player";
  const actionTarget = marketType ? `data-market-type="${cleanText(marketType)}"` : `data-player-id="${cleanText(pick.id)}"`;
  return `<button type="button" class="pick-lock${locked ? " is-locked" : ""}" ${actionAttribute}="${actionName}" ${actionTarget} aria-label="${action} ${cleanText(pick.name ?? marketType)}" title="${action} pick">
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"></rect><path d="${locked ? "M8 10V7a4 4 0 0 1 8 0v3" : "M8 10V7a4 4 0 0 1 7.5-1.8"}"></path></svg>
  </button>`;
}

function renderBasketballPickSummary(pick) {
  const labels = {
    PTS: "Pts", "3PT": "3PT", REB: "Reb", AST: "Ast", PR: "Pts + Reb",
    PA: "Pts + Ast", RA: "Reb + Ast", PRA: "Pts + Reb + Ast", SB: "Steals + Blocks",
    BLK: "Blocks", STL: "Steals", DD: "Double-Double", TD: "Triple-Double",
  };
  if (pick.market === "DD" || pick.market === "TD") return labels[pick.market];
  const side = pick.direction === "under" ? "Under" : "Over";
  const line = pick.line === "" || pick.line == null ? "—" : formatPickNumber(Number(pick.line));
  return `${side} ${line} ${labels[pick.market] ?? pick.market}`;
}

function getGamePlayerPickSummary(pick) {
  const options = getPlayerPropOptions(pick);
  const marketLabel = options.find(([value]) => value === pick.market)?.[1] ?? pick.market;
  if (isFootballBinaryProp(pick.market)) return `${marketLabel}`;
  const side = pick.direction === "under" ? "Under" : "Over";
  const line = pick.line === "" || pick.line == null ? "—" : formatPickNumber(Number(pick.line));
  return `${side} ${line} ${marketLabel}`;
}

function renderLockedGamePlayerPick(card, pick, summary) {
  const current = getPlayerCurrentValue(summary, pick);
  const binary = isFootballBinaryProp(pick.market);
  const milestone = pick.market === "DD" ? 2 : pick.market === "TD" ? 3 : 0;
  const milestoneName = pick.market === "DD" ? "Double-double" : "Triple-double";
  const loadingStats = isBasketballPickCard(card)
    && current == null && card.dataset.upcoming !== "true" && card.dataset.completed !== "true";
  const progress = renderPickProgress({
    current,
    line: pick.line,
    direction: pick.direction,
    isFinal: card.dataset.completed === "true",
    upcoming: card.dataset.upcoming === "true",
    milestone,
    milestoneName,
    binary,
    loadingStats,
  });
  const playerSummary = isBasketballPickCard(card)
    ? renderBasketballPickSummary(pick)
    : getGamePlayerPickSummary(pick);
  return `<article class="locked-player-pick">
    <div class="locked-player-pick-heading">
      <strong>${cleanText(pick.name)}</strong>
      <span class="locked-player-pick-actions">
        ${renderPickLockButton(pick, true)}
        <button type="button" class="pick-remove" data-pick-action="remove-player" data-player-id="${cleanText(pick.id)}" aria-label="Remove ${cleanText(pick.name)} from My Picks">×</button>
      </span>
    </div>
    <div class="locked-player-pick-market">${cleanText(playerSummary)}</div>
    <div class="locked-player-pick-progress">${renderGamePickProgress(card, progress)}</div>
  </article>`;
}

function renderPlayerPickRow(card, pick, summary) {
  const marketOptions = getPlayerPropOptions(pick).map(([value, label]) =>
    `<option value="${value}"${pick.market === value ? " selected" : ""}>${label}</option>`).join("");
  const binary = isFootballBinaryProp(pick.market);
  const milestone = pick.market === "DD" ? 2 : pick.market === "TD" ? 3 : 0;
  const milestoneName = pick.market === "DD" ? "Double-double" : "Triple-double";
  const current = getPlayerCurrentValue(summary, pick);
  const loadingStats = isBasketballPickCard(card)
    && current == null && card.dataset.upcoming !== "true" && card.dataset.completed !== "true";
  const currentLabel = current == null ? loadingStats ? "0" : "—" : binary ? `${current > 0 ? 100 : 0}%` : milestone ? `${current}/${milestone}` : formatPickNumber(current);
  const lockButton = supportsPlayerPickLock(card) ? renderPickLockButton(pick, false) : "";
  return `<tr>
    <th scope="row"><span class="pick-player-heading">${cleanText(pick.name)}<span class="pick-row-actions">${lockButton}<button type="button" class="pick-remove" data-pick-action="remove-player" data-player-id="${cleanText(pick.id)}" aria-label="Remove ${cleanText(pick.name)} from My Picks">×</button></span></span></th>
    <td><select data-pick-field="player-market" data-player-id="${cleanText(pick.id)}" aria-label="Bet type for ${cleanText(pick.name)}">${marketOptions}</select></td>
    <td>${milestone ? `${milestone}+` : binary ? "—" : `<select data-pick-field="player-direction" data-player-id="${cleanText(pick.id)}" aria-label="Over or under for ${cleanText(pick.name)}"><option value="over"${pick.direction !== "under" ? " selected" : ""}>Over</option><option value="under"${pick.direction === "under" ? " selected" : ""}>Under</option></select>`}</td>
    <td>${milestone || binary ? "—" : `<input type="number" min="0" step="0.5" inputmode="decimal" value="${cleanText(pick.line ?? "")}" data-pick-field="player-line" data-player-id="${cleanText(pick.id)}" aria-label="Stat line for ${cleanText(pick.name)}">`}</td>
    <td>${currentLabel}</td>
    <td class="pick-progress-cell">${renderGamePickProgress(card, renderPickProgress({ current, line: pick.line, direction: pick.direction, isFinal: card.dataset.completed === "true", upcoming: card.dataset.upcoming === "true", milestone, milestoneName, binary, loadingStats }))}</td>
  </tr>`;
}

function getSpreadChartElapsedSeconds(sportKey, periodValue, clockValue) {
  const sport = SPORTS[sportKey];
  if (!sport?.periodMinutes) return null;
  const period = Number(periodValue);
  if (!Number.isFinite(period) || period < 1) return null;
  const clockMatch = String(clockValue ?? "").match(/^(\d+):(\d{1,2})(?:\.\d+)?$/);
  if (!clockMatch) return null;
  const remainingSeconds = Number(clockMatch[1]) * 60 + Number(clockMatch[2]);
  const regulationSeconds = sport.periods * sport.periodMinutes * 60;
  if (period <= sport.periods) {
    return ((period - 1) * sport.periodMinutes * 60)
      + Math.max(0, sport.periodMinutes * 60 - remainingSeconds);
  }
  const overtimeMinutes = sport.overtimeMinutes ?? sport.periodMinutes;
  return regulationSeconds
    + (period - sport.periods - 1) * overtimeMinutes * 60
    + Math.max(0, overtimeMinutes * 60 - remainingSeconds);
}

function renderSpreadChart(card, pick) {
  const sport = SPORTS[card.dataset.sport];
  const teamId = String(pick.teamId);
  const selectedIsHome = teamId === card.dataset.homeId;
  const spreadLine = Number(pick.line);
  const hasSpreadLine = pick.line != null && pick.line !== "" && Number.isFinite(spreadLine);
  const isFavorite = hasSpreadLine && spreadLine < 0;
  const summary = card.latestSummary;
  const plays = isBasketballPickCard(card)
    ? summary?.plays ?? []
    : summary?.scoringPlays ?? [];
  const chartPoints = [];
  if (summary && plays.length) chartPoints.push({ elapsed: 0, margin: 0 });
  for (const play of plays) {
    if (isBasketballPickCard(card) && !play.scoringPlay) continue;
    const homeScore = Number(play.homeScore);
    const awayScore = Number(play.awayScore);
    if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) continue;
    const elapsed = getSpreadChartElapsedSeconds(
      card.dataset.sport,
      play.period?.number,
      play.clock?.displayValue,
    );
    if (elapsed == null) continue;
    const selectedScore = selectedIsHome ? homeScore : awayScore;
    const opponentScore = selectedIsHome ? awayScore : homeScore;
    const scoreMargin = selectedScore - opponentScore;
    chartPoints.push({ elapsed, margin: isFavorite ? -scoreMargin : scoreMargin });
  }

  const regulationSeconds = sport.periods * sport.periodMinutes * 60;
  const currentElapsed = card.dataset.completed === "true"
    ? Math.max(regulationSeconds, ...chartPoints.map((point) => point.elapsed))
    : getSpreadChartElapsedSeconds(card.dataset.sport, card.dataset.gamePeriod, card.dataset.gameClock);
  const currentScore = readScoreFromCard(card, selectedIsHome ? "home" : "away");
  const opponentScore = readScoreFromCard(card, selectedIsHome ? "away" : "home");
  const scoreMargin = currentScore == null || opponentScore == null ? null : currentScore - opponentScore;
  const currentMargin = scoreMargin == null ? null : isFavorite ? -scoreMargin : scoreMargin;
  const lastPoint = chartPoints[chartPoints.length - 1];
  if (currentElapsed != null && currentMargin != null
    && (!lastPoint || lastPoint.margin !== currentMargin || currentElapsed !== lastPoint.elapsed || card.dataset.completed === "true")) {
    chartPoints.push({ elapsed: currentElapsed, margin: currentMargin });
  } else if (!chartPoints.length && card.dataset.upcoming === "true") {
    chartPoints.push({ elapsed: 0, margin: 0 });
  }

  const duration = Math.max(regulationSeconds, ...chartPoints.map((point) => point.elapsed));
  const width = 340;
  const height = 88;
  const left = 48;
  const right = 332;
  const top = 18;
  const bottom = 70;
  const chartKey = `${card.dataset.sport}:${card.dataset.eventId}:${teamId}`;
  const range = spreadChartRanges.get(chartKey) ?? 15;
  const mapY = (value) => top + ((isFavorite ? range + value : range - value) / (range * 2)) * (bottom - top);
  const mapX = (value) => left + Math.max(0, Math.min(1, value / duration)) * (right - left);
  const ticks = isFavorite ? [-range, 0, range] : [range, 0, -range];
  const grid = ticks.map((value, index) => {
    const y = mapY(value);
    const position = index === 0 ? "top" : index === 2 ? "bottom" : "middle";
    const tickLabel = value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0";
    const tickY = position === "top" ? y - 2 : position === "bottom" ? y + 6 : y + 3;
    return `<line x1="6" y1="${y}" x2="${right}" y2="${y}" class="spread-chart-grid"/><text x="9" y="${tickY}" class="spread-chart-tick spread-chart-y-tick" data-spread-chart-tick="${position}" text-anchor="end">${tickLabel}</text>`;
  }).join("");
  const line = hasSpreadLine
    ? `<line x1="6" y1="${mapY(spreadLine)}" x2="${right}" y2="${mapY(spreadLine)}" class="spread-chart-line"/><text x="${right - 2}" y="${mapY(spreadLine) - 3}" class="spread-chart-line-label" text-anchor="end">${spreadLine > 0 ? "+" : ""}${formatPickNumber(spreadLine)}</text>`
    : "";
  const points = chartPoints
    .sort((a, b) => a.elapsed - b.elapsed)
    .map((point) => `${mapX(point.elapsed)},${mapY(point.margin)}`)
    .join(" ");
  const dots = chartPoints.map((point) =>
    `<circle cx="${mapX(point.elapsed)}" cy="${mapY(point.margin)}" r="1.25" class="spread-chart-dot"/>`).join("");
  const halfTime = duration / 2;
  const midpointLabel = `${Math.round(halfTime / 60)} min`;
  const endLabel = `${Math.round(duration / 60)} min`;
  const statusLabel = !summary && card.dataset.live === "true"
    ? "Loading scoring timeline..."
    : card.dataset.upcoming === "true" ? "Game not started"
      : currentMargin == null ? "Score timeline unavailable"
        : `Current margin ${currentMargin > 0 ? "+" : ""}${formatPickNumber(currentMargin)}`;
  const spreadLabel = hasSpreadLine
    ? `Spread line ${spreadLine > 0 ? "+" : ""}${formatPickNumber(spreadLine)}`
    : "Set a spread line";
  const topAxisValue = isFavorite ? -range : range;
  const bottomAxisValue = isFavorite ? range : -range;
  const formatAxisValue = (value) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}`;
  const axisLabel = `Selected-team margin · ${formatAxisValue(topAxisValue)} to ${formatAxisValue(bottomAxisValue)}`;
  const label = `${pick.teamName || (selectedIsHome ? card.dataset.homeName : card.dataset.awayName)} spread chart. ${statusLabel}. ${spreadLabel}. ${axisLabel}.`;
  const chart = `<div class="spread-chart-wrap" data-spread-chart-key="${cleanText(chartKey)}" data-spread-chart-team="${cleanText(teamId)}" data-spread-chart-range="${range}" data-spread-chart-favorite="${isFavorite}">
    <div class="spread-chart-heading"><span>${cleanText(statusLabel)}</span></div>
    <svg class="spread-chart" viewBox="0 0 ${width} ${height}" role="group" aria-label="${cleanText(label)}">
      <g class="spread-chart-plot">${grid}${line}
        ${points ? `<polyline points="${points}" class="spread-chart-trend"/>` : ""}
        ${dots}
      </g>
      <g class="spread-chart-range-control" role="button" tabindex="0" aria-label="Expand vertical range" data-spread-chart-action="increase">
        <rect x="6" y="2" width="7" height="6" rx="1"/><text x="9.5" y="6.5">▲</text>
      </g>
      <g class="spread-chart-range-control" role="button" tabindex="0" aria-label="Narrow vertical range" data-spread-chart-action="decrease">
        <rect x="6" y="80" width="7" height="6" rx="1"/><text x="9.5" y="84.5">▼</text>
      </g>
      <line x1="6" y1="${bottom}" x2="${right}" y2="${bottom}" class="spread-chart-axis"/>
      <text x="${left}" y="${bottom + 6}" class="spread-chart-tick spread-chart-x-tick">0</text>
      <text x="${mapX(halfTime)}" y="${bottom + 6}" class="spread-chart-tick spread-chart-x-tick" text-anchor="middle">${midpointLabel}</text>
      <text x="${right}" y="${bottom + 6}" class="spread-chart-tick spread-chart-x-tick" text-anchor="end">${endLabel}</text>
    </svg>
    <span class="visually-hidden">${cleanText(axisLabel)}</span>
  </div>`;
  return chart;
}

function getSpreadPickForChart(card, chart) {
  const teamId = chart.dataset.spreadChartTeam;
  return getGamePicks(card).markets.find((pick) =>
    pick.type === "spread" && String(pick.teamId) === teamId);
}

function renderSpreadChartInPlace(card, chart) {
  const pick = getSpreadPickForChart(card, chart);
  if (!pick) return;
  const focusedAction = document.activeElement?.dataset.spreadChartAction;
  const chartKey = chart.dataset.spreadChartKey;
  chart.outerHTML = renderSpreadChart(card, pick);
  if (focusedAction) {
    const updatedChart = [...card.querySelectorAll(".spread-chart-wrap")]
      .find((candidate) => candidate.dataset.spreadChartKey === chartKey);
    updatedChart?.querySelector(`[data-spread-chart-action="${focusedAction}"]`)?.focus();
  }
}

function setSpreadChartRange(card, chart, range) {
  const chartKey = chart.dataset.spreadChartKey;
  if (!chartKey) return;
  const nextRange = Math.max(5, Math.min(50, Math.round(range / 5) * 5));
  spreadChartRanges.set(chartKey, nextRange);
  renderSpreadChartInPlace(card, chart);
}

function updateSpreadChartRangeDuringPinch(chart, range) {
  const nextRange = Math.max(5, Math.min(50, Math.round(range / 5) * 5));
  chart.dataset.spreadChartRange = String(nextRange);
  const rangeLabel = chart.querySelector(".spread-chart-heading span:last-child");
  if (rangeLabel) {
    rangeLabel.textContent = `${rangeLabel.textContent.replace(/\s·\s±\d+$/, "")} · ±${nextRange}`;
  }
  const rangeTicks = chart.querySelectorAll(".spread-chart-y-tick");
  const isFavorite = chart.dataset.spreadChartFavorite === "true";
  rangeTicks.forEach((tick) => {
    const position = tick.dataset.spreadChartTick;
    const topValue = isFavorite ? -nextRange : nextRange;
    const bottomValue = isFavorite ? nextRange : -nextRange;
    tick.textContent = position === "top"
      ? `${topValue > 0 ? "+" : "−"}${Math.abs(topValue)}`
      : position === "bottom" ? `${bottomValue > 0 ? "+" : "−"}${Math.abs(bottomValue)}` : "0";
  });
  const plot = chart.querySelector(".spread-chart-plot");
  if (plot) {
    const scale = 15 / nextRange;
    plot.setAttribute("transform", `translate(0 ${34 * (1 - scale)}) scale(1 ${scale})`);
  }
  chart.querySelector(".spread-chart")?.setAttribute(
    "aria-label",
    isFavorite
      ? `Favorite score differential chart, vertical range minus ${nextRange} to plus ${nextRange}`
      : `Underdog score differential chart, vertical range plus ${nextRange} to minus ${nextRange}`,
  );
}

function getMarketPickProgress(card, pick) {
  if (pick.type === "spread") {
    const currentScore = readScoreFromCard(card, String(pick.teamId) === card.dataset.homeId ? "home" : "away");
    const otherScore = readScoreFromCard(card, String(pick.teamId) === card.dataset.homeId ? "away" : "home");
    const line = Number(pick.line);
    const signedLine = pick.line == null || pick.line === "" || !Number.isFinite(line)
      ? "—"
      : `${line > 0 ? "+" : ""}${formatPickNumber(line)}`;
    return {
      label: `${pick.teamName || (String(pick.teamId) === card.dataset.homeId ? card.dataset.homeName : card.dataset.awayName)} ${signedLine} Spread`,
      current: currentScore == null || otherScore == null ? "—" : `${formatPickNumber(currentScore)}–${formatPickNumber(otherScore)}`,
      progress: renderSpreadChart(card, pick),
    };
  }
  const homeScore = readScoreFromCard(card, "home");
  const awayScore = readScoreFromCard(card, "away");
  const current = homeScore == null || awayScore == null ? null : homeScore + awayScore;
  const line = Number(pick.line);
  const progress = renderPickProgress({
    current,
    line: pick.line,
    direction: pick.direction,
    isFinal: card.dataset.completed === "true",
    upcoming: card.dataset.upcoming === "true",
  });
  const direction = pick.direction === "under" ? "Under" : "Over";
  const formattedLine = pick.line == null || pick.line === "" || !Number.isFinite(line)
    ? "—"
    : formatPickNumber(line);
  return {
    label: `${direction} ${formattedLine} Total`,
    current: current == null ? "—" : formatPickNumber(current),
    progress: renderGamePickProgress(card, progress),
  };
}

function renderLockedMarketPick(card, pick) {
  const details = getMarketPickProgress(card, pick);
  return `<article class="locked-player-pick">
    <div class="locked-player-pick-heading">
      <strong>${cleanText(details.label)}</strong>
      <span class="locked-player-pick-actions">
        ${renderPickLockButton(pick, true, false, pick.type)}
        <button type="button" class="pick-remove" data-pick-action="remove-market" data-market-type="${cleanText(pick.type)}" aria-label="Remove ${cleanText(pick.type)} pick from My Picks">×</button>
      </span>
    </div>
    <div class="locked-player-pick-progress">${details.progress}</div>
  </article>`;
}

function renderMarketPickRow(card, pick) {
  const lockButton = supportsPlayerPickLock(card) ? renderPickLockButton(pick, false, false, pick.type) : "";
  const details = getMarketPickProgress(card, pick);
  return `<tr>
    <th scope="row"><span class="pick-player-heading">O/U<span class="pick-row-actions">${lockButton}<button type="button" class="pick-remove" data-pick-action="remove-market" data-market-type="total" aria-label="Remove over/under from My Picks">×</button></span></span></th>
    <td>Total</td>
    <td><select data-pick-field="total-direction" aria-label="Over or under"><option value="over"${pick.direction !== "under" ? " selected" : ""}>Over</option><option value="under"${pick.direction === "under" ? " selected" : ""}>Under</option></select></td>
    <td><input type="number" min="0" step="0.5" inputmode="decimal" value="${cleanText(pick.line ?? "")}" data-pick-field="total-line" aria-label="Total points line"></td>
    <td>${details.current}</td>
    <td class="pick-progress-cell">${details.progress}</td>
  </tr>`;
}

function renderSpreadPickCard(card, pick) {
  const details = getMarketPickProgress(card, pick);
  const options = [
    [card.dataset.homeId, card.dataset.homeName, card.dataset.homeSpread],
    [card.dataset.awayId, card.dataset.awayName, card.dataset.awaySpread],
  ].map(([teamId, name, line]) => `<option value="${cleanText(teamId)}" data-line="${cleanText(line)}"${String(pick.teamId) === String(teamId) ? " selected" : ""}>${cleanText(name)}</option>`).join("");
  const lockButton = supportsPlayerPickLock(card) ? renderPickLockButton(pick, false, false, "spread") : "";
  return `<article class="spread-pick-card">
    <div class="spread-pick-card-heading">
      <strong>${cleanText(details.label)}</strong>
      <span class="locked-player-pick-actions">${lockButton}<button type="button" class="pick-remove" data-pick-action="remove-market" data-market-type="spread" aria-label="Remove spread from My Picks">×</button></span>
    </div>
    <div class="spread-pick-card-controls">
      <label>TEAM<select data-pick-field="spread-team" aria-label="Team for spread pick">${options}</select></label>
      <label>LINE<input type="number" step="0.5" inputmode="decimal" value="${cleanText(pick.line ?? "")}" data-pick-field="spread-line" aria-label="Spread line"></label>
      <span class="spread-pick-current"><span class="meta-label">SCORE</span><strong>${cleanText(details.current)}</strong></span>
    </div>
    <div class="spread-pick-card-chart">${details.progress}</div>
  </article>`;
}

function renderMyPicks(card) {
  const section = card.querySelector("[data-my-picks]");
  const container = card.querySelector(".my-picks-content");
  if (!section || !container) return;
  const picks = getGamePicks(card);
  const hasSpread = picks.markets.some((pick) => pick.type === "spread");
  const hasTotal = picks.markets.some((pick) => pick.type === "total");
  card.querySelector('[data-pick-action="add-spread"]')?.toggleAttribute("disabled", hasSpread);
  card.querySelector('[data-pick-action="add-total"]')?.toggleAttribute("disabled", hasTotal);
  const summary = card.latestSummary;
  const lockedPicks = supportsPlayerPickLock(card) ? picks.players.filter((pick) => pick.locked) : [];
  const visiblePlayerPicks = supportsPlayerPickLock(card) ? picks.players.filter((pick) => !pick.locked) : picks.players;
  const lockedMarkets = supportsPlayerPickLock(card) ? picks.markets.filter((pick) => pick.locked) : [];
  const visibleMarkets = (supportsPlayerPickLock(card) ? picks.markets.filter((pick) => !pick.locked) : picks.markets)
    .filter((pick) => pick.type !== "spread");
  const visibleSpreadPicks = (supportsPlayerPickLock(card) ? picks.markets.filter((pick) => !pick.locked) : picks.markets)
    .filter((pick) => pick.type === "spread");
  const rows = [
    ...visiblePlayerPicks.map((pick) => renderPlayerPickRow(card, pick, summary)),
    ...visibleMarkets.map((pick) => renderMarketPickRow(card, pick)),
  ].join("");
  section.hidden = !picks.players.length && !picks.markets.length;
  const allLockedCards = [
    ...lockedPicks.map((pick) => renderLockedGamePlayerPick(card, pick, summary)),
    ...lockedMarkets.map((pick) => renderLockedMarketPick(card, pick)),
  ];
  const lockedCards = allLockedCards.length
    ? `<div class="locked-player-picks">${allLockedCards.join("")}</div>`
    : "";
  const spreadCards = visibleSpreadPicks.length
    ? `<div class="spread-pick-cards">${visibleSpreadPicks.map((pick) => renderSpreadPickCard(card, pick)).join("")}</div>`
    : "";
  const tables = rows ? `<div class="my-picks-table-wrap"><table class="my-picks-table">
    <thead><tr><th scope="col">PICK</th><th scope="col">BET</th><th scope="col">SIDE</th><th scope="col">LINE</th><th scope="col">NOW</th><th scope="col">PROGRESS</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>` : "";
  const error = state.pickStorageError ? `<p class="my-picks-error">${cleanText(state.pickStorageError)}</p>` : "";
  const refreshError = card.pickRefreshError ? `<p class="my-picks-error">${cleanText(card.pickRefreshError)}</p>` : "";
  container.innerHTML = `${lockedCards}${spreadCards}${tables}${error}${refreshError}`;
}

function initializeMyPicks() {
  elements.scoreList.querySelectorAll(".game-card").forEach(renderMyPicks);
}

function updatePlayerStarButtons(card, playerId, isPicked) {
  card.querySelectorAll(".player-star-button").forEach((button) => {
    if (button.dataset.playerId !== playerId) return;
    button.classList.toggle("is-picked", isPicked);
    button.textContent = isPicked ? "★" : "☆";
    button.setAttribute("aria-pressed", String(isPicked));
    button.setAttribute("aria-label", `${isPicked ? "Remove" : "Add"} ${button.dataset.playerName} ${isPicked ? "from" : "to"} My Picks`);
  });
}

function handlePickAction(event) {
  const button = event.target.closest("[data-pick-action]");
  const card = button?.closest(".game-card");
  if (!button || !card) return;
  const picks = getGamePicks(card);
  switch (button.dataset.pickAction) {
    case "toggle-player": {
      const playerId = button.dataset.playerId;
      const index = picks.players.findIndex((pick) => pick.id === playerId);
      if (index >= 0) picks.players.splice(index, 1);
      else picks.players.push({
        id: playerId,
        name: button.dataset.playerName,
        position: button.dataset.playerPosition,
        teamId: button.dataset.teamId,
        teamName: button.dataset.teamName,
        market: getDefaultPlayerProp(button.dataset.playerPosition),
        direction: "over",
        line: "",
      });
      savePicks();
      updatePlayerStarButtons(card, playerId, index < 0);
      renderMyPicks(card);
      break;
    }
    case "add-spread":
      if (!picks.markets.some((pick) => pick.type === "spread")) {
        picks.markets.push({
          type: "spread",
          teamId: card.dataset.homeId,
          teamName: card.dataset.homeName,
          line: card.dataset.homeSpread,
        });
        persistAndRenderPicks(card);
      }
      break;
    case "add-total":
      if (!picks.markets.some((pick) => pick.type === "total")) {
        picks.markets.push({
          type: "total",
          direction: "over",
          line: card.dataset.total,
        });
        persistAndRenderPicks(card);
      }
      break;
    case "remove-player": {
      const playerId = button.dataset.playerId;
      const pick = picks.players.find((item) => item.id === playerId);
      if (pick?.locked && supportsPlayerPickLock(card)
        && !window.confirm(`Are you sure you want to delete ${pick.name} from My Picks?`)) break;
      picks.players = picks.players.filter((pick) => pick.id !== playerId);
      savePicks();
      updatePlayerStarButtons(card, playerId, false);
      renderMyPicks(card);
      break;
    }
    case "toggle-lock-player": {
      if (!supportsPlayerPickLock(card)) break;
      const pick = picks.players.find((item) => item.id === button.dataset.playerId);
      if (!pick) break;
      pick.locked = !pick.locked;
      savePicks();
      renderMyPicks(card);
      break;
    }
    case "toggle-lock-market": {
      if (!supportsPlayerPickLock(card)) break;
      const pick = picks.markets.find((item) => item.type === button.dataset.marketType);
      if (!pick) break;
      pick.locked = !pick.locked;
      savePicks();
      renderMyPicks(card);
      break;
    }
    case "remove-market": {
      const pick = picks.markets.find((item) => item.type === button.dataset.marketType);
      if (pick?.locked && supportsPlayerPickLock(card)
        && !window.confirm(`Are you sure you want to delete the locked ${pick.type === "spread" ? "spread" : "over/under"} pick?`)) break;
      picks.markets = picks.markets.filter((pick) => pick.type !== button.dataset.marketType);
      persistAndRenderPicks(card);
      break;
    }
  }
}

function updatePickFromField(card, field, shouldRender = true, shouldSave = true) {
  const picks = getGamePicks(card);
  const playerId = field.dataset.playerId;
  if (field.dataset.pickField.startsWith("player-")) {
    const pick = picks.players.find((item) => item.id === playerId);
    if (!pick) return;
    if (field.dataset.pickField === "player-market") pick.market = field.value;
    if (field.dataset.pickField === "player-direction") pick.direction = field.value;
    if (field.dataset.pickField === "player-line") pick.line = field.value;
  } else {
    const pick = picks.markets.find((item) => item.type === (field.dataset.pickField.startsWith("spread-") ? "spread" : "total"));
    if (!pick) return;
    if (field.dataset.pickField === "spread-team") {
      const option = field.selectedOptions[0];
      pick.teamId = option.value;
      pick.teamName = option.textContent;
      pick.line = option.dataset.line ?? "";
    }
    if (field.dataset.pickField === "spread-line") pick.line = field.value;
    if (field.dataset.pickField === "total-direction") pick.direction = field.value;
    if (field.dataset.pickField === "total-line") pick.line = field.value;
  }
  if (shouldSave) savePicks();
  if (shouldRender) renderMyPicks(card);
}

let activeLineDrag = null;
const LINE_DRAG_STEP_PIXELS = 12;

function getPickLineValue(field) {
  const parsed = Number.parseFloat(field.value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function handleLinePointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const field = event.target.closest('input[data-pick-field$="-line"]');
  const card = field?.closest(".game-card");
  if (!field || !card) return;
  const step = Number.parseFloat(field.step);
  activeLineDrag = {
    pointerId: event.pointerId,
    startY: event.clientY,
    startValue: getPickLineValue(field),
    step: Number.isFinite(step) && step > 0 ? step : 0.5,
    field,
    card,
  };
  field.classList.add("is-dragging-line");
  if (field.setPointerCapture) field.setPointerCapture(event.pointerId);
}

function handleLinePointerMove(event) {
  if (!activeLineDrag || activeLineDrag.pointerId !== event.pointerId) return;
  const { field, card, startY, startValue, step } = activeLineDrag;
  const movement = Math.trunc((startY - event.clientY) / LINE_DRAG_STEP_PIXELS);
  if (!movement) return;
  const min = field.min === "" ? Number.NEGATIVE_INFINITY : Number(field.min);
  const max = field.max === "" ? Number.POSITIVE_INFINITY : Number(field.max);
  const decimals = Math.max(0, String(step).split(".")[1]?.length ?? 0);
  const multiplier = 10 ** decimals;
  const nextValue = Math.min(max, Math.max(min, startValue + movement * step));
  field.value = String(Math.round(nextValue * multiplier) / multiplier);
  updatePickFromField(card, field, false, false);
  event.preventDefault();
}

function handleLinePointerUp(event) {
  if (!activeLineDrag || activeLineDrag.pointerId !== event.pointerId) return;
  const { field, card } = activeLineDrag;
  field.classList.remove("is-dragging-line");
  activeLineDrag = null;
  updatePickFromField(card, field);
}

function fetchBasketballRoster(sportKey, teamId, season) {
  const key = `${sportKey}:${teamId}:${season}`;
  if (!basketballRosterCache.has(key)) {
    const request = fetch(`${API_ROOT}/${SPORTS[sportKey].path}/teams/${encodeURIComponent(teamId)}/roster?season=${season}`, {
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (!response.ok) throw new Error(`${SPORTS[sportKey].label} roster returned HTTP ${response.status}`);
      return response.json();
    });
    basketballRosterCache.set(key, request);
    request.catch(() => basketballRosterCache.delete(key));
  }
  return basketballRosterCache.get(key);
}

function fetchBasketballPlayerAverages(sportKey, athleteId, season) {
  const key = `${sportKey}:${athleteId}:${season}`;
  if (!basketballAverageCache.has(key)) {
    const url = `${BASKETBALL_STATS_API_ROOT}/sports/${SPORTS[sportKey].path}/athletes/${encodeURIComponent(athleteId)}/stats?region=us&lang=en&contentorigin=espn&season=${season}&seasontype=2`;
    const request = fetch(url, { headers: { Accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(`Player season stats returned HTTP ${response.status}`);
      return response.json();
    });
    basketballAverageCache.set(key, request);
    request.catch(() => basketballAverageCache.delete(key));
  }
  return basketballAverageCache.get(key);
}

function getBasketballSeasonAverages(data, season, teamId) {
  const category = data.categories?.find((item) => item.name === "averages");
  if (!category) return null;
  const seasonRows = (category.statistics ?? []).filter((row) => Number(row.season?.year) === Number(season));
  const row = seasonRows.find((item) => String(item.teamId) === String(teamId)) || seasonRows[0];
  if (!row) return null;
  return Object.fromEntries(BASKETBALL_AVERAGE_COLUMNS.map((column) => {
    const index = category.labels?.indexOf(column) ?? -1;
    return [column, index >= 0 ? row.stats?.[index] ?? "—" : "—"];
  }));
}

function hasBasketballSeasonStats(averages) {
  if (!averages) return false;
  const gamesPlayed = getFootballNumber(averages.GP);
  if (gamesPlayed != null) return gamesPlayed > 0;
  return hasRecordedStatValues(Object.entries(averages)
    .filter(([column]) => column !== "GP")
    .map(([, value]) => value));
}

async function loadBasketballRoster(summary, sportKey, season, eventId) {
  const competitors = summary.header?.competitions?.[0]?.competitors ?? summary.boxscore?.players ?? [];
  const displayOrder = getTeamDisplayOrder(summary, sportKey);
  const teams = competitors
    .map((competitor) => ({
      id: String(competitor.id ?? competitor.team?.id ?? ""),
      name: competitor.team?.displayName || competitor.team?.shortDisplayName || "Team",
      homeAway: competitor.homeAway,
    }))
    .filter((team) => team.id);
  teams.sort((left, right) =>
    (displayOrder.get(left.id) ?? (left.homeAway === "home" ? 0 : 1)) -
    (displayOrder.get(right.id) ?? (right.homeAway === "home" ? 0 : 1)));
  if (!teams.length) throw new Error("Game summary did not include team roster identifiers.");

  const teamRosters = await Promise.all(teams.map(async (team) => ({
    ...team,
    roster: await fetchBasketballRoster(sportKey, team.id, season),
  })));
  const requests = teamRosters.flatMap((team) => (team.roster.athletes ?? [])
    .filter((athlete) => athlete.id)
    .map((athlete) => ({ teamId: team.id, athlete })));
  const averages = new Map();
  const failures = [];
  let nextIndex = 0;
  const workerCount = Math.min(6, requests.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (nextIndex < requests.length) {
      const request = requests[nextIndex];
      nextIndex += 1;
      try {
        const data = await fetchBasketballPlayerAverages(sportKey, request.athlete.id, season);
        averages.set(`${request.teamId}:${request.athlete.id}`, getBasketballSeasonAverages(data, season, request.teamId));
      } catch (error) {
        failures.push({ athlete: request.athlete, message: error.message });
      }
    }
  }));

  return teamRosters.map((team) => {
    const gameKey = `${sportKey}:${eventId}`;
    const athletes = team.roster.athletes ?? [];
    const failedAthleteIds = new Set(failures
      .filter(({ athlete }) => athletes.some((rosterAthlete) => rosterAthlete.id === athlete.id))
      .map(({ athlete }) => String(athlete.id)));
    const playerRows = athletes.map((athlete) => ({
      athlete,
      averages: averages.get(`${team.id}:${athlete.id}`) ?? null,
    })).filter(({ athlete, averages: playerAverages }) =>
      failedAthleteIds.has(String(athlete.id)) || hasBasketballSeasonStats(playerAverages))
      .sort((left, right) => {
      const leftPoints = Number.parseFloat(left.averages?.PTS);
      const rightPoints = Number.parseFloat(right.averages?.PTS);
      const leftHasPoints = Number.isFinite(leftPoints);
      const rightHasPoints = Number.isFinite(rightPoints);
      if (leftHasPoints !== rightHasPoints) return leftHasPoints ? -1 : 1;
      return leftHasPoints ? rightPoints - leftPoints : 0;
    });
    const missingAverages = playerRows.filter(({ averages: playerAverages }) => !playerAverages).length;
    const failedRequests = failures.filter(({ athlete }) => athletes.some((rosterAthlete) => rosterAthlete.id === athlete.id)).length;
    const homeAway = team.homeAway === "home" ? "HOME" : team.homeAway === "away" ? "AWAY" : "";
    const heading = `${homeAway ? `${homeAway} · ` : ""}${team.name}`;
    const headerCells = BASKETBALL_AVERAGE_COLUMNS.map((column) => `<th scope="col">${cleanText(column)}</th>`).join("");
    const rows = playerRows.map(({ athlete, averages: playerAverages }) => {
      const values = BASKETBALL_AVERAGE_COLUMNS.map((column) => playerAverages?.[column] ?? "—");
      return `<tr><td class="stats-player-name"><span class="player-pick-cell">${cleanText(getBasketballPlayerDisplayName({ athlete }))}${renderPlayerStarButton(gameKey, team.id, team.name, { athlete })}</span></td>${values.map((value) => `<td>${cleanText(value)}</td>`).join("")}</tr>`;
    }).join("");
    const notices = [
      failedRequests ? `<p class="basketball-roster-note error">Season averages could not be loaded for ${failedRequests} player${failedRequests === 1 ? "" : "s"}.</p>` : "",
      missingAverages && !failedRequests ? `<p class="basketball-roster-note">Some players have no recorded averages for this season yet.</p>` : "",
    ].join("");
    return `<section class="basketball-player-team">
      <h3 class="basketball-team-heading">${cleanText(heading)}</h3>
      <p class="basketball-roster-note">Season averages per game · ${cleanText(team.roster.season?.displayName || String(season))}</p>
      <div class="basketball-stats-scroll">
        <table class="basketball-stats-table basketball-roster-table">
          <thead><tr><th scope="col">ROSTER</th>${headerCells}</tr></thead>
          <tbody>${rows || `<tr><td colspan="${BASKETBALL_AVERAGE_COLUMNS.length + 1}" class="stats-empty-cell">Roster not listed.</td></tr>`}</tbody>
        </table>
      </div>
      ${notices}
    </section>`;
  }).join("");
}

function fetchFootballRoster(sportKey, teamId, season) {
  const key = `${sportKey}:${teamId}:${season}`;
  if (!footballRosterCache.has(key)) {
    const request = fetch(`${API_ROOT}/${SPORTS[sportKey].path}/teams/${encodeURIComponent(teamId)}/roster?season=${season}`, {
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (!response.ok) throw new Error(`${SPORTS[sportKey].label} roster returned HTTP ${response.status}`);
      return response.json();
    });
    footballRosterCache.set(key, request);
    request.catch(() => footballRosterCache.delete(key));
  }
  return footballRosterCache.get(key);
}

function fetchFootballPlayerAverages(sportKey, athleteId, season) {
  const key = `${sportKey}:${athleteId}:${season}`;
  if (!footballAverageCache.has(key)) {
    const url = `${BASKETBALL_STATS_API_ROOT}/sports/${SPORTS[sportKey].path}/athletes/${encodeURIComponent(athleteId)}/stats?region=us&lang=en&contentorigin=espn&season=${season}&seasontype=2`;
    const request = fetch(url, { headers: { Accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(`Player season stats returned HTTP ${response.status}`);
      return response.json();
    });
    footballAverageCache.set(key, request);
    request.catch(() => footballAverageCache.delete(key));
  }
  return footballAverageCache.get(key);
}

function fetchFootballPlayerGameLog(sportKey, athleteId, season) {
  const key = `${sportKey}:${athleteId}:${season}`;
  if (!footballGameLogCache.has(key)) {
    const url = `${BASKETBALL_STATS_API_ROOT}/sports/${SPORTS[sportKey].path}/athletes/${encodeURIComponent(athleteId)}/gamelog?region=us&lang=en&contentorigin=espn&season=${season}&seasontype=2`;
    const request = fetch(url, { headers: { Accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(`Player game log returned HTTP ${response.status}`);
      return response.json();
    });
    footballGameLogCache.set(key, request);
    request.catch(() => footballGameLogCache.delete(key));
  }
  return footballGameLogCache.get(key);
}

function fetchFootballPlayerPosition(sportKey, athleteId) {
  const key = `${sportKey}:${athleteId}`;
  if (!footballPositionCache.has(key)) {
    const url = `${BASKETBALL_STATS_API_ROOT}/sports/${SPORTS[sportKey].path}/athletes/${encodeURIComponent(athleteId)}`;
    const request = fetch(url, { headers: { Accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(`Player profile returned HTTP ${response.status}`);
      return response.json();
    }).then((data) => data.athlete?.position?.abbreviation ?? "");
    footballPositionCache.set(key, request);
    request.catch(() => footballPositionCache.delete(key));
  }
  return footballPositionCache.get(key);
}

function getFootballGameCountFromLog(data) {
  const eventIds = new Set();
  for (const seasonType of data.seasonTypes ?? []) {
    for (const category of seasonType.categories ?? []) {
      for (const event of category.events ?? []) {
        const eventId = String(event.eventId ?? event.id ?? "");
        if (eventId) eventIds.add(eventId);
      }
    }
  }
  return eventIds.size;
}

async function getFootballSeasonGamesPlayed(sportKey, athleteId, season, teamId, statsData) {
  const categories = statsData?.categories ?? [];
  for (const { name } of categories) {
    const category = getFootballSeasonCategory(statsData, name, season, teamId);
    const gamesPlayed = getFootballNumber(getFootballSeasonValue(category, ["GP"]));
    if (gamesPlayed != null) return gamesPlayed;
  }
  const gameLog = await fetchFootballPlayerGameLog(sportKey, athleteId, season);
  return getFootballGameCountFromLog(gameLog);
}

function fetchFootballTeamGamesPlayed(sportKey, teamId, season) {
  const key = `${sportKey}:${teamId}:${season}`;
  if (!footballScheduleCache.has(key)) {
    const request = fetch(`${API_ROOT}/${SPORTS[sportKey].path}/teams/${encodeURIComponent(teamId)}/schedule?season=${season}`, {
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (!response.ok) throw new Error(`${SPORTS[sportKey].label} schedule returned HTTP ${response.status}`);
      return response.json();
    });
    footballScheduleCache.set(key, request);
    request.catch(() => footballScheduleCache.delete(key));
  }
  return footballScheduleCache.get(key).then((data) => (data.events ?? []).filter((event) =>
    Boolean(event.status?.type?.completed ?? event.competitions?.[0]?.status?.type?.completed)).length);
}

function getFootballTeamOrder(summary) {
  const competitors = summary.header?.competitions?.[0]?.competitors ?? [];
  return new Map(competitors.map((competitor, index) => [
    String(competitor.id ?? competitor.team?.id ?? ""),
    competitor.homeAway === "home" ? 0 : competitor.homeAway === "away" ? 1 : index,
  ]));
}

function getFootballStatCategory(teamGroup, name) {
  return (teamGroup.statistics ?? []).find((category) => category.name === name);
}

function getFootballLabelValue(category, values, aliases) {
  if (!category || !Array.isArray(values)) return null;
  const labels = (category.labels ?? []).map((label) => String(label).trim().toUpperCase());
  for (const alias of aliases) {
    const index = labels.indexOf(alias);
    if (index >= 0 && values[index] != null && values[index] !== "") return String(values[index]);
  }
  return null;
}

function getFootballColumnValue(teamGroup, categoryKey, athlete, column) {
  const category = getFootballStatCategory(teamGroup, categoryKey);
  const values = athlete ? athlete.stats : category?.totals;
  const aliases = {
    GP: ["GP"],
    "C/ATT": ["C/ATT"],
    YDS: ["YDS"],
    AVG: ["AVG"],
    TD: ["TD"],
    INT: ["INT"],
    SACKS: ["SACKS", "SACK"],
    QBR: ["QBR"],
    RTG: ["RTG"],
    CAR: ["CAR"],
    LONG: ["LONG", "LNG"],
    REC: ["REC"],
    TGTS: ["TGTS", "TGT"],
    TOT: ["TOT"],
    TFL: ["TFL"],
    PD: ["PD"],
    "QB HTS": ["QB HTS", "QB HUR", "QB HITS"],
    FR: ["FR"],
    PCT: ["PCT", "FG%"],
    FG: ["FG"],
    XP: ["XP"],
    PTS: ["PTS"],
  }[column] ?? [column];
  const direct = getFootballLabelValue(category, values, aliases);
  if (direct != null) return direct;

  if (column === "C/ATT") {
    const completions = getFootballLabelValue(category, values, ["CMP", "COM"]);
    const attempts = getFootballLabelValue(category, values, ["ATT"]);
    if (completions != null && attempts != null) return `${completions}/${attempts}`;
  }
  if (column === "FG") {
    const made = getFootballLabelValue(category, values, ["FGM"]);
    const attempts = getFootballLabelValue(category, values, ["FGA"]);
    if (made != null && attempts != null) return `${made}/${attempts}`;
  }
  if (column === "XP") {
    const made = getFootballLabelValue(category, values, ["XPM"]);
    const attempts = getFootballLabelValue(category, values, ["XPA"]);
    if (made != null && attempts != null) return `${made}/${attempts}`;
  }

  const secondary = column === "INT"
    ? getFootballStatCategory(teamGroup, "interceptions")
    : column === "FR"
      ? getFootballStatCategory(teamGroup, "fumbles")
      : null;
  if (secondary) {
    const secondaryEntry = athlete
      ? secondary.athletes?.find((item) => String(item.athlete?.id ?? "") === String(athlete.athlete?.id ?? ""))
      : secondary;
    const secondaryValues = athlete ? secondaryEntry?.stats : secondary.totals;
    const secondaryColumn = column === "FR" ? ["REC"] : [column];
    const secondaryValue = getFootballLabelValue(secondary, secondaryValues, secondaryColumn);
    if (secondaryValue != null) return secondaryValue;
  }
  return null;
}

function getFootballCategoryAthletes(teamGroup, categoryKey) {
  const categories = [getFootballStatCategory(teamGroup, categoryKey)];
  if (categoryKey === "defensive") {
    categories.push(getFootballStatCategory(teamGroup, "interceptions"), getFootballStatCategory(teamGroup, "fumbles"));
  }
  const athletes = new Map();
  for (const category of categories) {
    for (const athlete of category?.athletes ?? []) {
      if (category.name === "fumbles" && (getFootballNumber(getFootballLabelValue(category, athlete.stats, ["REC"])) ?? 0) <= 0) continue;
      if (!hasRecordedStatValues(athlete.stats)) continue;
      const id = String(athlete.athlete?.id ?? athlete.athlete?.displayName ?? "");
      if (id && !athletes.has(id)) athletes.set(id, athlete);
    }
  }
  return [...athletes.values()];
}

function getFootballTeamTotal(teamGroup, categoryKey, column, gamesPlayedByAthlete) {
  if (column === "GP") {
    const gamesPlayed = getFootballCategoryAthletes(teamGroup, categoryKey)
      .map((athlete) => gamesPlayedByAthlete.get(`${teamGroup.team?.id}:${athlete.athlete?.id}`) ??
        getFootballNumber(getFootballColumnValue(teamGroup, categoryKey, athlete, "GP")))
      .filter(Number.isFinite);
    return gamesPlayed.length ? String(Math.max(...gamesPlayed)) : "—";
  }
  const total = getFootballColumnValue(teamGroup, categoryKey, null, column);
  if (total != null && total !== "--") return total;
  if (["AVG", "LONG", "PCT", "QBR", "RTG", "C/ATT", "FG", "XP"].includes(column)) return total ?? "—";
  const values = getFootballCategoryAthletes(teamGroup, categoryKey)
    .map((athlete) => Number.parseFloat(getFootballColumnValue(teamGroup, categoryKey, athlete, column)))
    .filter(Number.isFinite);
  return values.length ? String(values.reduce((sum, value) => sum + value, 0)) : total ?? "—";
}

function renderFootballTeamStats(teamGroup, teamOrder, gamesPlayedByAthlete, playerPositions, gameKey) {
  const teamId = String(teamGroup.team?.id ?? "");
  const homeAway = teamOrder.get(teamId) === 0 ? "HOME" : teamOrder.get(teamId) === 1 ? "AWAY" : "";
  const teamName = teamGroup.team?.displayName || teamGroup.team?.shortDisplayName || "Team";
  const tables = FOOTBALL_STATS_CATEGORIES.map(({ name, key, columns }) => {
    const athletes = getFootballCategoryAthletes(teamGroup, key).sort((left, right) => {
      const leftGames = gamesPlayedByAthlete.get(`${teamId}:${left.athlete?.id}`) ??
        getFootballNumber(getFootballColumnValue(teamGroup, key, left, "GP"));
      const rightGames = gamesPlayedByAthlete.get(`${teamId}:${right.athlete?.id}`) ??
        getFootballNumber(getFootballColumnValue(teamGroup, key, right, "GP"));
      if (leftGames == null && rightGames == null) return 0;
      if (leftGames == null) return 1;
      if (rightGames == null) return -1;
      return rightGames - leftGames;
    });
    const headers = columns.map((column) => `<th scope="col">${cleanText(column)}</th>`).join("");
    const rows = athletes.map((athlete) => {
      const values = columns.map((column) => getFootballColumnValue(teamGroup, key, athlete, column) ?? "—");
      const position = playerPositions.get(`${teamId}:${athlete.athlete?.id}`);
      const player = position && !athlete.athlete?.position
        ? { ...athlete, athlete: { ...athlete.athlete, position: { abbreviation: position } } }
        : athlete;
      return `<tr><td class="stats-player-name"><span class="player-pick-cell">${cleanText(getBasketballPlayerDisplayName(player))}${renderPlayerStarButton(gameKey, teamId, teamName, player)}</span></td>${values.map((value) => `<td>${cleanText(value)}</td>`).join("")}</tr>`;
    }).join("");
    const totals = columns.map((column) => getFootballTeamTotal(teamGroup, key, column, gamesPlayedByAthlete));
    return `<section class="football-stats-block">
      <h4 class="stats-title">${cleanText(name)}</h4>
      <div class="basketball-stats-scroll">
        <table class="basketball-stats-table football-stats-table">
          <thead><tr><th scope="col">PLAYER</th>${headers}</tr></thead>
          <tbody>
            ${rows || `<tr><td colspan="${columns.length + 1}" class="stats-empty-cell">Player stats unavailable.</td></tr>`}
            <tr class="stats-team-total"><th scope="row">TEAM</th>${totals.map((value) => `<td>${cleanText(value)}</td>`).join("")}</tr>
          </tbody>
        </table>
      </div>
    </section>`;
  }).join("");
  return `<section class="football-player-team">
    <h3 class="basketball-team-heading">${cleanText(homeAway ? `${homeAway} · ` : "")}${cleanText(teamName)}</h3>
    ${tables}
  </section>`;
}

function renderFootballPlayerStats(summary, sportKey, eventId, gamesPlayedByAthlete = new Map(), playerPositions = new Map(), gamesPlayedErrors = 0, positionErrors = 0, positionErrorMessage = "") {
  const teamGroups = [...(summary.boxscore?.players ?? [])];
  if (!teamGroups.length) return "";
  const teamOrder = getFootballTeamOrder(summary);
  const displayOrder = getTeamDisplayOrder(summary, sportKey);
  teamGroups.sort((left, right) =>
    (displayOrder.get(String(left.team?.id ?? "")) ?? 2) - (displayOrder.get(String(right.team?.id ?? "")) ?? 2));
  const gameKey = `${sportKey}:${eventId}`;
  const teams = teamGroups.map((teamGroup) =>
    renderFootballTeamStats(teamGroup, teamOrder, gamesPlayedByAthlete, playerPositions, gameKey)).join("");
  const errorNote = gamesPlayedErrors
    ? `<p class="basketball-roster-note error">Games played could not be loaded for ${gamesPlayedErrors} player${gamesPlayedErrors === 1 ? "" : "s"}.</p>`
    : "";
  const positionErrorNote = positionErrors
    ? `<p class="basketball-roster-note error">Player positions could not be loaded for ${positionErrors} player${positionErrors === 1 ? "" : "s"}; football player bets may not be available. ${cleanText(positionErrorMessage)}</p>`
    : "";
  return `${teams}${errorNote}${positionErrorNote}`;
}

async function loadFootballSummaryGamesPlayed(summary, sportKey, season) {
  const requests = new Map();
  const teams = new Map();
  for (const teamGroup of summary.boxscore?.players ?? []) {
    const teamId = String(teamGroup.team?.id ?? "");
    if (teamId) teams.set(teamId, teamId);
    for (const category of teamGroup.statistics ?? []) {
      for (const item of category.athletes ?? []) {
        const athleteId = String(item.athlete?.id ?? "");
        if (teamId && athleteId) requests.set(`${teamId}:${athleteId}`, { teamId, athleteId });
      }
    }
  }
  const gamesPlayed = new Map();
  const playerPositions = new Map();
  const failures = new Set();
  const positionFailures = new Map();
  const rosterFailures = new Map();
  await Promise.all([...teams.values()].map(async (teamId) => {
    try {
      const roster = await fetchFootballRoster(sportKey, teamId, season);
      for (const group of roster.athletes ?? []) {
        for (const athlete of group.items ?? []) {
          if (athlete.id && athlete.position?.abbreviation) {
            playerPositions.set(`${teamId}:${athlete.id}`, athlete.position.abbreviation);
          }
        }
      }
    } catch (error) {
      rosterFailures.set(teamId, error.message);
    }
  }));
  const missingPositions = [...requests.values()].filter((request) =>
    !playerPositions.has(`${request.teamId}:${request.athleteId}`));
  let nextPositionIndex = 0;
  await Promise.all(Array.from({ length: Math.min(6, missingPositions.length) }, async () => {
    while (nextPositionIndex < missingPositions.length) {
      const request = missingPositions[nextPositionIndex];
      nextPositionIndex += 1;
      try {
        const position = await fetchFootballPlayerPosition(sportKey, request.athleteId);
        if (position) playerPositions.set(`${request.teamId}:${request.athleteId}`, position);
        else positionFailures.set(`${request.teamId}:${request.athleteId}`, "Player profile did not include a position.");
      } catch (error) {
        positionFailures.set(`${request.teamId}:${request.athleteId}`, error.message);
      }
    }
  }));
  const unresolvedPositions = [...requests.values()].filter((request) =>
    !playerPositions.has(`${request.teamId}:${request.athleteId}`));
  const positionErrorMessage = unresolvedPositions.map((request) =>
    positionFailures.get(`${request.teamId}:${request.athleteId}`) ||
      rosterFailures.get(request.teamId)).find(Boolean) ?? "";
  const athleteRequests = [...requests.values()];
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(6, athleteRequests.length) }, async () => {
    while (nextIndex < athleteRequests.length) {
      const request = athleteRequests[nextIndex];
      nextIndex += 1;
      try {
        const statsData = await fetchFootballPlayerAverages(sportKey, request.athleteId, season);
        const count = await getFootballSeasonGamesPlayed(
          sportKey, request.athleteId, season, request.teamId, statsData);
        gamesPlayed.set(`${request.teamId}:${request.athleteId}`, count);
      } catch {
        failures.add(`${request.teamId}:${request.athleteId}`);
      }
    }
  }));
  return {
    gamesPlayed,
    playerPositions,
    errors: failures.size,
    positionErrors: unresolvedPositions.length,
    positionErrorMessage,
  };
}

function getFootballSeasonCategory(data, name, season, teamId) {
  const category = data.categories?.find((item) => item.name === name);
  if (!category) return null;
  const rows = (category.statistics ?? []).filter((row) => Number(row.season?.year) === Number(season));
  const row = rows.find((item) => String(item.teamId ?? "") === String(teamId)) ||
    rows.find((item) => !item.teamId);
  return row ? { labels: category.labels ?? [], values: row.stats ?? [] } : null;
}

function getFootballSeasonValue(category, aliases) {
  if (!category) return null;
  return getFootballLabelValue({ labels: category.labels }, category.values, aliases);
}

function getFootballNumber(value) {
  const number = Number.parseFloat(String(value ?? "").replaceAll(",", ""));
  return Number.isFinite(number) ? number : null;
}

function formatFootballAverage(value, gamesPlayed) {
  const number = getFootballNumber(value);
  if (number == null || !gamesPlayed) return "—";
  return (number / gamesPlayed).toFixed(1);
}

function getFootballRosterCellValue(athleteStats, categoryKey, column, fallbackGamesPlayed) {
  const category = athleteStats.get(categoryKey);
  if (column === "GP") return athleteStats.get("GP") ?? "—";
  if (!category) return "—";
  const gamesPlayed = getFootballNumber(getFootballSeasonValue(category, ["GP"])) || fallbackGamesPlayed;
  const unchanged = (aliases) => getFootballSeasonValue(category, aliases) ?? "—";
  const average = (aliases) => formatFootballAverage(getFootballSeasonValue(category, aliases), gamesPlayed);

  if (column === "C/ATT") {
    const completed = getFootballSeasonValue(category, ["CMP", "COM"]);
    const attempts = getFootballSeasonValue(category, ["ATT"]);
    if (!gamesPlayed) return "—";
    return completed != null && attempts != null
      ? `${formatFootballAverage(completed, gamesPlayed)}/${formatFootballAverage(attempts, gamesPlayed)}`
      : unchanged(["C/ATT"]);
  }
  if (column === "FG" || column === "XP") {
    const madeAliases = column === "FG" ? ["FGM"] : ["XPM"];
    const attemptAliases = column === "FG" ? ["FGA"] : ["XPA"];
    const made = getFootballSeasonValue(category, madeAliases);
    const attempts = getFootballSeasonValue(category, attemptAliases);
    if (made != null && attempts != null) {
      if (!gamesPlayed) return "—";
      return `${formatFootballAverage(made, gamesPlayed)}/${formatFootballAverage(attempts, gamesPlayed)}`;
    }
    const combined = unchanged(column === "FG" ? ["FG"] : ["XP"]);
    const parts = combined.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
    if (parts && !gamesPlayed) return "—";
    return parts ? `${formatFootballAverage(parts[1], gamesPlayed)}/${formatFootballAverage(parts[2], gamesPlayed)}` : combined;
  }
  if (column === "AVG") return unchanged(["AVG"]);
  if (column === "LONG") return unchanged(["LONG", "LNG"]);
  if (column === "PCT") return unchanged(["PCT", "FG%"]);
  if (column === "QBR") return unchanged(["QBR"]);
  if (column === "RTG") return unchanged(["RTG"]);
  if (column === "FR") {
    const recovered = getFootballSeasonValue(category, ["FR"]) ??
      getFootballSeasonValue(athleteStats.get("fumbles"), ["REC"]);
    return formatFootballAverage(recovered, gamesPlayed);
  }
  if (column === "INT") {
    const interceptionValue = getFootballSeasonValue(category, ["INT"]) ??
      getFootballSeasonValue(athleteStats.get("interceptions"), ["INT"]);
    return formatFootballAverage(interceptionValue, gamesPlayed);
  }
  const aliases = {
    YDS: ["YDS"],
    TD: ["TD"],
    INT: ["INT"],
    SACKS: ["SACKS", "SACK"],
    CAR: ["CAR"],
    REC: ["REC"],
    TGTS: ["TGTS", "TGT"],
    TOT: ["TOT"],
    TFL: ["TFL"],
    PD: ["PD"],
    "QB HTS": ["QB HTS", "QB HUR", "QB HITS"],
    PTS: ["PTS"],
  }[column];
  return aliases ? average(aliases) : "—";
}

function getFootballRosterSortColumns(categoryKey) {
  const sortColumns = {
    passing: [["GP"], ["YDS"]],
    rushing: [["CAR"], ["YDS"]],
    receiving: [["YDS"], ["REC"]],
    defensive: [["TOT"], ["SACKS", "SACK"]],
    kicking: [["GP"], ["PTS"]],
  };
  return sortColumns[categoryKey] ?? [];
}

function getFootballRosterSortValue(athlete, teamId, categoryKey, aliases, averages) {
  const stats = averages.get(`${teamId}:${athlete.id}`);
  if (aliases[0] === "GP") return getFootballNumber(stats?.get("GP"));
  return getFootballNumber(getFootballSeasonValue(stats?.get(categoryKey), aliases));
}

function hasFootballSeasonStats(athleteStats) {
  const gamesPlayed = getFootballNumber(athleteStats.get("GP"));
  if (gamesPlayed != null) return gamesPlayed > 0;
  return [...athleteStats.entries()]
    .filter(([category]) => category !== "GP")
    .some(([, category]) => hasRecordedStatValues(category?.values));
}

function getFootballRosterPositionGroups(roster) {
  const athletes = (roster.athletes ?? []).flatMap((group) =>
    (group.items ?? []).map((athlete) => ({ ...athlete, rosterGroup: group.position })));
  return {
    passing: athletes.filter((athlete) => athlete.position?.abbreviation === "QB"),
    rushing: athletes.filter((athlete) => ["RB", "HB", "FB"].includes(athlete.position?.abbreviation)),
    receiving: athletes.filter((athlete) => ["WR", "TE"].includes(athlete.position?.abbreviation)),
    defensive: athletes.filter((athlete) => athlete.rosterGroup === "defense"),
    kicking: athletes.filter((athlete) => athlete.rosterGroup === "specialTeam" &&
      ["K", "PK"].includes(athlete.position?.abbreviation)),
  };
}

async function loadFootballRoster(summary, sportKey, season, eventId) {
  const competitors = summary.header?.competitions?.[0]?.competitors ?? [];
  const displayOrder = getTeamDisplayOrder(summary, sportKey);
  const teams = competitors.map((competitor) => ({
    id: String(competitor.id ?? competitor.team?.id ?? ""),
    name: competitor.team?.displayName || competitor.team?.shortDisplayName || "Team",
    homeAway: competitor.homeAway,
  })).filter((team) => team.id);
  teams.sort((left, right) =>
    (displayOrder.get(left.id) ?? (left.homeAway === "home" ? 0 : 1)) -
    (displayOrder.get(right.id) ?? (right.homeAway === "home" ? 0 : 1)));
  if (!teams.length) throw new Error("Game summary did not include team roster identifiers.");

  const teamRosters = await Promise.all(teams.map(async (team) => {
    const [roster, scheduleResult] = await Promise.all([
      fetchFootballRoster(sportKey, team.id, season),
      fetchFootballTeamGamesPlayed(sportKey, team.id, season).then(
        (gamesPlayed) => ({ gamesPlayed, error: "" }),
        (error) => ({ gamesPlayed: 0, error: error.message }),
      ),
    ]);
    return {
      ...team,
      roster,
      gamesPlayed: scheduleResult.gamesPlayed,
      scheduleError: scheduleResult.error,
      positionGroups: getFootballRosterPositionGroups(roster),
    };
  }));
  const requests = new Map();
  for (const team of teamRosters) {
    for (const athletes of Object.values(team.positionGroups)) {
      for (const athlete of athletes) {
        if (athlete.id) requests.set(`${team.id}:${athlete.id}`, { teamId: team.id, athlete });
      }
    }
  }
  const averages = new Map();
  const failures = new Map();
  const gamesPlayedFailures = new Map();
  const requestList = [...requests.values()];
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(6, requestList.length) }, async () => {
    while (nextIndex < requestList.length) {
      const request = requestList[nextIndex];
      nextIndex += 1;
      try {
        const data = await fetchFootballPlayerAverages(sportKey, request.athlete.id, season);
        const categories = new Map((data.categories ?? []).map(({ name }) => [
          name,
          getFootballSeasonCategory(data, name, season, request.teamId),
        ]));
        try {
          categories.set("GP", await getFootballSeasonGamesPlayed(
            sportKey, request.athlete.id, season, request.teamId, data));
        } catch (error) {
          gamesPlayedFailures.set(`${request.teamId}:${request.athlete.id}`, error.message);
        }
        averages.set(`${request.teamId}:${request.athlete.id}`, categories);
      } catch (error) {
        failures.set(`${request.teamId}:${request.athlete.id}`, error.message);
      }
    }
  }));

  return teamRosters.map((team) => {
    const gameKey = `${sportKey}:${eventId}`;
    const notes = [];
    const teamFailures = requestList.filter((request) => request.teamId === team.id)
      .map((request) => failures.get(`${request.teamId}:${request.athlete.id}`))
      .filter(Boolean);
    const failedRequests = teamFailures.length;
    if (failedRequests) {
      notes.push(`<p class="basketball-roster-note error">Season averages could not be loaded for ${failedRequests} player${failedRequests === 1 ? "" : "s"}: ${cleanText(teamFailures[0])}</p>`);
    }
    if (team.scheduleError) {
      notes.push(`<p class="basketball-roster-note error">Team games played could not be loaded; per-game averages may be unavailable: ${cleanText(team.scheduleError)}</p>`);
    }
    const failedGamesPlayed = requestList.filter((request) => request.teamId === team.id)
      .map((request) => gamesPlayedFailures.get(`${request.teamId}:${request.athlete.id}`))
      .filter(Boolean);
    if (failedGamesPlayed.length) {
      notes.push(`<p class="basketball-roster-note error">Games played could not be loaded for ${failedGamesPlayed.length} player${failedGamesPlayed.length === 1 ? "" : "s"}: ${cleanText(failedGamesPlayed[0])}</p>`);
    }
    const tables = FOOTBALL_STATS_CATEGORIES.map(({ name, key, columns }) => {
      const athletes = [...(team.positionGroups[key] ?? [])].filter((athlete) => {
        const athleteKey = `${team.id}:${athlete.id}`;
        if (failures.has(athleteKey) || gamesPlayedFailures.has(athleteKey)) return true;
        const stats = averages.get(athleteKey);
        return stats ? hasFootballSeasonStats(stats) : false;
      }).sort((left, right) => {
        for (const aliases of getFootballRosterSortColumns(key)) {
          const leftValue = getFootballRosterSortValue(left, team.id, key, aliases, averages);
          const rightValue = getFootballRosterSortValue(right, team.id, key, aliases, averages);
          if (leftValue == null && rightValue == null) continue;
          if (leftValue == null) return 1;
          if (rightValue == null) return -1;
          if (leftValue !== rightValue) return rightValue - leftValue;
        }
        return 0;
      });
      const headers = columns.map((column) => `<th scope="col">${cleanText(column)}</th>`).join("");
      const rows = athletes.map((athlete) => {
        const stats = averages.get(`${team.id}:${athlete.id}`) ?? new Map();
        const values = columns.map((column) =>
          getFootballRosterCellValue(stats, key, column, team.gamesPlayed));
        return `<tr><td class="stats-player-name"><span class="player-pick-cell">${cleanText(getBasketballPlayerDisplayName({ athlete }))}${renderPlayerStarButton(gameKey, team.id, team.name, { athlete })}</span></td>${values.map((value) => `<td>${cleanText(value)}</td>`).join("")}</tr>`;
      }).join("");
      return `<section class="football-stats-block">
        <h4 class="stats-title">${cleanText(name)}</h4>
        <div class="basketball-stats-scroll">
          <table class="basketball-stats-table football-stats-table">
            <thead><tr><th scope="col">PLAYER</th>${headers}</tr></thead>
            <tbody>${rows || `<tr><td colspan="${columns.length + 1}" class="stats-empty-cell">No players listed for this group.</td></tr>`}</tbody>
          </table>
        </div>
      </section>`;
    }).join("");
    const homeAway = team.homeAway === "home" ? "HOME" : team.homeAway === "away" ? "AWAY" : "";
    return `<section class="football-player-team">
      <h3 class="basketball-team-heading">${cleanText(homeAway ? `${homeAway} · ` : "")}${cleanText(team.name)}</h3>
      <p class="basketball-roster-note">Season averages per game · ${cleanText(team.roster.season?.displayName || String(season))}</p>
      ${tables}
      ${notes.join("")}
    </section>`;
  }).join("");
}

async function loadEventDetails(details) {
  const card = details.closest(".game-card");
  const sportKey = card?.dataset.sport;
  const eventId = card?.dataset.eventId;
  const content = details.querySelector(".details-content");
  if (!sportKey || !eventId || !content) return;
  try {
    const summary = await fetchGameSummary(sportKey, eventId);
    card.latestSummary = summary;
    renderMyPicks(card);
    if (["NBA", "WNBA", "NCAAM", "NCAAW"].includes(sportKey)) {
      const playerStats = renderBasketballPlayerStats(summary, sportKey, eventId);
      const hasPlayerStats = (summary.boxscore?.players ?? []).some((team) =>
        (team.statistics ?? []).some((category) => (category.athletes ?? [])
          .some((athlete) => athlete.stats?.some((value) => value != null && value !== "" && value !== "--"))));
      if (card.dataset.upcoming === "true" && !hasPlayerStats) {
        content.innerHTML = await loadBasketballRoster(summary, sportKey, Number(card.dataset.season), eventId);
      } else {
        content.innerHTML = playerStats || `<div class="stats-empty">Player stats are not available for this game yet.</div>`;
      }
    } else if (["NFL", "NCAAF"].includes(sportKey)) {
      const hasPlayerStats = (summary.boxscore?.players ?? []).some((team) =>
        (team.statistics ?? []).some((category) => (category.athletes ?? [])
          .some((athlete) => athlete.stats?.some((value) => value != null && value !== "" && value !== "--"))));
      if (card.dataset.upcoming === "true" && !hasPlayerStats) {
        content.innerHTML = await loadFootballRoster(summary, sportKey, Number(card.dataset.season), eventId);
      } else {
        const { gamesPlayed, playerPositions, errors, positionErrors, positionErrorMessage } = await loadFootballSummaryGamesPlayed(
          summary, sportKey, Number(card.dataset.season));
        const playerStats = renderFootballPlayerStats(
          summary, sportKey, eventId, gamesPlayed, playerPositions, errors, positionErrors, positionErrorMessage);
        content.innerHTML = playerStats || `<div class="stats-empty">Player stats are not available for this game yet.</div>`;
      }
    } else {
      const groups = [...getTeamStatGroups(summary), ...getPlayerStatGroups(summary)];
      content.innerHTML = groups.length
        ? `<div class="stats-grid">${groups.map(renderStatsTable).join("")}</div>`
        : `<div class="stats-empty">Stats are not available for this game yet.</div>`;
    }
  } catch (error) {
    content.innerHTML = `<div class="stats-error">Could not load stats: ${cleanText(error.message)}</div>`;
    details.dataset.loaded = "false";
  }
}

let livePickRefreshInProgress = false;
async function refreshLivePicks() {
  if (livePickRefreshInProgress || document.visibilityState === "hidden") return;
  const isGolfTab = state.tab === "Golf";
  const cards = [...elements.scoreList.querySelectorAll(".game-card")].filter((card) => {
    const picks = state.picks[getGamePickKey(card)];
    const hasPicks = Boolean(picks?.players?.length || picks?.markets?.length);
    const needsFinalSpreadTimeline = picks?.markets?.some((pick) => pick.type === "spread") && !card.latestSummary;
    const gameStarted = Number(card.dataset.eventStart) <= Date.now();
    return card.dataset.live === "true"
      || hasPicks && card.dataset.completed !== "true" && gameStarted
      || needsFinalSpreadTimeline;
  });
  if (!cards.length && !isGolfTab) return;
  livePickRefreshInProgress = true;
  try {
    if (isGolfTab) await refreshGolfPickProgress();
    if (!cards.length) return;
    await Promise.all(cards.map(async (card) => {
      try {
        const summary = await fetchGameSummary(card.dataset.sport, card.dataset.eventId, true);
        card.latestSummary = summary;
        const competition = summary.header?.competitions?.[0];
        if (competition?.competitors?.length) {
          const scoreTable = card.querySelector(".score-table-wrap");
          if (scoreTable) scoreTable.innerHTML = renderScoreTable({ competitions: [competition] }, card.dataset.sport);
        }
        const status = competition?.status?.type ?? {};
        if (status.completed != null) card.dataset.completed = String(Boolean(status.completed));
        const clockStatus = competition?.status ?? {};
        const eventStatus = summary.header?.competitions?.[0]?.status ?? {};
        if (clockStatus.period != null || eventStatus.period != null) {
          card.dataset.gamePeriod = String(clockStatus.period ?? eventStatus.period);
        }
        if (clockStatus.displayClock != null || eventStatus.displayClock != null) {
          card.dataset.gameClock = String(clockStatus.displayClock ?? eventStatus.displayClock);
        }
        if (status.state) {
          card.dataset.live = String(status.state === "in");
          if (status.state === "in") card.dataset.upcoming = "false";
        }
        if (status.completed) card.dataset.upcoming = "false";
        const statusElement = card.querySelector(".game-live-indicator, .game-status");
        if (statusElement) {
          if (card.dataset.live === "true") {
            statusElement.outerHTML = renderLiveGameIndicator({
              competitions: [competition ?? {}],
              status: summary.header?.competitions?.[0]?.status,
            }, card.dataset.sport);
          } else {
            const label = status.shortDetail || status.detail
              || (card.dataset.completed === "true" ? "Final" : "In progress");
            statusElement.outerHTML = `<span class="game-status${card.dataset.completed === "true" ? " final" : ""}">${cleanText(label)}</span>`;
          }
        }
        card.pickRefreshError = "";
        renderMyPicks(card);
      } catch (error) {
        card.pickRefreshError = `Could not refresh pick progress: ${error.message}`;
        renderMyPicks(card);
      }
    }));
  } finally {
    livePickRefreshInProgress = false;
  }
}

function setRefreshing(isRefreshing, tab = state.tab) {
  if (isRefreshing) {
    elements.pullIndicatorLabel.textContent = tab === "Golf"
      ? "Refreshing Golf leaderboard"
      : `Refreshing ${tab} scores`;
  }
  elements.refreshButton.classList.toggle("is-refreshing", isRefreshing);
  elements.refreshButton.disabled = isRefreshing;
  elements.pullIndicator.classList.toggle("visible", isRefreshing);
}

async function refreshScores() {
  const activeTab = state.tab;
  setRefreshing(true, activeTab);
  try {
    await loadScores();
  } finally {
    window.setTimeout(() => setRefreshing(false), 350);
  }
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.tab = button.dataset.tab;
    document.querySelectorAll(".tab").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      if (selected) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    loadScores();
  });
});

document.querySelectorAll(".league-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.myTeamsLeague = button.dataset.leagueFilter;
    document.querySelectorAll(".league-filter").forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    loadScores();
  });
});

document.querySelectorAll(".golf-tour-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.golfTour = button.dataset.golfTour;
    document.querySelectorAll(".golf-tour-filter").forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    loadScores();
  });
});

document.querySelectorAll(".date-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    state.day = button.dataset.day;
    document.querySelectorAll(".date-switch button").forEach((dayButton) => {
      const selected = dayButton === button;
      dayButton.classList.toggle("selected", selected);
      dayButton.setAttribute("aria-pressed", String(selected));
    });
    elements.todayViewSwitch.hidden = state.tab === "Golf" || state.day !== "today";
    loadScores();
  });
});

document.querySelectorAll(".today-view-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    state.todayView = button.dataset.todayView;
    document.querySelectorAll(".today-view-switch button").forEach((viewButton) => {
      const selected = viewButton === button;
      viewButton.classList.toggle("selected", selected);
      viewButton.setAttribute("aria-pressed", String(selected));
    });
    loadScores();
  });
});

elements.refreshButton.addEventListener("click", refreshScores);

function handleSpreadChartControl(control, directionOverride) {
  const card = control.closest(".game-card");
  const chart = control.closest(".spread-chart-wrap");
  if (!card || !chart) return;
  const currentRange = spreadChartRanges.get(chart.dataset.spreadChartKey)
    ?? Number(chart.dataset.spreadChartRange)
    ?? 15;
  const direction = directionOverride ?? (control.dataset.spreadChartAction === "increase" ? 1 : -1);
  setSpreadChartRange(card, chart, currentRange + direction * 5);
}

elements.scoreList.addEventListener("click", (event) => {
  const spreadChartControl = event.target.closest("[data-spread-chart-action]");
  if (spreadChartControl) handleSpreadChartControl(spreadChartControl);
  handleGolfPickAction(event);
  handlePickAction(event);
});
elements.scoreList.addEventListener("keydown", (event) => {
  const control = event.target.closest("[data-spread-chart-action]");
  if (!control) return;
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    handleSpreadChartControl(control, event.key === "ArrowUp" ? 1 : -1);
    return;
  }
  if (!["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  handleSpreadChartControl(control);
});
let spreadPinchGesture = null;
function getTouchDistance(touches) {
  const x = touches[0].clientX - touches[1].clientX;
  const y = touches[0].clientY - touches[1].clientY;
  return Math.hypot(x, y);
}

elements.scoreList.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 2) {
    spreadPinchGesture = null;
    return;
  }
  const chart = event.target.closest(".spread-chart-wrap");
  const card = chart?.closest(".game-card");
  if (!chart || !card) return;
  spreadPinchGesture = {
    chart,
    card,
    distance: getTouchDistance(event.touches),
    range: Number(chart.dataset.spreadChartRange) || 15,
  };
}, { passive: true });

elements.scoreList.addEventListener("touchmove", (event) => {
  if (!spreadPinchGesture || event.touches.length !== 2) return;
  event.preventDefault();
  const distanceChange = getTouchDistance(event.touches) - spreadPinchGesture.distance;
  const range = spreadPinchGesture.range + distanceChange / 8;
  const nextRange = Math.max(5, Math.min(50, Math.round(range / 5) * 5));
  spreadChartRanges.set(spreadPinchGesture.chart.dataset.spreadChartKey, nextRange);
  updateSpreadChartRangeDuringPinch(spreadPinchGesture.chart, nextRange);
}, { passive: false });

function finishSpreadChartPinch() {
  if (!spreadPinchGesture) return;
  const { chart, card } = spreadPinchGesture;
  spreadPinchGesture = null;
  if (chart.isConnected) renderSpreadChartInPlace(card, chart);
}

elements.scoreList.addEventListener("touchend", (event) => {
  if (spreadPinchGesture && event.touches.length < 2) finishSpreadChartPinch();
}, { passive: true });
elements.scoreList.addEventListener("touchcancel", finishSpreadChartPinch, { passive: true });

elements.scoreList.addEventListener("input", (event) => {
  const field = event.target.closest("[data-pick-field]");
  const card = field?.closest(".game-card");
  if (field && card) updatePickFromField(card, field, false);
});
elements.scoreList.addEventListener("change", (event) => {
  const golfField = event.target.closest("[data-golf-pick-field]");
  const tournament = golfField?.closest(".golf-tournament");
  if (golfField && tournament) {
    updateGolfPickFromField(tournament, golfField);
    return;
  }
  const field = event.target.closest("[data-pick-field]");
  const card = field?.closest(".game-card");
  if (field && card) updatePickFromField(card, field);
});
elements.scoreList.addEventListener("pointerdown", handleLinePointerDown);
elements.scoreList.addEventListener("pointermove", handleLinePointerMove);
elements.scoreList.addEventListener("pointerup", handleLinePointerUp);
elements.scoreList.addEventListener("pointercancel", handleLinePointerUp);

window.setInterval(refreshLivePicks, 30000);
elements.sectionKicker.textContent = formatCentralDateTime();
window.setInterval(() => {
  elements.sectionKicker.textContent = formatCentralDateTime();
}, 30000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") refreshLivePicks();
});

let touchStartY = null;
let pullRefreshInProgress = false;
document.addEventListener("touchstart", (event) => {
  touchStartY = window.scrollY === 0 && event.touches.length === 1
    ? event.touches[0].clientY
    : null;
}, { passive: true });

document.addEventListener("touchmove", (event) => {
  if (touchStartY !== null && event.touches.length === 1
    && event.touches[0].clientY > touchStartY && window.scrollY === 0) {
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener("touchend", (event) => {
  if (touchStartY === null) return;
  if (!event.changedTouches.length) {
    touchStartY = null;
    return;
  }
  const distance = event.changedTouches[0].clientY - touchStartY;
  touchStartY = null;
  if (!pullRefreshInProgress && window.scrollY === 0 && distance > 95) {
    pullRefreshInProgress = true;
    refreshScores().finally(() => { pullRefreshInProgress = false; });
  }
}, { passive: true });

document.addEventListener("touchcancel", () => {
  touchStartY = null;
}, { passive: true });

loadScores();
