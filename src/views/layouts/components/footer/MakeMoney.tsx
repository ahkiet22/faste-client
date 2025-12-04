const items = [
  "Sell on Gorgon",
  "Sell Your Brand on Gorgon",
  "Sell on Gorgon Business",
  "Sell Your Apps on Gorgon",
  "Become an Affiliate",
  "Advertise Your Products",
  "Sell-Publish with Us",
  "Become an Blowwe Vendor",
];

export default function MakeMoney() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Make Money with Us</h4>
      <ul className="space-y-2 text-sm">
        {items.map((item, i) => (
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
