import './globals.css';
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'VeriPlate | Tap to verify your car', description: 'NFC tags linked to your VIN. Tap to check the car behind the plate. Join the waitlist.',
};
export default function Root({ children }) { return <html lang="en-GB"><body>{children}</body></html>; }
