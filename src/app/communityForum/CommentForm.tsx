import React, { useState } from "react";

interface Comment {
	_id: string;
	text: string;
	author: {
		name: string;
		avatar: string;
	};
	createdAt: string;
}

interface CommentFormProps {
	postId: string;
	onCommentAdded: (newComment: Comment) => void;
	onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
	postId,
	onCommentAdded,
	onCancel,
}) => {
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!comment.trim()) {
			setError("Comment cannot be empty");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const userData = {
				name: "Current User",
				avatar: "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%2C%20neutral%20background&width=40&height=40&seq=1&orientation=squarish",
			};

			const response = await fetch(`/api/forum/${postId}/comment`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: comment, author: userData }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to add comment");
			}

			const newComment = await response.json();
			setComment("");
			onCommentAdded(newComment);
            window.location.reload();
		} catch (err) {
			console.error("Error adding comment:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to add comment. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4 mb-6">
			<div className="mb-2">
				<textarea
					className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows={3}
					placeholder="Write your comment..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					disabled={isSubmitting}
				/>
			</div>

			{error && <div className="mb-2 text-red-500 text-sm">{error}</div>}

			<div className="flex justify-end space-x-2">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
						disabled={isSubmitting}
					>
						Cancel
					</button>
				)}

				<button
					type="submit"
					className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Posting..." : "Post Comment"}
				</button>
			</div>
		</form>
	);
};

export default CommentForm;
