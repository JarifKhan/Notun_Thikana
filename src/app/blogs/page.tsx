"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import * as echarts from "echarts";
import Blogcart from "./BlogCart";
import Link from "next/link";

interface Blog {
  _id: string;
  image: string;
  title: string;
  category: string;
  excerpt: string;
  author: {
    avatar: string;
    name: string;
  };
  likes: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [blogData, setBlogData] = useState<Blog[]>([]);

  const featuredPost = {
    image:
      "https://public.readdy.ai/ai/img_res/9a11dedfbed40a5818e30ad9b9744a92.jpg",
    title:
      "The Future of Urban Living: Smart Homes and Sustainable Architecture",
    author: "Elizabeth Anderson",
    date: "March 8, 2025",
    readTime: "7 min read",
    excerpt:
      "Discover how technology and sustainability are reshaping modern urban living spaces, creating smarter and more eco-friendly homes for the future generation.",
  };

  const blogPosts = [
    {
      id: 1,
      image:
        "https://public.readdy.ai/ai/img_res/2174a79b85a4e0f064ccbc665b8d9c20.jpg",
      category: "Interior Design",
      title:
        "Maximizing Small Spaces: Interior Design Tips for Urban Apartments",
      excerpt:
        "Learn innovative ways to make the most of limited square footage without compromising on style and comfort.",
      author: {
        name: "Michael Richardson",
        avatar:
          "https://public.readdy.ai/ai/img_res/0b34545ca154fd40bd92f058f4d9795a.jpg",
      },
      date: "March 7, 2025",
      readTime: "5 min read",
      likes: 234,
    },
  ];

  const popularPosts = [
    {
      title: "Top 10 Neighborhoods for Young Professionals in 2025",
      image:
        "https://public.readdy.ai/ai/img_res/0d9cfa6e61ab7947d7b458d211381d2e.jpg",
      views: "15.2K",
    },
  ];

  const featuredProperties = [
    {
      title: "Luxury Penthouse with City Views",
      location: "Downtown Manhattan",
      price: "$8,500/month",
      image:
        "https://public.readdy.ai/ai/img_res/66981feaf7102c7c548a2520d9a7fa58.jpg",
    },
  ];

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSubscribeModal(true);
    setSubscriberEmail("");
  };

  const [randomNum, setRandomNum] = useState<number | null>(null);

  useEffect(() => {
    const num = Math.floor(Math.random() * 50) + 10;
    setRandomNum(num);
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data: Blog[] = await res.json();
        setBlogData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 pt-24">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div className="mb-12 bg-white rounded-xl overflow-hidden shadow-lg">
          {featuredPost ? (
            <div className="relative h-[400px]">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-4">
                    {featuredPost.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-2">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <p className="text-gray-200 mb-4">{featuredPost.excerpt}</p>
                  <button className="!rounded-button bg-white text-gray-900 px-6 py-2 hover:bg-gray-100 transition duration-300 cursor-pointer whitespace-nowrap">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading featured post...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogData.map((post, index) => {
                return (
                  <Blogcart
                    key={index}
                    _id={post._id}
                    image={post.image}
                    title={post.title}
                    category={post.category}
                    excerpt={post.excerpt}
                    author={post.author}
                    likes={post.likes}
                  />
                );
              })}
            </div>

            <div className="mt-12 flex items-center justify-between">
              <button
                className="!rounded-button bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left mr-2"></i>
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`!rounded-button w-10 h-10 ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } cursor-pointer whitespace-nowrap`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="!rounded-button bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
                <i className="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {[
                  "Interior Design",
                  "Real Estate Tips",
                  "Market Analysis",
                  "Lifestyle",
                  "Architecture",
                ].map((category) => (
                  <button
                    key={category}
                    className="flex items-center justify-between w-full p-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <span>{category}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                      {randomNum !== null ? randomNum : "..."}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div key={index} className="flex space-x-4 cursor-pointer">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800 hover:text-blue-600">
                        {post.title}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {post.views} views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a href="houseDetailsPage">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Featured Properties
              </h3>
              <div className="space-y-4">
                {featuredProperties.map((property, index) => (
                  <div key={index} className="cursor-pointer group">
                    <div className="relative h-40 mb-2">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 group-hover:text-blue-600">
                      {property.title}
                    </h4>
                    <p className="text-sm text-gray-500">{property.location}</p>
                    <p className="text-blue-600 font-semibold">
                      {property.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            </a>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Get the latest blog posts and property updates delivered to your
                inbox.
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="!rounded-button w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition duration-300 cursor-pointer whitespace-nowrap"
                >
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">About Rento</h4>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect rental property. We
                make house hunting simple and enjoyable.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <i className="fas fa-map-marker-alt mr-2"></i>123 Rental
                  Street, NY 10001
                </li>
                <li>
                  <i className="fas fa-phone mr-2"></i>+1 (555) 123-4567
                </li>
                <li>
                  <i className="fas fa-envelope mr-2"></i>info@Rento.com
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Rento. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="!rounded-button fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition duration-300 cursor-pointer whitespace-nowrap"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <i className="fas fa-envelope-open-text text-4xl text-blue-600"></i>
              <h3 className="text-2xl font-semibold mt-4">
                Thank You for Subscribing!
              </h3>
              <p className="text-gray-600 mt-2">
                You'll receive our latest updates in your inbox.
              </p>
            </div>
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="!rounded-button w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition duration-300 cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
