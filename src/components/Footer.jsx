import { Smartphone, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-blue-500 text-white px-8 py-10 mt-10">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 text-center">

        <h2 className="text-3xl font-bold">Smartly</h2>

        <div className="flex gap-10 justify-center flex-wrap">
          <div>
            <div className="flex items-center gap-1 justify-center font-semibold">
              <Smartphone size={16} /> WhatsApp
            </div>
            <p className="text-sm">+1 202-918-2132</p>
          </div>
          <div>
            <div className="flex items-center gap-1 justify-center font-semibold">
              <Phone size={16} /> Call Us
            </div>
            <p className="text-sm">+1 202-918-2132</p>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Download App</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="App Store"
              className="h-10"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10"
            />
          </div>
        </div>

      </div>

      <div className="border-t border-white text-center text-xs mt-8 pt-4">
        <p>© 2026 All rights reserved. Smartly.</p>
      </div>
    </footer>
  );
}

export default Footer;