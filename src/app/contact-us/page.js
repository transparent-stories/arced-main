import Footer from '@/components/Global/Footer'
import HeaderOpaque from '@/components/Global/HeaderOpaque'
import React from 'react'

const ContactUs = () => {
    return (
        <div>
            <HeaderOpaque header_text="Contact Us" />
            <section className='py-5 flex flex-col items-center h-[70vh]'>
                <div className='py-5 text-center h-[50vh] flex flex-col gap-10 justify-center'>
                    <h3 className='text-3xl'>#daretodeviate</h3>
                    <p>Write to us at <a className='hover:underline' href='mailto:contact@arced.in'>contact@arced.in</a> or call us on <a className='hover:underline' href='tel:+912245199478'>+91 22 45199478</a></p>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default ContactUs