'use client';

import CardSpotlightDemo from '@/components/CardSpotlight';
import SpotlightSlider from '@/components/SpotlightSlider';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import Image from 'next/image';
// bg-[#140540]
export default function Home() {
  return (
    <div>
      <div className="w-full h-screen bg-[#140540] relative">
        <div className="flex items-center justify-between w-full px-8 pt-6 absolute top-0 z-10 text-white  ">
          <div>
            <Image src={'/vercel.svg'} width={40} height={40} alt="logo" />
          </div>
          <div>
            <ul className="flex items-center gap-x-8">
              <li>Feed</li>
              <li>Trending</li>
              <li>Art</li>
              <li>Live</li>
            </ul>
          </div>
          <div>
            <Button variant={'ghost'} className="text-white">
              <Icon icon="material-symbols-light:search" className="w-8 h-8" />
            </Button>
            <Button className="text-white bg-blue-500">Connect Wallet</Button>
          </div>
        </div>
        <div className="flex w-full h-screen z-10">
          <div className="cut-corner-left bg-custom-gradient-1 w-48 h-[680px]"></div>
          <div className="flex-1 h-[477px] bg-custom-gradient-1"></div>
          <div className="cut-corner-right bg-custom-gradient-1 w-48 h-[680px]"></div>
        </div>
        {/*  */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[70px] w-full">
          {/* <CardSpotlightDemo />1 */}
          <SpotlightSlider />
        </div>
        <div className="absolute bottom-20 left-40 max-md:hidden">
          <Image
            src={'/svgs/people-3.svg'}
            alt="people"
            width={100}
            height={100}
            className="w-[130px]"
          />
        </div>
        <div className="absolute bottom-20 right-45 max-md:hidden">
          <Image
            src={'/svgs/people-2.svg'}
            alt="people"
            width={100}
            height={100}
            className="w-[130px]"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col absolute justify-center  items-center gap-4 bottom-5 left-1/2 -translate-x-1/2 z-10 text-white">
          <h2 className="text-5xl max-w-xl text-center font-semibold">
            <span className="text-[#661DFA]">Discover, Collect</span> and{' '}
            <span className="text-[#661DFA]">Sell</span> Extraordinary{' '}
            <span className="text-[#661DFA]">NFTs!</span>
          </h2>
          <div className="flex items-center">
            <div className="max-w-[17rem]">
              <p className="text-sm">
                Digital marketplace for crypto collectibles and non-fungible
                tokens (NFTs).Buy. Sell.
              </p>
            </div>

            <div className="flex gap-x-2">
              <Button className="bg-gradient-to-r from-purple-800 to-purple-500 border border-black">
                <span>Get started</span>
              </Button>

              <Button
                variant={'outline'}
                className="text-white bg-transparent border-purple-500 hover:text-white hover:bg-gradient-to-r from-purple-800 to-purple-500"
              >
                <span>Create NFT</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>OK</div>
    </div>
  );
}
