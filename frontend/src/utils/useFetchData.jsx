import api from "../services/api";
import { useState, useEffect } from "react";

export default function useFetchData(url) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let isCancelled = false;

		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await api.get(url);
				if (!isCancelled) {
					setData(response.data.data);
					setError(null);
				}
			} catch (error) {
				if (!isCancelled) {
					setData(null);
					setError(error);
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
		};

		fetchData();

		return () => {
			isCancelled = true;
		};
	}, [url]);

	return { isLoading, error, data };
}
