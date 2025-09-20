import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IntegratedRanking } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IntegratedChartProps {
  data: IntegratedRanking[];
}

const platformColors = {
  netflix: 'hsl(var(--netflix))',
  disney: 'hsl(var(--disney))',
  wavve: 'hsl(var(--wavve))',
  tving: 'hsl(var(--tving))'
};

export function IntegratedChart({ data }: IntegratedChartProps) {
  const top10Data = data.slice(0, 10).map((item, index) => ({
    ...item,
    rank: index + 1,
    color: platformColors[item.mainPlatform as keyof typeof platformColors] || 'hsl(var(--primary))'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.title}</p>
          <p className="text-sm text-muted-foreground">점수: {data.score}점</p>
          <p className="text-sm text-muted-foreground">대표 플랫폼: {data.mainPlatform}</p>
          <p className="text-sm text-muted-foreground">장르: {data.genre}</p>
          <p className="text-sm text-muted-foreground">등장 플랫폼: {data.platformCount}개</p>
          <p className="text-sm text-muted-foreground">총 조회수: {data.totalViews.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  if (top10Data.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            📊 통합 랭킹 TOP 10
          </CardTitle>
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
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          📊 통합 랭킹 TOP 10
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top10Data}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                dataKey="title" 
                type="category" 
                width={100}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}