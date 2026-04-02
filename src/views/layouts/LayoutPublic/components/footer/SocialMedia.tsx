import { Icon } from '@iconify/react';

export default function SocialMedia() {
  return (
    <div className="pt-4 border-t border-border/50">
      <p className="text-sm font-semibold mb-4 tracking-wide">THEO DÕI CHÚNG TÔI</p>
      <div className="flex gap-4">
        {[
          { icon: 'line-md:facebook', color: 'hover:text-blue-500' },
          { icon: 'prime:twitter', color: 'hover:text-sky-400' },
          { icon: 'lets-icons:insta', color: 'hover:text-pink-500' },
          { icon: 'ri:linkedin-fill', color: 'hover:text-blue-600' }
        ].map((item, index) => (
          <a
            key={index}
            href="#"
            className={`w-10 h-10 bg-muted/40 rounded-full flex items-center justify-center text-muted-foreground transition-all duration-300 hover:bg-muted ${item.color} hover:scale-110 active:scale-95`}
          >
            <Icon icon={item.icon} width="22" height="22" />
          </a>
        ))}
      </div>
    </div>
  );
}
