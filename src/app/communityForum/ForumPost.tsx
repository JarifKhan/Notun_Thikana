import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHeart,
	faComment,
	faChevronDown,
	faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// Mock authentication - replace with actual auth logic
const isLoggedIn = true;
const showLoginPopup = () => alert("Please log in to like the post.");

interface Comment {
	_id: string;
	text: string;
	author: {
		name: string;
		avatar: string;
	};
	createdAt: string;
}

interface PostProps {
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
	onLikeUpdate?: (postId: string, newLikes: number) => void;
	onCommentUpdate?: (postId: string, newCommentCount: number) => void;
}

const ForumPost: React.FC<PostProps> = ({
	_id,
	title,
	preview,
	category,
	author,
	comments = [],
	commentCount,
	likes,
	time,
	onLikeUpdate,
	onCommentUpdate,
}) => {
	const [postLikes, setPostLikes] = useState<number>(likes);
	const [postComments, setPostComments] = useState<Comment[]>(comments);
	const [postCommentCount, setPostCommentCount] =
		useState<number>(commentCount);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [showComments, setShowComments] = useState<boolean>(false);
	const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
	const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);

	// Check if user has already liked this post (could be stored in localStorage or fetched from API)
	useEffect(() => {
		try {
			const likedPosts = JSON.parse(
				localStorage.getItem("likedPosts") || "{}"
			);
			console.log(
				`Checking if post ${_id} is liked. Current liked posts:`,
				likedPosts
			);
			setIsLiked(!!likedPosts[_id]);
		} catch (error) {
			console.error("Error checking liked status:", error);
			localStorage.setItem("likedPosts", "{}"); // Reset if corrupted
		}
	}, [_id]);

	// Function to toggle comments visibility
	const toggleComments = async () => {
		try {
			// Toggle comments visibility
			setShowComments((prevState) => !prevState);

			// If we're showing comments and we don't have any loaded yet, fetch them
			if (
				!showComments &&
				postComments.length === 0 &&
				postCommentCount > 0
			) {
				await fetchComments();
			}
		} catch (error) {
			console.error("Error toggling comments:", error);
			// Don't let the error crash the component
			// Just show an empty comments list
			setPostComments([]);
			setIsLoadingComments(false);
		}
	};

	// Function to fetch comments from the API
	const fetchComments = async () => {
		if (isLoadingComments) return;

		setIsLoadingComments(true);

		try {
			const response = await fetch(`/api/forum/${_id}/comments`);

			if (!response.ok) {
				throw new Error("Failed to fetch comments");
			}

			// Get the response text first to check if it's valid JSON
			const responseText = await response.text();

			if (!responseText || responseText.trim() === "") {
				console.log(
					"Empty response from server, using empty array for comments"
				);
				setPostComments([]);
				return;
			}

			try {
				// Parse the JSON response
				const data = JSON.parse(responseText);

				// Validate that data is an array
				if (Array.isArray(data)) {
					// Filter out any invalid comments (missing required fields)
					const validComments = data.filter(
						(comment) =>
							comment &&
							typeof comment === "object" &&
							comment._id &&
							typeof comment.text === "string"
					);

					console.log(
						`Received ${data.length} comments, ${validComments.length} are valid`
					);
					setPostComments(validComments);
				} else {
					console.error(
						"Invalid comments data format, expected array:",
						data
					);
					setPostComments([]);
				}
			} catch (parseError) {
				console.error("Error parsing comments JSON:", parseError);
				setPostComments([]);
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
			setPostComments([]);
		} finally {
			setIsLoadingComments(false);
		}
	};

	// Function to handle adding a new comment
	const handleCommentAdded = (newComment: Comment) => {
		try {
			setPostComments((prev) => [...prev, newComment]);
			const newCount = postCommentCount + 1;
			setPostCommentCount(newCount);

			if (onCommentUpdate) {
				onCommentUpdate(_id, newCount);
			}
		} catch (error) {
			console.error("Error handling new comment:", error);
		}
	};

	const handleLike = async () => {
		if (!isLoggedIn) {
			showLoginPopup();
			return;
		}

		if (isUpdating) return; // Prevent multiple clicks while updating
		setIsUpdating(true);

		const newLikeStatus = !isLiked;
		const increment = newLikeStatus ? 1 : -1;

		console.log(
			`Liking post ${_id}: current=${isLiked}, new=${newLikeStatus}, increment=${increment}`
		);

		// Optimistically update UI
		setIsLiked(newLikeStatus);
		setPostLikes((prev) => prev + increment);

		// Store liked status in localStorage
		const likedPosts = JSON.parse(
			localStorage.getItem("likedPosts") || "{}"
		);
		if (newLikeStatus) {
			likedPosts[_id] = true;
		} else {
			delete likedPosts[_id];
		}
		localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

		try {
			console.log(
				`Sending PATCH request to /api/forum/${_id} with increment=${increment}`
			);

			const response = await fetch(`/api/forum/${_id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ increment }),
			});

			console.log(`Response status: ${response.status}`);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`Server error: ${errorText}`);
				throw new Error(
					`Failed to update likes: ${response.status} ${errorText}`
				);
			}

			const responseText = await response.text();
			console.log(`Response text: ${responseText}`);

			if (!responseText) {
				console.warn("Empty response from server");
				// Keep the optimistic update

				// Notify parent component if callback provided
				if (onLikeUpdate) {
					console.log(
						`Calling onLikeUpdate with ${_id}, ${postLikes}`
					);
					onLikeUpdate(_id, postLikes);
				}
				return;
			}

			try {
				const updatedPost = JSON.parse(responseText);
				console.log(`Updated post:`, updatedPost);

				if (updatedPost && typeof updatedPost.likes === "number") {
					// Update with the actual value from the server
					setPostLikes(updatedPost.likes);

					// Notify parent component if callback provided
					if (onLikeUpdate) {
						console.log(
							`Calling onLikeUpdate with ${_id}, ${updatedPost.likes}`
						);
						onLikeUpdate(_id, updatedPost.likes);
					}
				} else {
					console.warn("Invalid response format:", updatedPost);
				}
			} catch (parseError) {
				console.error("Error parsing response:", parseError);
				// Keep the optimistic update
			}
		} catch (error) {
			console.error("Error updating likes:", error);
			// Revert UI changes on error
			setIsLiked(!newLikeStatus);
			setPostLikes((prev) => prev - increment);

			// Revert localStorage changes
			const likedPosts = JSON.parse(
				localStorage.getItem("likedPosts") || "{}"
			);
			if (!newLikeStatus) {
				likedPosts[_id] = true;
			} else {
				delete likedPosts[_id];
			}
			localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

			// Show error to user
			alert(`Failed to update reaction: ${error.message}`);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
			<div className="p-5">
				{/* Post Header */}
				<div className="flex items-center mb-3">
					<img
						className="h-10 w-10 rounded-full object-cover"
						src={author.avatar}
						alt={author.name}
					/>
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-800">
							{author.name}
						</p>
						<p className="text-xs text-gray-500">{time}</p>
					</div>
				</div>

				{/* Post Content */}
				<h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
					{title}
				</h3>
				<p className="text-gray-600 text-sm mb-3">{preview}</p>

				{/* Post Footer */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{category}
						</span>
					</div>
					<div className="flex items-center space-x-4 text-gray-500">
						<button
							onClick={() => {
								if (!isLoggedIn) {
									showLoginPopup();
									return;
								}
								toggleComments();
								setShowCommentForm(false);
							}}
							className="flex items-center text-sm hover:text-blue-600 transition-colors duration-200"
						>
							<FontAwesomeIcon
								icon={faComment}
								className="mr-1"
							/>
							{postCommentCount}
						</button>
						<button
							onClick={handleLike}
							disabled={isUpdating}
							className={`flex items-center text-sm transition-colors duration-200 ${
								isUpdating
									? "opacity-50 cursor-not-allowed"
									: "cursor-pointer"
							} ${
								isLiked
									? "text-red-500"
									: "text-gray-500 hover:text-red-500"
							}`}
						>
							<FontAwesomeIcon
								icon={isLiked ? faHeart : faHeartRegular}
								className={`mr-1 ${
									isLiked ? "animate-pulse" : ""
								}`}
							/>
							{postLikes}
						</button>
					</div>
				</div>

				{/* Comments Section */}
				{showComments && (
					<div className="mt-4 border-t pt-4">
						<div className="flex justify-between items-center mb-4">
							<h4 className="text-md font-medium text-gray-800">
								Comments ({postCommentCount})
							</h4>
							<button
								onClick={() =>
									setShowCommentForm(!showCommentForm)
								}
								className="text-sm text-blue-600 hover:text-blue-800"
							>
								{showCommentForm ? "Cancel" : "Add Comment"}
							</button>
						</div>

						{/* Comment Form */}
						{showCommentForm && (
							<CommentForm
								postId={_id}
								onCommentAdded={handleCommentAdded}
								onCancel={() => setShowCommentForm(false)}
							/>
						)}

						{/* Comments List */}
						{isLoadingComments ? (
							<div className="py-4 text-center text-gray-500">
								Loading comments...
							</div>
						) : (
							<CommentList comments={postComments} />
						)}
					</div>
				)}

				{/* Toggle Comments Button */}
				{!showComments && postCommentCount > 0 && (
					<button
						onClick={toggleComments}
						className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors duration-200"
					>
						<span>View {postCommentCount} comments</span>
						<FontAwesomeIcon
							icon={faChevronDown}
							className="ml-2"
						/>
					</button>
				)}

				{showComments && (
					<button
						onClick={toggleComments}
						className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors duration-200"
					>
						<span>Hide comments</span>
						<FontAwesomeIcon icon={faChevronUp} className="ml-2" />
					</button>
				)}
			</div>
		</div>
	);
};

export default ForumPost;
