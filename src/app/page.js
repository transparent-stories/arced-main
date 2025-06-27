
import Header from "@/components/Global/Header";
import { EmptyState, ErrorState } from "@/components/Global/States";
import ServiceSliderPrac from "@/components/Home/ServiceSliderPrac";
import { fetchFromApiWp } from "@/utils/api";
import parse from 'html-react-parser';

async function getPageData(queryParams, id = "43") {
  try {
    // Fetch page data from WP API
    const pageData = await fetchFromApiWp(`/pages/${id}`, queryParams, "wp");
    return pageData?.data;
  } catch (error) {
    console.error(`Error fetching page data`, error);
    throw new Error("page not found");
  }
}

export async function generateMetadata() {

  try {
    const title = "ARCED";
    const description = "Activation, Retail, Content, Event, Design";

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

export default async function Home() {
  const id = "43"; // Default to ID 43
  const queryParams = { _fields: "acf", acf_format: "standard", status: "publish" };

  try {
    const pageData = await getPageData(queryParams);

    // Validate `acf` data existence
    if (!pageData?.acf) {
      return <EmptyState message="Page Not Found" height="100vh" />;
    }

    const {
      home_page_content = "Lorem Ipsum",
      carousel_images = [
        '/home/service1.jpg',
        '/home/service2.jpg',
        '/home/service3.jpg',
        '/home/service4.jpg',
        '/home/service5.jpg'
      ],
    } = pageData?.acf;

    const categories = [
      { categoryIndex: 0, subText: 'ACTIVATIONS', url: '/service/activations' },
      { categoryIndex: 1, subText: 'RETAIL', url: '/service/retail' },
      { categoryIndex: 2, subText: 'CONTENT', url: '/service/content' },
      { categoryIndex: 3, subText: 'EVENT', url: '/service/event' },
      { categoryIndex: 4, subText: 'DESIGN', url: '/service/design' },
    ];

    // We want 9 objects total, cycling through images and categories
    const totalObjects = 9;

    const carouselResult = Array.from({ length: totalObjects }, (_, i) => {
      const image = carousel_images[i % carousel_images.length];
      const cat = categories[i % categories.length];
      return {
        image,
        categoryIndex: cat.categoryIndex,
        subText: cat.subText,
        url: cat.url,
      };
    });


    return (
      <section className="bg-[url(/home/bg-1.jpg)] bg-black bg-opacity-70 bg-blend-overlay h-[90vh] sm:h-auto flex flex-col items-center justify-end sm:justify-end">
        <Header />

        <div className="flex justify-center mt-64 sm:mt-40 w-10/12 sm:w-1/2">
          <div className="text-white text-justify px-5 mt-5 text-xs">
            {parse(home_page_content)}
            <h1>Discover Events Like Never Before</h1>
          </div>
        </div>
        {/* <ServicesSlider /> */}
        <ServiceSliderPrac gallery={carouselResult} />

        {/* <GsapMotionCarousel /> */}
      </section>
    );
  } catch (error) {
    console.error("Error fetching page data:", error.message || error);
    return <ErrorState message="Error fetching page." height="100vh" />;
  }
}
