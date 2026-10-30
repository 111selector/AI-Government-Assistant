// Comprehensive content moderation for AI Government Assistant
// Enforces respectful, civil, and family-friendly citizen communications.

// Categorized inappropriate words and patterns
const INSULT_PATTERNS = [
  'idiot', 'stupid', 'moron', 'dumb', 'loser', 'shut up', 'trash', 'scumbag',
  'ugly', 'worthless', 'jerk', 'creep', 'freak', 'psycho', 'retard', 'retarded',
  'clown', 'imbecile', 'pig', 'parasite', 'scum', 'ignorant', 'fool', 'dirtbag'
];

const VULGAR_PATTERNS = [
  'fuck', 'fucking', 'fucker', 'motherfucker', 'shit', 'shitty', 'bullshit',
  'bitch', 'bitches', 'bitching', 'asshole', 'ass', 'bastard', 'crap', 'damn',
  'dick', 'cock', 'pussy', 'cunt', 'twat', 'prick', 'wanker', 'bollocks', 'bugger'
];

const ADULT_PATTERNS = [
  'porn', 'porno', 'pornography', 'xxx', 'nsfw', 'sex', 'sexy', 'nude', 'naked',
  'erotic', 'boobs', 'tits', 'penis', 'vagina', 'dildo', 'cum', 'orgasm',
  'blowjob', 'handjob', 'stripper', 'escort', 'hardcore', 'milf', 'hentai',
  'masturbat', 'ejaculat', 'whore', 'slut', 'hooker'
];

const MULTILINGUAL_PATTERNS = [
  'mierda', 'puta', 'puto', 'coño', 'cabron', 'chinga', 'pendejo', 'verga', 'culo',
  'merde', 'putain', 'salope', 'connard', 'enculé', 'pute', 'chier',
  'scheisse', 'arschloch', 'hure', 'schlampe'
];

// Normalize text for leetspeak and obfuscation
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();

  // Normalize accented characters
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Convert common leetspeak substitutions
  normalized = normalized
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/7/g, 't')
    .replace(/\+/g, 't');

  // Collapse repeated characters (e.g. fuuuuck -> fuck)
  normalized = normalized.replace(/(.)\1{2,}/g, '$1$1');

  return normalized;
}

export interface ModerationResult {
  isClean: boolean;
  category?: 'insult' | 'vulgar' | 'adult' | 'multilingual';
  reason?: string;
  matchedWord?: string;
}

export function moderateContent(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true };
  }

  const rawLower = text.toLowerCase();
  const normalized = normalizeText(text);

  // Check all pattern categories
  const testList = (list: string[], category: ModerationResult['category'], label: string): ModerationResult | null => {
    for (const pattern of list) {
      // Word boundary regex on raw
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexRaw = new RegExp(`\\b${escapedPattern}\\b`, 'i');
      const regexSubstr = new RegExp(escapedPattern, 'i');

      // Check on raw text
      if (regexRaw.test(rawLower)) {
        return {
          isClean: false,
          category,
          reason: `Your message contains ${label} ("${pattern}"). Government assistance requires respectful, civil communication.`,
          matchedWord: pattern,
        };
      }

      // Check on normalized text (leetspeak / spaced / altered)
      if (regexSubstr.test(normalized)) {
        // Only trigger if pattern is 3+ chars or bounded
        if (pattern.length >= 3) {
          const normWordBound = new RegExp(`(?:^|[^a-z0-9])${escapedPattern}(?:$|[^a-z0-9])`, 'i');
          if (normWordBound.test(normalized) || pattern.length >= 4) {
            return {
              isClean: false,
              category,
              reason: `Your message contains ${label} ("${pattern}"). Government assistance requires respectful, civil communication.`,
              matchedWord: pattern,
            };
          }
        }
      }
    }
    return null;
  };

  const adultCheck = testList(ADULT_PATTERNS, 'adult', 'adult or sexually explicit language');
  if (adultCheck) return adultCheck;

  const vulgarCheck = testList(VULGAR_PATTERNS, 'vulgar', 'inappropriate or vulgar language');
  if (vulgarCheck) return vulgarCheck;

  const insultCheck = testList(INSULT_PATTERNS, 'insult', 'insulting or abusive words');
  if (insultCheck) return insultCheck;

  const multiCheck = testList(MULTILINGUAL_PATTERNS, 'multilingual', 'offensive language');
  if (multiCheck) return multiCheck;

  return { isClean: true };
}

export function sanitizeText(text: string): string {
  let clean = text;
  const allPatterns = [...ADULT_PATTERNS, ...VULGAR_PATTERNS, ...INSULT_PATTERNS, ...MULTILINGUAL_PATTERNS];
  for (const pattern of allPatterns) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    clean = clean.replace(regex, '*'.repeat(pattern.length));
  }
  return clean;
}
