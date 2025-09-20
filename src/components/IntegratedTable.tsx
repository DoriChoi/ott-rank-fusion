import { IntegratedRanking } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

interface IntegratedTableProps {
  data: IntegratedRanking[];
  onDownload: () => void;
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

export function IntegratedTable({ data, onDownload }: IntegratedTableProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            📋 통합 순위 테이블
          </CardTitle>
          <Button variant="outline" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            CSV 다운로드
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-16">
            표시할 데이터가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          📋 통합 순위 테이블
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="w-4 h-4 mr-2" />
          CSV 다운로드
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">순위</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">제목</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">점수</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">대표 플랫폼</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">장르</th>
                <th className="text-right p-4 text-sm font-semibold text-muted-foreground">총 조회수</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">등장 플랫폼</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.title} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="p-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground max-w-xs">
                    <div className="truncate" title={item.title}>
                      {item.title}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-primary text-lg">
                      {item.score}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Badge 
                      className={platformColors[item.mainPlatform as keyof typeof platformColors] || 'bg-secondary text-secondary-foreground'}
                    >
                      {platformLabels[item.mainPlatform as keyof typeof platformLabels] || item.mainPlatform}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="secondary" className="text-xs">
                      {item.genre}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-sm text-muted-foreground">
                    {item.totalViews.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-1 justify-center flex-wrap">
                      {item.platforms.map(platform => (
                        <Badge 
                          key={platform}
                          variant="outline"
                          className="text-xs"
                        >
                          {platformLabels[platform as keyof typeof platformLabels] || platform}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}