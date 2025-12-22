import React, { useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useParams } from 'react-router-dom';

import Loader from './Utils/Loader';
import Banner from './Utils/Banner';
import ImageComponent from './Utils/Image';
import '../styles/templates/categoryHome.scss';

import { useQuery } from '@tanstack/react-query';
import PageTransition from './Utils/PageTransition';

import { fetchImages, checkIfUserSignedIn } from '../utils/apis';
import { Image, McMoments } from '../info/types';
import {
  dispachSignedInEvent,
  getMappedCategory,
  reOrderImages,
} from '../utils/helpers';
import { initMoments } from '../utils/constants';

interface homeProps {}

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

interface homeProps {}

const Home: React.FunctionComponent<homeProps> = () => {
  const params = useParams();
  const { tag } = getMappedCategory(params.categoryTag!);

  const {
    data: imagesData,
    isLoading: fetchingImages,
    isError: fetchingFailed,
    refetch,
  } = useQuery({
    queryKey: ['images', tag],
    queryFn: () => fetchImages(tag),
    select: (data) => reOrderImages(data.images),
  });

  const { data: userSignedIn } = useQuery({
    queryKey: ['userSignedIn'],
    queryFn: checkIfUserSignedIn,
    initialData: false,
  });

  useEffect(() => {
    if (userSignedIn) {
      dispachSignedInEvent();
    }
  }, [userSignedIn]);

  let categoryHome = <></>;
  if (fetchingImages) {
    categoryHome = <Loader />;
  } else if (fetchingFailed) {
    categoryHome = <Banner canRefresh onRefresh={() => refetch()} />;
  } else if (
    !imagesData ||
    !(imagesData.moments.length || imagesData.biotc.original.length)
  ) {
    categoryHome = (
      <Banner
        title={
          'No moments recorded for this category as of yet. Check back again later.'
        }
      />
    );
  } else {
    const { biotc, moments: images } = imagesData;
    categoryHome = (
      <React.Fragment>
        {biotc.original.length > 0 && (
          <ImageComponent
            {...biotc}
            userSignedIn={!!userSignedIn}
            categoryTag={tag}
          />
        )}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='my-masonry-grid'
          columnClassName='my-masonry-grid_column'
        >
          {images.map((image: Image) => {
            return (
              <ImageComponent
                {...image}
                userSignedIn={!!userSignedIn}
                categoryTag={tag}
                key={image.updateTime}
              />
            );
          })}
        </Masonry>
      </React.Fragment>
    );
  }
  return (
    <PageTransition>
      <div className='category-home'>{categoryHome}</div>
    </PageTransition>
  );
};

export default Home;
