import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} HealthTriage. This is a prototype application using simulated data.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-600">
              Privacy
            </a>
            <span className="mx-2 text-neutral-400">|</span>
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-600">
              Terms
            </a>
            <span className="mx-2 text-neutral-400">|</span>
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-600">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
