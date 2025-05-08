import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

// Mock user ID for testing - in a real app, this would come from authentication
const MOCK_USER_ID = "user_" + Math.random().toString(36).substr(2, 9);

// Replace with actual authentication logic
const isLoggedIn = true;
const showLoginPopup = () => alert("Please log in to like the post.");

interface BlogcartProps {
	_id: string;
	image: string;
	title: string;
	category: string;
	excerpt: string;
	author: {
		name: string;
		avatar: string;
	};
	likes: number;
}

const Blogcart: React.FC<BlogcartProps> = ({
	_id,
	image,
	title,
	category,
	excerpt,
	author,
	likes,
}) => {
	const [initialLikes, setinitialLikes] = useState<number>(likes);
	const [notLiked, setNotLiked] = useState<boolean>(true);
	const [userId] = useState<string>(MOCK_USER_ID); // In a real app, get this from auth context
	const [hasCheckedLikeStatus, setHasCheckedLikeStatus] =
		useState<boolean>(false);

	// Check if the current user has already liked this post
	useEffect(() => {
		const checkLikeStatus = async () => {
			try {
				const response = await fetch(
					`/api/blog/${_id}/checkLike?userId=${userId}`
				);
				if (response.ok) {
					const data = await response.json();
					setNotLiked(!data.hasLiked);
				}
				setHasCheckedLikeStatus(true);
			} catch (error) {
				console.error("Error checking like status:", error);
				setHasCheckedLikeStatus(true);
			}
		};

		if (userId && !hasCheckedLikeStatus) {
			checkLikeStatus();
		}
	}, [_id, userId, hasCheckedLikeStatus]);

	// Log when likes are updated
	useEffect(() => {
		console.log(`initialLikes updated: ${initialLikes}`);
	}, [initialLikes]);

	const handleLikeClick = async () => {
		// Don't proceed if we haven't checked the like status yet
		if (!hasCheckedLikeStatus) {
			return;
		}

		console.log(
			`Like button clicked by user ${userId} for post ${_id}. Current status: ${
				notLiked ? "not liked" : "liked"
			}`
		);

		if (isLoggedIn && notLiked) {
			// Optimistically update UI
			setinitialLikes((previnitialLikes) => previnitialLikes + 1);
			setNotLiked(false);

			try {
				console.log(
					`Sending like request for user ${userId} on post ${_id}`
				);
				const response = await fetch(`/api/blog/${_id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						increment: 1,
						userId: userId,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("Server error:", errorData);
					throw new Error(
						errorData.message ||
							"Failed to update likes in the database."
					);
				} else {
					const data = await response.json();
					console.log(`Like successful:`, data);
				}
			} catch (error) {
				console.error("Error updating likes:", error);
				// Revert state changes if the database update fails
				setinitialLikes((previnitialLikes) => previnitialLikes - 1);
				setNotLiked(true);

				// Show error to user
				alert(
					error.message ||
						"Failed to like the post. Please try again."
				);
			}
		} else if (isLoggedIn && !notLiked) {
			// Optimistically update UI
			setinitialLikes((previnitialLikes) => previnitialLikes - 1);
			setNotLiked(true);

			try {
				console.log(
					`Sending unlike request for user ${userId} on post ${_id}`
				);
				const response = await fetch(`/api/blog/${_id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						increment: -1,
						userId: userId,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("Server error:", errorData);
					throw new Error(
						errorData.message ||
							"Failed to update likes in the database."
					);
				} else {
					const data = await response.json();
					console.log(`Unlike successful:`, data);
				}
			} catch (error) {
				console.error("Error updating likes:", error);
				// Revert state changes if the database update fails
				setinitialLikes((previnitialLikes) => previnitialLikes + 1);
				setNotLiked(false);

				// Show error to user
				alert(
					error.message ||
						"Failed to unlike the post. Please try again."
				);
			}
		} else {
			showLoginPopup();
		}
	};

	return (
		<>
			<div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
				<div className="relative h-48">
					<Link href={`/blogs/${_id}`} className="absolute inset-0">
						<img
							src={image}
							alt={title}
							className="w-full h-full object-cover"
						/>
					</Link>
					<span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
						{category}
					</span>
				</div>
				<div className="p-4">
					<h3 className="text-xl font-semibold mb-2">{title}</h3>
					<Link
						href={`/blogs/${_id}`}
						className="text-blue-500 hover:underline"
					>
						<p className="text-gray-600 text-sm mb-4">{excerpt}</p>
					</Link>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<img
								src={author.avatar}
								alt={author.name}
								className="w-8 h-8 rounded-full"
							/>
							<span className="text-sm text-gray-700">
								{author.name}
							</span>
						</div>
						<button
							className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
							onClick={handleLikeClick}
						>
							{hasCheckedLikeStatus ? (
								<FontAwesomeIcon
									icon={notLiked ? faHeartRegular : faHeart}
									className={notLiked ? "" : "text-red-500"}
								/>
							) : (
								<span className="w-4 h-4 inline-block bg-gray-200 rounded-full animate-pulse"></span>
							)}
							<span className="ml-1">{initialLikes}</span>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Blogcart;
