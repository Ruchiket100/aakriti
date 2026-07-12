"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5000, // 5 seconds
						refetchOnWindowFocus: true,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<JotaiProvider>{children}</JotaiProvider>
		</QueryClientProvider>
	);
}
