import { useNavigate } from 'react-router-dom';
import Step1 from '../components/Step1';
import StepsLayout from '../layout/StepsLayout';

const Step1Page = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/step2');
  };

  return (
    <StepsLayout>
      <Step1 onNext={handleNext} />
    </StepsLayout>
  );
};

export default Step1Page;
