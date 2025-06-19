import HeaderOpaque from '@/components/Global/HeaderOpaque'
import React from 'react'

const About = () => {
    return (
        <div>
            <HeaderOpaque header_text="About Us" />
            <section className='py-5 flex flex-col items-center'>
                <div className='py-5 text-center h-[50vh] flex flex-col gap-10 justify-center max-w-5xl'>
                    <h3 className='text-3xl'>
                        ARCED is an echo of not only &apos;what&apos; we do, but &apos;how&apos; we do it.
                    </h3>
                    <p>
                        Activations, Retail, Content, Events and Design form the disciplines we exercise as ardent marketeers and by doing different things differently.
                    </p>
                    <p>
                        Seasoned professionals who never learnt to think unilaterally, but a brave bunch who break the mould by making a conscious choice to Deviate and Innovate
                    </p>
                </div>
            </section>
        </div>
    )
}

export default About