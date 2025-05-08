"use client";
import React, { useState, useEffect, useMemo } from "react";
import ForumPost from "./ForumPost";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHeart,
	faLayerGroup,
	faChevronRight,
	faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const App: React.FC = () => {
	interface Comment {
		_id: string;
		text: string;
		author: {
			name: string;
			avatar: string;
		};
		createdAt: string;
	}

	interface Post {
		_id: string;
		title: string;
		preview: string;
		category: string;
		author: {
			name: string;
			avatar: string;
		};
		comments?: Comment[];
		commentCount: number;
		likes: number;
		time: string;
	}

	const [activeCategory, setActiveCategory] = useState("all");
	const [sortBy, setSortBy] = useState("latest");
	const [searchQuery, setSearchQuery] = useState("");
	const [showNotifications, setShowNotifications] = useState(false);
	const [showPostPopup, setShowPostPopup] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 5;

	const [title, setTitle] = useState("");
	const [preview, setPreview] = useState("");
	const [category, setCategory] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [avatar, setAvatar] = useState("");

	const categories = [
		{
			id: "rental-experiences",
			name: "Rental Experiences",
			icon: "fa-home",
			count: 245,
		},
		{
			id: "housing-advice",
			name: "Housing Advice",
			icon: "fa-lightbulb",
			count: 189,
		},
		{
			id: "roommate-finder",
			name: "Roommate Finder",
			icon: "fa-users",
			count: 132,
		},
		{
			id: "legal-questions",
			name: "Legal Questions",
			icon: "fa-gavel",
			count: 98,
		},
		{
			id: "property-reviews",
			name: "Property Reviews",
			icon: "fa-star",
			count: 176,
		},
		{ id: "moving-tips", name: "Moving Tips", icon: "fa-truck", count: 87 },
	];
	const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

	// Fetch trending topics from API
	const fetchTrendingTopics = async () => {
		try {
			const res = await fetch("/api/trending");
			if (!res.ok) {
				throw new Error("Failed to fetch trending topics");
			}
			const data = await res.json();
			setTrendingTopics(data);
		} catch (error) {
			console.error("Error fetching trending topics:", error);
			// Fallback to default trending topics if API fails
			setTrendingTopics([
				"Tenant rights during renovations",
				"How to negotiate rent decrease",
				"Best neighborhoods for young professionals",
				"Dealing with noisy neighbors",
				"Security deposit return tips",
			]);
		}
	};
	// const posts = [
	//   {
	//     id: 1,
	//     title: "My experience with a difficult landlord and how I resolved it",
	//     preview:
	//       "After months of dealing with maintenance issues being ignored, I finally found a solution that worked without having to move out...",
	//     category: "Rental Experiences",
	//     author: {
	//       name: "Emily Parker",
	//       avatar:
	//         "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20woman%20with%20short%20brown%20hair%2C%20friendly%20smile%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=40&height=40&seq=1&orientation=squarish",
	//     },
	//     comments: 24,
	//     likes: 47,
	//     time: "2 hours ago",
	//   },
	//   {
	//     id: 2,
	//     title:
	//       "Guide: Understanding your lease agreement - hidden clauses to watch for",
	//     preview:
	//       "Many renters sign leases without fully understanding the terms. Here are the most common problematic clauses and what they actually mean...",
	//     category: "Legal Questions",
	//     author: {
	//       name: "Marcus Johnson",
	//       avatar:
	//         "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20middle-aged%20man%20with%20glasses%2C%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=40&height=40&seq=2&orientation=squarish",
	//     },
	//     comments: 36,
	//     likes: 89,
	//     time: "5 hours ago",
	//   },
	//   {
	//     id: 3,
	//     title:
	//       "Found the perfect roommate through this platform - here's my story",
	//     preview:
	//       "After three terrible roommate experiences, I was about to give up. Then I tried this approach to screening potential roommates...",
	//     category: "Roommate Finder",
	//     author: {
	//       name: "Sophia Lee",
	//       avatar:
	//         "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20woman%20with%20long%20black%20hair%2C%20friendly%20smile%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=40&height=40&seq=3&orientation=squarish",
	//     },
	//     comments: 18,
	//     likes: 32,
	//     time: "1 day ago",
	//   },
	//   {
	//     id: 4,
	//     title: "Review: Parkview Apartments - Honest assessment after 2 years",
	//     preview:
	//       "I've lived at Parkview for two years now and wanted to share my honest thoughts about the pros and cons of this property...",
	//     category: "Property Reviews",
	//     author: {
	//       name: "David Wilson",
	//       avatar:
	//         "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20man%20with%20beard%2C%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=40&height=40&seq=4&orientation=squarish",
	//     },
	//     comments: 42,
	//     likes: 63,
	//     time: "2 days ago",
	//   },
	//   {
	//     id: 5,
	//     title: "How I saved $2000 on my cross-country move - practical tips",
	//     preview:
	//       "Moving across the country seemed financially impossible until I discovered these money-saving strategies that actually worked...",
	//     category: "Moving Tips",
	//     author: {
	//       name: "Rachel Green",
	//       avatar:
	//         "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20woman%20in%20her%2030s%20with%20curly%20hair%2C%20casual%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=40&height=40&seq=5&orientation=squarish",
	//     },
	//     comments: 29,
	//     likes: 75,
	//     time: "3 days ago",
	//   },
	// ];
	const notifications = [
		{
			id: 1,
			text: "Marcus Johnson replied to your post",
			time: "10 minutes ago",
		},
		{
			id: 2,
			text: 'Your post "Guide to finding affordable housing" received 15 likes',
			time: "2 hours ago",
		},
		{ id: 3, text: "New housing advice in your area", time: "1 day ago" },
	];

	const handleCreatePost = async () => {
		// Validate form fields
		if (!title || !preview || !category || !authorName) {
			alert("Please fill in all required fields");
			return;
		}

		try {
			const res = await fetch("/api/forum", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					preview,
					category,
					author: {
						name: authorName,
						avatar:
							avatar ||
							"https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%2C%20neutral%20background&width=40&height=40&seq=1&orientation=squarish",
					},
					comments: [],
					commentCount: 0,
					likes: 0,
					time: new Date().toLocaleString(),
				}),
			});

			const text = await res.text(); // get raw response text
			const data = text ? JSON.parse(text) : null;

			if (res.ok) {
				alert("Post created successfully!");
				setShowPostPopup(false);

				// Reset form fields
				setTitle("");
				setPreview("");
				setCategory("");
				setAuthorName("");
				setAvatar("");

				// Refresh posts
				fetchPosts();

				// Go to first page to see the new post
				setCurrentPage(1);
			} else {
				console.error("Server error:", data);
				alert(data?.message || "Failed to create post");
			}
		} catch (err) {
			console.error("Unexpected error:", err);
			alert("An unexpected error occurred");
		}
	};

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	// Function to update a post's likes in the local state
	const handleLikeUpdate = (postId: string, newLikes: number) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) =>
				post._id === postId ? { ...post, likes: newLikes } : post
			)
		);
	};

	// Function to update a post's comment count in the local state
	const handleCommentUpdate = (postId: string, newCommentCount: number) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) =>
				post._id === postId
					? { ...post, commentCount: newCommentCount }
					: post
			)
		);
	};

	// Fetch posts from API
	const fetchPosts = async () => {
		try {
			const res = await fetch("/api/forum");
			const data = await res.json();
			setPosts(data);
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Fetch posts and trending topics when component mounts
		fetchPosts();
		fetchTrendingTopics();
	}, []);

	// Filter posts based on category and search query
	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			// Filter by category
			if (
				activeCategory !== "all" &&
				!post.category
					.toLowerCase()
					.includes(
						categories
							.find((c) => c.id === activeCategory)
							?.name.toLowerCase() || ""
					)
			) {
				return false;
			}

			// Filter by search query
			if (
				searchQuery &&
				!(
					post.title
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					post.preview
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					post.category
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					post.author.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
			) {
				return false;
			}

			return true;
		});
	}, [posts, activeCategory, searchQuery, categories]);

	// Sort posts based on selected sort option
	const sortedPosts = useMemo(() => {
		return [...filteredPosts].sort((a, b) => {
			if (sortBy === "latest") {
				return new Date(b.time).getTime() - new Date(a.time).getTime();
			} else if (sortBy === "popular") {
				return b.likes - a.likes;
			} else if (sortBy === "trending") {
				// Trending is a combination of recency and popularity
				const recencyA = new Date(a.time).getTime();
				const recencyB = new Date(b.time).getTime();
				const popularityA = a.likes + a.commentCount * 2; // Comments weighted more
				const popularityB = b.likes + b.commentCount * 2;

				return popularityB + recencyB - (popularityA + recencyA);
			}
			return 0;
		});
	}, [filteredPosts, sortBy]);

	if (loading) return <p className="text-black">Loading posts...</p>;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<span className="text-blue-600 text-2xl font-bold">
									RentTalk
								</span>
							</div>
						</div>
						{/* Right Navigation */}
						<div className="flex items-center space-x-4">
							<button
								className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 relative cursor-pointer !rounded-button whitespace-nowrap"
								onClick={() =>
									setShowNotifications(!showNotifications)
								}
							>
								<FontAwesomeIcon
									icon={faHeart}
									className="text-gray-600"
								/>
								<span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
							</button>
							{showNotifications && (
								<div className="absolute right-16 top-16 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
									<h3 className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
										Notifications
									</h3>
									<div className="max-h-96 overflow-y-auto">
										{notifications.map((notification) => (
											<div
												key={notification.id}
												className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
											>
												<p className="text-sm text-gray-800">
													{notification.text}
												</p>
												<p className="text-xs text-black mt-1">
													{notification.time}
												</p>
											</div>
										))}
									</div>
									<div className="px-4 py-2 border-t text-center">
										<button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer !rounded-button whitespace-nowrap">
											View all notifications
										</button>
									</div>
								</div>
							)}
							<div className="flex items-center">
								<img
									className="h-8 w-8 rounded-full object-cover"
									src="https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20person%20with%20friendly%20expression%2C%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=32&height=32&seq=6&orientation=squarish"
									alt="User profile"
								/>
								<span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
									Alex Morgan
								</span>
							</div>
						</div>
					</div>
				</div>
			</header>
			{/* Main Content */}
			<main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Search Bar */}
				<div className="mb-6 flex items-center justify-between">
					<div className="relative max-w-2xl w-full">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<i className="fas fa-search text-gray-400"></i>
						</div>
						<input
							type="text"
							className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
							placeholder="Search discussions, topics, or users..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1); // Reset to first page when searching
							}}
						/>
					</div>
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap ml-4"
						onClick={() => setShowPostPopup(true)}
					>
						<i className="fas fa-plus mr-2"></i>Create Post
					</button>
					{showPostPopup && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
								<h2 className="text-lg font-semibold text-gray-800 mb-4">
									Create a New Post
								</h2>

								{/* Title */}
								<input
									type="text"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Post title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>

								{/* Preview */}
								<textarea
									className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									rows={3}
									placeholder="Preview text..."
									value={preview}
									onChange={(e) => setPreview(e.target.value)}
								></textarea>

								{/* Category */}
								<input
									type="text"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Category"
									value={category}
									onChange={(e) =>
										setCategory(e.target.value)
									}
								/>

								{/* Author name */}
								<input
									type="text"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Author name"
									value={authorName}
									onChange={(e) =>
										setAuthorName(e.target.value)
									}
								/>

								{/* Avatar URL (optional) */}
								<input
									type="text"
									className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Author avatar URL"
									value={avatar}
									onChange={(e) => setAvatar(e.target.value)}
								/>

								<div className="mt-4 flex justify-end space-x-2">
									<button
										className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
										onClick={() => setShowPostPopup(false)}
									>
										Cancel
									</button>
									<button
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
										onClick={handleCreatePost}
									>
										Post
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Left Column - Forum Posts */}
					<div className="w-full md:w-8/12">
						{/* Sorting Options */}
						<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold text-gray-800">
									Community Forum
								</h2>
								<div className="flex items-center space-x-2">
									<span className="text-sm text-black">
										Sort by:
									</span>
									<select
										className="text-sm border-none text-black bg-gray-100 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={sortBy}
										onChange={(e) => {
											setSortBy(e.target.value);
											setCurrentPage(1); // Reset to first page when changing sort order
										}}
									>
										<option value="latest">Latest</option>
										<option value="popular">
											Most Popular
										</option>
										<option value="trending">
											Trending
										</option>
									</select>
								</div>
							</div>
						</div>
						{/* Posts */}
						<div className="space-y-4">
							{sortedPosts.length > 0 ? (
								sortedPosts
									.slice(
										(currentPage - 1) * postsPerPage,
										currentPage * postsPerPage
									)
									.map((post) => (
										<ForumPost
											key={post._id}
											_id={post._id}
											title={post.title}
											preview={post.preview}
											category={post.category}
											author={post.author}
											comments={post.comments}
											commentCount={post.commentCount}
											likes={post.likes}
											time={post.time}
											onLikeUpdate={handleLikeUpdate}
											onCommentUpdate={
												handleCommentUpdate
											}
										/>
									))
							) : (
								<div className="bg-white rounded-lg shadow-sm p-8 text-center">
									<p className="text-black">
										No posts found matching your criteria.
									</p>
								</div>
							)}
						</div>
						{/* Pagination */}
						{sortedPosts.length > 0 && (
							<div className="flex justify-center mt-8">
								<nav
									className="inline-flex rounded-md shadow-sm -space-x-px"
									aria-label="Pagination"
								>
									<button
										onClick={() => {
											const prevPage = Math.max(
												1,
												currentPage - 1
											);
											setCurrentPage(prevPage);
										}}
										className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
										disabled={currentPage === 1}
									>
										<FontAwesomeIcon icon={faChevronLeft} />
									</button>

									{/* Generate page numbers */}
									{Array.from(
										{
											length: Math.min(
												5,
												Math.ceil(
													sortedPosts.length / 5
												)
											),
										},
										(_, i) => (
											<button
												key={i + 1}
												onClick={() =>
													setCurrentPage(i + 1)
												}
												className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${
													currentPage === i + 1
														? "bg-blue-50 text-blue-600 hover:bg-blue-100"
														: "bg-white text-gray-700 hover:bg-gray-50"
												} text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap`}
											>
												{i + 1}
											</button>
										)
									)}

									<button
										onClick={() => {
											const nextPage = Math.min(
												Math.ceil(
													sortedPosts.length / 5
												),
												currentPage + 1
											);
											setCurrentPage(nextPage);
										}}
										className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
										disabled={
											currentPage ===
											Math.ceil(sortedPosts.length / 5)
										}
									>
										<FontAwesomeIcon
											icon={faChevronRight}
										/>
									</button>
								</nav>
							</div>
						)}
					</div>
					{/* Right Column - Categories and Trending */}
					<div className="w-full md:w-4/12">
						{/* User Profile Card */}
						<div className="bg-white rounded-lg shadow-sm p-5 mb-6">
							<div className="flex items-center">
								<img
									className="h-16 w-16 rounded-full object-cover"
									src="https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20person%20with%20friendly%20expression%2C%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%2C%20photorealistic%2C%20soft%20lighting%2C%20professional%20headshot&width=64&height=64&seq=7&orientation=squarish"
									alt="User profile"
								/>
								<div className="ml-4">
									<h3 className="text-lg font-semibold text-gray-800">
										Alex Morgan
									</h3>
									<p className="text-sm text-black">
										Member since April 2023
									</p>
								</div>
							</div>
							<div className="mt-4 pt-4 border-t border-gray-100">
								<div className="grid grid-cols-3 gap-2 text-center">
									<div>
										<p className="text-lg font-semibold text-gray-800">
											24
										</p>
										<p className="text-xs text-black">
											Posts
										</p>
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-800">
											142
										</p>
										<p className="text-xs text-black">
											Comments
										</p>
									</div>
									<div>
										<p className="text-lg font-semibold text-gray-800">
											87
										</p>
										<p className="text-xs text-black">
											Reputation
										</p>
									</div>
								</div>
							</div>
							<button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
								View Profile
							</button>
						</div>
						{/* Categories */}
						<div className="bg-white rounded-lg shadow-sm p-5 mb-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Categories
							</h3>
							<div className="space-y-3 text-black">
								<button
									className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left cursor-pointer !rounded-button whitespace-nowrap ${
										activeCategory === "all"
											? "bg-blue-50 text-blue-700"
											: "hover:bg-gray-50"
									}`}
									onClick={() => {
										setActiveCategory("all");
										setCurrentPage(1); // Reset to first page when changing category
									}}
								>
									<div className="flex items-center">
										<FontAwesomeIcon
											icon={faLayerGroup}
											className="mr-3 text-blue-500"
										/>
										<span className="font-medium">
											All Topics
										</span>
									</div>
									<span className="text-sm text-black">
										{posts.length}
									</span>
								</button>
								{categories.map((category) => {
									// Count posts in this category
									const categoryPostCount = posts.filter(
										(post) =>
											post.category
												.toLowerCase()
												.includes(
													category.name.toLowerCase()
												)
									).length;

									return (
										<button
											key={category.id}
											className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left cursor-pointer !rounded-button whitespace-nowrap ${
												activeCategory === category.id
													? "bg-blue-50 text-blue-700"
													: "hover:bg-gray-50"
											}`}
											onClick={() => {
												setActiveCategory(category.id);
												setCurrentPage(1); // Reset to first page when changing category
											}}
										>
											<div className="flex items-center">
												<i
													className={`fas ${category.icon} mr-3 text-blue-500`}
												></i>
												<span className="font-medium">
													{category.name}
												</span>
											</div>
											<span className="text-sm text-black">
												{categoryPostCount}
											</span>
										</button>
									);
								})}
							</div>
						</div>
						{/* Trending Topics */}
						<div className="bg-white rounded-lg shadow-sm p-5 mb-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Trending Topics
							</h3>
							<div className="space-y-3">
								{trendingTopics.length > 0 ? (
									trendingTopics.map((topic, index) => (
										<div
											key={index}
											className="flex items-start"
										>
											<div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
												{index + 1}
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
													{topic}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="py-4 text-center text-black">
										<div className="animate-pulse flex flex-col space-y-3">
											<div className="h-4 bg-gray-200 rounded w-3/4"></div>
											<div className="h-4 bg-gray-200 rounded w-full"></div>
											<div className="h-4 bg-gray-200 rounded w-5/6"></div>
											<div className="h-4 bg-gray-200 rounded w-2/3"></div>
											<div className="h-4 bg-gray-200 rounded w-4/5"></div>
										</div>
									</div>
								)}
							</div>
						</div>
						{/* Community Guidelines */}
						<div className="bg-white rounded-lg shadow-sm p-5">
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Community Guidelines
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Our community thrives on respectful and
								constructive discussions. Please review our
								guidelines before posting.
							</p>
							<button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer !rounded-button whitespace-nowrap">
								Read Guidelines{" "}
								<i className="fas fa-arrow-right ml-1"></i>
							</button>
						</div>
					</div>
				</div>
			</main>
			{/* Fixed Create Post Button (Mobile) */}
			<div className="md:hidden fixed right-6 bottom-6">
				<button
					onClick={() => setShowPostPopup(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
				>
					<i className="fas fa-plus text-xl"></i>
				</button>
			</div>
		</div>
	);
};
export default App;
