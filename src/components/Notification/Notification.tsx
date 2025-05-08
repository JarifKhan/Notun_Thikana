"use client";

import React, { useState, useEffect } from "react";

interface NotificationItem {
	message: string;
	createdAt: string;
}

interface CommentNotificationItem {
	commentBody: string;
	communityForumId: {
		title: string;
	};
	createdAt: string;
}

const Notification: React.FC = () => {
	const [userNotifications, setUserNotifications] = useState<
		NotificationItem[]
	>([]);
	const [commentNotifications, setCommentNotifications] = useState<
		CommentNotificationItem[]
	>([]);
	const [isOpen, setIsOpen] = useState(false);

	const togglePopup = () => {
		setIsOpen((prevState) => !prevState);
	};

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const userId = localStorage.getItem("userId") || "default";

				// Fetch user notifications
				const userResponse = await fetch(
					`/api/notification?id=${userId}`
				);
				if (userResponse.ok) {
					const userData = await userResponse.json();
					setUserNotifications(userData.notifications ?? []);
				}

				// Fetch comment notifications
				const commentResponse = await fetch(
					"/api/notifications/comments"
				);
				if (commentResponse.ok) {
					const commentData = await commentResponse.json();
					setCommentNotifications(commentData ?? []);
				}
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, []);

	return (
		<div className="notification-container">
			<div
				className={`notification-icon cursor-pointer ${
					isOpen ? "animate-bounce" : ""
				}`}
				onClick={togglePopup}
			>
				🔔
			</div>
			{isOpen && (
				<div
					className="notification-popup absolute bg-white p-5 shadow-lg rounded-lg"
					style={{
						top: "60px",
						right: "180px",
						width: "400px",
						maxWidth: "90%",
					}}
				>
					<h4 className="text-lg font-bold text-black mb-4">
						Notifications
					</h4>
					<ul className="space-y-3">
						{/* User Notifications */}
						{userNotifications.length > 0 ? (
							userNotifications.map((notification, index) => (
								<li
									key={`user-${index}`}
									className="hover:shadow-md hover:bg-gray-100 transition-all duration-200 p-2 rounded"
								>
									<div>{notification.message}</div>
									<div className="text-sm text-black">
										{new Date(
											notification.createdAt
										).toLocaleString("en-GB", {
											day: "2-digit",
											month: "2-digit",
											year: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										})}
									</div>
								</li>
							))
						) : (
							<li></li>
						)}

						{/* Comment Notifications */}
						{commentNotifications.length > 0 ? (
							commentNotifications.map((notification, index) => (
								<li
									key={`comment-${index}`}
									className="hover:shadow-md text-black hover:bg-gray-100 transition-all duration-200 p-2 rounded"
								>
									<div>
										New comment on{" "}
										<span className="text-blue-600">
											{notification.communityForumId
												?.title || "a post"}
										</span>
									</div>
									<div className="text-sm text-black">
										{notification.commentBody}
									</div>
									<div className="text-sm text-black">
										{new Date(
											notification.createdAt
										).toLocaleString("en-GB", {
											day: "2-digit",
											month: "2-digit",
											year: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										})}
									</div>
								</li>
							))
						) : (
							<li>No comment notifications</li>
						)}
					</ul>
					<button
						onClick={() =>
							(window.location.href = "/notificationPage")
						}
						className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
					>
						Show more
					</button>
				</div>
			)}
		</div>
	);
};

export default Notification;
