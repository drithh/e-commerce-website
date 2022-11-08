import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <main className="flex h-[70vh] flex-col items-center justify-center gap-y-1">
      <h1 className="text-3xl leading-10 tracking-wider">Coming Soon!</h1>
      <h2 className="mt-2 text-2xl text-gray-500">
        This page has not been created yet!
      </h2>
      <img
        src="/img/coding.svg"
        alt="Not created yet"
        width={400}
        height={300}
      />
      <span className="text-gray-400">
        Go back to{' '}
        <Link to="/" className="hover:text-gray500 font-bold underline">
          Home Page
        </Link>
        ?
      </span>
    </main>
  );
};

export default ComingSoon;
