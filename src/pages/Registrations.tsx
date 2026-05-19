import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Registrations() {
  const { registrations, updateRegistrationStatus } = useData();
  const pending = registrations.filter(r => r.status === "Chờ duyệt").length;
  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý đăng ký" description="Duyệt đăng ký tham gia, đăng ký tự đóng trước cuộc đua 48 giờ" />

      <Alert className="border-accent/40 bg-accent/5">
        <Clock className="h-4 w-4 text-accent" />
        <AlertDescription>
          <span className="font-semibold">{pending} đăng ký đang chờ duyệt.</span> Hệ thống tự động đóng đăng ký 48 giờ trước giờ thi đấu.
        </AlertDescription>
      </Alert>

      <Card className="shadow-card-soft">
        <CardContent className="p-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Mã</TableHead>
                  <TableHead>Cuộc đua</TableHead>
                  <TableHead>Ngựa</TableHead>
                  <TableHead>Nài ngựa</TableHead>
                  <TableHead className="hidden md:table-cell">Đăng ký lúc</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.raceName}</TableCell>
                    <TableCell>{r.horseName}</TableCell>
                    <TableCell>{r.jockeyName}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.registeredAt}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      {r.status === "Chờ duyệt" ? (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-8 text-success border-success/40 hover:bg-success/10" onClick={() => updateRegistrationStatus(r.id, "Đã duyệt")}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Duyệt
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => updateRegistrationStatus(r.id, "Từ chối")}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Từ chối
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-8">Xem</Button>
                      )}
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
