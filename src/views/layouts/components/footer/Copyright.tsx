const Copyright = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-muted-foreground/80">
      <p className="text-center lg:text-left leading-loose">
        Bản quyền 2024 © <strong>FastE Ecommerce</strong>. Tất cả các quyền đã được bảo lưu. 
        Được cung cấp bởi FastE Team.
      </p>
      <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2 font-medium">
        <a href="#" className="hover:text-foreground transition-colors">
          Điều khoản & Điều kiện
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Chính sách Bảo mật
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Theo dõi Đơn hàng
        </a>
      </div>
    </div>
  );
};

export default Copyright;