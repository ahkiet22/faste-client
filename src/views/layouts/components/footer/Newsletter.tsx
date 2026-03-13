import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Newsletter() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-16">
      <div className="max-w-xl">
        <h3 className="text-2xl font-bold mb-3 tracking-tight">
          Tham gia bản tin của chúng tôi
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Đăng ký ngay để nhận thông tin cập nhật mới nhất về các chương trình khuyến mãi và mã giảm giá. 
          Chúng tôi cam kết không gửi thư rác.
        </p>
      </div>

      <div className="w-full lg:max-w-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input 
            placeholder="Nhập địa chỉ email của bạn" 
            className="h-12 bg-background border-border"
          />
          <Button className="h-12 px-8 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            GỬI NGAY
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <a href="#" className="text-foreground font-medium underline-offset-4 hover:underline">
            Điều khoản & Điều kiện
          </a>{' '}
          và{' '}
          <a href="#" className="text-foreground font-medium underline-offset-4 hover:underline">
            Chính sách Quyền riêng tư
          </a>
          .
        </p>
      </div>
    </div>
  );
}
