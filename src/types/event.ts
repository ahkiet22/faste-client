// types/event.ts
export interface EventPageData {
  eventSlug: string;
  eventConfig: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
    };
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
    timing: {
      startTime: string;
      endTime: string;
      timezone: string;
    };
  };
  page: {
    config: {
      displayMap: Record<string, number>;
    };
  };
  layout: {
    component_list: Array<{
      id: number;
      biz_component_id: number;
      fe_id: string;
      properties: string;
      extend_info: string;
    }>;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
  sold: number;
  stock: number;
  rating: number;
}

export interface PageProps {
  params: {
    eventSlug: string;
  };
  searchParams: {
    tab?: string;
    category?: string;
  };
}
