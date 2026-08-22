import { Navigate, useParams } from 'react-router-dom';

// The capstone practical lives in the app's Learning Mode page (it is an
// interactive exercise against the teaching dataset, not course prose).
const CapstoneRedirect = () => {
  const { appSlug } = useParams();
  return <Navigate to={`/dashboard/apps/${appSlug}`} replace />;
};

export default CapstoneRedirect;
