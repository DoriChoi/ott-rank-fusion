import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OTTData } from "@/lib/data";

interface PlatformCardProps {
  platform: 'netflix' | 'disney' | 'wavve' | 'tving';
  data: OTTData[];
}

const platformConfig = {
  netflix: {
    name: '넷플릭스',
    gradient: 'bg-gradient-netflix',
    color: 'text-netflix-foreground',
    icon: '🎬'
  },
  disney: {
    name: '디즈니+',
    gradient: 'bg-gradient-disney',
    color: 'text-disney-foreground',
    icon: '🏰'
  },
  wavve: {
    name: '웨이브',
    gradient: 'bg-gradient-wavve',
    color: 'text-wavve-foreground',
    icon: '🌊'
  },
  tving: {
    name: '티빙',
    gradient: 'bg-gradient-tving',
    color: 'text-tving-foreground',
    icon: '📺'
  }
};

export function PlatformCard({ platform, data }: PlatformCardProps) {
  const config = platformConfig[platform];
  const top5Data = data
    .filter(item => item.platform === platform)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);

  if (top5Data.length === 0) {
    return (
      <Card className="bg-card border-border hover:shadow-glow transition-all duration-300">
        <CardHeader className={`${config.gradient} rounded-t-lg`}>
          <CardTitle className={`${config.color} flex items-center gap-2 text-lg font-bold`}>
            <span className="text-2xl">{config.icon}</span>
            {config.name} TOP 5
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-8">
            데이터가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border hover:shadow-glow transition-all duration-300">
      <CardHeader className={`${config.gradient} rounded-t-lg`}>
        <CardTitle className={`${config.color} flex items-center gap-2 text-lg font-bold`}>
          <span className="text-2xl">{config.icon}</span>
          {config.name} TOP 5
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">순위</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">제목</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">장르</th>
                <th className="text-right p-3 text-sm font-semibold text-muted-foreground">조회수</th>
              </tr>
            </thead>
            <tbody>
              {top5Data.map((item) => (
                <tr key={`${item.platform}-${item.rank}`} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="p-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {item.rank}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-foreground">{item.title}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.genre}
                    </Badge>
                  </td>
                  <td className="p-3 text-right text-sm text-muted-foreground">
                    {item.weekly_views.toLocaleString()}
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