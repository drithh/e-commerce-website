import { FC } from 'react';

type Props = {
  // size: "small" | "large";
  value: string;
};

const TextButton: FC<Props> = ({ value }) => (
  <div className={`group relative flex w-28 justify-center transition-all`}>
    <button
      type="button"
      className={`inline-block p-2 text-gray-500 no-underline duration-500 group-hover:tracking-widest`}
    >
      {value}
    </button>
    <div className="absolute bottom-2 w-2.5 border-b-2 border-transparent duration-500 group-hover:w-4/5 group-hover:border-gray-500 group-hover:duration-500"></div>
  </div>
);

export default TextButton;
