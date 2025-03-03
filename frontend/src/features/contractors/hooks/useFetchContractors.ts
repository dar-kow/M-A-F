import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { fetchContractorsRequest } from '../redux/contractorActions';

export function useFetchContractors() {
    const dispatch = useDispatch();
    const contractors = useSelector((state: RootState) => state.contractors.contractors);
    const loading = useSelector((state: RootState) => state.contractors.loading);
    const error = useSelector((state: RootState) => state.contractors.error);

    useEffect(() => {
        dispatch(fetchContractorsRequest());
    }, [dispatch]);

    return { contractors, loading, error };
}

export default useFetchContractors;