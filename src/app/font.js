import localFont from 'next/font/local'

const brother = localFont({
    src: [
        {
            path: './fonts/brother-1816-black.ttf',
            weight: '900',
            style: 'bold'
        }
    ],
    variable: '--font-brother'
})

const cera = localFont({
    src: [
        {
            path: './fonts/cera.otf',
            weight: '500',
            style: 'regular',
        }
    ],
    variable: '--font-cera'
})

export default {brother, cera}