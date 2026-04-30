import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Configuratore Prodotto",
  description: "B2B Product Configurator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var log = function(type, msg) {
              try { fetch('/api/log', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type: type, msg: msg, url: location.href, ua: navigator.userAgent }) }); } catch(e) {}
            };
            log('init', 'script loaded, readyState=' + document.readyState);
            window.addEventListener('error', function(e) { log('js-error', e.message + ' @ ' + e.filename + ':' + e.lineno); });
            window.addEventListener('unhandledrejection', function(e) { log('promise-error', String(e.reason)); });
            document.addEventListener('DOMContentLoaded', function() { log('dom-ready', 'DOMContentLoaded fired'); });
            window.addEventListener('load', function() { log('load', 'window.load fired'); });
          })();
        ` }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
