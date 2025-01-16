import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CONSTANTS } from '../../../../services/config/app-config';
import getSiteMapList from '../../../../services/api/seo-apis/sitemap-api';
import getComponentsList from '../../../../services/api/home-page-apis/get-components-list';
import getMultiLingualTextFromAPI from '../../../../services/api/general-apis/multilanguage-api';
import useGoogleAnalyticsOperationsHandler from '../../../../hooks/GoogleAnalytics/useGoogleAnalyticsOperationsHandler';
import { setMultiLingualData } from '../../../../store/slices/general_slices/multilang-slice';
import TranslationsList from '../../../../components/TranslationsList';
import ProductPageMaster from '../../../../components/ProductPageComponents/ProductPageMaster';

export const getStaticPaths = async () => {
  const { SUMMIT_APP_CONFIG } = CONSTANTS;
  const apiParams = { type: 'product' };
  let getPathsList: any[] = [];
  let getListOfAllPathsFromAPI: any = await getSiteMapList(apiParams, SUMMIT_APP_CONFIG);
  if (
    getListOfAllPathsFromAPI?.status === 200 &&
    getListOfAllPathsFromAPI?.data?.message?.msg === 'success' &&
    getListOfAllPathsFromAPI?.data?.message?.data?.length > 0
  ) {
    getPathsList = getListOfAllPathsFromAPI?.data?.message?.data?.map((path: string) => {
      const segments = path.split('/');
      const productId = segments[segments.length - 1].replace(/^\//, ''); // Remove leading '/';
      const category = segments[segments.length - 2].replace(/^\//, ''); // Remove leading '/';

      return { category, productId };
    });
  }
  return {
    paths: getPathsList.map(({ category, productId }: any) => ({
      params: { category, productId }, // Matches the [category] dynamic segment
    })),
    fallback: false, // Adjust based on your fallback strategy
  };
};

export const getStaticProps = async (context: any) => {
  const { category, productId } = context.params;
  const { SUMMIT_APP_CONFIG } = CONSTANTS;
  let componentsList: any;
  let fetchComponentsList: any = await getComponentsList('Product Page', SUMMIT_APP_CONFIG);
  if (fetchComponentsList?.status === 200 && fetchComponentsList?.data?.message?.msg === 'success') {
    componentsList = fetchComponentsList?.data?.message?.data;
  }
  let translationsList: any;
  let getMultilanguageData: any = await getMultiLingualTextFromAPI(SUMMIT_APP_CONFIG);
  if (getMultilanguageData?.length > 0) {
    translationsList = getMultilanguageData;
  } else {
    translationsList = [];
  }

  return {
    props: {
      productListPageComponents: fetchComponentsList?.data?.message?.data || {},
      translationsList,
    },
  };
};

const Index = ({ productListPageComponents, translationsList }: any) => {
  const dispatch = useDispatch();
  const { sendPageViewToGA } = useGoogleAnalyticsOperationsHandler();
  useEffect(() => {
    sendPageViewToGA(window.location.pathname + window.location.search, 'Product Detail Page');
    if (translationsList?.length > 0) {
      dispatch(setMultiLingualData(translationsList));
    }
  }, []);
  return (
    <>
      <TranslationsList>
        {/* {CONSTANTS.ENABLE_META_TAGS && <PageMetaData meta_data={serverDataForPages.metaData} />} */}
        <ProductPageMaster componentsList={productListPageComponents} />
      </TranslationsList>
    </>
  );
};

// export async function getServerSideProps(context: any) {
//   const { SUMMIT_APP_CONFIG } = CONSTANTS;
//   const method = 'get_meta_tags';
//   const version = SUMMIT_APP_CONFIG.version;
//   const entity = 'seo';
//   const params = `?version=${version}&method=${method}&entity=${entity}`;
//   const url = `${context.resolvedUrl.split('?')[0]}`;
//   if (CONSTANTS.ENABLE_META_TAGS) {
//     return await getPageMetaData(params, url);
//   } else {
//     return {
//       props: {},
//     };
//   }
// }
export default Index;
