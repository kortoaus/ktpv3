import Link from "next/link";
import React from "react";
import PlusIcon from "./icons/PlusIcon";
import SearchIcon from "./icons/SearchIcon";
import { PagingProps } from "@/types/api";

type Props = {
  basePath: string;
  children: React.ReactNode;
  paging: PagingProps;
  useAdd?: boolean;
};

export default function ListWrapper({
  basePath,
  children,
  paging,
  useAdd = true,
}: Props) {
  const { keyword, hasNext, hasPrev, current, totalPages } = paging;
  return (
    <div className="ListContainer max-w-xl mx-auto">
      <div className="ToolbarContainer">
        <form className="SearchForm">
          <input
            type="text"
            name="keyword"
            placeholder={paging?.keyword || ""}
          />
          <button>
            <SearchIcon />
          </button>
        </form>
        {useAdd && (
          <Link
            href={`${basePath}/new?page=${current}&keyword=${keyword}`}
            prefetch={false}
          >
            <button className="BasicBtn bg-purple-500 text-white border-purple-500">
              <PlusIcon />
              <span>Add New</span>
            </button>
          </Link>
        )}
      </div>
      {children}

      {/* Pagination */}
      <div className="PaginatorContainer py-4">
        <div className="InnerContainer">
          {hasPrev && (
            <Link href={`${basePath}?page=${current - 1}&keyword=${keyword}`}>
              Prev
            </Link>
          )}
          <form className="PagingForm">
            <input
              type="number"
              name="page"
              min={1}
              max={+paging.totalPages}
              required
              placeholder={"" + current}
            />
            <input
              type="text"
              name="keyword"
              value={keyword}
              onChange={(e) => null}
              hidden
            />
            <div>/</div>
            <div>{totalPages}</div>
            <button>Go</button>
          </form>
          {hasNext && (
            <Link href={`${basePath}?page=${current + 1}&keyword=${keyword}`}>
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
