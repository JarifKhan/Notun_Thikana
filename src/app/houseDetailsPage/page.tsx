'use client';


import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import * as echarts from "echarts";
const App: React.FC = () => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const propertyImages = [
    "https://public.readdy.ai/ai/img_res/b904695ff4a4cce3168678a3d5b74cb7.jpg",
    "https://public.readdy.ai/ai/img_res/c8f985ef24169e2f435802cba74b1449.jpg",
    "https://public.readdy.ai/ai/img_res/4dcbaf5c740e20aa61ad0e94bde53fda.jpg",
    "https://public.readdy.ai/ai/img_res/76d3f75cb417ce8302bf77bd6f06552f.jpg",
  ];
  const amenities = [
    { icon: "fa-bed", label: "4 Bedrooms" },
    { icon: "fa-bath", label: "3.5 Bathrooms" },
    { icon: "fa-ruler-combined", label: "3,200 sq ft" },
    { icon: "fa-users", label: "8 Guests" },
    { icon: "fa-wifi", label: "High-speed WiFi" },
    { icon: "fa-car", label: "2 Parking Spots" },
    { icon: "fa-swimming-pool", label: "Infinity Pool" },
    { icon: "fa-tv", label: "Smart TVs" },
  ];
  const reviews = [
    {
      id: 1,
      author: "Emily Thompson",
      rating: 5,
      date: "2025-03-01",
      content:
        "Absolutely stunning property with breathtaking views. The infinity pool was a highlight of our stay. Everything was immaculate and the host was incredibly responsive.",
      image:
        "https://public.readdy.ai/ai/img_res/6c2d0b05439b6dc811dc2e4e15c8af5d.jpg",
    },
    {
      id: 2,
      author: "Michael Richardson",
      rating: 4.8,
      date: "2025-02-28",
      content:
        "Exceptional property with top-notch amenities. The kitchen was a chef's dream and the master suite was pure luxury. Will definitely return!",
      image:
        "https://public.readdy.ai/ai/img_res/f97b54c9a90c0b4e3df72ecc1d477944.jpg",
    },
  ];
  const initializeChart = () => {
    const chartDom = document.getElementById("reviewChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        radar: {
          indicator: [
            { name: "Cleanliness", max: 5 },
            { name: "Communication", max: 5 },
            { name: "Check-in", max: 5 },
            { name: "Accuracy", max: 5 },
            { name: "Location", max: 5 },
            { name: "Value", max: 5 },
          ],
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [4.9, 5.0, 4.8, 4.9, 4.7, 4.8],
                name: "Rating Breakdown",
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    }
  };
  React.useEffect(() => {
    initializeChart();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <img
          src="https://public.readdy.ai/ai/img_res/f08ecd936a7f1f38b4adca70f3d4d024.jpg"
          className="w-full h-full object-cover"
          alt="Luxury Beach House"
        />
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <button className="bg-white/80 p-3 rounded-full shadow-lg cursor-pointer">
            <i className="fas fa-arrow-left text-gray-800"></i>
          </button>
          <div className="flex gap-4">
            <button className="bg-white/80 p-3 rounded-full shadow-lg cursor-pointer">
              <i className="fas fa-share text-gray-800"></i>
            </button>
            <button
              className="bg-white/80 p-3 rounded-full shadow-lg cursor-pointer"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <i
                className={`${isFavorite ? "fas" : "far"} fa-heart text-red-500`}
              ></i>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Oceanfront Modern Villa
          </h1>
          <p className="text-white flex items-center gap-2">
            <i className="fas fa-map-marker-alt"></i>
            Malibu, California, United States
          </p>
        </div>
      </div>
      {/* Quick Info Bar */}
      <div className="border-b py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <i className="fas fa-star text-yellow-400"></i>
              <span className="font-semibold">4.8</span>
              <span className="text-gray-600">(124 reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-home"></i>
              <span>Entire house</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="https://public.readdy.ai/ai/img_res/68f157609d68aa79c27a76adc87be3fb.jpg"
              className="w-12 h-12 rounded-full"
              alt="Host"
            />
            <div>
              <p className="font-semibold">Hosted by Sarah Anderson</p>
              <p className="text-sm text-gray-600">Superhost</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Key Details Section */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <i className={`fas ${amenity.icon} text-2xl text-gray-700`}></i>
              <span className="font-medium">{amenity.label}</span>
            </div>
          ))}
        </div>
        {/* Pricing Information */}
        <div className="bg-gray-50 p-8 rounded-xl mb-12">
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold">$1,200</span>
            <span className="text-gray-600">per night</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                type="date"
                className="w-full p-3 border rounded-lg cursor-pointer"
                onChange={(e) =>
                  setSelectedDates({ ...selectedDates, start: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <input
                type="date"
                className="w-full p-3 border rounded-lg cursor-pointer"
                onChange={(e) =>
                  setSelectedDates({ ...selectedDates, end: e.target.value })
                }
              />
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition !rounded-button">
            Book Now
          </button>
        </div>
        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About this property</h2>
          <div
            className={`text-gray-700 ${isDescriptionExpanded ? "" : "line-clamp-3"}`}
          >
            Experience luxury living at its finest in this stunning oceanfront
            villa. Perched on the cliffs of Malibu, this architectural
            masterpiece offers breathtaking views of the Pacific Ocean from
            every room. The open-concept living space features floor-to-ceiling
            windows, designer furnishings, and state-of-the-art amenities. The
            gourmet kitchen is equipped with professional-grade appliances,
            perfect for entertaining or preparing family meals. Each bedroom is
            a private retreat with en-suite bathrooms and premium bedding. The
            master suite includes a private terrace and spa-like bathroom with a
            freestanding tub. Outside, the infinity pool seems to merge with the
            ocean horizon, while the expansive deck provides the perfect setting
            for sunset gatherings or morning yoga sessions.
          </div>
          <button
            className="text-blue-600 font-medium mt-2 cursor-pointer"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            {isDescriptionExpanded ? "Show less" : "Read more"}
          </button>
        </div>
        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div id="reviewChart" className="h-[300px] mb-6"></div>
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={review.image}
                      className="w-12 h-12 rounded-full"
                      alt={review.author}
                    />
                    <div>
                      <p className="font-semibold">{review.author}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < Math.floor(review.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-gray-600">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Location Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          <div className="bg-gray-100 h-[400px] rounded-xl mb-4 overflow-hidden">
            <img
              src="https://public.readdy.ai/ai/img_res/e0d722ce683ac291f09a31f1ec1ebab6.jpg"
              className="w-full h-full object-cover"
              alt="Location Map"
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Neighborhood</h3>
              <p className="text-gray-700">
                Located in the prestigious Malibu Colony, this property offers
                privacy while being minutes away from high-end shopping, dining,
                and entertainment options.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Getting around</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 5 minutes to Malibu Pier</li>
                <li>• 15 minutes to Santa Monica</li>
                <li>• 45 minutes to LAX Airport</li>
                <li>• Beach access: Direct</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">$1,200</span>
            <span className="text-gray-600"> / night</span>
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition !rounded-button">
            Check Availability
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-6">About Us</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Safety Information
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Cancellation Options
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    COVID-19 Response
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Hosting</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Try Hosting
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Host Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Community Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Responsible Hosting
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Download Our App</h3>
              <div className="space-y-4">
                <button className="bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition w-full !rounded-button">
                  <i className="fab fa-apple text-2xl"></i>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition w-full !rounded-button">
                  <i className="fab fa-google-play text-2xl"></i>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <span className="text-gray-400">
                  © 2025 LuxuryStays. All rights reserved.
                </span>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Sitemap
                </a>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Host Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">Contact Host</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full border rounded-lg p-3"
                rows={4}
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-2 border rounded-lg cursor-pointer !rounded-button"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer !rounded-button">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
