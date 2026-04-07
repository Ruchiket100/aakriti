"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (res.ok) {
				router.push("/admin");
			} else {
				const data = await res.json();
				setError(data.error ?? "Login failed");
			}
		} catch {
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-8"
			>
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-6">
						<span className="text-[12px] tracking-[0.25em] uppercase font-medium text-gray-900">
							Aakriti
						</span>
						<span className="w-px h-3 bg-gray-300" />
						<span className="text-[12px] tracking-[0.15em] uppercase text-gray-400">
							Admin
						</span>
					</div>
					<h1
						className="text-xl font-medium text-gray-900"
						style={{ fontFamily: "Georgia, serif" }}
					>
						Sign in
					</h1>
					<p className="text-[13px] text-gray-400 mt-1">
						Access the product dashboard
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label className="text-[11px] uppercase tracking-wide text-gray-400 mb-1.5 block">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 outline-none focus:border-gray-900 transition-colors"
							placeholder="admin@aakriti3dstudio.com"
						/>
					</div>
					<div>
						<label className="text-[11px] uppercase tracking-wide text-gray-400 mb-1.5 block">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 outline-none focus:border-gray-900 transition-colors"
							placeholder="••••••••"
						/>
					</div>

					{error && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-[12px] text-red-500 bg-red-50 rounded-lg px-3 py-2"
						>
							{error}
						</motion.p>
					)}

					<motion.button
						type="submit"
						disabled={loading}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
						className="w-full py-3 rounded-full bg-gray-900 text-white text-[13px] font-medium mt-2 disabled:opacity-50"
					>
						{loading ? "Signing in..." : "Sign in"}
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
}
