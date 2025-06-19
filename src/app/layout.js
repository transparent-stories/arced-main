import { AOSInit } from '@/utils/aos';
import '../app/globals.css';
import Providers from './providers';
import Link from 'next/link';
import { Sora } from 'next/font/google'
import _customFont from '@/app/font'

const _sora = Sora({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  varibale: '--font-sora'
})

export const metadata = {
  title: 'ARCED',
  description: 'Activations, Retail, Content, Events and Design form the disciplines we exercise as ardent marketeers and by doing different things differently',
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <AOSInit />
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          
          <main>{children}</main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
