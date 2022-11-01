import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <main className="flex flex-col h-[70vh] justify-center items-center gap-y-1">
      <h1 className="text-3xl tracking-wider leading-10">Coming Soon!</h1>
      <h2 className="text-2xl text-gray-500 mt-2">
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
        <Link to="/" className="underline font-bold hover:text-gray500">
          Home Page
        </Link>
        ?
      </span>
    </main>
  );
};

export default ComingSoon;
