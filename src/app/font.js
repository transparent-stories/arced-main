import localFont from 'next/font/local'

const brother = localFont({
    src: [
        {
            path: './fonts/Brother-1816.ttf',
            weight: '900',
            style: 'bold',
        }
    ],
    variable: '--font-brother'
})

const cera = localFont({
    src: [
        {
            path: './fonts/Cera-1.otf',
            weight: '500',
            style: 'regular',
        }
    ],
    variable: '--font-cera'
})

export default {brother, cera}