import { Link } from 'react-router-dom';
const Custom404 = () => {
  return (
    <main className="flex h-[70vh] flex-col items-center justify-center gap-y-10">
      <h1 className="text-2xl">Oops! Page Not Found!</h1>
      <img
        src="/img/404.svg"
        alt="404 Page Not Found"
        width={400}
        height={300}
      />
      <span className="text-gray-400">
        Go Back To{' '}
        <Link to="/" className="font-bold underline hover:text-gray-500">
          Home Page
        </Link>
        ?
      </span>
    </main>
  );
};

export default Custom404;
