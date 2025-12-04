const Copyright = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-muted-foreground">
      <p>
        Copyright 2024 © Blowwe WooCommerce WordPress Theme. All right
        reserved. Powered by Ecomify Themes.
      </p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-foreground">
          Terms and Conditions
        </a>
        <a href="#" className="hover:text-foreground">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-foreground">
          Order Tracking
        </a>
      </div>
    </div>
  );
};

export default Copyright;