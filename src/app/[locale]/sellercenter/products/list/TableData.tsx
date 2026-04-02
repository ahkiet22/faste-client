import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

interface TProps {
  data: any[];
  totalItem: number;
  page: number;
  limit: number;
  totalPage: number;
}

export function TableData(props: TProps) {
  const { data, limit, page, totalItem, totalPage } = props;
  console.log(data);
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">
            <Checkbox />
          </TableHead>
          <TableHead></TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Publish on</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>
              <Image
                src={item.images[0] ? item.images[0] : '/vercel.svg'}
                width={100}
                height={100}
                alt="product"
                className="w-12 h-12 overflow-hidden rounded-xl border border-gray-300 object-cover"
              />
            </TableCell>
            <TableCell className="font-medium text-blue-600 hover:underline">
              <Link href={`/product/${item.slugId}`}>{item.name}</Link>
            </TableCell>
            <TableCell>{item.skus[0].price}</TableCell>
            <TableCell>{'Tivi'}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={clsx(
                  'px-3 py-1 font-medium rounded-full border-2', // border rõ hơn outline mặc định
                  {
                    'border-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-300':
                      item.status === 'DRAFT',

                    'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400':
                      item.status === 'PUBLISHED',

                    'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400':
                      item.status === 'ARCHIVED',
                  },
                )}
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>{item.skus.length}</TableCell>
            <TableCell>
              {dayjs(item.publishedAt).format('MMM D, hh:mm A')}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'outline'}>
                    <Icon icon="weui:more-filled" width="18" height="18" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Xem</DropdownMenuItem>
                  <DropdownMenuItem>Sửa</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 hover:!text-red-500">
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter className='flex items-center justify-center w-full'>
        <PaginationTable />
      </TableFooter> */}
    </Table>
  );
}
