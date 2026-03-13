'use client';

// ** React
import React from 'react';

// ** Components footer
import Newsletter from './Newsletter';
import PaymentMethods from './PaymentMethods';
import Copyright from './Copyright';
import SocialMedia from './SocialMedia';
import KnowUs from './KnowUs';
import MakeMoney from './MakeMoney';
import HelpYou from './HelpYou';
import Help from './Help';
import DownloadApp from './DownloadApp';

const Footer = () => {
  return (
    <footer className="bg-card/30 border-t border-border mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-8">
        <div className="mb-16">
          <Newsletter />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="col-span-2 sm:col-span-1">
            <Help />
          </div>

          <div className="col-span-1">
            <MakeMoney />
          </div>

          <div className="col-span-1">
            <HelpYou />
          </div>

          <div className="col-span-1">
            <KnowUs />
          </div>

          <div className="col-span-2 lg:col-span-1 space-y-8">
            <DownloadApp />
            <SocialMedia />
          </div>
        </div>

        <div className="border-t border-border pt-10">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-10">
            <div className="order-2 xl:order-1">
              <PaymentMethods />
            </div>

            <div className="order-1 xl:order-2 w-full xl:w-auto">
              <Copyright />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
