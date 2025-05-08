"use client";

import React, { useState, useEffect } from "react";

const NotificationPage: React.FC = () => {
	const [notifications, setNotifications] = useState<any[]>([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch("/api/notifications/comments");
				if (!response.ok)
					throw new Error("Failed to fetch notifications");

				const data = await response.json();
				setNotifications(data);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto bg-white shadow-lg p-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-4">
					Notifications
				</h1>
				<div className="space-y-4">
					{notifications.length > 0 ? (
						notifications.map((notification) => (
							<div
								key={notification._id}
								className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm"
							>
								<div className="flex-shrink-0 mr-4">
									<div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
										<i className="fas fa-comment text-blue-500"></i>
									</div>
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-gray-800">
										New comment on{" "}
										<span className="text-blue-600">
											{notification.communityForumId
												?.title || "a post"}
										</span>
									</h4>
									<p className="text-gray-600 mt-1">
										{notification.commentBody}
									</p>
									<p className="text-sm text-gray-500 mt-1">
										{new Date(
											notification.createdAt
										).toLocaleString()}
									</p>
								</div>
							</div>
						))
					) : (
						<p className="text-gray-500">
							No notifications available.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotificationPage;
