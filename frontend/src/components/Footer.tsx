export default function Footer() {
  return (
    <div className=" mx-auto flex flex-col place-content-center font-lato">
      <div className="wrapper  w-full border-t-2 border-gray-100 py-16">
        <div className="mx-auto flex max-w-6xl">
          <div className="flex w-full flex-col justify-between md:flex-row">
            <div>
              <h3 className="mb-1 text-lg text-gray-400 md:mb-3">Company</h3>
              <div className="flex flex-col gap-y-2">
                <a href="coming-soon">About Us</a>
                <a href="coming-soon">Contact Us</a>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-lg text-gray-400 md:mb-3">Help</h3>
              <div className="flex flex-col gap-y-2">
                <a href="coming-soon">Order Tracking</a>
                <a href="coming-soon">Faqs</a>
                <a href="coming-soon">Privacy Policy</a>
                <a href="coming-soon">Terms Conditions</a>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-lg text-gray-400 md:mb-3">
                Keep In Touch
              </h3>
              <div className="flex flex-col gap-y-2">
                <div>
                  123, Depan Steam
                  <br />
                  Kaplingan , Surakarta
                </div>
                <div>+6212345678</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper border-2 border-gray-200 py-1 text-xs text-gray-600">
        <div className="mx-auto flex max-w-6xl">
          <div className="app-max-width app-x-padding flex w-full justify-between">
            <span className="">@ 2022 Tutu. All Right Reserved</span>
            <span className="flex items-center">
              <a
                href="https://github.com/Drithh/e-commerce-website"
                target="_blank"
                rel="noreferrer"
              >
                See Project on <b>Github</b>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
