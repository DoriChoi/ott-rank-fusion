import { Card, CardContent } from '@/components/ui/card';
import { IntegratedRanking } from '@/lib/data';

interface KPICardsProps {
  selectedPlatforms: string[];
  totalTitles: number;
  topScore: number;
  totalViews: number;
}

export function KPICards({ selectedPlatforms, totalTitles, topScore, totalViews }: KPICardsProps) {
  const kpis = [
    {
      title: '선택된 플랫폼',
      value: selectedPlatforms.length || '전체',
      unit: selectedPlatforms.length ? '개' : '',
      icon: '📱',
      gradient: 'bg-gradient-primary'
    },
    {
      title: '총 타이틀 수',
      value: totalTitles.toLocaleString(),
      unit: '개',
      icon: '🎬',
      gradient: 'bg-gradient-netflix'
    },
    {
      title: '최고 점수',
      value: topScore,
      unit: '점',
      icon: '🏆',
      gradient: 'bg-gradient-disney'
    },
    {
      title: '총 조회수',
      value: (totalViews / 1000000).toFixed(1),
      unit: 'M',
      icon: '👀',
      gradient: 'bg-gradient-wavve'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-card border-border hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className={`${kpi.gradient} rounded-lg p-4 mb-4`}>
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <div className="text-white">
                <div className="text-2xl font-bold">
                  {kpi.value}
                  <span className="text-sm font-normal ml-1">{kpi.unit}</span>
                </div>
                <div className="text-sm opacity-90">{kpi.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}