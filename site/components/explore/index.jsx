import useStore from "@/hooks/useStore";
import POST_GLIMPSE_TYPES from "@/store/types/postGlimpseTypes";
import { getExplorePosts } from "@/store/actions/postGlimpseActions";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getData } from "@/utils/fetchData";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import Masonry from "react-masonry-css";
import {
  Search as SearchIcon,
} from "react-feather";
import PinCard from "../customs/PinCard";
import Preloader from "../customs/Preloader";

const Index = () => {
  const { state, dispatch } = useStore();
  const { explorePosts, detailedPostsGlimpses } = state.postGlimpse;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const handleSearch = async() =>{
      if (search && state.auth.token) {
        const res = await getData(`user/search?username=${search}`, state.auth.token);
        if (res.error)
          return dispatch({
            type: GLOBAL_TYPES.ALERT_ERROR,
            payload: res.error,
          });
        setSearchResult(res.users);
      }
        setLoading(false);
    }
    let timer = setTimeout(handleSearch, 500)
    return () => clearTimeout(timer)
  }, [search, state.auth.token, dispatch]);

  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!explorePosts.firstLoad) {
      getExplorePosts(dispatch, state.auth.token);
    }
  }, []);

  useEffect(() => {
    setPosts(explorePosts.data);
    setResult(explorePosts.result);
    setPage(explorePosts.page);
  }, [explorePosts]);

  const handleLoadMore = async () => {
    const res = await getData(`post-glimpse/posts/random?limit=${page * 9}`, auth.token);
    const newData = { ...res, page: page + 1, _id: id };
    dispatch({
      type: POST_GLIMPSE_TYPES.EXPLORE_POST_GET,
      payload: { ...newData, page: state.post.feedPostsGlimpses.data.page + 1 },
    });
  };

  return (
    <div className="flex h-full flex-col  min-h-[200px] gap-4 items-center w-full relative">
      <div
        className={`${
          search.length > 0 ? "text-text-main" : "text-text-light/70"
        } relative bg-background-extralight hover:border-primary-main transition-all border-2 border-transparent px-4 py-1.5 w-full  gap-1 rounded-2xl flex items-center justify-start cursor-pointer`}
      >
        <SearchIcon className="w-6 h-6 " />
        <input
          type="text"
          placeholder="Search anything..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);setLoading(e.target.value?true : false)
          }}
          className="outline-none text-text-dark bg-transparent w-full placeholder:font-light transition-all min-w-[260px] lg:min-w-[400px] text-base z-[40000000000000]  font-normal !p-1 !ring-0 !border-none placeholder:text-text-light"
        />
      </div>
      <div className="w-full">
        {search ? (
          loading ? (
           <Preloader/>
          ) : searchResult.length == 0 ? (
            "no user found"
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto w-full flex-col">
              {searchResult.map((user) => (
                <Link
                  key={user._id}
                  href={`/profile/${user.username}`}
                  onClick={() => {
                    setSearch("");
                  }}
                >
                  <div className="py-1 px-2 w-full hover:bg-background-extralight border-background-extralight border rounded-custom flex cursor-pointer justify-center items-center gap-3">
                    <Image
                      src={user.profileImage}
                      width={100}
                      height={100}
                      className="w-14 h-14 rounded-full object-cover object-center "
                    />
                    <div className="flex-grow flex flex-col break-words w-10">
                      <h5 className="text-base font-semibold">
                        {user.fullname}
                      </h5>
                      <p className="text-sm font-light text-text-light">
                        {"@" + user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col gap-4">
            <Masonry
              className="flex"
              breakpointCols={{
                default: 3,
                1200: 3,
                1000: 2,
                500: 1,
              }}
            >
   {posts.map((id) => (
                <PinCard key={id} {...detailedPostsGlimpses[id]} />
              ))}
            </Masonry>
            {explorePosts.loading && <Preloader/>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
