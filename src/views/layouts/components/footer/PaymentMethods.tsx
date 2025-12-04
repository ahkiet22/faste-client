import Image from 'next/image';

export default function PaymentMethods() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Image src={'/svgs/visa.svg'} alt="visa" width={50} height={50} />
        <Image
          src={'/svgs/List Item SVG.svg'}
          alt="itemlogo"
          width={50}
          height={50}
        />
        <Image src={'/svgs/paypal.svg'} alt="paypal" width={50} height={50} />
        <Image src={'/svgs/klarna.svg'} alt="klarna" width={50} height={50} />
        <Image src={'/svgs/skrill.svg'} alt="skrill" width={50} height={50} />
      </div>
    </div>
  );
}
