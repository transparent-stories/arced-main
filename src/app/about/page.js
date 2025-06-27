import Footer from '@/components/Global/Footer'
import HeaderOpaque from '@/components/Global/HeaderOpaque'
import { fetchFromApiWp } from '@/utils/api';
import React, { cache }  from 'react'
import Image from 'next/image';

const queryParams = { _fields: "id,title,acf", acf_format: "standard", status: "publish", id: '199' };

// Server-side function to fetch product data
const getPageData = cache(async (id = "199") => {
    try {
        // Fetch product data from WooCommerce API
        const product = await fetchFromApiWp(`/pages/${id}`, queryParams, "wp");
        return product?.data;
    } catch (error) {
        console.error(`Error fetching page data for distributor`, error);
        throw new Error("page not found");
    }
})

export async function generateMetadata() {

    try {
        const page = await getPageData();

        if (!page) {
            throw new Error("Page not found");
        }

        const title = page.title.rendered || "About Us";

        return {
            title,
            // description,
            openGraph: {
                title,
                // description
            },
        };
    } catch (error) {
        console.error(`Error generating metadata for page`, error);
        return {
            title: "Page Not Found",
            // description: "The page you are looking for could not be found.",
        };
    }
}

const About = async () => {
    const page = await getPageData();
    const {
        title: { rendered: title },
        acf: {
            content,
            client_logos = []
        }
    } = page;

    return (
        <div>
            <HeaderOpaque header_text="About Us" />
            <section className='py-5 flex flex-col items-center'>
                {/* <div className='py-5 text-center h-[70vh] flex flex-col gap-10 justify-center max-w-5xl'>
                    <h3 className='text-3xl'>
                        ARCED is an echo of not only &apos;what&apos; we do, but &apos;how&apos; we do it.
                    </h3>
                    <p>
                        Activations, Retail, Content, Events and Design form the disciplines we exercise as ardent marketeers and by doing different things differently.
                    </p>
                    <p>
                        Seasoned professionals who never learnt to think unilaterally, but a brave bunch who break the mould by making a conscious choice to Deviate and Innovate
                    </p>
                </div> */}

                <div className='py-5 text-center h-[70vh] flex flex-col gap-10 justify-center max-w-5xl'
                    dangerouslySetInnerHTML={{
                        __html: content ?? ''
                    }}
                />

                <section className='w-full px-6 py-12 bg-black text-white'>
                    <h3 className='text-3xl text-center mb-10'>Client Showcase</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 px-4 sm:px-10'>
                        {client_logos?.map((logo, index) => (
                            <div
                            key={index}
                            className='h-40 w-full max-w-[180px] flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300'
                            >
                            <Image
                                src={logo}
                                alt={`Client ${index + 1}`}
                                width={150}
                                height={80}
                                className='object-contain'
                            />
                            </div>
                        ))}
                    </div>
                </section>
            </section>
            <Footer />
        </div>
    );
};


export default About