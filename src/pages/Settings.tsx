import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Cài đặt" description="Cấu hình chung hệ thống quản lý" />
      <Card className="shadow-card-soft">
        <CardHeader>
          <CardTitle className="font-display">Quy tắc thi đấu</CardTitle>
          <CardDescription>Các giới hạn và ngưỡng tự động</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Số cuộc đua tối đa / tuần / nài ngựa</Label>
              <Input type="number" defaultValue={4} />
            </div>
            <div className="space-y-1.5">
              <Label>Đóng đăng ký trước cuộc đua (giờ)</Label>
              <Input type="number" defaultValue={48} />
            </div>
            <div className="space-y-1.5">
              <Label>Cảnh báo GCN sức khỏe sắp hết (ngày)</Label>
              <Input type="number" defaultValue={30} />
            </div>
            <div className="space-y-1.5">
              <Label>Hệ số trọng số xếp hạng</Label>
              <Input type="number" step="0.01" defaultValue={1.0} />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div><Label>Tự động phát hiện xung đột lịch</Label><p className="text-xs text-muted-foreground">Cảnh báo khi 2 cuộc đua cùng giờ và đường đua</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Bắt buộc báo cáo trọng tài trước khi công bố</Label><p className="text-xs text-muted-foreground">Khoá nút công bố nếu thiếu báo cáo</p></div>
            <Switch defaultChecked />
          </div>
          <div className="pt-2 flex justify-end">
            <Button className="bg-gradient-primary text-primary-foreground">Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
