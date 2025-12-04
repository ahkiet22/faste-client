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
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Main footer content */}
        {/* Newsletter Section */}
        <Newsletter />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Do You Need Help Section */}
          <Help />

          {/* Make Money with Us */}
          <MakeMoney />

          {/* Let Us Help You */}
          <HelpYou />

          {/* Get to Know Us & Download App */}
          <KnowUs />
          <div>
            <DownloadApp />

            {/* Social Media */}
            <SocialMedia />
          </div>
        </div>

        {/* Bottom section with payment methods and copyright */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Payment methods */}
            <PaymentMethods />

            {/* Copyright and links */}
            <Copyright />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
