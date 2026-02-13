import { useNavigate } from 'react-router-dom';
import Step4 from '../components/Step4';
import StepsLayout from '../layout/StepsLayout';

const Step4Page = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/step3');
  };

  return (
    <StepsLayout>
      <Step4 onBack={handleBack} />
    </StepsLayout>
  );
};

export default Step4Page;
