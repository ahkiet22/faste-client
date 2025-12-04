import { Icon } from '@iconify/react';

export default function DownloadApp() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Download our app</h4>

      <div className="space-y-2">
        <a href="#" className="block">
          <div className="bg-black text-white rounded-lg px-4 py-2 text-xs flex items-center gap-2">
            <Icon icon="logos:google-play-icon" width="24" />
            <div>
              <div className="text-xs opacity-75">GET IT ON</div>
              <div className="font-semibold">Google Play</div>
            </div>
          </div>
        </a>

        <a href="#" className="block">
          <div className="bg-black text-white rounded-lg px-4 py-2 text-xs flex items-center gap-2">
            <Icon icon="ic:baseline-apple" width="24" />
            <div>
              <div className="text-xs opacity-75">Download on the</div>
              <div className="font-semibold">App Store</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
