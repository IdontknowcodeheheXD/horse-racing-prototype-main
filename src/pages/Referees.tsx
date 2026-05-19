import { ShieldCheck, FileText, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { RefereeAssignmentDialog } from "@/components/forms/RefereeAssignmentDialog";

export default function Referees() {
  const { referees, races } = useData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý trọng tài"
        description="Phân công trọng tài, theo dõi báo cáo và vi phạm"
      />

      <Card className="shadow-card-soft">
        <CardContent className="p-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Mã</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Cuộc đua phụ trách</TableHead>
                  <TableHead>Báo cáo chờ nộp</TableHead>
                  <TableHead>Vi phạm ghi nhận</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referees.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell><Badge variant="secondary">{r.assignedRaces} cuộc</Badge></TableCell>
                    <TableCell>
                      {r.pendingReports > 0 ? (
                        <Badge className="bg-warning/20 text-warning-foreground border-warning/40 border">
                          <FileText className="h-3 w-3 mr-1" /> {r.pendingReports} chờ nộp
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Đã nộp đủ</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.violations > 0 ? (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                          <AlertTriangle className="h-3 w-3 mr-1" /> {r.violations} vi phạm
                        </Badge>
                      ) : (
                        <span className="text-xs text-success">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <RefereeAssignmentDialog
                        trigger={<Button variant="outline" size="sm">Phân công</Button>}
                        refereeId={r.id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
