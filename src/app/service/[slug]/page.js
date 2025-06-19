import Footer from '@/components/Global/Footer'
import HeaderOpaque from '@/components/Global/HeaderOpaque';
import { EmptyState, ErrorState } from '@/components/Global/States';
import ProjectsnFiltering from '@/components/Service/Projects&Filtering';
import ServiceVideo from '@/components/Service/ServiceVideo';
import { fetchFromApiWp } from '@/utils/api';
import React from 'react'

async function getPageData(queryParams) {
  try {
    // Fetch page data from WP API
    const pageData = await fetchFromApiWp(`/services`, queryParams, "wp");
    return pageData?.data?.[0];
  } catch (error) {
    console.error(`Error fetching page data`, error);
    throw new Error("page not found");
  }
}

export async function generateMetadata({params}) {

    const { slug } = await params;
    const queryParams = { _fields: "acf,title,related_projects", slug, acf_format: "standard", status: "publish" };

  try {

    const serviceData = await getPageData(queryParams);

    // Validate `acf` data existence
    if (!serviceData?.acf) {
      return <EmptyState message="Page Not Found" height="100vh" />;
    }
    const title = serviceData?.title?.rendered || "Service Page";
    const description = serviceData?.acf?.service_description || "Default service description.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for home`, error);
    return {
      title: "Page Not Found",
      description: "The page you are looking for could not be found.",
    };
  }
}

export default async function page({ params }) {

  const default_desktop_video = "https://arced-backend.anonymoustore.com/wp-content/uploads/2025/06/arced-desktop-video.mp4"
  const default_mobile_video = "https://arced-backend.anonymoustore.com/wp-content/uploads/2025/06/arced-mobile-video.mp4"

  const { slug } = await params;
  const queryParams = { _fields: "acf,title,related_projects", slug, acf_format: "standard", status: "publish" };

  try {
    const serviceData = await getPageData(queryParams);

    // Validate `acf` data existence
    if (!serviceData?.acf) {
      return <EmptyState message="Page Not Found" height="100vh" />;
    }

    const {
        desktop_video,
        desktop_poster,
        mobile_video,
        mobile_poster,
        all_poster,
        content,
        related_projects = []
    } = serviceData?.acf;

    return (
      <>
      <HeaderOpaque />
      <ServiceVideo desktop_poster={desktop_poster} mobile_poster={mobile_poster} desktopVideoSrc={desktop_video || default_desktop_video} mobileVideoSrc={mobile_video || default_mobile_video}/>
      {/* <section className='sm:flex items-center gap-10 py-10 m-4' >
        <div className='flex-1' data-aos="fade-right" data-aos-duration="600">
          <img src="/home/service1.jpg" alt="sample alt" className="w-full aspect-[5/4] rounded-2xl object-cover" />
        </div>
        <div className='flex-1 mt-5' data-aos="fade-left" data-aos-duration="600">
          <p className='text-center text-white opacity-80'>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
        </div>
      </section> */}
      <ProjectsnFiltering featured_image={all_poster || desktop_poster} content={content} title={capitalizeFirstLetter(slug)} ids={related_projects} />
        <Footer/>
      </>
    );
  } catch (error) {
    console.error("Error fetching page data:", error.message || error);
    return <ErrorState message="Error fetching page." height="100vh" />;
  }
}

function capitalizeFirstLetter(string) {
     return string.charAt(0).toUpperCase() + string.slice(1);
   }


// const page = async ({ params }) => {
//     const { slug } = await params;

//     // Map slug to background color codes
//     const bgColorMap = {
//         activations: '#ef4444', // red-500
//         retail: '#22c55e',      // green-500
//         content: '#3b82f6',     // blue-500
//         event: '#a855f7',       // purple-500
//         design: '#eab308',      // yellow-500
//     };

//     // Fallback color if slug doesn't match
//     const backgroundColor = bgColorMap[slug] || '#6b7280'; // gray-500

//     return (
//         <>
//             <div
//                 style={{
//                     backgroundColor,
//                     color: 'white',
//                     height: '100vh',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}
//                 data-aos="flip-up"
//                 data-aos-duration="2000"
//             >
//                 <h1 style={{ fontSize: '1.875rem', textTransform: 'capitalize' }}>{slug} page</h1>
//             </div>
//             <Footer />
//         </>
//     )
// }

// export default page;
