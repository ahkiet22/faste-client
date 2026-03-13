import { Icon } from '@iconify/react';

export default function DownloadApp() {
  return (
    <div className="mb-8">
      <h4 className="font-bold text-sm mb-5 tracking-wider uppercase">TẢI ỨNG DỤNG</h4>

      <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
        <a href="#" className="flex-1 transition-transform hover:-translate-y-1">
          <div className="bg-foreground text-background rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Icon icon="logos:google-play-icon" width="22" />
            <div>
              <div className="text-[10px] font-medium opacity-80 leading-none mb-1">GET IT ON</div>
              <div className="font-bold text-sm leading-none">Google Play</div>
            </div>
          </div>
        </a>

        <a href="#" className="flex-1 transition-transform hover:-translate-y-1">
          <div className="bg-foreground text-background rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Icon icon="ic:baseline-apple" width="24" />
            <div>
              <div className="text-[10px] font-medium opacity-80 leading-none mb-1">Download on</div>
              <div className="font-bold text-sm leading-none">App Store</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
