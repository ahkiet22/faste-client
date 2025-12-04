const list = [
  'Careers for Gorgon',
  'About Gorgon',
  'Investor Relations',
  'Gorgon Devices',
  'Customer reviews',
  'Social Responsibility',
  'Store Locations',
];

export default function KnowUs() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Get to Know Us</h4>
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
