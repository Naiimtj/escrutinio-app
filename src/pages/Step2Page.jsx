import { useNavigate } from 'react-router-dom';
import Step2 from '../components/Step2';
import StepsLayout from '../layout/StepsLayout';

const Step2Page = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/step3');
  };

  const handleBack = () => {
    navigate('/step1');
  };

  return (
    <StepsLayout>
      <Step2 onNext={handleNext} onBack={handleBack} />
    </StepsLayout>
  );
};

export default Step2Page;
