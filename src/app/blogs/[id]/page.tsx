"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogDetail {
	_id: string;
	image: string;
	title: string;
	category: string;
	excerpt: string;
	content: string;
	author: {
		name: string;
		avatar: string;
	};
	date: string;
	readTime: string;
	likes: number;
}

const BlogDetailPage = () => {
	const { id } = useParams();
	const [blog, setBlog] = useState<BlogDetail | null>(null);

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				if (!id || typeof id !== "string") {
					console.log("Invalid blog ID:", id);
					throw new Error("Invalid blog ID");
				}

				const response = await fetch(`/api/blog/${id}`);
				if (!response.ok) {
					throw new Error("Blog not found");
				}

				const data = await response.json();
				setBlog(data);
			} catch (error) {
				console.error("Error fetching blog data:", error);
			}
		};

		fetchBlog();
	}, [id]);

	if (!blog) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
				<p className="text-gray-600 text-lg">Loading blog post...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
			<div className="max-w-4xl mx-auto px-6 py-16">
				<div className="text-center mb-12">
					<span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
						{blog.category}
					</span>
					<h1 className="text-5xl font-extrabold text-gray-800 mt-4">
						{blog.title}
					</h1>
					<div className="flex items-center justify-center gap-4 mt-6">
						<img
							src={blog.author.avatar}
							alt={blog.author.name}
							className="w-12 h-12 rounded-full shadow-md"
						/>
						<div>
							<p className="font-semibold text-gray-700">
								{blog.author.name}
							</p>
							<p className="text-sm text-gray-500">
								{new Date(blog.date).toLocaleDateString()} •{" "}
								{blog.readTime}
							</p>
						</div>
					</div>
				</div>
				<div className="relative mb-12">
					<img
						src={blog.image}
						alt={blog.title}
						className="w-full h-[500px] object-cover rounded-lg shadow-lg"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
				</div>
				<div className="prose prose-lg max-w-none text-gray-800 mx-auto">
					<p className="text-xl text-gray-700">{blog.excerpt}</p>
					<hr className="my-8 border-gray-300" />
					<p>{blog.content || "Full blog content goes here..."}</p>
				</div>
				<div className="mt-12 flex justify-between items-center text-sm text-gray-500">
					<span>{blog.likes} likes</span>
					<span>Category: {blog.category}</span>
				</div>
			</div>
		</div>
	);
};

export default BlogDetailPage;
