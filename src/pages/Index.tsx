import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import {
  loadAllData,
  calculateIntegratedRanking,
  getAvailableGenres,
  getAvailableWeeks,
  filterData,
  exportToCSV,
  type OTTData
} from '@/lib/data';
import { loadIntegratedFromAPI, type IntegratedRanking } from '@/lib/data';

import { PlatformCard } from '@/components/PlatformCard';
import { IntegratedChart } from '@/components/IntegratedChart';
import { IntegratedTable } from '@/components/IntegratedTable';
import { FilterPanel } from '@/components/FilterPanel';
import { KPICards } from '@/components/KPICards';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allData, setAllData] = useState<OTTData[]>([]);
  const [filteredData, setFilteredData] = useState<OTTData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiIntegrated, setApiIntegrated] = useState<IntegratedRanking[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  
  // URL state management
  const selectedPlatforms = searchParams.get('platforms')?.split(',').filter(Boolean) || [];
  const selectedGenres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
  const selectedWeek = searchParams.get('week') || '';

  // Derived data
  const availablePlatforms = ['netflix', 'disney', 'wavve', 'tving'];
  const availableGenres = getAvailableGenres(allData);
  const availableWeeks = getAvailableWeeks(allData);
  const integratedRanking = apiIntegrated ?? calculateIntegratedRanking(filteredData);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await loadAllData();
        setAllData(data);
        
        // Set default week if not specified
        if (!selectedWeek && data.length > 0) {
          const weeks = getAvailableWeeks(data);
          const newParams = new URLSearchParams(searchParams);
          newParams.set('week', weeks[0]);
          setSearchParams(newParams);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Try API-integrated rankings whenever week changes
  useEffect(() => {
    const doFetch = async () => {
      const currentWeek = selectedWeek || (availableWeeks.length > 0 ? availableWeeks[0] : '');
      if (!currentWeek) return;
      setApiLoading(true);
      try {
        const integrated = await loadIntegratedFromAPI(currentWeek, (selectedPlatforms && selectedPlatforms.length > 0) ? selectedPlatforms.join(',') : 'all');
        setApiIntegrated(integrated);
      } catch (e) {
        console.warn('API integrated fetch failed', e);
        setApiIntegrated(null);
      } finally {
        setApiLoading(false);
      }
    };
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, searchParams.toString()]);

  // Filter data when parameters change
  useEffect(() => {
    const currentWeek = selectedWeek || (availableWeeks.length > 0 ? availableWeeks[0] : '');
    const filtered = filterData(allData, selectedPlatforms, selectedGenres, currentWeek);
    setFilteredData(filtered);
  }, [allData, selectedPlatforms, selectedGenres, selectedWeek, availableWeeks]);

  // URL update functions
  const updateSearchParams = (key: string, value: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (Array.isArray(value) && value.length > 0) {
      newParams.set(key, value.join(','));
    } else if (typeof value === 'string' && value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handlePlatformChange = (platforms: string[]) => {
    updateSearchParams('platforms', platforms);
  };

  const handleGenreChange = (genres: string[]) => {
    updateSearchParams('genres', genres);
  };

  const handleWeekChange = (week: string) => {
    updateSearchParams('week', week);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleDownload = () => {
    const currentWeek = selectedWeek || (availableWeeks.length > 0 ? availableWeeks[0] : '');
    const platforms = selectedPlatforms.length > 0 ? selectedPlatforms.join('-') : 'all';
    const genres = selectedGenres.length > 0 ? selectedGenres.join('-') : 'all';
    const filename = `liverank_mini_${currentWeek}_${platforms}_${genres}.csv`;
    
    exportToCSV(integratedRanking, filename);
  };

  // Calculate KPIs
  const totalViews = integratedRanking.reduce((sum, item) => sum + item.totalViews, 0);
  const topScore = integratedRanking.length > 0 ? integratedRanking[0].score : 0;

  if (isLoading || apiLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                LiveRank Mini
              </h1>
              <p className="text-muted-foreground mt-1">
                통합 OTT 랭킹 서비스
              </p>
            </div>
            <div className="flex items-center gap-4">
              {availableWeeks.length > 0 && (
                <select
                  value={selectedWeek || availableWeeks[0]}
                  onChange={(e) => handleWeekChange(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  {availableWeeks.map(week => (
                    <option key={week} value={week}>
                      {week} 주차
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Filter Panel */}
        <FilterPanel
          availablePlatforms={availablePlatforms}
          availableGenres={availableGenres}
          availableWeeks={availableWeeks}
          selectedPlatforms={selectedPlatforms}
          selectedGenres={selectedGenres}
          selectedWeek={selectedWeek || (availableWeeks.length > 0 ? availableWeeks[0] : '')}
          onPlatformChange={handlePlatformChange}
          onGenreChange={handleGenreChange}
          onWeekChange={handleWeekChange}
          onReset={handleReset}
        />

        {/* KPI Cards */}
        <KPICards
          selectedPlatforms={selectedPlatforms}
          totalTitles={integratedRanking.length}
          topScore={topScore}
          totalViews={totalViews}
        />

        {/* Platform Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground">플랫폼별 TOP 5</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {availablePlatforms.map(platform => (
              <PlatformCard
                key={platform}
                platform={platform as any}
                data={filteredData}
              />
            ))}
          </div>
        </section>

        {/* Integrated Chart */}
        <section>
          <IntegratedChart data={integratedRanking} />
        </section>

        {/* Integrated Table */}
        <section>
          <IntegratedTable data={integratedRanking} onDownload={handleDownload} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">LiveRank Mini - 통합 OTT 랭킹 서비스</p>
            <p className="text-sm">한눈에 보는 넷플릭스, 디즈니+, 웨이브, 티빙 인기 콘텐츠</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
