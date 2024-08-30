import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import IMG from "../assets/hero_image.svg";

function Hero() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 bg-slate-800 h-screen">
      <div className="flex-1 flex flex-col items-start justify-center gap-8 mb-6 md:mb-0 md:pr-8">
        <h1 className="text-white mb-4 text-4xl md:text-5xl font-bold leading-snug">
          Welcome To <span className="text-[#8fc5b8]">FinTech Industry</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#8fc5b8] mb-6">
          Elevate Your <span className="text-white">Payment Platform’s</span> Performance
        </h2>
        <p className="text-white text-base md:text-lg leading-relaxed mb-6 font-semibold">
          In today's digital era, financial technology (FinTech) has become a cornerstone of everyday transactions.
          Payment platforms like ours are transforming how users handle money, making speed, security, and convenience
          paramount. However, the digital revolution brings along some critical challenges:
        </p>
        <ul className="text-white text-base md:text-lg flex font-semibold flex-col gap-5 leading-relaxed">
          <li className="flex items-start">
            <FaCheckCircle size={'40'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>User Experience is Key:</strong> Ensuring a seamless, fast, and intuitive interface is crucial.
              Any lag, payment failure, or confusing navigation can lead to user frustration and a loss in customer
              loyalty.
            </div>
          </li>
          <li className="flex items-start">
            <FaCheckCircle size={'40'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>Security is Non-Negotiable:</strong> With increasing cyber threats, safeguarding users’
              financial data is essential. A single breach can severely damage trust and tarnish your brand's
              reputation.
            </div>
          </li>
          <li className="flex items-start">
            <FaCheckCircle size={'40'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>Transaction Reliability:</strong> Ensuring that payments are processed smoothly and accurately
              without delays or errors is critical to maintaining user confidence and satisfaction.
            </div>
          </li>
          <li className="flex items-start">
            <FaCheckCircle size={'40'} className="text-[#8fc5b8] mr-3" />
            <div>
              <strong>Compliance and Regulatory Standards:</strong> Adhering to the latest financial regulations and
              standards is crucial to avoid legal complications and maintain market credibility.
            </div>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <img src={IMG} alt="Hero" className="w-full h-auto max-w-xl md:max-w-2xl" />
      </div>
    </div>
  );
}

export default Hero;
