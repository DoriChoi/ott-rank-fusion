export interface OTTData {
  platform: 'netflix' | 'disney' | 'wavve' | 'tving';
  title: string;
  rank: number;
  genre: string;
  weekly_views: number;
  region: string;
  week: string;
}

export interface IntegratedRanking {
  title: string;
  score: number;
  platforms: string[];
  mainPlatform: string;
  genre: string;
  totalViews: number;
  platformCount: number;
}

export async function loadPlatformData(platform: string): Promise<OTTData[]> {
  try {
    const response = await fetch(`/data/${platform}_top10.csv`);
    const csvText = await response.text();
    
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        platform: values[0] as any,
        title: values[1],
        rank: parseInt(values[2]),
        genre: values[3],
        weekly_views: parseInt(values[4]),
        region: values[5],
        week: values[6]
      };
    });
  } catch (error) {
    console.error(`Error loading ${platform} data:`, error);
    return [];
  }
}

export async function loadAllData(): Promise<OTTData[]> {
  const platforms = ['netflix', 'disney', 'wavve', 'tving'];
  const allData = await Promise.all(
    platforms.map(platform => loadPlatformData(platform))
  );
  
  return allData.flat();
}

export function calculateIntegratedRanking(data: OTTData[]): IntegratedRanking[] {
  const titleMap = new Map<string, {
    scores: number[];
    platforms: string[];
    genres: Set<string>;
    totalViews: number;
    bestRank: number;
    bestPlatform: string;
  }>();

  // Group by title and calculate scores
  data.forEach(item => {
    const score = 11 - item.rank; // 1st place = 10 points, 10th place = 1 point
    
    if (!titleMap.has(item.title)) {
      titleMap.set(item.title, {
        scores: [],
        platforms: [],
        genres: new Set(),
        totalViews: 0,
        bestRank: item.rank,
        bestPlatform: item.platform
      });
    }

    const titleData = titleMap.get(item.title)!;
    titleData.scores.push(score);
    titleData.platforms.push(item.platform);
    titleData.genres.add(item.genre);
    titleData.totalViews += item.weekly_views;

    // Track best ranking platform
    if (item.rank < titleData.bestRank) {
      titleData.bestRank = item.rank;
      titleData.bestPlatform = item.platform;
    }
  });

  // Convert to integrated ranking array
  const rankings: IntegratedRanking[] = Array.from(titleMap.entries()).map(([title, data]) => ({
    title,
    score: data.scores.reduce((sum, score) => sum + score, 0),
    platforms: data.platforms,
    mainPlatform: data.bestPlatform,
    genre: Array.from(data.genres)[0], // Use first genre
    totalViews: data.totalViews,
    platformCount: data.platforms.length
  }));

  // Sort by score (desc), then by total views (desc), then by title (asc)
  return rankings.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.totalViews !== a.totalViews) return b.totalViews - a.totalViews;
    return a.title.localeCompare(b.title, 'ko');
  });
}

export function getAvailableGenres(data: OTTData[]): string[] {
  const genres = new Set(data.map(item => item.genre));
  return Array.from(genres).sort();
}

export function getAvailableWeeks(data: OTTData[]): string[] {
  const weeks = new Set(data.map(item => item.week));
  return Array.from(weeks).sort().reverse(); // Most recent first
}

export function filterData(
  data: OTTData[],
  selectedPlatforms: string[],
  selectedGenres: string[],
  selectedWeek?: string
): OTTData[] {
  return data.filter(item => {
    const platformMatch = selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);
    const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(item.genre);
    const weekMatch = !selectedWeek || item.week === selectedWeek;
    
    return platformMatch && genreMatch && weekMatch;
  });
}

export function exportToCSV(rankings: IntegratedRanking[], filename: string): void {
  const headers = ['통합순위', '제목', '점수', '대표플랫폼', '장르', '총조회수', '등장플랫폼수', '등장플랫폼'];
  
  const csvContent = [
    headers.join(','),
    ...rankings.map((item, index) => [
      index + 1,
      item.title,
      item.score,
      item.mainPlatform,
      item.genre,
      item.totalViews.toLocaleString(),
      item.platformCount,
      item.platforms.join(';')
    ].join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}