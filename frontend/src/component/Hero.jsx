import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import IMG from "../assets/hero_image.svg";

function Hero() {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between p-8 md:p-16 bg-slate-800 min-h-screen">
      {/* Text Section */}
      <div className="flex-1 flex flex-col items-start justify-center gap-6 mb-10 md:mb-0 md:pr-8">
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-snug">
          Welcome To <span className="text-[#8fc5b8]">FinTech Industry</span>
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8fc5b8]">
          Elevate Your <span className="text-white">Payment Platform’s</span> Performance
        </h2>
        <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed font-semibold">
          In today's digital era, financial technology (FinTech) has become a cornerstone of everyday transactions.
          Payment platforms like ours are transforming how users handle money, making speed, security, and convenience
          paramount. However, the digital revolution brings along some critical challenges:
        </p>
        <ul className="text-white text-sm md:text-base lg:text-lg flex font-semibold flex-col gap-4 leading-relaxed">
          <li className="flex items-start">
            <FaCheckCircle size={'34'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>User Experience is Key:</strong> Ensuring a seamless, fast, and intuitive interface is crucial.
              Any lag, payment failure, or confusing navigation can lead to user frustration and a loss in customer
              loyalty.
            </div>
          </li>
          <li className="flex items-start">
            <FaCheckCircle size={'34'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>Security is Non-Negotiable:</strong> With increasing cyber threats, safeguarding users’
              financial data is essential. A single breach can severely damage trust and tarnish your brand's
              reputation.
            </div>
          </li>
          <li className="flex items-start">
            <FaCheckCircle size={'34'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>Transaction Reliability:</strong> Ensuring that payments are processed smoothly and accurately
              without delays or errors is critical to maintaining user confidence and satisfaction.
            </div>
          </li>
          <li className="flex items-start">
            <FaCheckCircle size={'34'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>Compliance and Regulatory Standards:</strong> Adhering to the latest financial regulations and
              standards is crucial to avoid legal complications and maintain market credibility.
            </div>
          </li>
        </ul>
      </div>

      {/* Image Section */}
      <div className="flex-1 flex items-center justify-center">
        <img src={IMG} alt="Hero" className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl" />
      </div>
    </div>
  );
}

export default Hero;
