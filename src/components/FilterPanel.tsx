import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  availablePlatforms: string[];
  availableGenres: string[];
  availableWeeks: string[];
  selectedPlatforms: string[];
  selectedGenres: string[];
  selectedWeek: string;
  onPlatformChange: (platforms: string[]) => void;
  onGenreChange: (genres: string[]) => void;
  onWeekChange: (week: string) => void;
  onReset: () => void;
}

const platformLabels = {
  netflix: '넷플릭스',
  disney: '디즈니+',
  wavve: '웨이브',
  tving: '티빙'
};

const platformColors = {
  netflix: 'bg-netflix text-netflix-foreground',
  disney: 'bg-disney text-disney-foreground',
  wavve: 'bg-wavve text-wavve-foreground',
  tving: 'bg-tving text-tving-foreground'
};

export function FilterPanel({
  availablePlatforms,
  availableGenres,
  availableWeeks,
  selectedPlatforms,
  selectedGenres,
  selectedWeek,
  onPlatformChange,
  onGenreChange,
  onWeekChange,
  onReset
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformChange([...selectedPlatforms, platform]);
    }
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  const activeFiltersCount = selectedPlatforms.length + selectedGenres.length + (selectedWeek !== availableWeeks[0] ? 1 : 0);

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            필터
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Week Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">주차 선택</h3>
              <select
                value={selectedWeek}
                onChange={(e) => onWeekChange(e.target.value)}
                className="w-full p-2 bg-background border border-border rounded-md text-foreground"
              >
                {availableWeeks.map(week => (
                  <option key={week} value={week}>
                    {week}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">플랫폼</h3>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map(platform => {
                  const isSelected = selectedPlatforms.includes(platform);
                  const label = platformLabels[platform as keyof typeof platformLabels] || platform;
                  const colorClass = platformColors[platform as keyof typeof platformColors];
                  
                  return (
                    <Button
                      key={platform}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePlatform(platform)}
                      className={isSelected ? colorClass : ""}
                    >
                      {label}
                      {isSelected && <X className="w-3 h-3 ml-1" />}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Genre Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">장르</h3>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map(genre => {
                  const isSelected = selectedGenres.includes(genre);
                  
                  return (
                    <Button
                      key={genre}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                      {isSelected && <X className="w-3 h-3 ml-1" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}