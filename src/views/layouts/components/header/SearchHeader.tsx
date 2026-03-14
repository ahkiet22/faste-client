'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { getStoreSearchHistory, setStoreSearchHistory, clearStoreSearchHistory } from '@/helpers/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/stores/useSearchStore';
import useDebounce from '@/hooks/use-debounce';
import { getSearchSuggest } from '@/services/search';
import { hasVietnameseAccent } from '@/helpers/hasVietnameseAccent';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

const POPULAR_KEYWORDS = [
  'Máy Tính',
  'Ram Laptop',
  'Quần áo',
  'Laptop Dell',
  'Mỹ phẩm',
];

interface suggestKeywordType {
  keyword: string;
}

const SearchHeaderContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  // const [searchText, setSearchText] = useState('');
  const { searchText, setSearchText } = useSearchStore();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestKeyword, setSuggestKeyword] = useState<suggestKeywordType[]>(
    [],
  );
  const searchRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounce = useDebounce(searchText, 400);
  // Lấy lịch sử tìm kiếm từ localStorage
  useEffect(() => {
    const storedHistory = getStoreSearchHistory();
    if (storedHistory) {
      setSearchHistory(storedHistory);
    }
  }, []);

  const fetchGetSearchSuggest = async (keyword: string) => {
    const res = await getSearchSuggest(keyword);
    const isAccent = keyword
      .trim()
      .split(/\s+/)
      .every((item) => hasVietnameseAccent(item));
    const field = isAccent ? 'keyword_raw' : 'keyword';

    const suggestList = res.data.map((item: any) => ({
      ...item,
      keyword: item[field].toLowerCase(),
    }));

    setSuggestKeyword(suggestList);
  };
  useEffect(() => {
    if (!!debounce) {
      fetchGetSearchSuggest(debounce);
    }
  }, [debounce]);

  // Sự kiện click ngoài input để ẩn suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        searchRef.current &&
        !(searchRef.current as any).contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lưu lịch sử tìm kiếm vào localStorage
  const saveSearchHistory = (query: string) => {
    const updatedHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, 5); // Giới hạn 5 mục
    setSearchHistory(updatedHistory);
    setStoreSearchHistory(updatedHistory);
  };

  // Xử lý khi người dùng thực hiện tìm kiếm
  const handleSearch = (keyword: string) => {
    if (keyword && !searchHistory.includes(keyword)) {
      saveSearchHistory(keyword);
    }
    setIsVisible(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('keyword', keyword);
    router.replace(`/product?${params.toString()}`);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    clearStoreSearchHistory();
  };

  const handleDeleteSearchHistory = (index: number) => {
    const updatedHistory = searchHistory.filter((_, idx) => idx !== index);
    setSearchHistory(updatedHistory);
    setStoreSearchHistory(updatedHistory);
  };

  return (
    <div
      className="relative not-first:not-last:flex-1 max-w-2xl hidden md:flex items-center gap-2"
      ref={searchRef}
    >
      <div className="w-full rounded-2xl border border-gray-200">
        <Input
          type="text"
          placeholder="Search for products, categories or brands..."
          className="pr-10 bg-muted/50 border-0 rounded-2xl"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsVisible(true)}
        />
        <Button
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl cursor-pointer"
          onClick={() => handleSearch(searchText)}
        >
          <Icon icon="material-symbols-light:search" className="w-4 h-4" />
        </Button>
        {isVisible && (
          <>
            {searchText ? (
              <div className="absolute left-0 top-11 bg-card w-full z-50 rounded-xs shadow-lg outline outline-gray-200 py-2 px-4">
                <div className="text-gray-400">GỢI Ý TÌM KIẾM</div>
                <div>
                  <div>
                    {suggestKeyword.slice(0, 8).map((item, index) => (
                      <div
                        key={index}
                        className="text-gray-500 cursor-pointer py-1 flex items-center justify-between hover:bg-gray-50"
                        onClick={() => {
                          setSearchText(item.keyword);
                          handleSearch(item.keyword);
                        }}
                      >
                        <span>{String(item.keyword)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute left-0 top-11 bg-card w-full z-50 rounded-xs shadow-lg outline outline-gray-200 py-2 px-4">
                <div className="flex justify-between items-center py-1">
                  <div className="text-gray-400">LỊCH SỬ TÌM KIẾM</div>
                  <div
                    className="text-blue-400 cursor-pointer"
                    onClick={handleClearHistory}
                  >
                    Xóa tất cả
                  </div>
                </div>
                <div className="pb-2">
                  {searchHistory.length > 0 ? (
                    <div>
                      {searchHistory.slice(0, 5).map((keyword, index) => (
                        <div
                          key={index}
                          className="text-gray-500 cursor-pointer py-1 flex items-center justify-between hover:bg-gray-50 relative"
                          onClick={() => {
                            setSearchText(keyword);
                            handleSearch(keyword);
                          }}
                        >
                          <div className="flex items-center gap-x-2">
                            <Icon
                              icon="mingcute:time-line"
                              width="18"
                              height="18"
                            />
                            <span>{keyword}</span>
                          </div>
                          <button
                            className="hover:bg-gray-300 rounded-sm p-0.5 cursor-pointer absolute right-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSearchHistory(index);
                            }}
                          >
                            <Icon icon={'material-symbols:close'} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      Chưa có lịch sử tìm kiếm
                    </div>
                  )}
                </div>
                <div className="w-full h-[1px] bg-gray-300" />
                <div className="pt-2">
                  <div className="text-gray-400">TỪ KHÓA PHỔ BIẾN</div>
                  <div>
                    {POPULAR_KEYWORDS.map((keyword, index) => (
                      <div
                        key={index}
                        className="text-gray-500 cursor-pointer py-1 flex items-center gap-x-2 hover:bg-gray-50"
                        onClick={() => {
                          setSearchText(keyword);
                          handleSearch(keyword);
                        }}
                      >
                        <Icon
                          icon={'mdi:chart-line'}
                          className="text-yellow-500"
                        />
                        <span>{keyword}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SearchHeader = () => {
  return (
    <Suspense fallback={
      <div className="relative not-first:not-last:flex-1 max-w-2xl hidden md:flex items-center gap-2">
        <div className="w-full rounded-2xl border border-gray-200">
          <Input type="text" placeholder="Search for products, categories or brands..." className="pr-10 bg-muted/50 border-0 rounded-2xl" disabled />
        </div>
      </div>
    }>
      <SearchHeaderContent />
    </Suspense>
  );
};

export default SearchHeader;
