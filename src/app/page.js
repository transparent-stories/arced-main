
import GsapMotionCarousel from "@/components/Home/GsapMotionCarousel";
import ServicesSlider from "@/components/Home/ServicesSlider";
import ServiceSliderPrac from "@/components/Home/ServiceSliderPrac";
import { fetchFromApiWp } from "@/utils/api";
import defaults from "@/utils/defaults";

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
    const title = "Genki Ramune Soda or japan ramune is cool fun drink from japan";
    const description = "Japanese carbonated drinks are available in exciting fruit flavous and healthy ingredients. Turmeric ramune, Matcha ramune and Multivitamin ramune.";

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
  // const id = "43"; // Default to ID 43
  const queryParams = { _fields: "acf", acf_format: "standard", status: "publish" };

  try {
    // const pageData = await getPageData(queryParams);

    // Validate `acf` data existence
    // if (!pageData?.acf) {
    //   return <EmptyState message="Page Not Found" height="100vh" />;
    // }

    // const {
    //   banner_button = null,
    //   banner_heading = "Default Heading",
    //   banner_image_desktop = defaults.images.desktop,
    //   banner_image_mobile = defaults.images.mobile,
    //   banner_text = "",
    //   banner_url = "#",
    //   product_list_title = "Products List Title",
    //   product_list_subtitle = "",
    //   brand_metrics_title = "Brand Milestones & Metrics",
    //   brand_metrics_subtitle = "",
    //   brand_metrics = [],
    //   video_title = "Videos",
    //   video_subtitle = "",
    //   videos_feed = [],
    // } = pageData?.acf;

    // const bannerProps = {
    //   heading: banner_heading,
    //   text: banner_text,
    //   button: banner_button,
    //   desktopImage: banner_image_desktop,
    //   mobileImage: banner_image_mobile,
    //   url: banner_url,
    // };

    // const productListProps = {
    //   title: product_list_title,
    //   subtitle: product_list_subtitle,
    //   tag: "16", // Consider passing this dynamically
    // };

    // const brandMetricsProps = {
    //   title: brand_metrics_title,
    //   subtitle: brand_metrics_subtitle,
    //   metrics: Array.isArray(brand_metrics) ? brand_metrics : [],
    // };

    // const videoFeedProps = {
    //   title: video_title,
    //   subtitle: video_subtitle,
    //   videos: Array.isArray(videos_feed) ? videos_feed : [],
    // };

    // const blogSectionProps = {
    //   queryParams: { orderBy: "date", per_page: 3, _embed: "" }
    // }

    return (
      <>
        {/* <ServicesSlider /> */}
        <ServiceSliderPrac />

        {/* <GsapMotionCarousel /> */}
      </>
    );
  } catch (error) {
    console.error("Error fetching page data:", error.message || error);
    return <ErrorState message="Error fetching page." height="100vh" />;
  }
}
