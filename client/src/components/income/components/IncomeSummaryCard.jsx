import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const IncomeSummaryCard = ({ title, value, icon, iconColor = 'text-muted-foreground', valueColor = '' }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {icon && <div className={iconColor}>{icon}</div>}
            <span className={`text-2xl font-bold ${valueColor}`}>
              {value}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSummaryCard; 