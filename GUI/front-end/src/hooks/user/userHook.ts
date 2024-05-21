import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services';

export const useGetUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: getUsers,
		refetchOnWindowFocus: false,
		refetchInterval: false,
	});
};
