import HeaderOpaque from '@/components/Global/HeaderOpaque'
import React from 'react'

const ContactUs = () => {
    return (
        <div>
            <HeaderOpaque header_text="Contact Us" />
            <section className='py-5 flex flex-col items-center'>
                <div className='py-5 text-center h-[50vh] flex flex-col gap-10 justify-center'>
                    <h3 className='text-3xl'>#daretodeviate</h3>
                    <p>Write to us at <a href='mailto:contact@arced.in'>contact@arced.in</a> or call us on <a href='tel:02245199478'>022 45199478</a></p>
                </div>
            </section>
        </div>
    )
}

export default ContactUs