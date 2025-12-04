const list = [
  'Accessibility Statement',
  'Your Orders',
  'Shipping Rates & Policies',
  'Gorgon Prime',
  'Returns & Replacements',
  'Manage Your Content and Devices',
  'Your Account',
  'Help Center',
];

export default function HelpYou() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Let Us Help You</h4>
      <ul className="space-y-2 text-sm">
        {list.map((item, i) => (
          <li key={i}>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
