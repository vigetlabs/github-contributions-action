export type Stats = {
  opened: number;
  merged: number;
  reviews: number;
};

export type SearchResults = {
  total_count: number;
  items: {
    title: string;
    repository_url: string;
    user: {
      login: string;
    };
  }[];
};

export type ApiError = {
  message: string;
  errors: {
    message: string;
  }[];
};

export type ApiResponseData = SearchResults | ApiError;
