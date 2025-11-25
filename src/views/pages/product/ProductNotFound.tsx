import { Icon } from '@iconify/react';

export default function ProductNotFound({ keyword }: { keyword?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 text-center">
      <Icon
        icon="mdi:package-variant-remove"
        className="text-gray-400"
        width={150}
        height={150}
      />

      <h2 className="mt-4 text-lg font-medium text-gray-700">
        Không tìm thấy sản phẩm
      </h2>

      {keyword && (
        <p className="text-sm text-gray-500 mt-1">
          Kết quả cho từ khóa: <span className="text-red-500">{keyword}</span>
        </p>
      )}

      <p className="text-sm text-gray-400 mt-1">
        Hãy thử từ khóa khác hoặc thay đổi bộ lọc tìm kiếm
      </p>
    </div>
  );
}
