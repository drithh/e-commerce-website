import { FC } from 'react';

type Props = {
  imgSrc: string;
  imgSrc2?: string;
  imgAlt?: string;
  children?: React.ReactNode;
};

const OverlayContainer: FC<Props> = ({ imgSrc, imgAlt, children }) => (
  <div className="group relative flex items-center justify-center overflow-hidden">
    <img
      className="transition-all duration-500 group-hover:scale-110"
      src={imgSrc}
      alt={imgAlt}
      width={710}
      height={710}
    />

    {children}
    <div className="top-0 h-full w-full bg-gray-700 opacity-50 group-hover:absolute"></div>
    <div className="absolute right-[10%] bottom-[10%] h-0 w-0 group-hover:transition-[width,_height] group-hover:delay-[0s,_0.3s] group-hover:duration-300 group-hover:h-[80%] group-hover:w-[80%] group-hover:border-b group-hover:border-l  group-hover:border-b-white group-hover:border-l-white"></div>
    <div className="absolute left-[10%] top-[10%] h-0 w-0 group-hover:transition-[width,_height] group-hover:delay-[0.6s,_0.9s] group-hover:duration-300 group-hover:h-[80%] group-hover:w-[80%] group-hover:border-t group-hover:border-r group-hover:border-r-white group-hover:border-t-white "></div>
  </div>
);

export default OverlayContainer;
