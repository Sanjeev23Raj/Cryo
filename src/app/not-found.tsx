import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-20 bg-white font-sans flex items-center justify-center min-h-[75vh]">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl text-center">
            {/* The 404 gif background container */}
            <div 
              className="h-[400px] bg-center bg-no-repeat flex items-center justify-center select-none"
              style={{
                backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                backgroundSize: 'contain'
              }}
            >
              <h1 className="text-center text-[80px] font-bold text-gray-800 tracking-wider">
                404
              </h1>
            </div>
            
            {/* Content Box */}
            <div className="-mt-[50px] relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-hanken">
                Look like you're lost
              </h3>
              
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                the page you are looking for not available!
              </p>
              
              <Link 
                href="/" 
                className="link_404 inline-block text-white font-semibold px-6 py-3 bg-[#39ac31] hover:bg-[#31922a] transition-all duration-200 mt-5 rounded shadow-sm hover:shadow-md"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
