import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export function AdminStatCard({ title, value, icon, subtitle }: Props) {
  return (
    <motion.div whileHover={{ y: -3 }}>
      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-all border-muted/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-muted-foreground font-medium">
            {title}
          </CardTitle>
          {icon}
        </CardHeader>

        <CardContent>
          {/* BIG NUMBER */}
          <p className="text-4xl font-bold tracking-tight">{value}</p>

          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
