import localFont from 'next/font/local'

const sentient = localFont({
    src: [
        {
            path: './fonts/Sentient-Bold.otf',
            weight: '900',
            style: 'bold',
        }
    ],
    variable: '--font-sentient'
})

export default sentient