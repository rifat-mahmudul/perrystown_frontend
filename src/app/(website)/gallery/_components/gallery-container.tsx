
"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import TreatmentSkeleton from "@/components/shared/Skeleton/TreatmentsSkeleton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

export interface GalleryImage {
  imageName: string;
  cloudinaryId: string;
}

export interface GalleryItem {
  _id: string;
  before: GalleryImage;
  after: GalleryImage;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GalleryResponse {
  status: boolean;
  message: string;
  data: GalleryItem[];
  pagination: Pagination;
}

const GallerisContainer = () => {
  const currentPage = 1;
  const plugin = React.useRef(
    Autoplay({
      delay: 2500, // scroll every 2.5s
      stopOnInteraction: false, // keeps scrolling even if user interacts
      stopOnMouseEnter: true, // pause when hover
    })
  );

  const { data, isLoading, isError, error } = useQuery<GalleryResponse>({
    queryKey: ["all-galleries", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/galleries?page=${currentPage}&limit=180`
      );
      return res.json();
    },
  });

  if (isLoading) return <TreatmentSkeleton />;
  if (isError)
    return (
      <ErrorContainer message={error?.message || "Something went wrong"} />
    );

  return (
    <div className="py-10 md:py-14">
      <div className="">
        {/* Heading */}
        <div className="container pb-8 md:pb-10 lg:pb-12">
          <h2 className="text-2xl md:text-3xl text-primary font-semibold pt-4">
            Our Gallery
          </h2>
          <p className="text-sm md:text-base text-[#373737] pt-3 leading-relaxed">
            At Perrystown Orthodontics, we love celebrating smiles! Here are
            just a few examples of the beautiful results we’ve achieved
            together. Every smile here represents confidence and transformation.
          </p>
        </div>

        {/* Carousel Section */}
        <div
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
          className="pt-10 md:pt-12 w-full h-[466px] bg-cover bg-center bg-no-repeat bg-[url('/assets/images/gallery-bg.png')] "
        >
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
            }}
            className="w-full mx-auto mt-10 md:mt-5"
          >
            <CarouselContent className="flex gap-6 ">
              {data?.data?.map((item) => (
                <CarouselItem
                  key={item._id}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className=" shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col  ">
                      {/* Before Image */}
                      <div>
                        <h4 className="text-center text-sm md:text-base lg:text-lg font-medium bg-[#1C1C1C] text-white py-1">
                          Before
                        </h4>
                        <Image
                          src={item.before.imageName}
                          alt={`before image ${item._id}`}
                          width={500}
                          height={400}
                          className="w-full h-[127px] object-cover"
                        />
                      </div>

                      {/* After Image */}
                      <div>
                        <h4 className="text-center text-sm md:text-base lg:text-lg font-medium bg-[#1C1C1C] text-white py-1">
                          After
                        </h4>
                        <Image
                          src={item.after.imageName}
                          alt={`after image ${item._id}`}
                          width={500}
                          height={400}
                          className="w-full h-[127px] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Arrows */}
            {/* <CarouselNext className="right-0 md:-right-6" />
            <CarouselPrevious className="left-0 md:-left-6" /> */}
          </Carousel>
        </div>


      </div>
    </div>
  );
};

export default GallerisContainer;
