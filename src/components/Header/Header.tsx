"use client";

import React, { useState, useEffect } from "react";
import Notification from "@/components/Notification/Notification";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
	const router = useRouter();
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", password: "" });

	useEffect(() => {
		// check if token exists in cookies
		const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("token="));
		setIsLoggedIn(!!token);
	}, []);

	const handleChange = (e: any) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleLogin = async () => {
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					email: form.email.trim(),
					password: form.password,
				}),
			});
			if (res.ok) {
				setShowLogin(false);
				setIsLoggedIn(true);
			} else {
				const errorData = await res.json();
				console.error(
					"Login failed:",
					errorData.message || "Unknown error"
				);
				alert(
					"Login failed: " +
						(errorData.message || "Please check your credentials.")
				);
			}
		} catch (error) {
			console.error("Error during login:", error);
			alert("An error occurred. Please try again later.");
		}
	};

	const handleSignup = async () => {
		const res = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(form),
		});
		if (res.ok) {
			setShowSignup(false);
			setIsLoggedIn(true);
		}
	};

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setIsLoggedIn(false);
		router.refresh(); // refresh to clear any cached auth state
	};

	return (
		<header className="fixed top-0 w-full bg-white shadow-sm z-50">
			<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<i className="fas fa-home text-2xl text-blue-600"></i>
					<span className="text-xl font-semibold text-black">
						<a href=".">Rento</a>
					</span>
				</div>

				<nav className="hidden md:flex space-x-8">
					<a
						href="#"
						className="text-gray-600 hover:text-blue-600 cursor-pointer"
					>
						Home
					</a>
					<a
						href="#"
						className="text-gray-600 hover:text-blue-600 cursor-pointer"
					>
						Listings
					</a>
					<a
						href="blogs"
						className="text-gray-600 hover:text-blue-600 cursor-pointer"
					>
						Blog
					</a>
					<a
						href="/blogs"
						className="text-gray-600 hover:text-blue-600 cursor-pointer"
					>
						About
					</a>
					<a
						href="communityForum"
						className="text-gray-600 hover:text-blue-600 cursor-pointer"
					>
						Community Forum
					</a>
				</nav>

				<div className="flex items-center space-x-4">
					<Notification />

					{!isLoggedIn ? (
						<>
							<button
								onClick={() => setShowLogin(true)}
								className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
							>
								Login
							</button>
							<button
								onClick={() => setShowSignup(true)}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
							>
								Sign Up
							</button>
						</>
					) : (
						<button
							onClick={handleLogout}
							className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
						>
							Logout
						</button>
					)}
				</div>
			</div>

			{/* Login Modal */}
			{showLogin && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded w-96 space-y-4">
						<h2 className="text-xl font-bold">Login</h2>
						<input
							type="email"
							name="email"
							placeholder="Email"
							className="w-full border px-3 py-2 rounded"
							onChange={handleChange}
						/>
						<input
							type="password"
							name="password"
							placeholder="Password"
							className="w-full border px-3 py-2 rounded"
							onChange={handleChange}
						/>
						<button
							onClick={handleLogin}
							className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Login
						</button>
						<button
							onClick={() => setShowLogin(false)}
							className="w-full text-sm text-gray-500 mt-2"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Signup Modal */}
			{showSignup && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded w-96 space-y-4">
						<h2 className="text-xl font-bold">Sign Up</h2>
						<input
							type="text"
							name="name"
							placeholder="Name"
							className="w-full border px-3 py-2 rounded"
							onChange={handleChange}
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							className="w-full border px-3 py-2 rounded"
							onChange={handleChange}
						/>
						<input
							type="password"
							name="password"
							placeholder="Password"
							className="w-full border px-3 py-2 rounded"
							onChange={handleChange}
						/>
						<button
							onClick={handleSignup}
							className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Sign Up
						</button>
						<button
							onClick={() => setShowSignup(false)}
							className="w-full text-sm text-gray-500 mt-2"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
