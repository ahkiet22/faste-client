import { Icon } from '@iconify/react/dist/iconify.js';

export default function SocialMedia() {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium mb-3">Follow us on social media:</p>
      <div className="flex gap-3">
        <a
          href="#"
          className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
        >
          <Icon icon="line-md:facebook" width="24" height="24" />
        </a>
        <a
          href="#"
          className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800"
        >
          <Icon icon="prime:twitter" width="14" height="14" />
        </a>
        <a
          href="#"
          className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white"
        >
          <Icon icon="lets-icons:insta" width="24" height="24" />
        </a>
        <a
          href="#"
          className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800"
        >
          <Icon icon="ri:linkedin-fill" width="24" height="24" />
        </a>
      </div>
    </div>
  );
}
