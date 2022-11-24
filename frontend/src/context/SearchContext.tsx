import React, { createContext, useContext, useState } from 'react';

interface SearchImage {
  file: File;
  category: string;
}

export type SearchType = {
  searchText: string;
  setSearchText?: React.Dispatch<React.SetStateAction<string>>;
  search: boolean;
  setSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  searchImage: SearchImage;
  setSearchImage?: React.Dispatch<React.SetStateAction<SearchImage>>;
};

const SearchContext = createContext<SearchType>({
  searchText: '',
  search: false,
  searchImage: {
    file: new File([], ''),
    category: '',
  },
});

export const useSearch = () => useContext(SearchContext);

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const search = useProvideSearch();
  return (
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  );
};

const useProvideSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState(false);
  const [searchImage, setSearchImage] = useState<SearchImage>({
    file: new File([], ''),
    category: '',
  });

  return {
    searchText,
    setSearchText,
    search,
    setSearch,
    searchImage,
    setSearchImage,
  };
};
